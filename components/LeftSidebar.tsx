"use client";

import type { PostType } from "@/lib/types";

const BOARDS: {
  type: PostType;
  icon: string;
  label: string;
  description: string;
}[] = [
  {
    type: "help",
    icon: "🆘",
    label: "HelpDesk",
    description: "Ask for or offer help",
  },
  {
    type: "job",
    icon: "💼",
    label: "Jobs",
    description: "Local opportunities",
  },
  {
    type: "event",
    icon: "📅",
    label: "Events",
    description: "Meetups & gatherings",
  },
  {
    type: "project",
    icon: "🚀",
    label: "Projects",
    description: "Find collaborators",
  },
];

interface LeftSidebarProps {
  activeTab: PostType;
  onTabChange: (type: PostType) => void;
  onNewPost: () => void;
}

export default function LeftSidebar({
  activeTab,
  onTabChange,
  onNewPost,
}: LeftSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col gap-3 w-[256px] shrink-0">
      {/* Community card */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="h-8 bg-gradient-to-r from-indigo-500 to-violet-500" />
        <div className="px-4 pt-3 pb-4">
          <h2 className="font-bold text-gray-900 text-base leading-snug">
            LocalHub community workspace
          </h2>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            A place to share help, jobs, events and projects with your local
            community.
          </p>
          <button
            onClick={onNewPost}
            className="mt-4 w-full py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Write a post
          </button>
          <a
            href="/login"
            className="mt-2 w-full py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            Log in
          </a>
        </div>
      </div>

      {/* Board navigation */}
      <nav className="bg-white border border-gray-200 rounded-lg py-2">
        {BOARDS.map((board) => (
          <button
            key={board.type}
            onClick={() => onTabChange(board.type)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors rounded-sm
              ${
                activeTab === board.type
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            <span className="text-base">{board.icon}</span>
            <span className="text-sm">{board.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
