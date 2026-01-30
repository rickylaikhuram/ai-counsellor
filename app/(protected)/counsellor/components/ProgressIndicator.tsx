"use client";

import { SessionStage } from "@/app/generated/prisma/enums";
import {
  Target,
  Search,
  Compass,
  ListChecks,
  Lock,
  Sparkles,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/libs/utils";

interface ProgressIndicatorProps {
  currentStage: SessionStage;
  isLocked: boolean;
}

const stages = [
  { key: SessionStage.INTENT_CONFIRMED, label: "Intent", icon: Target },
  { key: SessionStage.PROFILE_ANALYZED, label: "Analysis", icon: Search },
  { key: SessionStage.DECISION_FRAMED, label: "Path", icon: Compass },
  { key: SessionStage.SHORTLISTED, label: "Shortlist", icon: ListChecks },
  { key: SessionStage.LOCKED, label: "Lock", icon: Lock },
  {
    key: SessionStage.ACTION_PLAN_CREATED,
    label: "Action Plan",
    icon: Sparkles,
  },
];

export default function ProgressIndicator({
  currentStage,
  isLocked,
}: ProgressIndicatorProps) {
  const currentIndex = stages.findIndex((s) => s.key === currentStage);

  return (
    <div className="bg-white rounded-[2rem] border border-zinc-200/60 shadow-xl shadow-zinc-200/20 p-8 mb-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-emerald-500 opacity-20" />

      <div className="flex items-center justify-between relative">
        {stages.map((stage, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = stage.icon;

          return (
            <div
              key={stage.key}
              className="flex items-center flex-1 last:flex-none"
            >
              {/* Stage Circle */}
              <div className="flex flex-col items-center relative group">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 z-10 border-2",
                    isComplete
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100"
                      : isCurrent
                        ? "bg-white border-indigo-600 text-indigo-600 shadow-xl ring-4 ring-indigo-50"
                        : "bg-zinc-50 border-zinc-200 text-zinc-400",
                  )}
                >
                  {isComplete ? (
                    <Check className="w-6 h-6 stroke-[3px]" />
                  ) : (
                    <Icon
                      className={cn("w-5 h-5", isCurrent && "animate-pulse")}
                    />
                  )}
                </div>

                <span
                  className={cn(
                    "mt-3 text-[11px] font-bold uppercase tracking-wider transition-colors duration-300",
                    isCurrent
                      ? "text-indigo-600"
                      : isComplete
                        ? "text-emerald-600"
                        : "text-zinc-400",
                  )}
                >
                  {stage.label}
                </span>

                {/* Pulse for Current Stage */}
                {isCurrent && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                  </span>
                )}
              </div>

              {/* Connector Line */}
              {index < stages.length - 1 && (
                <div className="flex-1 h-[2px] mx-4 bg-zinc-100 relative -mt-6">
                  <div
                    className={cn(
                      "absolute inset-0 transition-all duration-700 ease-in-out",
                      isComplete ? "bg-emerald-500" : "w-0",
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Status Text Box */}
      <div className="mt-8 pt-6 border-t border-zinc-50 flex justify-center">
        <div
          className={cn(
            "px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all",
            isLocked && currentStage === SessionStage.ACTION_PLAN_CREATED
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : isLocked
                ? "bg-amber-50 text-amber-700 border border-amber-100"
                : "bg-zinc-50 text-zinc-600 border border-zinc-100",
          )}
        >
          {isLocked && currentStage === SessionStage.ACTION_PLAN_CREATED ? (
            <>
              <Check className="w-4 h-4" />Counselling Complete - Session
              Locked
            </>
          ) : isLocked ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Session Locked - Generating Action Plan
            </>
          ) : (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Step {currentIndex + 1} of {stages.length}:{" "}
              <span className="text-zinc-900 ml-1">
                {stages[currentIndex].label}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
