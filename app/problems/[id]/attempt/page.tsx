"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function LogAttempt() {
  const params = useParams();
  const router = useRouter();

  const problemId = params.id as string;

  const [solved, setSolved] = useState(false);
  const [timeTaken, setTimeTaken] = useState("");
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null); // Clear previous errors
    setIsSubmitting(true);

    // Basic validation
    const timeTakenNum = parseInt(timeTaken, 10);
    if (isNaN(timeTakenNum) || timeTakenNum <= 0) {
      setErrorMessage(
        "Please enter a valid time taken (minutes) greater than 0."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problemId,
          solved,
          timeTaken: timeTakenNum,
          notes,
        }),
      });

      if (response.ok) {
        router.push(`/problems/${problemId}`); // Redirect
      } else {
        const errorData = await response.json();
        setErrorMessage(
          errorData.message || "Failed to log attempt. Please try again."
        );
        console.error("Failed to log attempt:", errorData);
      }
    } catch (error) {
      setErrorMessage(
        "An unexpected error occurred. Please check your network connection."
      );
      console.error("Network or unexpected error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 py-12">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg border border-gray-700">
        <h1 className="text-4xl font-extrabold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Log Attempt
        </h1>
        <p className="text-center text-gray-400 mb-8 text-sm">
          Track your progress on this problem
        </p>

        {errorMessage && (
          <div
            className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg relative mb-6 backdrop-blur-sm"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-3 bg-gray-700/50 p-4 rounded-lg border border-gray-600 hover:border-purple-500 transition-colors duration-200">
            <input
              type="checkbox"
              id="solved"
              checked={solved}
              onChange={(e) => setSolved(e.target.checked)}
              className="form-checkbox h-6 w-6 text-purple-600 rounded focus:ring-purple-500 focus:ring-2 bg-gray-600 border-gray-500"
            />
            <label
              htmlFor="solved"
              className="text-gray-200 font-medium text-lg cursor-pointer"
            >
              I solved this problem ✓
            </label>
          </div>

          <div>
            <label
              htmlFor="timeTaken"
              className="block text-gray-300 text-sm font-semibold mb-2"
            >
              Time Taken (minutes) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              id="timeTaken"
              value={timeTaken}
              onChange={(e) => setTimeTaken(e.target.value)}
              min="1"
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-200 placeholder-gray-500 transition-all duration-200"
              placeholder="e.g., 30"
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-gray-300 text-sm font-semibold mb-2"
            >
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-200 placeholder-gray-500 resize-none transition-all duration-200"
              placeholder="What did you learn? What mistakes did you make? What approach did you use?"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-base font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
          >
            {isSubmitting ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            {isSubmitting ? "Submitting..." : "Submit Attempt"}
          </button>
        </form>
      </div>
    </div>
  );
}
