import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");


if (process.env.NODE_ENV === "production") {
  prisma.$connect();
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User does not exist" }, { status: 404 });
    }


    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const { ingredients, mealType, cuisine, cookingTime, complexity } = await req.json();

    if (!ingredients || !mealType || !cuisine || !cookingTime || !complexity) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Build user profile-based prompt
    const userProfile = [
      `User's name: ${profile.name}`,
      `Age: ${profile.age}`,
      `Weight: ${profile.weight} kg`,
      `Height: ${profile.height} cm`,
      `Gender: ${profile.gender}`,
      `Allergies: ${profile.allergies.join(", ")}`,
      `Chronic Diseases: ${profile.chronicDiseases.join(", ")}`,
      `Dietary Preferences: ${profile.dietaryPreferences.join(", ")}`,
      "The recipe should accommodate all of the above health factors, allergies, and dietary preferences."
    ].join("\n");

    const prompt = [
      "Generate a recipe that incorporates the following details:",
      `[Ingredients: ${ingredients}]`,
      `[Meal Type: ${mealType}]`,
      `[Cuisine Preference: ${cuisine}]`,
      `[Cooking Time: ${cookingTime}]`,
      `[Complexity: ${complexity}]`,
      "Consider the following user profile for health and dietary considerations:",
      userProfile,
      "Provide a detailed recipe, including steps for preparation and cooking. Only use the ingredients provided.",
      "Highlight the fresh and vibrant flavors of the ingredients.",
      "Give the recipe a suitable name in its local language based on the cuisine preference.",
    ].join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(prompt);
    const recipeText = result.response.text();

    if (!recipeText) {
      throw new Error("Failed to retrieve recipe text from AI response.");
    }

    const nameMatch = recipeText.match(/^([^\n]+)\n/);
    const recipeName = nameMatch ? nameMatch[1].trim() : `Recipe for ${mealType} (${cuisine})`;

    const cleanRecipeText = recipeText
      .replace(/\*\*(.*?)\*\*/g, "$1") 
      .replace(/\*(.*?)\*/g, "$1") 
      .trim();

    
    const recipe = await prisma.recipe.create({
      data: {
        title: recipeName,
        ingredients,
        mealType,
        cuisine,
        cookingTime,
        complexity,
        userId: user.id,
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
