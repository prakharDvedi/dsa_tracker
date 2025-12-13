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
        codeSnippet: body.codeSnippet || null,
        approach: body.approach || null,
        language: body.language || null,
      },
    });

    return NextResponse.json(attempt, { status: 201 });
  } catch (error) {
    console.error("Error creating attempt:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get("problemId");

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

    const where: any = { userId: user.id };
    if (problemId) {
      where.problemId = problemId;
    }

    const attempts = await prisma.attempt.findMany({
      where,
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
