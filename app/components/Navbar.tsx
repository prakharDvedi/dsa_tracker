import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex justify-between items-center">
        <li>
          <Link href="/" className="text-white hover:text-gray-300">
            Home
          </Link>
        </li>
        <li className="flex space-x-4">
          <Link href="/problems" className="text-white hover:text-gray-300">
            Problems
          </Link>
          <Link href="/problems/new" className="text-white hover:text-gray-300">
            New Problem
          </Link>
        </li>
      </ul>
    </nav>
  );
}
