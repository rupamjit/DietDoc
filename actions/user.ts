
"use server";

import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return { error: "User is not authenticated" }; 
  }


  const isExistingUser = await prisma?.user.findFirst({
    where: {
      clerkId: user.id,
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
