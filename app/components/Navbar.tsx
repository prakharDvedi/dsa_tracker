"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-purple-400 text-xl font-bold hover:text-purple-300 transition-colors"
          >
            DSA Tracker
          </Link>
          <ul className="flex space-x-4">
            <li>
              <Link
                href="/dashboard"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/problems"
                className="text-gray-300 hover:text-white transition-colors"
              >
                All Problems
              </Link>
            </li>
            {session && (
              <li>
                <Link
                  href="/problems/new"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Add Problem
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="flex items-center gap-4">
          {!session ? (
            <>
              <span className="text-yellow-500 text-sm font-medium px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                Guest Mode (Read Only)
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-200 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-gray-300 text-sm">
                Hi, {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-md transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
