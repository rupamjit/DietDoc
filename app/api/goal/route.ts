
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = await auth(); // Get the authenticated user's ID

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
  const { userId } = await auth(); // Get the authenticated user's ID

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
