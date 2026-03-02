"use client";

import { useEffect, useState } from "react";

interface Summary {
  total: number;
  counts: Record<string, number>;
  since: string;
}

const BOARD_META: Record<
  string,
  { icon: string; label: string; color: string }
> = {
  help: {
    icon: "🆘",
    label: "HelpDesk",
    color: "bg-red-50 text-red-700 border-red-100",
  },
  job: {
    icon: "💼",
    label: "Jobs",
    color: "bg-yellow-50 text-yellow-700 border-yellow-100",
  },
  event: {
    icon: "📅",
    label: "Events",
    color: "bg-green-50 text-green-700 border-green-100",
  },
  project: {
    icon: "🚀",
    label: "Projects",
    color: "bg-blue-50 text-blue-700 border-blue-100",
  },
  article: {
    icon: "📝",
    label: "Articles",
    color: "bg-purple-50 text-purple-700 border-purple-100",
  },
};

export default function RightSidebar() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    fetch("/api/summary")
      .then((r) => r.json())
      .then(setSummary)
      .catch(() => {});
  }, []);

  return (
    <aside className="space-y-4">
      {/* This week */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-800">
            This week in the community
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {Object.entries(BOARD_META).map(([type, meta]) => {
            const count = summary?.counts?.[type] ?? 0;
            return (
              <div
                key={type}
                className="flex items-center justify-between px-4 py-2.5"
              >
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span>{meta.icon}</span>
                  <span>{meta.label}</span>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${count > 0 ? meta.color : "bg-gray-50 text-gray-400 border-gray-100"}`}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>
        {summary && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-gray-700">
                {summary.total}
              </span>{" "}
              post{summary.total !== 1 ? "s" : ""} in the last 7 days
            </p>
          </div>
        )}
      </div>

      {/* Quick tips */}
      <div className="bg-white border border-gray-200 rounded-lg px-4 py-4">
        <h3 className="text-sm font-bold text-gray-800 mb-3">
          How LocalHub works
        </h3>
        <ul className="space-y-2 text-xs text-gray-600">
          <li className="flex gap-2">
            <span>🆘</span>
            <span>
              <strong>HelpDesk</strong> — ask for or offer local help
            </span>
          </li>
          <li className="flex gap-2">
            <span>💼</span>
            <span>
              <strong>Jobs</strong> — local opportunities
            </span>
          </li>
          <li className="flex gap-2">
            <span>📅</span>
            <span>
              <strong>Events</strong> — meetups & gatherings
            </span>
          </li>
          <li className="flex gap-2">
            <span>🚀</span>
            <span>
              <strong>Projects</strong> — find collaborators
            </span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
