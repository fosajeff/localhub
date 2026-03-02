"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import type { PostType } from "@/lib/types";
import PostList from "@/components/PostList";
import CreatePostModal from "@/components/CreatePostModal";
import CommunityBanner from "@/components/CommunityBanner";
import { useAuth } from "@/lib/AuthContext";

const BOARDS: { type: PostType; label: string; icon: string }[] = [
  { type: "help", label: "HelpDesk", icon: "🆘" },
  { type: "job", label: "Jobs", icon: "💼" },
  { type: "event", label: "Events", icon: "📅" },
  { type: "project", label: "Projects", icon: "🚀" },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<PostType>("help");
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { profile } = useAuth();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";

  return (
    <div className="flex gap-4 pt-4 pb-12 items-start">
      {/* ── LEFT SIDEBAR ─────────────────────────────── */}
      <aside className="hidden lg:flex flex-col gap-1 w-55 shrink-0 sticky top-14">
        {/* Brand blurb */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-2">
          <div className="h-8 bg-linear-to-r from-[#42dfe1] to-[#78b4dc]" />
          <div className="px-4 pb-4 pt-3">
            <p className="font-bold text-gray-900 text-sm">
              LocalHub community workspace
            </p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Share help, jobs, events and projects with your local community.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-3 w-full text-sm font-semibold py-1.5 rounded-md bg-[#42dfe1] text-gray-900 hover:bg-[#2ecbcd] transition-colors"
            >
              Write a post
            </button>
            {!profile && (
              <a
                href="/login"
                className="mt-2 w-full text-sm font-medium py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                Log in
              </a>
            )}
          </div>
        </div>

        {/* Board nav */}
        <nav className="bg-white border border-gray-200 rounded-lg py-2">
          {BOARDS.map((b) => (
            <button
              key={b.type}
              onClick={() => setActiveTab(b.type)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded transition-colors text-left
                ${
                  activeTab === b.type
                    ? "bg-[#42dfe1]/15 text-gray-900 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <span className="text-base leading-none">{b.icon}</span>
              <span>{b.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ── CENTER FEED ──────────────────────────────── */}
      <main className="flex-1 min-w-0">
        {/* Mobile board tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-3 lg:hidden">
          {BOARDS.map((b) => (
            <button
              key={b.type}
              onClick={() => setActiveTab(b.type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 border transition-colors
                ${
                  activeTab === b.type
                    ? "bg-[#42dfe1] text-gray-900 border-[#42dfe1]"
                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                }`}
            >
              {b.icon} {b.label}
            </button>
          ))}
        </div>

        {/* Hero banner */}
        <div className="rounded-lg overflow-hidden mb-3 border border-gray-200">
          <Image
            src="/images/localhub.png"
            alt="LocalHub"
            width={1280}
            height={320}
            className="w-full object-cover max-h-40"
            priority
          />
        </div>

        {/* Board label + new post */}
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-sm font-semibold text-white">
            {BOARDS.find((b) => b.type === activeTab)?.icon}{" "}
            {BOARDS.find((b) => b.type === activeTab)?.label}
          </span>
          <button
            onClick={() => setShowModal(true)}
            className="text-sm font-semibold text-[#1a9a9c] hover:underline"
          >
            + New post
          </button>
        </div>

        <PostList
          key={`${activeTab}-${refreshKey}-${searchQuery}`}
          type={activeTab}
          searchQuery={searchQuery}
        />
      </main>

      {/* ── RIGHT SIDEBAR ────────────────────────────── */}
      <aside className="hidden xl:block w-60 shrink-0 sticky top-14">
        <CommunityBanner />
      </aside>

      {showModal && (
        <CreatePostModal
          defaultType={activeTab}
          onClose={() => setShowModal(false)}
          onCreated={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
}
