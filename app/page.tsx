import Image from "next/image";

function HeroSection() {
  return (
    <div className="relative bg-white px-6 py-20 text-center shadow-lg dark:bg-black sm:px-16 sm:py-24 lg:px-24">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-5xl">
          DSA Tracker
        </h1>
        <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Effortlessly manage your Data Structures and Algorithms practice,
          track your progress, and conquer coding interviews.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/dashboard"
            className="flex h-12 w-full items-center justify-center rounded-full bg-indigo-600 px-6 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
            rel="noopener noreferrer"
          >
            Get Started
          </a>
          <a
            href="/problems"
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-zinc-300 px-6 text-base font-semibold leading-6 text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800 sm:w-auto"
            rel="noopener noreferrer"
          >
            Explore Problems{" "}
            <span aria-hidden="true" className="ml-1">
              →
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-7xl">
        <HeroSection />
      </main>
    </div>
  );
}
