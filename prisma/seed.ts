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

  for (const problemData of problems) {
    await prisma.problem.create({
      data: {
        userId: user.id,
        ...problemData,
      },
    });
  }

  console.log(`✓ Created ${problems.length} problems`);
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
