"use client";

import { useState } from "react";
import { Intent } from "@/app/generated/prisma/enums";
import { saveIntent } from "../actions";
import {
  Search,
  ListChecks,
  Rocket,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/libs/utils";

interface IntentStepProps {
  sessionId: string;
}

const intentOptions = [
  {
    value: Intent.EXPLORING,
    label: "Exploring Options",
    description: "I'm just starting to explore study abroad possibilities",
    icon: Search,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    value: Intent.SHORTLISTING,
    label: "Shortlisting Universities",
    description: "I have an idea and want to narrow down my university choices",
    icon: ListChecks,
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    value: Intent.READY,
    label: "Ready to Apply",
    description: "I know where I want to apply and need an action plan",
    icon: Rocket,
    color: "bg-emerald-600 text-white border-emerald-600",
  },
];

export default function IntentStep({ sessionId }: IntentStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(intent: Intent) {
    setLoading(true);
    setError(null);

    const result = await saveIntent(sessionId, intent);

    if (!result.success) {
      setError(result.error || "Failed to save selection");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-100">
          <CheckCircle2 className="w-3 h-3" /> Step 1: Your Intent
        </div>
        <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-4">
          Let's Find Your Perfect University
        </h1>
        <p className="text-lg text-zinc-500 font-medium">
          First, tell us where you are in your study abroad journey
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {intentOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            disabled={loading}
            className={cn(
              "w-full p-6 bg-white border-2 border-zinc-100 rounded-[2rem] text-left transition-all duration-300",
              "hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1",
              "disabled:opacity-60 disabled:cursor-not-allowed group relative overflow-hidden",
            )}
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 h-24 w-24 bg-emerald-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center gap-6 relative z-10">
              <div
                className={cn(
                  "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 group-hover:rotate-3",
                  option.color,
                )}
              >
                <option.icon className="w-8 h-8" />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-zinc-900 mb-1 group-hover:text-emerald-600 transition-colors">
                  {option.label}
                </h3>
                <p className="text-zinc-500 font-medium leading-relaxed">
                  {option.description}
                </p>
              </div>

              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-50 text-zinc-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {loading && (
        <div className="mt-10 flex flex-col items-center justify-center gap-3 animate-in fade-in">
          <div className="relative">
            <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
            <div className="absolute inset-0 blur-xl bg-emerald-400/20 animate-pulse" />
          </div>
          <p className="text-emerald-700 font-bold text-sm tracking-wide uppercase">
            Saving your selection...
          </p>
        </div>
      )}
    </div>
  );
}
