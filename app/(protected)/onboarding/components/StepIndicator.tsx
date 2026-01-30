"use client";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepTitles = [
  "Academic Background",
  "Study Goals",
  "Budget",
  "Exams & Readiness",
];

export default function StepIndicator({
  currentStep,
  totalSteps,
}: StepIndicatorProps) {
  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Titles */}
      <div className="flex justify-between mb-8">
        {stepTitles.map((title, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={stepNumber} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-colors ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>
              <span
                className={`text-xs text-center hidden sm:block ${
                  isActive ? "text-blue-600 font-semibold" : "text-gray-500"
                }`}
              >
                {title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
