"use client";

import { useState } from "react";

export default function NewProblemPage() {
  const [title, setTitle] = useState(""); // Inside the component
  const [platform, setPlatform] = useState("");
  const [platformLink, setPlatformLink] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [topics, setTopics] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // prevents page to aautmatically submit and reload
    console.log(title, platform, platformLink, difficulty, topics);
  };

  return (
    <div>
      <h1>New Problem</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="platform"> Platform</label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="">Select Platform</option>
            <option value="LeetCode">LeetCode</option>
            <option value="HackerRank">HackerRank</option>
            <option value="Codeforces">Codeforces</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div>
          <label htmlFor="platformLink"> Platform Link</label>
          <input
            type="text"
            value={platformLink}
            onChange={(e) => setPlatformLink(e.target.value)}
            placeholder="Enter Platform Link"
          />
        </div>
        <div>
          <label htmlFor="difficulty">Difficulty</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">Select Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div>
          <label htmlFor="topics">Topics</label>
          <input
            type="text"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            placeholder="Enter Topics"
          />
        </div>
        <div>
          <label htmlFor="title">Problem Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <button type="submit">Add Problem</button>
      </form>
    </div>
  );
}
