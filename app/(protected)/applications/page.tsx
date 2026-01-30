import { redirect } from "next/navigation";
import { requireOnboarding } from "@/libs/auth";
import { getLockedSession } from "./actions";
import LockedShortlist from "./components/LockedShortlist";
import TaskList from "./components/TaskList";
import ProgressSummary from "./components/ProgressSummary";

export default async function ApplicationsPage() {
  // Ensure user is authenticated and onboarded
  const user = await requireOnboarding();

  // Fetch the locked counselling session
  const sessionData = await getLockedSession(user.id);
console.log("Locked Session Data:", sessionData);
  // If no locked session exists, redirect to dashboard
  if (!sessionData) {
    redirect("/dashboard");
  }

  const { session, universities, tasks } = sessionData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="mt-2 text-gray-600">
            Track your university applications and manage your tasks
          </p>
        </div>

        {/* Progress Summary */}
        <ProgressSummary tasks={tasks} />

        {/* Locked Shortlist */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your University Shortlist
          </h2>
          <LockedShortlist universities={universities} />
        </section>

        {/* Task List */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Application Tasks
          </h2>
          <TaskList
            tasks={tasks}
            universities={universities}
            sessionId={session.id}
          />
        </section>
      </div>
    </div>
  );
}
