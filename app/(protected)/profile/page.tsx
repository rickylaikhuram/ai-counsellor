import { getCurrentProfile } from "./actions";
import { requireOnboarding } from "@/libs/auth";
import ProfileForm from "./components/ProfileForm";

export default async function ProfilePage() {
  // Ensure user is authenticated and onboarded
  await requireOnboarding();

  // Fetch current profile data
  const profile = await getCurrentProfile();

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Profile Not Found
          </h1>
          <p className="text-gray-600">
            Unable to load your profile. Please contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Update Profile</h1>
          <p className="mt-2 text-gray-600">
            Edit your profile information to keep your details up to date.
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                About Profile Updates
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                Updating your profile will not change existing recommendations
                or counselling sessions. To get updated advice based on your new
                profile, start a new counselling session from your dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
