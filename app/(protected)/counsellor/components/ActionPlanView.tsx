"use client";

import { useEffect, useState } from "react";
import {
  TaskStatus,
  Priority,
  SessionStage,
} from "@/app/generated/prisma/enums";
import { generateTasks } from "../actions";
import { ActionPlanViewProps } from "../types/prisma-enums";
import {
  Loader2,
  Sparkles,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Flag,
  School,
  ArrowRightCircle,
  RefreshCcw,
  Trophy,
} from "lucide-react";
import { cn } from "@/libs/utils";

const priorityStyles = {
  HIGH: {
    badge: "bg-rose-50 text-rose-700 border-rose-100",
    icon: <Flag className="w-4 h-4 text-rose-600" />,
  },
  MEDIUM: {
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    icon: <Flag className="w-4 h-4 text-amber-600" />,
  },
  LOW: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    icon: <Flag className="w-4 h-4 text-emerald-600" />,
  },
};

const statusStyles = {
  TODO: "bg-zinc-100 text-zinc-600 border-zinc-200",
  IN_PROGRESS: "bg-indigo-50 text-indigo-700 border-indigo-100",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100",
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
    if (stage === SessionStage.LOCKED && tasks.length === 0) {
      generatePlan();
    }
  }, [stage]);

  async function generatePlan() {
    setStatus("generating");
    setError(null);
    const result = await generateTasks(sessionId, userId);
    if (result.success) {
      setStatus("success");
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
      <div className="max-w-3xl mx-auto text-center py-20 px-6">
        <div className="relative mb-8 inline-block">
          <Loader2 className="h-20 w-20 text-indigo-600 animate-spin" />
          <div className="absolute inset-0 blur-2xl bg-indigo-400/20 animate-pulse" />
        </div>
        <h2 className="text-3xl font-black text-zinc-900 tracking-tight mb-4">
          Creating Your Action Plan
        </h2>
        <p className="text-zinc-500 font-medium text-lg mb-10 max-w-lg mx-auto leading-relaxed">
          Our AI counsellor is generating a personalized 30-60 day timeline with
          specific tasks and deadlines...
        </p>

        <div className="bg-indigo-50/50 border border-indigo-100 rounded-[2rem] p-8 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-24 h-24 text-indigo-600" />
          </div>
          <h3 className="font-bold text-indigo-900 mb-5 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> What We're Creating:
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-semibold text-indigo-800/80">
            <li className="flex items-center gap-2 bg-white/50 p-3 rounded-xl border border-indigo-100/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Document
              preparation checklist
            </li>
            <li className="flex items-center gap-2 bg-white/50 p-3 rounded-xl border border-indigo-100/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Application
              submission timeline
            </li>
            <li className="flex items-center gap-2 bg-white/50 p-3 rounded-xl border border-indigo-100/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Test and
              exam deadlines
            </li>
            <li className="flex items-center gap-2 bg-white/50 p-3 rounded-xl border border-indigo-100/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />{" "}
              University-specific requirements
            </li>
            <li className="flex items-center gap-2 bg-white/50 p-3 rounded-xl border border-indigo-100/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Financial
              planning milestones
            </li>
          </ul>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-6">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 border border-rose-100">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-zinc-900 tracking-tight mb-4">
          Action Plan Generation Failed
        </h2>
        <p className="text-zinc-500 font-medium mb-10">
          {error || "We encountered an issue creating your action plan."}
        </p>

        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 mb-8">
          <p className="text-sm font-bold text-amber-800 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" /> Your session is saved. Click retry to
            generate your action plan again.
          </p>
        </div>

        <button
          onClick={handleRetry}
          disabled={retrying}
          className="group flex items-center justify-center gap-2 mx-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
        >
          {retrying ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          )}
          {retrying ? "Retrying..." : "Retry Generation"}
        </button>
      </div>
    );
  }

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
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 border border-indigo-100 mb-6">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-4">
          Your Personalized Action Plan
        </h1>
        <p className="text-lg font-medium text-zinc-500">
          {tasks.length} tasks to guide you through the next 30-60 days
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-[2rem] border border-zinc-200/60 p-8 shadow-sm mb-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 bg-indigo-50 rounded-full blur-3xl" />
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-indigo-600 mb-1">
              Overall Progress
            </h3>
            <p className="text-zinc-500 text-xs font-bold">
              {completedCount} of {tasks.length} completed
            </p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-100">
            {Math.round(progressPercentage)}%
          </div>
        </div>
        <div className="w-full bg-zinc-100 rounded-full h-4 overflow-hidden border border-zinc-200/50 p-0.5">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* University Context */}
      <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-[2rem] p-8 mb-12">
        <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <School className="w-5 h-5 text-indigo-600" /> Applying To{" "}
          {shortlisted.length} Universities
        </h3>
        <div className="flex flex-wrap gap-3">
          {shortlisted.map((item, idx) => (
            <span
              key={idx}
              className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 font-bold rounded-2xl text-sm shadow-sm hover:border-indigo-200 hover:text-indigo-600 transition-colors cursor-default"
            >
              {item.university.name}
            </span>
          ))}
        </div>
      </div>

      {/* Tasks by Priority */}
      <div className="space-y-12">
        {Object.entries(groupedByPriority).map(([priority, taskList]) => {
          if (taskList.length === 0) return null;
          const styles = priorityStyles[priority as Priority];

          return (
            <div key={priority}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 flex items-center justify-center rounded-xl border",
                      styles.badge,
                    )}
                  >
                    {styles.icon}
                  </div>
                  <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
                    {priority} Priority
                  </h2>
                </div>
                <div
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border",
                    styles.badge,
                  )}
                >
                  {taskList.length} tasks
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {taskList.map((task) => (
                  <div
                    key={task.id}
                    className="group flex flex-col p-6 bg-white border border-zinc-200/60 rounded-[2rem] hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-zinc-900 mb-1 group-hover:text-indigo-600 transition-colors truncate">
                          {task.title}
                        </h3>
                        {task.university && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 uppercase tracking-tighter">
                            <School className="w-3 h-3" />{" "}
                            {task.university.name}
                          </div>
                        )}
                      </div>
                      <span
                        className={cn(
                          "shrink-0 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border",
                          statusStyles[task.status],
                        )}
                      >
                        {task.status.replace("_", " ")}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-sm font-medium text-zinc-500 mb-6 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "No Deadline"}
                        </span>
                      </div>
                      <button className="h-8 w-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <ArrowRightCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      <div className="mt-20 relative group">
        <div className="absolute inset-0 bg-emerald-400/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative text-center p-10 bg-white border-2 border-emerald-100 rounded-[3rem] shadow-2xl shadow-emerald-500/10">
          <div className="h-20 w-20 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-emerald-900 mb-3">
            Your Counselling Session is Complete!
          </h3>
          <p className="text-emerald-700/80 font-semibold max-w-lg mx-auto leading-relaxed">
            Follow your action plan and track your progress. You can access this
            plan anytime from your dashboard to ensure a successful application.
          </p>
        </div>
      </div>
    </div>
  );
}
