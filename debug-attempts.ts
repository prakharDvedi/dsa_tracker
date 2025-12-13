import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function debug() {
  const attempts = await prisma.attempt.findMany({
    include: {
      problem: true,
    },
  });

  // Group by problem
  const problemMap = new Map();
  attempts.forEach((attempt) => {
    if (!problemMap.has(attempt.problemId)) {
      problemMap.set(attempt.problemId, {
        title: attempt.problem.title,
        attempts: [],
      });
    }
    problemMap.get(attempt.problemId).attempts.push({
      solved: attempt.solved,
      attemptNumber: attempt.attemptNumber,
    });
  });

  const results: any = {
    totalAttempts: attempts.length,
    uniqueProblems: problemMap.size,
    problems: Array.from(problemMap.entries()).map(([id, data]) => ({
      title: data.title,
      totalAttempts: data.attempts.length,
      solvedAttempts: data.attempts.filter((a: any) => a.solved).length,
      hasAtLeastOneSolved: data.attempts.some((a: any) => a.solved),
    })),
  };

  const solvedProblems = results.problems.filter(
    (p: any) => p.hasAtLeastOneSolved
  ).length;
  results.solvedProblems = solvedProblems;
  results.successRate = Math.round(
    (solvedProblems / results.uniqueProblems) * 100
  );

  fs.writeFileSync("debug-output.json", JSON.stringify(results, null, 2));
  console.log("✅ Debug output written to debug-output.json");
  console.log(`Success Rate: ${results.successRate}%`);
  console.log(`Solved: ${solvedProblems}/${results.uniqueProblems}`);

  await prisma.$disconnect();
}

debug();
