"use client";

import { useEffect, useState } from "react";
import { triggerProfileAnalysis } from "../actions";
import { ProfileAnalysisStepProps } from "../types/prisma-enums";
import {
  Loader2,
  Search,
  UserCircle2,
  GraduationCap,
  Coins,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
  Sparkles,
} from "lucide-react";

export default function ProfileAnalysisStep({
  sessionId,
  userId,
  profile,
}: ProfileAnalysisStepProps) {
  const [status, setStatus] = useState<"analyzing" | "success" | "error">(
    "analyzing",
  );
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    runAnalysis();
  }, []);

  async function runAnalysis() {
    setStatus("analyzing");
    setError(null);
    const result = await triggerProfileAnalysis(sessionId, userId);
    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setError(result.error || "Analysis failed");
    }
  }

  async function handleRetry() {
    setRetrying(true);
    await runAnalysis();
    setRetrying(false);
  }

  if (status === "analyzing") {
    return (
      <div className="max-w-3xl mx-auto text-center py-20 px-6">
        {/* Animated Scanner Visual */}
        <div className="relative mb-10 inline-flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-ping" />
          <div className="relative h-24 w-24 rounded-3xl bg-white border border-indigo-100 flex items-center justify-center shadow-xl shadow-indigo-500/10">
            <Search className="h-10 w-10 text-indigo-600 animate-pulse" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-amber-400 animate-bounce" />
          </div>
        </div>

        <h2 className="text-3xl font-black text-zinc-900 tracking-tight mb-4">
          Analyzing Your Profile
        </h2>
        <p className="text-lg font-medium text-zinc-500 max-w-lg mx-auto leading-relaxed mb-12">
          Our AI counsellor is reviewing your academic background and goals to
          calibrate your personalized strategy.
        </p>

        {/* Profile Summary Card */}
        <div className="bg-white rounded-[2.5rem] border border-zinc-200 p-8 shadow-sm text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform group-hover:scale-110">
            <UserCircle2 className="w-24 h-24" />
          </div>

          <h3 className="font-bold text-zinc-900 mb-6 flex items-center gap-2 uppercase tracking-widest text-xs">
            <BarChart3 className="w-4 h-4 text-indigo-600" /> Current Profile
            Scan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
              <span className="text-xs font-black text-zinc-400 uppercase flex items-center gap-1.5 mb-2">
                <GraduationCap className="w-3 h-3" /> Target Degree
              </span>
              <p className="font-bold text-zinc-900">
                {profile.targetDegree || "Not specified"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
              <span className="text-xs font-black text-zinc-400 uppercase flex items-center gap-1.5 mb-2">
                <Search className="w-3 h-3" /> Field of Study
              </span>
              <p className="font-bold text-zinc-900">
                {profile.fieldOfStudy || "Not specified"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
              <span className="text-xs font-black text-zinc-400 uppercase flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> GPA Score
              </span>
              <p className="font-bold text-zinc-900">
                {profile.normalizedGpa || profile.gpa || "N/A"}/100
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
              <span className="text-xs font-black text-zinc-400 uppercase flex items-center gap-1.5 mb-2">
                <Coins className="w-3 h-3 text-amber-500" /> Budget Range
              </span>
              <p className="font-bold text-zinc-900">
                ${profile.budgetMin?.toLocaleString()} - $
                {profile.budgetMax?.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3 py-3 px-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
            <span className="text-sm font-bold text-indigo-700">
              Synthesizing admission probabilities...
            </span>
          </div>
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
          Analysis Interrupted
        </h2>
        <p className="text-zinc-500 font-medium mb-10">
          {error || "We encountered an issue analyzing your profile."}
        </p>

        <div className="bg-amber-50/50 border border-amber-100 rounded-[2rem] p-8 mb-8 text-left">
          <p className="text-sm font-bold text-amber-800 leading-relaxed">
            Don't worry - your session is saved. We had trouble connecting to
            the counsellor engine. You can retry the analysis or try again in a
            few moments.
          </p>
        </div>

        <button
          onClick={handleRetry}
          disabled={retrying}
          className="group flex items-center justify-center gap-3 mx-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
        >
          {retrying ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          )}
          {retrying ? "Retrying..." : "Retry Profile Analysis"}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center py-24 px-6">
      <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xl shadow-emerald-500/10">
        <CheckCircle2 className="h-12 w-12" />
      </div>
      <h2 className="text-4xl font-black text-zinc-900 tracking-tight mb-4">
        Analysis Complete
      </h2>
      <p className="text-lg font-medium text-zinc-500 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
        Finalizing your personalized strategy...
      </p>
    </div>
  );
}
