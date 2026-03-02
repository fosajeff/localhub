"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Login failed");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Image
              src="/images/logo.png"
              alt="LocalHub"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          <p className="text-sm text-gray-500">
            Sign in to your community account
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Access for invited members only
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-lg px-7 py-7 space-y-4 shadow-sm"
        >
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#42dfe1]/50 focus:border-[#42dfe1] transition-colors"
              placeholder="alice"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#42dfe1]/50 focus:border-[#42dfe1] transition-colors"
            />
          </div>

          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-[#42dfe1] text-gray-900 text-sm font-semibold hover:bg-[#2ecbcd] transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Continue"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5">
          <Link href="/" className="hover:text-gray-700 underline">
            ← Back to LocalHub
          </Link>
        </p>
      </div>
    </div>
  );
}
