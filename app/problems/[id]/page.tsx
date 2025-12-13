"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

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
}

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.id as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAttemptId, setExpandedAttemptId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [problemRes, attemptsRes] = await Promise.all([
          fetch(`/api/problems/${problemId}`),
          fetch(`/api/attempts?problemId=${problemId}`),
        ]);

        if (!problemRes.ok) {
          throw new Error(`Problem fetch error: ${problemRes.status}`);
        }
        const problemData: Problem = await problemRes.json();
        setProblem(problemData);

        if (!attemptsRes.ok) {
          throw new Error(`Attempts fetch error: ${attemptsRes.status}`);
        }
        const attemptsData: Attempt[] = await attemptsRes.json();
        setAttempts(attemptsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setProblem(null);
        setAttempts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [problemId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-red-600">
          Problem not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {problem.title}
        </h1>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Platform:</span> {problem.platform}
          {problem.platformLink && (
            <a
              href={problem.platformLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-600 hover:underline"
            >
              (Link)
            </a>
          )}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Difficulty:</span>{" "}
          <span
            className={`font-medium ${
              problem.difficulty === "Easy"
                ? "text-green-600"
                : problem.difficulty === "Medium"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {problem.difficulty}
          </span>
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Topics:</span> {problem.topics}
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Attempts</h2>
        {attempts.length === 0 ? (
          <p className="text-gray-600 italic">No attempts logged yet.</p>
        ) : (
          <div className="space-y-3">
            {attempts.map((attempt) => {
              const isExpanded = expandedAttemptId === attempt.id;
              return (
                <div
                  key={attempt.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-400 transition-colors duration-200"
                >
                  <button
                    onClick={() =>
                      setExpandedAttemptId(isExpanded ? null : attempt.id)
                    }
                    className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors duration-150 text-left"
                  >
                    <div className="flex-1">
                      <span className="font-medium text-gray-800">
                        Attempt {attempt.attemptNumber}
                      </span>{" "}
                      -{" "}
                      <span
                        className={`font-semibold ${
                          attempt.solved ? "text-green-600" : "text-red-600"
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
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
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
                    <div className="px-4 py-4 bg-white border-t border-gray-200">
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">
                            Time Taken
                          </h4>
                          <p className="text-gray-600">
                            {attempt.timeTaken
                              ? `${attempt.timeTaken} minutes`
                              : "Not recorded"}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">
                            Date
                          </h4>
                          <p className="text-gray-600">
                            {new Date(attempt.solvedAt).toLocaleString()}
                          </p>
                        </div>

                        {attempt.notes && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-1">
                              Notes
                            </h4>
                            <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded border border-gray-200">
                              {attempt.notes}
                            </p>
                          </div>
                        )}

                        {!attempt.notes && (
                          <p className="text-gray-400 italic text-sm">
                            No notes recorded for this attempt
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <button
          onClick={() => router.push(`/problems/${problemId}/attempt`)}
          className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-150 ease-in-out"
        >
          Log New Attempt
        </button>
      </div>
    </div>
  );
}
