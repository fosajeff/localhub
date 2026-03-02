"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  // Keep input in sync if URL changes externally
  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
  }, [searchParams]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : "/");
  }

  function handleClear() {
    setQ("");
    router.push("/");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="hidden sm:flex flex-1 max-w-md relative"
    >
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search LocalHub…"
        className="w-full text-sm border border-gray-300 rounded-md px-3 py-1.5 pr-8 bg-gray-50 text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#42dfe1] focus:border-[#42dfe1] transition-colors"
      />
      {q && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-base leading-none"
        >
          ×
        </button>
      )}
    </form>
  );
}
