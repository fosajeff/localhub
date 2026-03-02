// lib/types.ts – shared types used across API and UI

export type PostType = "job" | "event" | "help" | "project" | "article";
export type PostStatus = "open" | "closed" | "resolved";
export type HelpType = "request" | "offer";

export interface PostWithAuthor {
  id: string;
  title: string;
  description: string;
  type: PostType;
  status: PostStatus;
  tags: string[];
  contactLink: string | null;
  eventDate: string | null;
  location: string | null;
  helpType: HelpType | null;
  authorId: string;
  author: { id: string; name: string; role: string | null };
  createdAt: string;
  updatedAt: string;
}
