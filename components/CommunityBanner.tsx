"use client";

import { useEffect, useState } from "react";

interface Summary {
  total: number;
  counts: Record<string, number>;
  since: string;
}

const BOARD_META: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  help: { label: "HelpDesk", icon: "🆘", color: "text-red-600" },
  job: { label: "Jobs", icon: "💼", color: "text-yellow-600" },
  event: { label: "Events", icon: "📅", color: "text-blue-600" },
  project: { label: "Projects", icon: "🚀", color: "text-purple-600" },
  article: { label: "Articles", icon: "📝", color: "text-gray-600" },
};

export default function CommunityBanner() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    fetch("/api/summary")
      .then((r) => r.json())
      .then(setSummary)
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {/* This week */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-linear-to-r from-indigo-600 to-indigo-500 px-4 py-3">
          <h3 className="text-sm font-bold text-white">
            This week in LocalHub
          </h3>
        </div>
        <div className="p-3">
          {summary ? (
            <ul className="space-y-2">
              {Object.entries(BOARD_META).map(([type, meta]) => {
                const count = summary.counts[type] ?? 0;
                return (
                  <li
                    key={type}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className={`flex items-center gap-1.5 ${meta.color}`}>
                      <span className="text-base leading-none">
                        {meta.icon}
                      </span>
                      <span className="text-gray-700">{meta.label}</span>
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${count > 0 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-400"}`}
                    >
                      {count}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-100 rounded animate-pulse"
                />
              ))}
            </div>
          )}

          {summary && summary.total > 0 && (
            <p className="text-xs text-gray-400 mt-3 pt-2 border-t border-gray-100">
              {summary.total} post{summary.total !== 1 ? "s" : ""} this week
            </p>
          )}
        </div>
      </div>

      {/* LocalHub info box */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-bold text-gray-800 mb-1">About LocalHub</h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          A space for local community members to connect, share opportunities,
          ask for help and organise events.
        </p>
        <div className="mt-3 flex flex-col gap-1.5">
          <a
            href="/login"
            className="text-xs text-center font-semibold py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
