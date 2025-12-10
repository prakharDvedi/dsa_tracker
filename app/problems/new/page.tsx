"use client";

import { useState } from "react";

export default function NewProblemPage() {
  const [title, setTitle] = useState(""); // Inside the component

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // prevents page to aautmatically submit and reload
    console.log(title);
  };

  return (
    <div>
      <h1>New Problem</h1>
      <form onSubmit={handleSubmit}>
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
