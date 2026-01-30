"use client";

import { useState } from "react";
import { UniversityCategory } from "@/app/generated/prisma/enums";
import { lockSession } from "../actions";
import { LockDecisionProps } from "../types/prisma-enums";
import {
  Lock,
  ShieldCheck,
  AlertTriangle,
  ChevronLeft,
  LayoutList,
  CheckCircle2,
  Loader2,
  GraduationCap,
  Globe2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/libs/utils";

export default function LockDecision({
  sessionId,
  shortlisted,
}: LockDecisionProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLock() {
    setLoading(true);
    setError(null);

    const result = await lockSession(sessionId);

    if (!result.success) {
      setError(result.error || "Failed to lock decision");
      setLoading(false);
    }
  }

  const categoryCount = {
    DREAM: shortlisted.filter((s) => s.category === UniversityCategory.DREAM)
      .length,
    TARGET: shortlisted.filter((s) => s.category === UniversityCategory.TARGET)
      .length,
    SAFE: shortlisted.filter((s) => s.category === UniversityCategory.SAFE)
      .length,
  };

  if (!showConfirmation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-6 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-4">
            Ready to Lock Your Decision?
          </h1>
          <p className="text-lg text-zinc-500 font-medium max-w-2xl mx-auto">
            Once locked, your university shortlist will be finalized and we'll
            create a personalized action plan to help you apply.
          </p>
        </div>

        {/* Shortlist Summary Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-[2rem] p-6 border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4 font-bold">
              ★
            </div>
            <div className="text-4xl font-black text-zinc-900">
              {categoryCount.DREAM}
            </div>
            <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider mt-1">
              Dream Schools
            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-6 border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 font-bold text-lg">
              🎯
            </div>
            <div className="text-4xl font-black text-zinc-900">
              {categoryCount.TARGET}
            </div>
            <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider mt-1">
              Target Schools
            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-6 border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-4xl font-black text-zinc-900">
              {categoryCount.SAFE}
            </div>
            <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider mt-1">
              Safe Schools
            </div>
          </div>
        </div>

        {/* Universities List Card */}
        <div className="bg-zinc-50 rounded-[2.5rem] border border-zinc-200 p-8 mb-10">
          <h4 className="font-bold text-zinc-900 mb-6 flex items-center gap-2 text-xl">
            <LayoutList className="w-6 h-6 text-emerald-600" />
            Universities in Your Shortlist:
          </h4>
          <div className="space-y-3">
            {shortlisted.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm group hover:border-emerald-200 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 block leading-tight">
                      {item.university.name}
                    </span>
                    <span className="text-zinc-400 text-xs font-bold flex items-center gap-1 mt-1">
                      <Globe2 className="w-3 h-3" /> {item.university.country}
                    </span>
                  </div>
                </div>
                <span
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    item.category === "DREAM"
                      ? "bg-violet-50 text-violet-700 border-violet-100"
                      : item.category === "TARGET"
                        ? "bg-blue-50 text-blue-700 border-blue-100"
                        : "bg-emerald-50 text-emerald-700 border-emerald-100",
                  )}
                >
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <div className="flex flex-col items-center">
          <button
            onClick={() => setShowConfirmation(true)}
            className="group relative px-10 py-5 bg-emerald-600 text-white text-lg font-black rounded-3xl hover:bg-emerald-700 transition-all active:scale-95 shadow-xl shadow-emerald-200 flex items-center gap-3"
          >
            Lock Decision & Create Action Plan
            <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
          </button>
          <p className="text-sm font-bold text-zinc-400 mt-6 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> You can still review your
            shortlist in the session history
          </p>
        </div>
      </div>
    );
  }

  // Confirmation Modal
  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <div className="bg-white rounded-[3rem] border border-amber-100 p-10 shadow-2xl shadow-amber-500/10 relative overflow-hidden">
        {/* Warning Badge */}
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <AlertTriangle className="w-32 h-32 text-amber-600" />
        </div>

        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-amber-50 text-amber-600 border border-amber-100 mb-6">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">
            Confirm Your Decision
          </h2>
          <p className="text-zinc-500 font-medium">
            This action will finalize your university shortlist and generate
            your application action plan.
          </p>
        </div>

        <div className="bg-amber-50/50 border border-amber-100 rounded-[2rem] p-6 mb-10 relative z-10">
          <h3 className="font-black text-amber-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
            <CheckCircle2 className="w-5 h-5" /> What happens when you lock:
          </h3>
          <ul className="space-y-3">
            {[
              "Your shortlist becomes finalized",
              "A personalized 30-60 day action plan will be created",
              "Tasks and deadlines will be assigned",
              "You can track your progress in the dashboard",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-amber-800 text-sm font-bold"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 animate-shake">
            <AlertTriangle className="w-5 h-5" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <button
            onClick={() => setShowConfirmation(false)}
            disabled={loading}
            className="flex-1 px-8 py-4 border-2 border-zinc-100 text-zinc-500 font-bold rounded-2xl hover:bg-zinc-50 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" /> Go Back
          </button>
          <button
            onClick={handleLock}
            disabled={loading}
            className="flex-1 px-8 py-4 bg-zinc-900 text-white font-black rounded-2xl hover:bg-black shadow-lg shadow-zinc-200 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Lock className="w-5 h-5" />
            )}
            {loading ? "Locking..." : "Confirm & Lock"}
          </button>
        </div>
      </div>
    </div>
  );
}
