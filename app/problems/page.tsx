"use client";
import { useState, useEffect } from "react";

interface Problem {
  id: string;
  platform: string;
  title: string;
  difficulty: string;
  topics: string[]; // Assuming topics could be an array for better structure
  platformLink?: string;
}

export default function Problems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const handleLogAttempt = (problemId: string) => {
    console.log(`Logging attempt for problem ID: ${problemId}`);
  };

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("/api/problems");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Problem[] = await response.json();
        setProblems(data);
      } catch (error) {
        console.error("Failed to fetch problems:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">
        DSA Problems
      </h1>
      {problems.length === 0 ? (
        <p className="text-center text-gray-600">No problems found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {problem.title}
                </h2>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {problem.platform}
                </span>
              </div>
              <div className="flex items-center text-gray-700 mb-2">
                <strong className="mr-2">Difficulty:</strong>
                <span
                  className={`font-medium ${
                    problem.difficulty.toLowerCase() === "easy"
                      ? "text-green-600"
                      : problem.difficulty.toLowerCase() === "medium"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>
              <div className="text-gray-700 mb-4">
                <strong className="mr-2">Topics:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(Array.isArray(problem.topics)
                    ? problem.topics
                    : [problem.topics]
                  ).map((topic, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              {problem.platformLink && (
                <a
                  href={problem.platformLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 mr-2"
                >
                  View Problem
                </a>
              )}
              <button
                onClick={() => handleLogAttempt(problem.id)}
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
              >
                Log Attempt
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
