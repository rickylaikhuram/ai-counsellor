import { SessionStage } from "@/app/generated/prisma/enums";

interface ProgressIndicatorProps {
  currentStage: SessionStage;
  isLocked: boolean;
}

const stages = [
  { key: SessionStage.INTENT_CONFIRMED, label: "Intent", icon: "🎯" },
  { key: SessionStage.PROFILE_ANALYZED, label: "Analysis", icon: "🔍" },
  { key: SessionStage.DECISION_FRAMED, label: "Path", icon: "⚖️" },
  { key: SessionStage.SHORTLISTED, label: "Shortlist", icon: "📋" },
  { key: SessionStage.LOCKED, label: "Lock", icon: "🔒" },
  { key: SessionStage.ACTION_PLAN_CREATED, label: "Action Plan", icon: "✨" },
];

export default function ProgressIndicator({
  currentStage,
  isLocked,
}: ProgressIndicatorProps) {
  const currentIndex = stages.findIndex((s) => s.key === currentStage);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div key={stage.key} className="flex items-center flex-1">
              {/* Stage Circle */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 ${
                    isComplete
                      ? "bg-green-500 text-white"
                      : isCurrent
                        ? "bg-indigo-600 text-white ring-4 ring-indigo-200"
                        : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {isComplete ? (
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    stage.icon
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isCurrent ? "text-indigo-600" : "text-gray-600"
                  }`}
                >
                  {stage.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < stages.length - 1 && (
                <div className="flex-1 h-1 mx-2 relative">
                  <div
                    className={`absolute inset-0 transition-all duration-500 ${
                      isComplete ? "bg-green-500" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Status Text */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {isLocked && currentStage === SessionStage.ACTION_PLAN_CREATED ? (
            <span className="text-green-600 font-semibold">
              ✅ Counselling Complete - Session Locked
            </span>
          ) : isLocked ? (
            <span className="text-yellow-600 font-semibold">
              🔒 Session Locked - Generating Action Plan
            </span>
          ) : (
            <>
              Step {currentIndex + 1} of {stages.length}:{" "}
              <span className="font-semibold">
                {stages[currentIndex].label}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
