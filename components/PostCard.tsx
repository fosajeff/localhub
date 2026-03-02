"use client";

import { useState } from "react";
import type { PostWithAuthor, PostStatus } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import { useAuth } from "@/lib/AuthContext";
import CreatePostModal from "./CreatePostModal";

const TYPE_LABEL: Record<string, string> = {
  job: "💼 Jobs",
  event: "📅 Events",
  help: "🆘 HelpDesk",
  project: "🚀 Projects",
  article: "📝 Article",
};

const TYPE_COLOR: Record<string, string> = {
  job: "bg-yellow-50 text-yellow-800 border-yellow-200",
  event: "bg-blue-50 text-blue-800 border-blue-200",
  help: "bg-red-50 text-red-800 border-red-200",
  project: "bg-purple-50 text-purple-800 border-purple-200",
  article: "bg-gray-100 text-gray-700 border-gray-200",
};

interface PostCardProps {
  post: PostWithAuthor;
  onStatusChange?: (id: string, status: PostStatus) => void;
  onDelete?: (id: string) => void;
  onUpdated?: () => void;
  hideType?: boolean;
}

export default function PostCard({
  post,
  onStatusChange,
  onDelete,
  onUpdated,
  hideType,
}: PostCardProps) {
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { profile } = useAuth();
  const isOwner = !!profile && profile.id === post.authorId;

  async function handleStatusChange(newStatus: PostStatus) {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) onStatusChange?.(post.id, newStatus);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      if (res.ok) onDelete?.(post.id);
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  }

  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  // Author avatar: initials
  const initials = post.author.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <article className="bg-white border border-gray-200 rounded-lg hover:border-[#42dfe1] hover:shadow-sm transition-all group">
        {/* Top: category badge */}
        {!hideType && (
          <div className="px-5 pt-4 pb-0">
            <span
              className={`inline-block text-xs font-medium px-2 py-0.5 rounded border ${TYPE_COLOR[post.type]}`}
            >
              {TYPE_LABEL[post.type]}
            </span>
          </div>
        )}

        <div className="px-5 py-4">
          {/* Author row */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#42dfe1]/25 text-gray-900 text-xs font-bold flex items-center justify-center shrink-0 border border-[#42dfe1]/40">
              {initials}
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-800">
                {post.author.name}
              </span>
              {post.author.role && (
                <span className="text-gray-400"> · {post.author.role}</span>
              )}
              <span className="text-gray-400"> · {date}</span>
            </div>
            <div className="ml-auto">
              <StatusBadge status={post.status} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-gray-900 leading-snug mb-1 group-hover:text-[#1a9a9c] transition-colors">
            {post.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {post.description}
          </p>

          {/* Event extras */}
          {post.type === "event" && (post.eventDate || post.location) && (
            <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-3">
              {post.eventDate && (
                <span>
                  📅{" "}
                  {new Date(post.eventDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
              {post.location && <span>📍 {post.location}</span>}
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-gray-500 hover:text-[#1a9a9c] hover:bg-[#42dfe1]/10 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            {post.contactLink && (
              <a
                href={post.contactLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#1a9a9c] hover:text-[#0e7e80] font-medium"
              >
                Contact →
              </a>
            )}

            <div className="ml-auto flex items-center gap-1.5">
              {/* Owner actions */}
              {isOwner && (
                <>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="text-xs text-gray-400 hover:text-gray-700 px-1.5 py-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    Edit
                  </button>
                  {!confirmDelete ? (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="text-xs text-gray-400 hover:text-red-600 px-1.5 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-xs">
                      <span className="text-red-500">Delete?</span>
                      <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="text-red-600 font-semibold hover:underline disabled:opacity-50"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        No
                      </button>
                    </span>
                  )}
                  <span className="text-gray-200">|</span>
                </>
              )}
              {/* Status actions — owner only */}
              {isOwner && post.status === "open" && (
                <>
                  <button
                    disabled={loading}
                    onClick={() => handleStatusChange("resolved")}
                    className="text-xs px-2.5 py-1 rounded border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 transition-colors"
                  >
                    Resolve
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => handleStatusChange("closed")}
                    className="text-xs px-2.5 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </article>
      {showEditModal && (
        <CreatePostModal
          defaultType={post.type}
          editPost={post}
          onClose={() => setShowEditModal(false)}
          onCreated={() => {
            setShowEditModal(false);
            onUpdated?.();
          }}
        />
      )}
    </>
  );
}
