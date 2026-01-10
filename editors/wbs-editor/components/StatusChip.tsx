import React from "react";

interface StatusChipProps {
  row: {
    status: string;
  };
}

const STATUS_COLORS = {
  TODO: {
    bg: "#f3f4f6", // gray-100
    text: "#6b7280", // gray-500
    dot: "#9ca3af", // gray-400
  },
  IN_PROGRESS: {
    bg: "#dbeafe", // blue-100
    text: "#2563eb", // blue-600
    dot: "#3b82f6", // blue-500
  },
  IN_REVIEW: {
    bg: "#fef3c7", // amber-100
    text: "#d97706", // amber-600
    dot: "#f59e0b", // amber-500
  },
  COMPLETED: {
    bg: "#dcfce7", // green-100
    text: "#16a34a", // green-600
    dot: "#22c55e", // green-500
  },
  BLOCKED: {
    bg: "#fee2e2", // red-100
    text: "#dc2626", // red-600
    dot: "#ef4444", // red-500
  },
  DELEGATED: {
    bg: "#f3e8ff", // purple-100
    text: "#9333ea", // purple-600
    dot: "#a855f7", // purple-500
  },
  WONT_DO: {
    bg: "#f1f5f9", // slate-100
    text: "#64748b", // slate-500
    dot: "#94a3b8", // slate-400
  },
};

const STATUS_LABELS = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  COMPLETED: "Completed",
  BLOCKED: "Blocked",
  DELEGATED: "Delegated",
  WONT_DO: "Won't Do",
};

export default function StatusChip({ row }: StatusChipProps) {
  const status = row.status as keyof typeof STATUS_COLORS;
  const colors = STATUS_COLORS[status] || STATUS_COLORS.TODO;
  const label = STATUS_LABELS[status] || status;

  return (
    <div className="flex items-center justify-center h-full">
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
        style={{
          backgroundColor: colors.bg,
          color: colors.text,
        }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: colors.dot }}
        />
        {label}
      </div>
    </div>
  );
}
