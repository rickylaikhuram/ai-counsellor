// app/dashboard/components/SnapshotCards.tsx
import type { DashboardState } from '../action'

type Props = {
  state: DashboardState
}

export function SnapshotCards({ state }: Props) {
  const cards = [
    {
      label: 'Profile Status',
      value: state.profile.isComplete ? 'Complete' : 'Incomplete',
      variant: state.profile.isComplete ? 'success' : 'warning',
    },
    {
      label: 'Shortlisted Universities',
      value: state.stats.shortlistedCount,
      variant: 'neutral',
    },
    {
      label: 'Pending Tasks',
      value: state.stats.pendingTasksCount,
      variant: state.stats.pendingTasksCount > 0 ? 'warning' : 'success',
    },
  ]

  const variantStyles = {
    success: 'border-green-200 bg-green-50',
    warning: 'border-amber-200 bg-amber-50',
    neutral: 'border-gray-200 bg-white',
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-lg border-2 p-6 ${variantStyles[card.variant]}`}
          >
            <p className="text-sm font-medium text-gray-600 mb-1">{card.label}</p>
            <p className="text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}