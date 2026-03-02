"use client";

import { useEffect, useState, useCallback } from "react";
import type { PostWithAuthor, PostType, PostStatus } from "@/lib/types";
import PostCard from "./PostCard";

const BOARD_TAGS: Record<PostType, string[]> = {
  help: [
    "urgent",
    "react",
    "nextjs",
    "css",
    "python",
    "backend",
    "design",
    "typescript",
  ],
  job: [
    "remote",
    "fulltime",
    "parttime",
    "contract",
    "frontend",
    "backend",
    "design",
  ],
  event: ["meetup", "workshop", "online", "free", "networking", "hackathon"],
  project: ["opensource", "collab", "mvp", "frontend", "backend", "mobile"],
  article: ["tutorial", "opinion", "announcement", "guide", "tips", "news"],
};

interface PostListProps {
  type: PostType;
}

export default function PostList({ type }: PostListProps) {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<PostStatus | "">("");
  const [tagFilter, setTagFilter] = useState("");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ type });
    if (statusFilter) params.set("status", statusFilter);
    if (tagFilter.trim()) params.set("tag", tagFilter.trim().toLowerCase());
    const res = await fetch(`/api/posts?${params}`);
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }, [type, statusFilter, tagFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  function handleStatusChange(id: string, status: PostStatus) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  function toggleTag(tag: string) {
    setTagFilter((prev) => (prev === tag ? "" : tag));
  }

  return (
    <div className="space-y-2">
      {/* Filter bar */}
      <div className="space-y-2 px-1 mb-2">
        {/* Status */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PostStatus | "")}
            className="text-xs border border-gray-300 rounded-md px-2.5 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-300"
          >
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="resolved">Resolved</option>
          </select>
          {tagFilter && (
            <span className="text-xs text-indigo-600 font-medium">
              #{tagFilter}
              <button
                onClick={() => setTagFilter("")}
                className="ml-1 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </span>
          )}
        </div>
        {/* Tag chips */}
        <div className="flex flex-wrap gap-1.5">
          {BOARD_TAGS[type].map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                tagFilter === tag
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:text-indigo-600"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg p-5 animate-pulse"
            >
              <div className="h-3 bg-gray-100 rounded w-20 mb-3" />
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-100" />
                <div className="h-3 bg-gray-100 rounded w-40" />
              </div>
              <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-full mb-1" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg px-8 py-16 text-center">
          <p className="text-4xl mb-2">📭</p>
          <p className="text-gray-500 font-medium text-sm">
            No posts here yet.
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Be the first to share something!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onStatusChange={handleStatusChange}
              hideType
            />
          ))}
        </div>
      )}
    </div>
  );
}
