"use client";

import { useState } from "react";
import { DecisionPath, Level, Role } from "@/app/generated/prisma/enums";
import { saveDecisionPath } from "../actions";
import {
  CircleDollarSign,
  Scale,
  Target,
  CheckCircle2,
  BrainCircuit,
  ChevronRight,
  Loader2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { cn } from "@/libs/utils";

interface DecisionPathStepProps {
  sessionId: string;
  messages: Array<{ role: Role; content: string }>;
  riskLevel: Level | null;
}

const pathOptions = [
  {
    value: DecisionPath.LOW_COST,
    label: "Cost-Conscious Path",
    description:
      "Prioritize affordability and scholarships. Focus on universities with lower tuition and high scholarship availability.",
    icon: CircleDollarSign,
    color: "emerald",
    features: [
      "Lower tuition fees",
      "High scholarship probability",
      "Part-time work opportunities",
      "Cost-effective living locations",
    ],
  },
  {
    value: DecisionPath.BALANCED,
    label: "Balanced Path",
    description:
      "Balance cost, reputation, and acceptance chances. A well-rounded approach considering multiple factors.",
    icon: Scale,
    color: "indigo",
    features: [
      "Mix of prestigious and affordable options",
      "Reasonable acceptance rates",
      "Good ROI potential",
      "Flexible funding options",
    ],
  },
  {
    value: DecisionPath.HIGH_RISK,
    label: "Prestige-Focused Path",
    description:
      "Target top-tier universities for maximum career impact, even if acceptance rates are lower.",
    icon: Target,
    color: "violet",
    features: [
      "Top-ranked institutions",
      "Strong alumni networks",
      "Premium career prospects",
      "Competitive admission standards",
    ],
  },
];

const colorClasses = {
  emerald: {
    border: "border-emerald-100",
    activeBorder: "hover:border-emerald-500",
    bg: "bg-emerald-50/50",
    text: "text-emerald-700",
    icon: "bg-emerald-100 text-emerald-600",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  indigo: {
    border: "border-indigo-100",
    activeBorder: "hover:border-indigo-500",
    bg: "bg-indigo-50/50",
    text: "text-indigo-700",
    icon: "bg-indigo-100 text-indigo-600",
    pill: "bg-indigo-50 text-indigo-700 border-indigo-100",
  },
  violet: {
    border: "border-violet-100",
    activeBorder: "hover:border-violet-500",
    bg: "bg-violet-50/50",
    text: "text-violet-700",
    icon: "bg-violet-100 text-violet-600",
    pill: "bg-violet-50 text-violet-700 border-violet-100",
  },
};

export default function DecisionPathStep({
  sessionId,
  messages,
  riskLevel,
}: DecisionPathStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analysisMessage = messages.filter((m) => m.role === "ASSISTANT").pop();

  async function handleSelect(path: DecisionPath) {
    setLoading(true);
    setError(null);
    const result = await saveDecisionPath(sessionId, path);
    if (!result.success) {
      setError(result.error || "Failed to save decision path");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-4 border border-indigo-100">
          <Sparkles className="w-3 h-3" /> Step 3: Strategy
        </div>
        <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-4">
          Choose Your Decision Path
        </h1>
        <p className="text-lg text-zinc-500 font-medium max-w-2xl mx-auto">
          Based on your profile analysis, select the strategy that aligns with
          your goals
        </p>
      </div>

      {/* AI Analysis Summary */}
      {analysisMessage && (
        <div className="mb-12 relative group">
          <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full" />
          <div className="relative p-8 bg-white rounded-[2.5rem] border border-indigo-100 shadow-xl shadow-indigo-500/5">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                <BrainCircuit className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-zinc-900">
                    AI Profile Intelligence
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest">
                    Risk Profile: {riskLevel}
                  </span>
                </div>
                <div className="prose prose-zinc max-w-none">
                  <p className="text-zinc-600 leading-relaxed font-medium whitespace-pre-wrap">
                    {analysisMessage.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 animate-in fade-in slide-in-from-top-2">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {pathOptions.map((option) => {
          const colors =
            colorClasses[option.color as keyof typeof colorClasses];
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              disabled={loading}
              className={cn(
                "group relative flex flex-col p-8 bg-white border-2 rounded-[2.5rem] text-left transition-all duration-300",
                colors.border,
                colors.activeBorder,
                "hover:shadow-2xl hover:shadow-zinc-200 hover:-translate-y-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              <div
                className={cn(
                  "h-16 w-16 flex items-center justify-center rounded-2xl mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3",
                  colors.icon,
                )}
              >
                <Icon className="w-8 h-8" />
              </div>

              <h3
                className={cn(
                  "text-2xl font-black tracking-tight mb-3",
                  colors.text,
                )}
              >
                {option.label}
              </h3>

              <p className="text-zinc-500 font-medium text-sm leading-relaxed mb-6">
                {option.description}
              </p>

              <div className="space-y-3 mb-8">
                {option.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 text-xs font-bold text-zinc-700"
                  >
                    <CheckCircle2
                      className={cn("w-4 h-4 shrink-0 mt-0.5", colors.text)}
                    />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div
                className={cn(
                  "mt-auto pt-6 border-t flex items-center justify-between group-hover:border-current transition-colors",
                  colors.border,
                )}
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 transition-colors">
                  Choose Path
                </span>
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center transition-all",
                    "bg-zinc-50 text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white",
                  )}
                >
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="mt-12 flex flex-col items-center justify-center gap-3 animate-in fade-in">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
          <p className="text-indigo-900 font-black text-xs uppercase tracking-[0.2em]">
            Optimizing Strategy...
          </p>
        </div>
      )}
    </div>
  );
}
