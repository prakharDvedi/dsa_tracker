import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedUser() {
  let user = await prisma.user.findUnique({
    where: { email: "demo@example.com" },
  });

  if (!user) {
    const hashedPassword = await bcrypt.hash("temp", 10);
    user = await prisma.user.create({
      data: {
        email: "demo@example.com",
        name: "Demo User",
        password: hashedPassword,
      },
    });
    console.log("✓ Created demo user (demo@example.com / temp)");
  }
  return user;
}

async function clearExistingData() {
  await prisma.attempt.deleteMany();
  await prisma.problem.deleteMany();
  console.log("✓ Cleared existing data");
}

async function seedProblems(userId: string) {
  const problemDataList = [
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
      title: "Climbing Stairs",
      platform: "HackerRank",
      platformLink:
        "https://www.hackerrank.com/challenges/climbing-the-leaderboard/",
      difficulty: "Easy",
      topics: "Dynamic Programming",
    },
    {
      title: "Maximum Subarray",
      platform: "Codeforces",
      platformLink: "https://codeforces.com/problemset/problem/1/A",
      difficulty: "Easy",
      topics: "Array, Greedy, Kadane",
    },
    {
      title: "Best Time to Buy and Sell Stock",
      platform: "LeetCode",
      platformLink:
        "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
      difficulty: "Easy",
      topics: "Array, Dynamic Programming",
    },
    {
      title: "Reverse Linked List",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/reverse-linked-list/",
      difficulty: "Easy",
      topics: "Linked List, Recursion",
    },
    {
      title: "Palindrome Number",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/palindrome-number/",
      difficulty: "Easy",
      topics: "Math",
    },
    {
      title: "Roman to Integer",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/roman-to-integer/",
      difficulty: "Easy",
      topics: "Hash Table, Math, String",
    },
    {
      title: "Longest Common Prefix",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/longest-common-prefix/",
      difficulty: "Easy",
      topics: "String",
    },
    {
      title: "Valid Anagram",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/valid-anagram/",
      difficulty: "Easy",
      topics: "Hash Table, String, Sorting",
    },
    {
      title: "Binary Search",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/binary-search/",
      difficulty: "Easy",
      topics: "Array, Binary Search",
    },
    {
      title: "Implement Queue using Stacks",
      platform: "LeetCode",
      platformLink:
        "https://leetcode.com/problems/implement-queue-using-stacks/",
      difficulty: "Easy",
      topics: "Stack, Queue, Design",
    },
    {
      title: "Majority Element",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/majority-element/",
      difficulty: "Easy",
      topics: "Array, Hash Table, Divide and Conquer",
    },
    {
      title: "Contains Duplicate",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/contains-duplicate/",
      difficulty: "Easy",
      topics: "Array, Hash Table, Sorting",
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
      title: "3Sum",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/3sum/",
      difficulty: "Medium",
      topics: "Array, Two Pointers, Sorting",
    },
    {
      title: "Group Anagrams",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/group-anagrams/",
      difficulty: "Medium",
      topics: "Array, Hash Table, String, Sorting",
    },
    {
      title: "Longest Palindromic Substring",
      platform: "LeetCode",
      platformLink:
        "https://leetcode.com/problems/longest-palindromic-substring/",
      difficulty: "Medium",
      topics: "String, Dynamic Programming",
    },
    {
      title: "Container With Most Water",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/container-with-most-water/",
      difficulty: "Medium",
      topics: "Array, Two Pointers, Greedy",
    },
    {
      title: "Product of Array Except Self",
      platform: "LeetCode",
      platformLink:
        "https://leetcode.com/problems/product-of-array-except-self/",
      difficulty: "Medium",
      topics: "Array, Prefix Sum",
    },
    {
      title: "Rotate Image",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/rotate-image/",
      difficulty: "Medium",
      topics: "Array, Math, Matrix",
    },
    {
      title: "Spiral Matrix",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/spiral-matrix/",
      difficulty: "Medium",
      topics: "Array, Matrix, Simulation",
    },
    {
      title: "Jump Game",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/jump-game/",
      difficulty: "Medium",
      topics: "Array, Dynamic Programming, Greedy",
    },
    {
      title: "Unique Paths",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/unique-paths/",
      difficulty: "Medium",
      topics: "Math, Dynamic Programming, Combinatorics",
    },
    {
      title: "Minimum Path Sum",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/minimum-path-sum/",
      difficulty: "Medium",
      topics: "Array, Dynamic Programming, Matrix",
    },
    {
      title: "Word Search",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/word-search/",
      difficulty: "Medium",
      topics: "Array, Backtracking, Matrix",
    },
    {
      title: "Kth Largest Element in an Array",
      platform: "LeetCode",
      platformLink:
        "https://leetcode.com/problems/kth-largest-element-in-an-array/",
      difficulty: "Medium",
      topics: "Array, Divide and Conquer, Sorting, Heap",
    },
    {
      title: "Course Schedule",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/course-schedule/",
      difficulty: "Medium",
      topics: "DFS, BFS, Graph, Topological Sort",
    },
    {
      title: "Number of Islands",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/number-of-islands/",
      difficulty: "Medium",
      topics: "Array, DFS, BFS, Union Find, Matrix",
    },
    {
      title: "Clone Graph",
      platform: "HackerRank",
      platformLink: "https://www.hackerrank.com/challenges/clone-graph/",
      difficulty: "Medium",
      topics: "Hash Table, DFS, BFS, Graph",
    },
    {
      title: "Decode Ways",
      platform: "Codeforces",
      platformLink: "https://codeforces.com/problemset/problem/2/A",
      difficulty: "Medium",
      topics: "String, Dynamic Programming",
    },
    {
      title: "Trapping Rain Water",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/trapping-rain-water/",
      difficulty: "Hard",
      topics: "Array, Two Pointers, Stack",
    },
    {
      title: "Median of Two Sorted Arrays",
      platform: "LeetCode",
      platformLink:
        "https://leetcode.com/problems/median-of-two-sorted-arrays/",
      difficulty: "Hard",
      topics: "Array, Binary Search, Divide and Conquer",
    },
    {
      title: "Regular Expression Matching",
      platform: "LeetCode",
      platformLink:
        "https://leetcode.com/problems/regular-expression-matching/",
      difficulty: "Hard",
      topics: "String, Dynamic Programming, Recursion",
    },
    {
      title: "Merge k Sorted Lists",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/merge-k-sorted-lists/",
      difficulty: "Hard",
      topics: "Linked List, Divide and Conquer, Heap, Merge Sort",
    },
    {
      title: "Word Ladder",
      platform: "LeetCode",
      platformLink: "https://leetcode.com/problems/word-ladder/",
      difficulty: "Hard",
      topics: "Hash Table, String, BFS",
    },
  ];

  const createdProblems = [];
  for (const problemData of problemDataList) {
    const problem = await prisma.problem.create({
      data: {
        userId: userId,
        ...problemData,
      },
    });
    createdProblems.push(problem);
  }
  console.log(`✓ Created ${problemDataList.length} problems`);
  return createdProblems;
}

async function seedAttempts(userId: string, createdProblems: any[]) {
  const attemptNotes = [
    "Struggled with edge cases initially",
    "Used HashMap approach, worked well",
    "Need to review this concept again",
    "Solved after looking at hints",
    "Clean solution, happy with it!",
    "Took longer than expected",
    "Optimized from O(n²) to O(n)",
    null,
    null,
    null,
  ];

  let totalAttemptCount = 0;
  const now = new Date();

  const problemsWithOnlyFailedAttempts = 3;
  for (let i = 0; i < problemsWithOnlyFailedAttempts; i++) {
    const problem = createdProblems[i];
    const numberOfAttempts = Math.floor(Math.random() * 2) + 1;

    for (let j = 0; j < numberOfAttempts; j++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const attemptDate = new Date(now);
      attemptDate.setDate(attemptDate.getDate() - daysAgo);

      await prisma.attempt.create({
        data: {
          problemId: problem.id,
          userId: userId,
          attemptNumber: j + 1,
          solved: false,
          timeTaken: null,
          notes: attemptNotes[Math.floor(Math.random() * 3)],
          solvedAt: attemptDate,
        },
      });
      totalAttemptCount++;
    }
  }

  const numberOfMixedAttempts = 80;
  for (let i = 0; i < numberOfMixedAttempts; i++) {
    const randomProblemIndex =
      Math.floor(
        Math.random() *
          (createdProblems.length - problemsWithOnlyFailedAttempts)
      ) + problemsWithOnlyFailedAttempts;
    const randomProblem = createdProblems[randomProblemIndex];

    const existingAttempts = await prisma.attempt.count({
      where: { problemId: randomProblem.id },
    });

    const isSolved = Math.random() > 0.3;
    const timeTaken = isSolved ? Math.floor(Math.random() * 90) + 10 : null;
    const randomNote =
      attemptNotes[Math.floor(Math.random() * attemptNotes.length)];

    const daysAgo = Math.floor(Math.random() * 30);
    const attemptDate = new Date(now);
    attemptDate.setDate(attemptDate.getDate() - daysAgo);

    await prisma.attempt.create({
      data: {
        problemId: randomProblem.id,
        userId: userId,
        attemptNumber: existingAttempts + 1,
        solved: isSolved,
        timeTaken: timeTaken,
        notes: randomNote,
        solvedAt: attemptDate,
      },
    });

    totalAttemptCount++;
  }

  console.log(`✓ Created ${totalAttemptCount} random attempts`);
}

async function main() {
  const user = await seedUser();
  await clearExistingData();
  const createdProblems = await seedProblems(user.id);
  await seedAttempts(user.id, createdProblems);

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
