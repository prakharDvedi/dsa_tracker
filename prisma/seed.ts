import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create or get default user
  let user = await prisma.user.findFirst();

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "default@example.com",
        name: "Default User",
        password: "temp",
      },
    });
    console.log("✓ Created default user");
  }

  // Clear existing problems (optional - comment out if you want to keep existing data)
  await prisma.attempt.deleteMany();
  await prisma.problem.deleteMany();
  console.log("✓ Cleared existing data");

  // Seed problems
  const problems = [
    {
      title: "Two Sum",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/two-sum/",
      difficulty: "Easy",
      topics: "Array, Hash Table",
    },
    {
      title: "Valid Parentheses",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/valid-parentheses/",
      difficulty: "Easy",
      topics: "Stack, String",
    },
    {
      title: "Merge Two Sorted Lists",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/merge-two-sorted-lists/",
      difficulty: "Easy",
      topics: "Linked List, Recursion",
    },
    {
      title: "Binary Tree Inorder Traversal",
      platform: "LeetCode",
      platformLink:
        "https://leetcode.com/problems/binary-tree-inorder-traversal/",
      difficulty: "Medium",
      topics: "Tree, DFS, Stack",
    },
    {
      title: "Longest Substring Without Repeating Characters",
      platform: "LeetCode",
      platformLink:
        "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      difficulty: "Medium",
      topics: "Hash Table, Sliding Window",
    },
    {
      title: "Climbing Stairs",
      platform: "HackerRank",
      platformLink:
        "https://www.hackerrank.com/challenges/climbing-the-leaderboard/",
      difficulty: "Easy",
      topics: "Dynamic Programming",
    },
    {
      title: "Merge Intervals",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/merge-intervals/",
      difficulty: "Medium",
      topics: "Array, Sorting",
    },
    {
      title: "Coin Change",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/coin-change/",
      difficulty: "Medium",
      topics: "Dynamic Programming, BFS",
    },
    {
      title: "Trapping Rain Water",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/trapping-rain-water/",
      difficulty: "Hard",
      topics: "Array, Two Pointers, Stack",
    },
    {
      title: "Maximum Subarray",
      platform: "Codeforces",
      platformLink: "https://codeforces.com/problemset/problem/1/A",
      difficulty: "Easy",
      topics: "Array, Greedy, Kadane",
    },
  ];

  const createdProblems = [];
  for (const problemData of problems) {
    const problem = await prisma.problem.create({
      data: {
        userId: user.id,
        ...problemData,
      },
    });
    createdProblems.push(problem);
  }

  console.log(`✓ Created ${problems.length} problems`);

  // Seed random attempts
  const notes = [
    "Struggled with edge cases initially",
    "Used HashMap approach, worked well",
    "Need to review this concept again",
    "Solved after looking at hints",
    "Clean solution, happy with it!",
    "Took longer than expected",
    "Optimized from O(n²) to O(n)",
    null,
    null,
    null, // Some attempts without notes
  ];

  let attemptCount = 0;
  const now = new Date();

  // Track which problems have been solved
  const solvedProblemIds = new Set<string>();

  // First, ensure 3-4 problems have ONLY failed attempts (unsolved)
  const unsolvedCount = 3;
  for (let i = 0; i < unsolvedCount; i++) {
    const problem = createdProblems[i];
    const numAttempts = Math.floor(Math.random() * 2) + 1; // 1-2 failed attempts

    for (let j = 0; j < numAttempts; j++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const solvedAt = new Date(now);
      solvedAt.setDate(solvedAt.getDate() - daysAgo);

      await prisma.attempt.create({
        data: {
          problemId: problem.id,
          userId: user.id,
          attemptNumber: j + 1,
          solved: false, // Explicitly unsolved
          timeTaken: null,
          notes: notes[Math.floor(Math.random() * 3)], // Pick from first 3 notes
          solvedAt,
        },
      });
      attemptCount++;
    }
  }

  // Then, create random attempts for remaining problems (mix of solved/unsolved)
  for (let i = 0; i < 20; i++) {
    const randomProblem =
      createdProblems[
        Math.floor(Math.random() * (createdProblems.length - unsolvedCount)) +
          unsolvedCount
      ];

    const existingAttempts = await prisma.attempt.count({
      where: { problemId: randomProblem.id },
    });

    const solved = Math.random() > 0.3; // 70% success rate for these
    const timeTaken = solved ? Math.floor(Math.random() * 90) + 10 : null;
    const randomNote = notes[Math.floor(Math.random() * notes.length)];

    const daysAgo = Math.floor(Math.random() * 30);
    const solvedAt = new Date(now);
    solvedAt.setDate(solvedAt.getDate() - daysAgo);

    await prisma.attempt.create({
      data: {
        problemId: randomProblem.id,
        userId: user.id,
        attemptNumber: existingAttempts + 1,
        solved,
        timeTaken,
        notes: randomNote,
        solvedAt,
      },
    });

    if (solved) {
      solvedProblemIds.add(randomProblem.id);
    }

    attemptCount++;
  }

  console.log(`✓ Created ${attemptCount} random attempts`);
  console.log("✓ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
