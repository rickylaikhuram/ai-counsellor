import { SigninForm } from "@/components/auth/SigninForm";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50/50 px-4 py-12 selection:bg-indigo-100 selection:text-indigo-900">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 transition-opacity hover:opacity-80"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
          <GraduationCap className="h-6 w-6" />
        </div>
        <span className="text-xl font-bold tracking-tight text-zinc-900">
          StudyPath AI
        </span>
      </Link>

      <div className="w-full max-w-md">
        <SigninForm />
      </div>
    </div>
  );
}
