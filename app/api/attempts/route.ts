import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let user = await prisma.user.findFirst();

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "default@example.com",
          name: "Default User",
          password: "temp",
        },
      });
    }
    // i will count attempt and update attempt number
    const existAttemptCnt = await prisma.attempt.count({
      where: {
        problemId: body.problemId,
        userId: user.id,
      },
    });
    const attemptNumber = existAttemptCnt + 1;
    const attempt = await prisma.attempt.create({
      data: {
        userId: user.id,
        problemId: body.problemId,
        attemptNumber: attemptNumber,
        solved: body.solved,
        timeTaken: body.timeTaken,
        notes: body.notes,
        codeSnippet: body.codeSnippet,
        approach: body.approach,
        language: body.language,
      },
    });
    return NextResponse.json(attempt, { status: 201 });
  } catch (error) {
    console.error("Error in attempt", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get("problemId");

    // Get or create default user
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "default@example.com",
          name: "Default User",
          password: "temp",
        },
      });
    }

    const attempts = await prisma.attempt.findMany({
      where: {
        problemId: problemId as string,
        userId: user.id,
      },
      include: {
        problem: true,
      },
      orderBy: {
        solvedAt: "desc",
      },
    });

    return NextResponse.json(attempts);
  } catch (error) {
    console.error("Error fetching attempts:", error);
    return NextResponse.json(
      { error: "Failed to fetch attempts" },
      { status: 500 }
    );
  }
}
