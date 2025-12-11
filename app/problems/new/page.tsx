"use client";

import { useState } from "react";

export default function NewProblemPage() {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [platformLink, setPlatformLink] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [topics, setTopics] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          platform,
          platformLink,
          difficulty,
          topics,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        alert("Problem added successfully");
        // Optionally reset form fields
        setTitle("");
        setPlatform("");
        setPlatformLink("");
        setDifficulty("");
        setTopics("");
      } else {
        const error = await response.json();
        console.log(error);
        alert("Failed to add problem");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to add problem");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          New Problem
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="title"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Problem Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter problem title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              htmlFor="platform"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Platform
            </label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Platform</option>
              <option value="LeetCode">LeetCode</option>
              <option value="HackerRank">HackerRank</option>
              <option value="Codeforces">Codeforces</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="platformLink"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Platform Link
            </label>
            <input
              type="text"
              id="platformLink"
              value={platformLink}
              onChange={(e) => setPlatformLink(e.target.value)}
              placeholder="Enter Platform Link"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              htmlFor="difficulty"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Difficulty
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="topics"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Topics
            </label>
            <input
              type="text"
              id="topics"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="Enter Topics (e.g., Array, DP, Graph)"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Add Problem
          </button>
        </form>
      </div>
    </div>
  );
}
