"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, GraduationCap, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;

    try {
      const result = await signup(formData);

      if (result.success) {
        // Auto-login after signup
        const loginResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (loginResult?.error) {
          setError("Account created, but failed to log in automatically.");
          await router.push("/signin");
        } else {
          await router.push("/onboarding");
        }
      } else {
        setError(result.error || "Something went wrong during signup");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Brand Context */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <Link href="/" className="flex items-center gap-2 group transition-all">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 group-hover:rotate-3 transition-transform">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            StudyPath <span className="text-indigo-600">AI</span>
          </span>
        </Link>
      </div>

      <Card className="mx-auto max-w-[450px] border-zinc-200/60 shadow-2xl shadow-indigo-100/50 backdrop-blur-sm bg-white/80">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-8 w-fit items-center rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 border border-indigo-100">
            <Sparkles className="mr-1.5 h-3 w-3" /> Get Started Free
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900">
            Create your account
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Join thousands of students planning their future
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-200 rounded-xl bg-red-50 border border-red-100 p-3 text-sm font-medium text-red-600 text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-zinc-700"
              >
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
                disabled={isLoading}
                className="h-11 rounded-xl border-zinc-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-zinc-700"
              >
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                disabled={isLoading}
                className="h-11 rounded-xl border-zinc-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-zinc-700"
              >
                Password
              </Label>
              <Input
                id="passwords"
                name="password"
                type="password"
                required
                disabled={isLoading}
                minLength={8}
                className="h-11 rounded-xl border-zinc-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 px-1">
                <div className="h-1 w-1 rounded-full bg-zinc-300" />
                Must be at least 8 characters
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 mt-2">
            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-indigo-600 font-semibold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-bold text-indigo-600 hover:text-indigo-700"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>

      <Link
        href="/"
        className="flex items-center justify-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>
    </div>
  );
}
