"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

interface Problem {
  id: string;
  title: string;
  platform: string;
  platformLink?: string;
  difficulty: string;
  topics: string;
}

interface Attempt {
  id: string;
  attemptNumber: number;
  solved: boolean;
  timeTaken: number | null;
  notes: string | null;
  solvedAt: string;
  problemId: string;
}

interface AttemptWithProblem extends Attempt {
  problem: Problem;
}

export default function DashboardPage() {
  const router = useRouter();

  const [attempts, setAttempts] = useState<AttemptWithProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAttemptId, setExpandedAttemptId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const attemptsRes = await fetch("/api/attempts");

        if (!attemptsRes.ok) {
          throw new Error(`Attempts fetch error: ${attemptsRes.status}`);
        }
        const attemptsData: AttemptWithProblem[] = await attemptsRes.json();
        setAttempts(attemptsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setAttempts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // stats
  const stats = useMemo(() => {
    const uniqueProblems = new Set(attempts.map((a) => a.problemId));
    const totalProblems = uniqueProblems.size;

    const solvedProblems = new Set(
      attempts.filter((a) => a.solved).map((a) => a.problemId)
    );
    const totalSolved = solvedProblems.size;

    const successRate =
      totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

    const totalAttempts = attempts.length;

    const solvedWithTime = attempts.filter((a) => a.solved && a.timeTaken);
    const avgTime =
      solvedWithTime.length > 0
        ? Math.round(
            solvedWithTime.reduce((sum, a) => sum + (a.timeTaken || 0), 0) /
              solvedWithTime.length
          )
        : 0;

    return {
      totalProblems,
      totalSolved,
      successRate,
      totalAttempts,
      avgTime,
    };
  }, [attempts]);

  // sort by date
  const sortedAttempts = useMemo(() => {
    return [...attempts].sort(
      (a, b) => new Date(b.solvedAt).getTime() - new Date(a.solvedAt).getTime()
    );
  }, [attempts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950">
        <div className="text-xl font-semibold text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-center mb-12 text-purple-300">
          Your DSA Journey
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <StatCard
            title="Problems Solved"
            value={stats.totalSolved}
            color="bg-green-600"
          />
          <StatCard
            title="Total Problems"
            value={stats.totalProblems}
            color="bg-purple-600"
          />
          <StatCard
            title="Avg Time (min)"
            value={stats.avgTime}
            color="bg-yellow-600"
          />
          <StatCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            color="bg-blue-600"
          />
          <StatCard
            title="Total Attempts"
            value={stats.totalAttempts}
            color="bg-pink-600"
          />
        </div>

        <div className="bg-gray-900 shadow-lg rounded-xl p-6 border border-gray-800">
          <h2 className="text-2xl font-semibold text-gray-100 mb-6">
            Recent Attempts
          </h2>
          {attempts.length === 0 ? (
            <p className="text-gray-500 italic">No attempts logged yet.</p>
          ) : (
            <div className="space-y-4">
              {sortedAttempts.map((attempt) => {
                const isExpanded = expandedAttemptId === attempt.id;
                return (
                  <div
                    key={attempt.id}
                    className="border border-gray-800 rounded-lg overflow-hidden hover:border-purple-600 transition-colors duration-200 bg-gray-850"
                  >
                    <button
                      onClick={() =>
                        setExpandedAttemptId(isExpanded ? null : attempt.id)
                      }
                      className="w-full px-5 py-4 flex justify-between items-center bg-gray-800 hover:bg-gray-700 transition-colors duration-150 text-left"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-100 mb-1">
                          <a
                            href={`/problems/${attempt.problem.id}`}
                            className="hover:underline text-purple-400"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {attempt.problem.title}
                          </a>{" "}
                          <span className="text-gray-400 text-sm">
                            (Attempt {attempt.attemptNumber})
                          </span>
                        </p>
                        <span
                          className={`text-sm font-medium ${
                            attempt.solved ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {attempt.solved ? "Solved ✓" : "Not Solved ✗"}
                        </span>
                        {attempt.timeTaken && (
                          <span className="ml-2 text-gray-500 text-sm">
                            ({attempt.timeTaken} min)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm">
                          {new Date(attempt.solvedAt).toLocaleDateString()}
                        </span>
                        <svg
                          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 py-4 bg-gray-900 border-t border-gray-800">
                        <div className="space-y-3 text-sm">
                          <div>
                            <h4 className="font-semibold text-gray-300 mb-1">
                              Problem Details
                            </h4>
                            <p className="text-gray-400">
                              Platform: {attempt.problem.platform}
                              {attempt.problem.platformLink && (
                                <a
                                  href={attempt.problem.platformLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-1 text-purple-400 hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  (Link)
                                </a>
                              )}
                            </p>
                            <p className="text-gray-400">
                              Difficulty:{" "}
                              <span
                                className={`font-medium ${
                                  attempt.problem.difficulty === "Easy"
                                    ? "text-green-500"
                                    : attempt.problem.difficulty === "Medium"
                                    ? "text-yellow-500"
                                    : "text-red-500"
                                }`}
                              >
                                {attempt.problem.difficulty}
                              </span>
                            </p>
                            <p className="text-gray-400">
                              Topics: {attempt.problem.topics}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-300 mb-1">
                              Time Taken
                            </h4>
                            <p className="text-gray-400">
                              {attempt.timeTaken
                                ? `${attempt.timeTaken} minutes`
                                : "Not recorded"}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-300 mb-1">
                              Date
                            </h4>
                            <p className="text-gray-400">
                              {new Date(attempt.solvedAt).toLocaleString()}
                            </p>
                          </div>

                          {attempt.notes && (
                            <div>
                              <h4 className="font-semibold text-gray-300 mb-1">
                                Notes
                              </h4>
                              <p className="text-gray-300 whitespace-pre-wrap bg-gray-800 p-3 rounded border border-gray-700">
                                {attempt.notes}
                              </p>
                            </div>
                          )}

                          {!attempt.notes && (
                            <p className="text-gray-500 italic">
                              No notes recorded for this attempt
                            </p>
                          )}
                          <button
                            onClick={() =>
                              router.push(
                                `/problems/${attempt.problem.id}/attempt`
                              )
                            }
                            className="mt-5 px-4 py-2 bg-purple-600 text-white font-medium rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition duration-150 ease-in-out text-sm"
                          >
                            Log New Attempt for this Problem
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  color: string;
}

function StatCard({ title, value, color }: StatCardProps) {
  return (
    <div
      className={`${color} bg-opacity-30 border border-opacity-40 ${color.replace(
        "bg-",
        "border-"
      )} shadow-md rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-300`}
    >
      <h3 className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-4xl font-bold text-gray-100">{value}</p>
    </div>
  );
}
