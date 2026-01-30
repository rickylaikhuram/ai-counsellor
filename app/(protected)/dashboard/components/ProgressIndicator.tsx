// app/dashboard/components/ProgressIndicator.tsx
import type { DashboardState } from '../action'

type Props = {
  state: DashboardState
}

export function ProgressIndicator({ state }: Props) {
  const steps = [
    { 
      label: 'Profile', 
      complete: state.profile.isComplete,
      active: !state.profile.isComplete
    },
    { 
      label: 'Counselling', 
      complete: state.latestSession !== null,
      active: state.profile.isComplete && !state.latestSession
    },
    { 
      label: 'Shortlist', 
      complete: state.latestSession?.isLocked ?? false,
      active: state.latestSession !== null && !state.latestSession.isLocked
    },
    { 
      label: 'Action Plan', 
      complete: false, // Could add completion logic
      active: state.latestSession?.isLocked ?? false
    },
  ]

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Your Journey</h3>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center flex-1">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step.complete
                    ? 'bg-green-600 text-white'
                    : step.active
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.complete ? '✓' : index + 1}
              </div>
              <span className="text-sm mt-2 font-medium">{step.label}</span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 ${
                  step.complete ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}