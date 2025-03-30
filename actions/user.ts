
"use server";

import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return { error: "User is not authenticated" }; // Handle unauthenticated users
  }

  // Check if the user already exists based on the clerkId
  const isExistingUser = await prisma?.user.findFirst({
    where: {
      clerkId: user.id, // Ensure you're using clerkId to check user existence
    },
  });

  if (isExistingUser) {
    return isExistingUser;
  }


  const newUser = await prisma.user.create({
    data: {
      clerkId: user.id, 
      email: user.emailAddresses[0].emailAddress, 
    },
  });

  return newUser;
};
