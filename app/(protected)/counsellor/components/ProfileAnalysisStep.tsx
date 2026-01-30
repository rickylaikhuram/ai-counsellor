"use client";

import { useEffect, useState } from "react";
import { triggerProfileAnalysis } from "../actions";
import { ProfileAnalysisStepProps } from "../types/prisma-enums";



export default function ProfileAnalysisStep({
  sessionId,
  userId,
  profile,
}: ProfileAnalysisStepProps) {
  const [status, setStatus] = useState<"analyzing" | "success" | "error">("analyzing");
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    // Auto-trigger analysis on mount
    runAnalysis();
  }, []);

  async function runAnalysis() {
    setStatus("analyzing");
    setError(null);

    const result = await triggerProfileAnalysis(sessionId, userId);

    if (result.success) {
      setStatus("success");
      // Page will revalidate and advance to next stage
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
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="mb-6">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Analyzing Your Profile
        </h2>
        <p className="text-gray-600 mb-8">
          Our AI counsellor is reviewing your academic background, goals, and preferences
          to provide personalized recommendations...
        </p>

        {/* Profile Summary While Loading */}
        <div className="bg-gray-50 rounded-lg p-6 text-left">
          <h3 className="font-semibold text-gray-800 mb-3">Your Profile Overview</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Target Degree:</span>
              <p className="font-medium">{profile.targetDegree || "Not specified"}</p>
            </div>
            <div>
              <span className="text-gray-500">Field of Study:</span>
              <p className="font-medium">{profile.fieldOfStudy || "Not specified"}</p>
            </div>
            <div>
              <span className="text-gray-500">GPA:</span>
              <p className="font-medium">
                {profile.normalizedGpa || profile.gpa || "N/A"}/100
              </p>
            </div>
            <div>
              <span className="text-gray-500">Budget Range:</span>
              <p className="font-medium">
                ${profile.budgetMin?.toLocaleString()} - $
                {profile.budgetMax?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="mb-6 text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Something Went Wrong
        </h2>
        <p className="text-gray-600 mb-6">
          {error || "We encountered an issue analyzing your profile."}
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <p className="text-sm text-yellow-800">
            Don't worry - your session is saved. You can retry the analysis or continue
            with a simplified recommendation.
          </p>
        </div>

        <button
          onClick={handleRetry}
          disabled={retrying}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {retrying ? "Retrying..." : "Retry Analysis"}
        </button>
      </div>
    );
  }

  // Success state - this will quickly transition as page revalidates
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="mb-6 text-6xl">✅</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Profile Analysis Complete
      </h2>
      <p className="text-gray-600">Loading your personalized recommendations...</p>
    </div>
  );
}