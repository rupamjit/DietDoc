"use server"
import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";


export async function saveProfile(profile: {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: string;
  allergies: string[];
  chronicDiseases: string[];
  dietaryPreferences: string[];
}) {
  try {
    const user = await currentUser();
    console.log(user);
    if (!user) {
      return { error: "User not authenticated" };
    }

 
    let existingUser = await prisma.user.findFirst({
      where: { clerkId: user.id },
      include: { profile: true },
    });

    if (!existingUser) {
      
      existingUser = await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress, // Fetch the email from Clerk
          profile: {
            create: {
              ...profile,
              age: Number(profile.age),
              weight: Number(profile.weight),
              height: Number(profile.height),
            },
          },
        },
        include: { profile: true },
      });
    } else if (!existingUser.profile) {
      // If user exists but has no profile, create profile
      await prisma.profile.create({
        data: {
          userId: existingUser.id,
          ...profile,
          age: Number(profile.age),
          weight: Number(profile.weight),
          height: Number(profile.height),
        },
      });
    } else {
      await prisma.profile.update({
        where: { userId: existingUser.id },
        data: {
          ...profile,
          age: Number(profile.age),
          weight: Number(profile.weight),
          height: Number(profile.height),
        },
      });
    }

    return { success: "Profile saved successfully", user: existingUser };
  } catch (error) {
    console.error("Error saving profile:", error);
    return { error: "Failed to save profile" };
  }
}
