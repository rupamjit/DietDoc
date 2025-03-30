"use server";

import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export enum Category {
  nutrition = "nutrition",
  fitness = "fitness",
  health = "health",
}

export const addGoalAction = async (goalData: {
  title: string;
  target: number;
  unit: string;
  category: Category;
}) => {
  const { userId } = await auth();

  if (!userId) throw new Error("User not authenticated");

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) throw new Error("User not found");

    const newGoal = await prisma.goal.create({
      data: {
        title: goalData.title,
        target: goalData.target,
        unit: goalData.unit,
        category: goalData.category,
        userId: user.id,
      },
    });

    return {
      id: newGoal.id,
      title: newGoal.title,
      target: newGoal.target,
      current: newGoal.current,
      unit: newGoal.unit,
      category: newGoal.category,
    };
  } catch (error) {
    console.error("Failed to add goal:", error);
    throw new Error("Failed to add goal");
  }
};

export const fetchGoalsAction = async () => {
  const { userId } = await auth();

  if (!userId) throw new Error("User not authenticated");

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) throw new Error("User not found");

    const goals = await prisma.goal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return goals.map((goal) => ({
      id: goal.id,
      title: goal.title,
      target: goal.target,
      current: goal.current,
      unit: goal.unit,
      category: goal.category as Category,
    }));
  } catch (error) {
    console.error("Failed to fetch goals:", error);
    throw new Error("Failed to fetch goals");
  }
};

export const updateGoalAction = async (goalId: string, current: number) => {
  const { userId } = await auth();

  if (!userId) throw new Error("User not authenticated");

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) throw new Error("User not found");

    const goal = await prisma.goal.findUnique({ where: { id: goalId } });

    if (!goal || goal.userId !== user.id) throw new Error("Unauthorized or goal not found");

    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: { current },
    });

    return {
      id: updatedGoal.id,
      title: updatedGoal.title,
      target: updatedGoal.target,
      current: updatedGoal.current,
      unit: updatedGoal.unit,
      category: updatedGoal.category as Category,
    };
  } catch (error) {
    console.error("Failed to update goal:", error);
    throw new Error("Failed to update goal");
  }
};

export const deleteGoalAction = async (goalId: string) => {
  const { userId } = await auth();

  if (!userId) throw new Error("User not authenticated");

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) throw new Error("User not found");

    const goal = await prisma.goal.findUnique({ where: { id: goalId } });

    if (!goal || goal.userId !== user.id) throw new Error("Unauthorized or goal not found");

    await prisma.goal.delete({ where: { id: goalId } });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete goal:", error);
    throw new Error("Failed to delete goal");
  }
};