import { SigninForm } from "@/components/auth/SigninForm";
import { getCurrentUser } from "@/libs/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const isSignin = (await getCurrentUser()) ? true : false;
    if (isSignin) {
      redirect("/dashboard");
    }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50/50 px-4 py-12 selection:bg-indigo-100 selection:text-indigo-900">

      <div className="w-full max-w-md">
        <SigninForm />
      </div>
    </div>
  );
}
