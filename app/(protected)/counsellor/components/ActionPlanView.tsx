"use client";

import { useEffect, useState } from "react";
import {
  TaskStatus,
  Priority,
  SessionStage,
} from "@/app/generated/prisma/enums";
import { generateTasks } from "../actions";
import { ActionPlanViewProps } from "../types/prisma-enums";



const priorityStyles = {
  HIGH: {
    badge: "bg-red-100 text-red-700",
    icon: "🔴",
  },
  MEDIUM: {
    badge: "bg-yellow-100 text-yellow-700",
    icon: "🟡",
  },
  LOW: {
    badge: "bg-green-100 text-green-700",
    icon: "🟢",
  },
};

const statusStyles = {
  TODO: "bg-gray-100 text-gray-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
};

export default function ActionPlanView({
  sessionId,
  userId,
  stage,
  tasks,
  shortlisted,
}: ActionPlanViewProps) {
  const [status, setStatus] = useState<"generating" | "success" | "error">(
    tasks.length > 0 ? "success" : "generating",
  );
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    // Auto-trigger task generation if stage is LOCKED and no tasks exist
    if (stage === SessionStage.LOCKED && tasks.length === 0) {
      generatePlan();
    }
  }, [stage]);

  async function generatePlan() {
    setStatus("generating");
    setError(null);

    // For this demo, we need userId - in production, pass it as prop
    const result = await generateTasks(sessionId, userId);

    if (result.success) {
      setStatus("success");
      // Page will revalidate and show tasks
    } else {
      setStatus("error");
      setError(result.error || "Failed to generate action plan");
    }
  }

  async function handleRetry() {
    setRetrying(true);
    await generatePlan();
    setRetrying(false);
  }

  if (status === "generating") {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="mb-6">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Creating Your Action Plan
        </h2>
        <p className="text-gray-600 mb-6">
          Our AI counsellor is generating a personalized 30-60 day timeline with
          specific tasks and deadlines...
        </p>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-3">
            What We're Creating:
          </h3>
          <ul className="text-left text-sm text-gray-700 space-y-2">
            <li>✓ Document preparation checklist</li>
            <li>✓ Application submission timeline</li>
            <li>✓ Test and exam deadlines</li>
            <li>✓ University-specific requirements</li>
            <li>✓ Financial planning milestones</li>
          </ul>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="mb-6 text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Action Plan Generation Failed
        </h2>
        <p className="text-gray-600 mb-6">
          {error || "We encountered an issue creating your action plan."}
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <p className="text-sm text-yellow-800">
            Your session is saved. Click retry to generate your action plan
            again.
          </p>
        </div>

        <button
          onClick={handleRetry}
          disabled={retrying}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {retrying ? "Retrying..." : "Retry Generation"}
        </button>
      </div>
    );
  }

  // Success - display action plan
  const groupedByPriority = {
    HIGH: tasks.filter((t) => t.priority === Priority.HIGH),
    MEDIUM: tasks.filter((t) => t.priority === Priority.MEDIUM),
    LOW: tasks.filter((t) => t.priority === Priority.LOW),
  };

  const completedCount = tasks.filter(
    (t) => t.status === TaskStatus.COMPLETED,
  ).length;
  const progressPercentage =
    tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">✨</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Your Personalized Action Plan
        </h1>
        <p className="text-lg text-gray-600">
          {tasks.length} tasks to guide you through the next 30-60 days
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Overall Progress</h3>
          <span className="text-sm text-gray-600">
            {completedCount} of {tasks.length} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* University Context */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-3">
          Applying To {shortlisted.length} Universities
        </h3>
        <div className="flex flex-wrap gap-2">
          {shortlisted.map((item, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {item.university.name}
            </span>
          ))}
        </div>
      </div>

      {/* Tasks by Priority */}
      <div className="space-y-6">
        {Object.entries(groupedByPriority).map(([priority, taskList]) => {
          if (taskList.length === 0) return null;

          const styles = priorityStyles[priority as Priority];

          return (
            <div key={priority}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{styles.icon}</span>
                <h2 className="text-xl font-bold text-gray-900">
                  {priority} Priority
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${styles.badge}`}
                >
                  {taskList.length} tasks
                </span>
              </div>

              <div className="space-y-3">
                {taskList.map((task) => (
                  <div
                    key={task.id}
                    className="p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {task.title}
                        </h3>
                        {task.university && (
                          <span className="text-sm text-indigo-600">
                            For: {task.university.name}
                          </span>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusStyles[task.status]
                        }`}
                      >
                        {task.status.replace("_", " ")}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-500">
                        <svg
                          className="w-4 h-4"
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
                        <span>
                          Due:{" "}
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "Not set"}
                        </span>
                      </div>
                      <span
                        className={`font-medium ${styles.badge} px-2 py-0.5 rounded`}
                      >
                        {priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      <div className="mt-10 text-center p-6 bg-green-50 border-2 border-green-200 rounded-xl">
        <div className="text-3xl mb-2">🎉</div>
        <h3 className="font-semibold text-green-900 mb-2">
          Your Counselling Session is Complete!
        </h3>
        <p className="text-green-700 text-sm">
          Follow your action plan and track your progress. You can access this
          plan anytime from your dashboard.
        </p>
      </div>
    </div>
  );
}
