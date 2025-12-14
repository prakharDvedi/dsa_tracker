"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Problem {
  id: string;
  platform: string;
  title: string;
  difficulty: string;
  topics: string[];
  platformLink?: string;
}

export default function Problems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficultyfilter, setDifficultyFilter] = useState("All");
  const [platformfilter, setPlatformFilter] = useState("All");
  const router = useRouter();

  const handlDelete = async (id: string, problem: string) => {
    // Corrected syntax here
    try {
      // TODO: Implement delete logic
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  };
  const filtered = problems.filter((problem) => {
    // Changed problems to problem for clarity
    const match = problem.title.toLowerCase().includes(search.toLowerCase());
    const difficultyMatch =
      difficultyfilter === "All" || problem.difficulty === difficultyfilter;
    const platformMatch =
      platformfilter === "All" || problem.platform === platformfilter;

    return match && difficultyMatch && platformMatch;
  });
  const handleLogAttempt = (problemId: string) => {
    console.log(`Logging attempt for problem: ${problemId}`);
    router.push(`/problems/${problemId}/attempt`);
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
      <div className="flex justify-center items-center h-screen text-lg text-gray-300 bg-gray-900">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          DSA Problems
        </h1>
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Filters Row */}
          <div className="flex gap-4">
            <select
              value={difficultyfilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              value={platformfilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="All">All Platforms</option>
              <option value="LeetCode">LeetCode</option>
              <option value="HackerRank">HackerRank</option>
              <option value="Codeforces">Codeforces</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No problems found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filtered.map((problem) => (
              <div
                key={problem.id}
                className="bg-gray-800 shadow-xl rounded-xl p-7 border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-3xl font-bold text-white leading-tight">
                    {problem.title}
                  </h2>
                  <span className="bg-purple-600 text-white text-md font-semibold px-3 py-1 rounded-full shadow-md">
                    {problem.platform}
                  </span>
                </div>
                <div className="flex items-center text-gray-400 mb-3 text-lg">
                  <strong className="mr-2">Difficulty:</strong>
                  <span
                    className={`font-semibold ${
                      problem.difficulty.toLowerCase() === "easy"
                        ? "text-green-400"
                        : problem.difficulty.toLowerCase() === "medium"
                        ? "text-yellow-400"
                        : "text-red-500"
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </div>
                <div className="text-gray-400 mb-6">
                  <strong className="mr-2 text-lg">Topics:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(Array.isArray(problem.topics)
                      ? problem.topics
                      : [problem.topics]
                    ).map((topic, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-gray-200 text-sm font-medium px-3 py-1 rounded-full shadow-sm hover:bg-gray-600 transition-colors duration-200"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  {problem.platformLink && (
                    <a
                      href={problem.platformLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      View Problem
                    </a>
                  )}
                  <button
                    onClick={() => handleLogAttempt(problem.id)}
                    className="flex-1 text-center bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Log Attempt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
