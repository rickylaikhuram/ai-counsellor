"use client";

import { cn } from "@/libs/utils";
import { Check } from "lucide-react";
import type { DashboardState } from "../action";

type Props = {
  state: DashboardState;
};

export function ProgressIndicator({ state }: Props) {
  const steps = [
    {
      label: "Profile",
      complete: state.profile.isComplete,
      active: !state.profile.isComplete,
    },
    {
      label: "Counselling",
      complete: state.latestSession !== null,
      active: state.profile.isComplete && !state.latestSession,
    },
    {
      label: "Shortlist",
      complete: state.latestSession?.isLocked ?? false,
      active: state.latestSession !== null && !state.latestSession.isLocked,
    },
    {
      label: "Action Plan",
      complete: false,
      active: state.latestSession?.isLocked ?? false,
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-zinc-200/60 p-8 shadow-sm relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-indigo-50/50 blur-3xl" />

      <h3 className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.2em] mb-8">
        Your Journey
      </h3>

      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => (
          <div
            key={step.label}
            className="flex items-center flex-1 last:flex-none"
          >
            {/* Step circle */}
            <div className="flex flex-col items-center relative z-10">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-300 border-2",
                  step.complete
                    ? "bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-100"
                    : step.active
                      ? "bg-white border-teal-600 text-teal-600 shadow-md ring-4 ring-teal-50"
                      : "bg-zinc-50 border-zinc-200 text-zinc-400",
                )}
              >
                {step.complete ? (
                  <Check className="w-5 h-5 stroke-[3px]" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  "text-xs mt-4 font-bold tracking-tight transition-colors",
                  step.active || step.complete
                    ? "text-zinc-900"
                    : "text-zinc-400",
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 h-[2px] bg-zinc-100 relative -mt-5">
                <div
                  className={cn(
                    "absolute inset-0 transition-all duration-700 ease-in-out",
                    step.complete ? "bg-teal-600 w-full" : "w-0",
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
