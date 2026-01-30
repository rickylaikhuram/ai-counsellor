"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
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
import { Loader2, GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { loginRedirect } from "@/app/actions/auth";

export function SigninForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      const profileInfo = await loginRedirect(email);

      if (profileInfo.success && profileInfo.data?.isComplete) {
        await router.push("/dashboard");
      } else {
        await router.push("/onboarding");
      }

      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Brand Logo for context */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <Link href="/" className="flex items-center gap-2 group transition-all">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 group-hover:rotate-3">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            StudyPath <span className="text-indigo-600">AI</span>
          </span>
        </Link>
      </div>

      <Card className="mx-auto max-w-[400px] border-zinc-200/60 shadow-2xl shadow-indigo-100/50 backdrop-blur-sm bg-white/80">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900">
            Welcome back
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Enter your credentials to access your portal
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="animate-in fade-in zoom-in duration-200 rounded-xl bg-red-50 border border-red-100 p-3 text-sm font-medium text-red-600 text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-zinc-700"
              >
                Email
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
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-zinc-700"
                >
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="passwords" // Fixed id from 'passwords'
                name="password"
                type="password"
                required
                disabled={isLoading}
                className="h-11 rounded-xl border-zinc-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
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
                "Sign in"
              )}
            </Button>

            <div className="relative w-full py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-zinc-400">
                  Or continue with
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-zinc-500">
              New here?{" "}
              <Link
                href="/signup"
                className="font-bold text-indigo-600 hover:text-indigo-700"
              >
                Create an account
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
