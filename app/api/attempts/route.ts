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
        codeSnippet: null,
        approach: null,
        language: null,
      },
    });
    return NextResponse.json(attempt, { status: 201 });
  } catch (error) {
    console.error("Error in attempt", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
