import { requireOnboarding } from "@/libs/auth";

export default async function DashboardPage() {
  // This will auto-redirect to /onboarding if incomplete
  const user = await requireOnboarding();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}!</p>
    </div>
  );
}
