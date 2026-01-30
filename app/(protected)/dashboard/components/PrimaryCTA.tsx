// app/dashboard/components/PrimaryCTA.tsx
import { getDashboardState, startCounsellingSession } from '../action'
import Link from 'next/link'

type CTAConfig = {
  title: string
  description: string
  href?: string
  action?: () => Promise<void>
  variant: 'primary' | 'success' | 'warning'
}

function getCTAConfig(state: Awaited<ReturnType<typeof getDashboardState>>): CTAConfig {
  if (!state.profile.isComplete) {
    return {
      title: 'Complete Your Profile',
      description: 'Finish setting up your profile to unlock AI counselling',
      href: '/onboarding',
      variant: 'warning',
    }
  }

  if (state.latestSession === null) {
    return {
      title: 'Start AI Counselling',
      description: 'Begin your personalized study-abroad journey with AI guidance',
      action: startCounsellingSession,
      variant: 'primary',
    }
  }

  if (!state.latestSession.isLocked) {
    return {
      title: 'Continue Counselling',
      description: 'Resume your AI counselling session to finalize your shortlist',
      href: '/counsellor',
      variant: 'primary',
    }
  }

  return {
    title: 'View Action Plan',
    description: 'Your shortlist is ready. Review applications and next steps',
    href: '/applications',
    variant: 'success',
  }
}

export async function PrimaryCTA() {
  const state = await getDashboardState()
  const cta = getCTAConfig(state)

  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white',
  }

  // If CTA uses Server Action
  if (cta.action) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-100">
        <h2 className="text-3xl font-bold mb-3">{cta.title}</h2>
        <p className="text-gray-600 mb-6 text-lg">{cta.description}</p>
        <form action={cta.action}>
          <button
            type="submit"
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${variantStyles[cta.variant]}`}
          >
            {cta.title}
          </button>
        </form>
      </div>
    )
  }

  // If CTA uses navigation
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-100">
      <h2 className="text-3xl font-bold mb-3">{cta.title}</h2>
      <p className="text-gray-600 mb-6 text-lg">{cta.description}</p>
      <Link
        href={cta.href!}
        className={`inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${variantStyles[cta.variant]}`}
      >
        {cta.title}
      </Link>
    </div>
  )
}