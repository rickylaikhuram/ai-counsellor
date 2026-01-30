"use client";

import { useState } from "react";
import { TaskStatus } from "@/app/generated/prisma/enums";
import { updateTaskStatus } from "../actions";
import { TaskItemProps } from "../types/props";


const priorityColors = {
  LOW: "text-gray-500",
  MEDIUM: "text-yellow-600",
  HIGH: "text-red-600",
};

const statusLabels = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const statusColors = {
  TODO: "bg-gray-100 text-gray-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
};

export default function TaskItem({ task }: TaskItemProps) {
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    setIsUpdating(true);

    const result = await updateTaskStatus(task.id, newStatus);

    if (result.success) {
      setStatus(newStatus);
    } else {
      alert(result.error || "Failed to update task");
    }

    setIsUpdating(false);
  };

  const getNextStatus = (): TaskStatus | null => {
    if (status === "TODO") return "IN_PROGRESS";
    if (status === "IN_PROGRESS") return "COMPLETED";
    return null;
  };

  const nextStatus = getNextStatus();

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      {/* Status Checkbox */}
      <div className="flex-shrink-0 mt-1">
        {status === "COMPLETED" ? (
          <div className="w-5 h-5 rounded border-2 border-green-600 bg-green-600 flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        ) : (
          <button
            onClick={() => nextStatus && handleStatusChange(nextStatus)}
            disabled={isUpdating || !nextStatus}
            className={`w-5 h-5 rounded border-2 ${
              status === "IN_PROGRESS"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            } transition-colors ${
              isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {status === "IN_PROGRESS" && (
              <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto" />
            )}
          </button>
        )}
      </div>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h4
            className={`font-medium text-gray-900 ${
              status === "COMPLETED" ? "line-through text-gray-500" : ""
            }`}
          >
            {task.title}
          </h4>

          {/* Priority Badge */}
          <span
            className={`flex-shrink-0 text-xs font-medium ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
        )}

        {/* Meta Information */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {/* Status Badge */}
          <span
            className={`px-2 py-0.5 rounded-full font-medium ${
              statusColors[status]
            }`}
          >
            {statusLabels[status]}
          </span>

          {/* Due Date */}
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Due {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
