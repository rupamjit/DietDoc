import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";



export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "User not authenticated" }, { status: 401 });

    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const goals = await prisma.goal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "User not authenticated" }, { status: 401 });

  try {
    const { title, target, unit, category } = await request.json();

    if (!title || !target || !unit || !category) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const newGoal = await prisma.goal.create({
      data: {
        title,
        target,
        unit,
        category,
        userId: user.id,
      },
    });

    return NextResponse.json(newGoal, { status: 201 });
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "User not authenticated" }, { status: 401 });

  try {
    const { id, current } = await request.json();
    if (!id || current === undefined || current < 0) {
      return NextResponse.json({ error: "Goal ID and valid current value are required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const goal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!goal || goal.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized or goal not found" }, { status: 403 });
    }

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: { current },
    });

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error("Error updating goal:", error);
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "User not authenticated" }, { status: 401 });

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Goal ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const goal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!goal || goal.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized or goal not found" }, { status: 403 });
    }

    await prisma.goal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting goal:", error);
    return NextResponse.json({ error: "Failed to delete goal" }, { status: 500 });
  }
}