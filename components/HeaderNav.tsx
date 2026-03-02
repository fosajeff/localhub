"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function HeaderNav() {
  const router = useRouter();
  const { profile, refresh } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await refresh();
    router.push("/");
    router.refresh();
  }

  if (profile) {
    const initials = profile.name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((o) => !o)}
          className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-[#42dfe1]/25 text-gray-900 text-xs font-bold flex items-center justify-center shrink-0 border border-[#42dfe1]">
            {initials}
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-800">
            {profile.name}
          </span>
          <svg
            className="w-3.5 h-3.5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {profile.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                @{profile.username}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href="/login"
        className="text-sm text-gray-700 font-medium px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
      >
        Log in
      </a>
      <div className="relative">
        <button
          onMouseEnter={() => setTooltip(true)}
          onMouseLeave={() => setTooltip(false)}
          className="text-sm font-semibold px-3 py-1.5 rounded border border-[#42dfe1] text-gray-800 hover:bg-[#42dfe1]/10 transition-colors cursor-default"
        >
          Create account
        </button>
        {tooltip && (
          <div className="absolute right-0 top-full mt-1.5 whitespace-nowrap bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-md shadow-lg z-50">
            Coming soon ✨
            <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 rotate-45" />
          </div>
        )}
      </div>
    </div>
  );
}
