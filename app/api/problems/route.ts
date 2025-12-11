import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const problems = await prisma.problem.findMany({
      include: {
        attempts: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    return NextResponse.json(
      { error: "Failed to fetch problems" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // For now, using a default user since you don't have auth yet
    // First, check if a user exists, if not create one
    let user = await prisma.user.findFirst();

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "default@example.com",
          name: "Default User",
          password: "temp", // You'll implement proper auth later
        },
      });
    }

    const problem = await prisma.problem.create({
      data: {
        userId: user.id,
        title: body.title,
        platformLink: body.platformLink || null,
        platform: body.platform || null,
        difficulty: body.difficulty,
        topics: body.topics, // Store as string
      },
    });

    return NextResponse.json(problem, { status: 201 });
  } catch (error) {
    console.error("Error creating problem:", error);
    return NextResponse.json(
      { error: "Failed to create problem" },
      { status: 500 }
    );
  }
}
