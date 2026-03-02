import type { PostStatus } from "@/lib/types";

const CONFIG: Record<PostStatus, { label: string; classes: string }> = {
  open: {
    label: "Open",
    classes: "bg-green-100 text-green-700 border border-green-200",
  },
  closed: {
    label: "Closed",
    classes: "bg-gray-100 text-gray-500 border border-gray-200",
  },
  resolved: {
    label: "Resolved",
    classes: "bg-blue-100 text-blue-700 border border-blue-200",
  },
};

export default function StatusBadge({ status }: { status: PostStatus }) {
  const { label, classes } = CONFIG[status];
  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${classes}`}
    >
      {label}
    </span>
  );
}
