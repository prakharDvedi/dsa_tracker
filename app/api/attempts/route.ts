import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Cast session.user to any to access 'id' since we added it in the callback
    const userId = (session.user as any).id;
    const body = await request.json();

    const existAttemptCnt = await prisma.attempt.count({
      where: {
        problemId: body.problemId,
        userId: userId,
      },
    });

    const attemptNumber = existAttemptCnt + 1;

    const attempt = await prisma.attempt.create({
      data: {
        userId: userId,
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

    const session = await getServerSession(authOptions);
    let userId = "";

    if (session && session.user) {
      userId = (session.user as any).id;
    } else {
      // GUEST MODE: Fetch demo user's data
      const demoUser = await prisma.user.findUnique({
        where: { email: "demo@example.com" },
      });
      if (demoUser) {
        userId = demoUser.id;
      } else {
        // Fallback or empty if seed hasn't run
        return NextResponse.json([]);
      }
    }

    const where: any = { userId: userId };
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
