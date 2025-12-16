import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
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
        return NextResponse.json([]);
      }
    }

    const problems = await prisma.problem.findMany({
      where: {
        userId: userId,
      },
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
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Cast session.user to any to access 'id' since we added it in the callback
    const userId = (session.user as any).id;
    const body = await request.json();

    const problem = await prisma.problem.create({
      data: {
        userId: userId,
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
