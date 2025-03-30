// import { NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { PrismaClient } from "@prisma/client";
// import { auth } from "@clerk/nextjs/server";



// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
// const prisma = new PrismaClient();

// export async function POST(req: Request) {
//   try {
//     const { userId } = await auth();
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { ingredients, mealType, cuisine, cookingTime, complexity } =
//       await req.json();

//     const prompt = [
//       "Generate a recipe that incorporates the following details:",
//       `[Ingredients: ${ingredients}]`,
//       `[Meal Type: ${mealType}]`,
//       `[Cuisine Preference: ${cuisine}]`,
//       `[Cooking Time: ${cookingTime}]`,
//       `[Complexity: ${complexity}]`,
//       "Please provide a detailed recipe, including steps for preparation and cooking. Only use the ingredients provided.",
//       "The recipe should highlight the fresh and vibrant flavors of the ingredients.",
//       "Also give the recipe a suitable name in its local language based on cuisine preference.",
//     ].join("\n");

//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash-latest",
//     });
//     const result = await model.generateContent(prompt);

//     const response = result.response;
//     const recipeText = await response.text();

//     const cleanRecipeText = recipeText
//       .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold formatting (**
//       .replace(/\*(.*?)\*/g, "$1"); // Remove bullet points

//     const recipe = await prisma.recipe.create({
//       data: {
//         title: `Recipe for ${mealType} (${cuisine})`,
//         ingredients: ingredients,
//         mealType: mealType,
//         cuisine: cuisine,
//         cookingTime: cookingTime,
//         complexity: complexity,
//         userId: userId,
//       },
//     });

//     return NextResponse.json({ recipe: cleanRecipeText, savedRecipe: recipe });
//   } catch (error) {
//     console.error("Error generating recipe:", error);
//     return NextResponse.json(
//       { error: "Failed to generate recipe" },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { PrismaClient } from "@prisma/client";
// import { auth } from "@clerk/nextjs/server";

// // Initialize GoogleGenerativeAI and PrismaClient
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
// const prisma = new PrismaClient();

// // Singleton pattern to avoid multiple PrismaClient instantiations
// if (process.env.NODE_ENV === "production") {
//   prisma.$connect();
// }

// export async function POST(req: Request) {
//   try {
//     // Authenticate the user
//     const { userId } = await auth();
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Check if the user exists in the database
//     const userExists = await prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!userExists) {
//       return NextResponse.json({ error: "User does not exist" }, { status: 404 });
//     }

//     // Get the recipe details from the request body
//     const { ingredients, mealType, cuisine, cookingTime, complexity } =
//       await req.json();

//     // Generate the prompt for the AI model
//     const prompt = [
//       "Generate a recipe that incorporates the following details:",
//       `[Ingredients: ${ingredients}]`,
//       `[Meal Type: ${mealType}]`,
//       `[Cuisine Preference: ${cuisine}]`,
//       `[Cooking Time: ${cookingTime}]`,
//       `[Complexity: ${complexity}]`,
//       "Please provide a detailed recipe, including steps for preparation and cooking. Only use the ingredients provided.",
//       "The recipe should highlight the fresh and vibrant flavors of the ingredients.",
//       "Also give the recipe a suitable name in its local language based on cuisine preference.",
//     ].join("\n");

//     // Generate content from GoogleGenerativeAI
//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash-latest", // Ensure this model is available and configured
//     });
//     const result = await model.generateContent(prompt);

//     // If result.response is not available or is malformed, throw an error
//     const recipeText = await result.response.text();
//     if (!recipeText) {
//       throw new Error("Failed to retrieve recipe text from AI response.");
//     }

//     // Clean up the recipe text
//     const cleanRecipeText = recipeText
//       .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold formatting (e.g. **text**)
//       .replace(/\*(.*?)\*/g, "$1"); // Remove bullet points (e.g. *text*)

//     // Save the recipe to the database using Prisma
//     const recipe = await prisma.recipe.create({
//       data: {
//         title: `Recipe for ${mealType} (${cuisine})`,
//         ingredients: ingredients,
//         mealType: mealType,
//         cuisine: cuisine,
//         cookingTime: cookingTime,
//         complexity: complexity,
//         userId: userId, // Associate the recipe with the user
//       },
//     });

//     // Return the response with both the generated recipe and saved recipe data
//     return NextResponse.json({ recipe: cleanRecipeText, savedRecipe: recipe });
//   } catch (error) {
//     console.error("Error generating recipe:", error);
//     return NextResponse.json(
//       { error: "Failed to generate recipe" },
//       { status: 500 }
//     );
//   }
// }



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