// app/dashboard/page.tsx
import { getDashboardState } from "./action";
import { PrimaryCTA } from "./components/PrimaryCTA";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { SnapshotCards } from "./components/SnapshotCards";

export default async function DashboardPage() {
  const state = await getDashboardState();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {state.user.email}</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <ProgressIndicator state={state} />
        </div>

        {/* Primary CTA */}
        <div className="mb-12">
          <PrimaryCTA />
        </div>

        {/* Snapshot Cards */}
        <SnapshotCards state={state} />
      </div>
    </div>
  );
}
