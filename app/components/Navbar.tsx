import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-white text-lg font-bold hover:text-gray-300"
        >
          DSA Tracker
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/problems" className="text-white hover:text-gray-300">
              Problems
            </Link>
          </li>
          <li>
            <Link
              href="/problems/new"
              className="text-white hover:text-gray-300"
            >
              New Problem
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
