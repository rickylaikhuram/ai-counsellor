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
import { Loader2 } from "lucide-react";
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

    const result = await signup(formData);

    if (result.success) {
      // Auto-login after signup
      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginResult?.error) {
        setError(
          "Account created, but failed to log in automatically. Please log in manually.",
        );
        router.push("/login");
      } else {
        router.push("/onboarding");
      }
    } else {
      setError(result.error || "Something went wrong");
    }
    setIsLoading(false);
  }

  return (
    <Card className="w-full border-zinc-200 shadow-xl shadow-indigo-50">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Create an account
        </CardTitle>
        <CardDescription>
          Enter your details below to start your study abroad journey
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 mb-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              required
              className="border-zinc-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              className="border-zinc-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="passwords"
              name="password"
              type="password"
              required
              className="border-zinc-200"
              minLength={8}
            />
            <p className="text-xs text-zinc-500">
              Minimum 8 characters required
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Up
          </Button>
          <p className="text-center text-sm text-zinc-600">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-semibold text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline"
            >
              Signin
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
