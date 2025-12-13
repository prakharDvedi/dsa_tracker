"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function LogAttempt() {
  // Renamed to follow React component naming conventions
  const params = useParams();
  const router = useRouter();

  const problemId = params.id as string;

  const [solved, setSolved] = useState(false);
  const [timeTaken, setTimeTaken] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(solved, timeTaken, notes, problemId);

    const response = await fetch("/api/attempts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        problemId,
        solved,
        timeTaken: parseInt(timeTaken, 10), // Convert timeTaken to number
        notes,
      }),
    });

    if (response.ok) {
      router.push(`/problems/${problemId}`); // Redirect
    } else {
      console.error("Failed to log attempt");
    }
  };

  return (
    <div>
      <h1>Log Attempt for Problem: {problemId}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Solved:
          <input
            type="checkbox"
            checked={solved}
            onChange={(e) => setSolved(e.target.checked)}
          />
        </label>
        <br />
        <label>
          Time Taken (minutes):
          <input
            type="number"
            value={timeTaken}
            onChange={(e) => setTimeTaken(e.target.value)}
          />
        </label>
        <br />
        <label>
          Notes:
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
