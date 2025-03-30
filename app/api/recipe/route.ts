import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const prisma = new PrismaClient();

if (process.env.NODE_ENV === "production") {
  prisma.$connect();
}

export async function POST(req: Request) {
  try {
    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the user exists in the database using clerkId
    const user = await prisma.user.findFirst({
      where: { clerkId: userId }, // Use clerkId instead of id
    });

    if (!user) {
      return NextResponse.json({ error: "User does not exist" }, { status: 404 });
    }

    // Parse request body
    const { ingredients, mealType, cuisine, cookingTime, complexity } = await req.json();

    if (!ingredients || !mealType || !cuisine || !cookingTime || !complexity) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Generate the prompt for the AI model
    const prompt = [
      "Generate a recipe that incorporates the following details:",
      `[Ingredients: ${ingredients}]`,
      `[Meal Type: ${mealType}]`,
      `[Cuisine Preference: ${cuisine}]`,
      `[Cooking Time: ${cookingTime}]`,
      `[Complexity: ${complexity}]`,
      "Provide a detailed recipe, including steps for preparation and cooking. Only use the ingredients provided.",
      "Highlight the fresh and vibrant flavors of the ingredients.",
      "Give the recipe a suitable name in its local language based on the cuisine preference.",
    ].join("\n");

    // Generate content from GoogleGenerativeAI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(prompt);
    const recipeText = result.response.text();

    if (!recipeText) {
      throw new Error("Failed to retrieve recipe text from AI response.");
    }

    // Extract the recipe name from the generated text (assuming it’s at the start)
    const nameMatch = recipeText.match(/^([^\n]+)\n/);
    const recipeName = nameMatch ? nameMatch[1].trim() : `Recipe for ${mealType} (${cuisine})`;

    // Clean up the recipe text (remove markdown)
    const cleanRecipeText = recipeText
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italics or bullet points
      .trim();

    // Save the recipe to the database
    const recipe = await prisma.recipe.create({
      data: {
        title: recipeName,
        ingredients,
        mealType,
        cuisine,
        cookingTime,
        complexity,
        userId: user.id, // Use Prisma’s user.id, not Clerk’s userId
      },
    });

    return NextResponse.json({ recipe: cleanRecipeText, savedRecipe: recipe }, { status: 200 });
  } catch (error) {
    console.error("Error generating recipe:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate recipe" },
      { status: 500 }
    );
  } finally {
    if (process.env.NODE_ENV === "production") {
      await prisma.$disconnect();
    }
  }
}