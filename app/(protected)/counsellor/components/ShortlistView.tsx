"use client";

import { useEffect, useState } from "react";
import { UniversityCategory } from "@/app/generated/prisma/enums";
import { generateUniversityShortlist } from "../actions";
import { ShortlistViewProps } from "../types/prisma-enums";
import {
  Sparkles,
  MapPin,
  Banknote,
  UserCheck,
  Info,
  AlertCircle,
  GraduationCap,
  Loader2,
  RefreshCcw,
  Star,
  Target,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/libs/utils";

const categoryStyles = {
  DREAM: {
    badge: "bg-violet-50 text-violet-700 border-violet-100",
    border: "border-violet-100",
    accent: "bg-violet-600",
    icon: Star,
    label: "Dream Schools",
  },
  TARGET: {
    badge: "bg-blue-50 text-blue-700 border-blue-100",
    border: "border-blue-100",
    accent: "bg-blue-600",
    icon: Target,
    label: "Target Schools",
  },
  SAFE: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    border: "border-emerald-100",
    accent: "bg-emerald-600",
    icon: ShieldCheck,
    label: "Safety Schools",
  },
};

const levelColors = {
  LOW: "text-emerald-600 bg-emerald-50",
  MEDIUM: "text-amber-600 bg-amber-50",
  HIGH: "text-rose-600 bg-rose-50",
};

export default function ShortlistView({
  sessionId,
  shortlisted,
  decisionPath,
  profile,
}: ShortlistViewProps) {
  const [status, setStatus] = useState<"generating" | "success" | "error">(
    shortlisted.length > 0 ? "success" : "generating",
  );
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (shortlisted.length === 0) {
      generateShortlist();
    }
  }, []);

  async function generateShortlist() {
    setStatus("generating");
    setError(null);

    if (!decisionPath) {
      setError("Decision path not selected");
      setStatus("error");
      return;
    }

    const result = await generateUniversityShortlist(
      sessionId,
      profile.userId,
      decisionPath,
    );

    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setError(result.error || "Failed to generate shortlist");
    }
  }

  async function handleRetry() {
    setRetrying(true);
    await generateShortlist();
    setRetrying(false);
  }

  if (status === "generating") {
    return (
      <div className="max-w-3xl mx-auto text-center py-20 px-6">
        <div className="relative mb-10 inline-flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-ping" />
          <div className="relative h-20 w-20 rounded-[2rem] bg-white border border-indigo-100 flex items-center justify-center shadow-xl">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-zinc-900 tracking-tight mb-4">
          Curating Your Shortlist
        </h2>
        <p className="text-lg font-medium text-zinc-500 max-w-lg mx-auto leading-relaxed mb-12">
          Analyzing 44 global institutions to find the perfect matches for your{" "}
          <span className="text-indigo-600 font-bold">
            {decisionPath?.replace("_", " ")}
          </span>{" "}
          strategy.
        </p>

        <div className="bg-zinc-50 rounded-[2.5rem] border border-zinc-200 p-8 text-left max-w-md mx-auto">
          <h3 className="font-bold text-zinc-900 mb-4 text-sm uppercase tracking-widest">
            Algorithm Focus:
          </h3>
          <ul className="space-y-4">
            {[
              "Academic eligibility matching",
              "Budget & scholarship optimization",
              "Risk-balanced category distribution",
              "Career ROI & acceptance probability",
            ].map((text, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-sm font-bold text-zinc-600"
              >
                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-6">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 border border-rose-100 shadow-sm">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-zinc-900 tracking-tight mb-4">
          Generation Failed
        </h2>
        <p className="text-zinc-500 font-medium mb-8">
          {error || "We encountered an issue."}
        </p>
        <button
          onClick={handleRetry}
          disabled={retrying}
          className="inline-flex items-center gap-2 px-10 py-4 bg-zinc-900 text-white rounded-2xl font-black hover:bg-black transition-all disabled:opacity-50"
        >
          {retrying ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCcw className="w-5 h-5" />
          )}
          Retry Generation
        </button>
      </div>
    );
  }

  const groupedByCategory = {
    DREAM: shortlisted.filter((s) => s.category === UniversityCategory.DREAM),
    TARGET: shortlisted.filter((s) => s.category === UniversityCategory.TARGET),
    SAFE: shortlisted.filter((s) => s.category === UniversityCategory.SAFE),
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6">
          <Sparkles className="w-3 h-3 text-amber-400" /> Decision Path:{" "}
          {decisionPath?.replace("_", " ")}
        </div>
        <h1 className="text-5xl font-black text-zinc-900 tracking-tight mb-4">
          Your Curated Shortlist
        </h1>
        <p className="text-lg text-zinc-500 font-medium max-w-2xl mx-auto">
          We’ve selected {shortlisted.length} universities that offer the best
          path to your goals.
        </p>
      </div>

      <div className="space-y-20">
        {Object.entries(groupedByCategory).map(([category, universities]) => {
          if (universities.length === 0) return null;
          const styles =
            categoryStyles[category as keyof typeof categoryStyles];
          const Icon = styles.icon;

          return (
            <div key={category} className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div
                  className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                    styles.accent,
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
                    {styles.label}
                  </h2>
                  <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                    {universities.length} Institutions
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {universities.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex flex-col p-8 bg-white border-2 rounded-[2.5rem] transition-all duration-300 hover:shadow-2xl hover:shadow-zinc-200 hover:-translate-y-1",
                      styles.border,
                    )}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-zinc-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                          {item.university.name}
                        </h3>
                        <div className="flex items-center gap-2 text-zinc-400 font-bold text-xs uppercase">
                          <MapPin className="w-3 h-3" />
                          {item.university.city}, {item.university.country}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                          styles.badge,
                        )}
                      >
                        {category}
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-8">
                      <div
                        className={cn(
                          "p-3 rounded-2xl flex flex-col items-center justify-center text-center",
                          levelColors[item.costLevel],
                        )}
                      >
                        <Banknote className="w-4 h-4 mb-1" />
                        <span className="text-[10px] font-black uppercase opacity-60">
                          Cost
                        </span>
                        <span className="text-xs font-black uppercase">
                          {item.costLevel}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "p-3 rounded-2xl flex flex-col items-center justify-center text-center",
                          levelColors[item.acceptanceChance],
                        )}
                      >
                        <UserCheck className="w-4 h-4 mb-1" />
                        <span className="text-[10px] font-black uppercase opacity-60">
                          Entry
                        </span>
                        <span className="text-xs font-black uppercase">
                          {item.acceptanceChance}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-zinc-50 text-zinc-600 flex flex-col items-center justify-center text-center border border-zinc-100">
                        <GraduationCap className="w-4 h-4 mb-1" />
                        <span className="text-[10px] font-black uppercase opacity-60">
                          Tuition
                        </span>
                        <span className="text-xs font-black">
                          ${(item.university.tuition / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>

                    <div className="space-y-6 mt-auto">
                      <div className="relative p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div className="absolute -top-2 left-4 px-2 bg-white text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-50">
                          Why This Choice
                        </div>
                        <p className="text-sm font-medium text-zinc-600 leading-relaxed italic">
                          "{item.reasoning}"
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full bg-zinc-900 flex items-center justify-center shrink-0 mt-0.5">
                          <Info className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">
                            Counsellor Notes
                          </span>
                          <p className="text-xs font-bold text-zinc-600 leading-relaxed">
                            {item.risks}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-24 p-12 bg-zinc-900 rounded-[3rem] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#4f46e5,transparent)]" />
        </div>
        <h3 className="text-3xl font-black text-white mb-4 relative z-10">
          Confirm Your Strategy
        </h3>
        <p className="text-zinc-400 font-medium mb-8 max-w-xl mx-auto relative z-10">
          Ready to commit? Proceeding will lock this shortlist and generate your
          60-day application roadmap.
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 rounded-2xl text-zinc-400 text-xs font-bold uppercase tracking-widest border border-zinc-700">
          <Loader2 className="w-4 h-4 animate-spin" /> Waiting for review...
        </div>
      </div>
    </div>
  );
}
