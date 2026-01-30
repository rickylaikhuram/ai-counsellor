import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/libs/auth";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  ArrowRight, 
  Zap, 
  Globe, 
  ShieldCheck,
  Sparkles 
} from "lucide-react";

export default async function LandingPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-950 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] left-[10%] h-[40%] w-[40%] rounded-full bg-indigo-50/50 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] h-[30%] w-[30%] rounded-full bg-blue-50/50 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-zinc-200/50 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 transition-transform hover:scale-105">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">
              StudyPath <span className="text-indigo-600">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="hidden font-medium text-zinc-600 hover:text-zinc-900 sm:flex">
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button asChild className="rounded-full bg-zinc-900 px-6 font-medium text-white hover:bg-zinc-800">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <div className="mb-6 inline-flex animate-fade-in items-center rounded-full border border-indigo-100 bg-indigo-50/50 px-4 py-1.5 text-sm font-semibold text-indigo-700">
                <Sparkles className="mr-2 h-4 w-4 fill-indigo-500 text-indigo-500" />
                Powered by Gemini 2.5 Flash
              </div>
              <h1 className="mx-auto max-w-5xl text-balance text-5xl font-extrabold tracking-tight text-zinc-900 sm:text-7xl lg:text-8xl">
                Your study-abroad journey,{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  AI-guided & effortless.
                </span>
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-zinc-600 sm:text-xl">
                Navigate the complexity of international education with a personal AI counsellor that tracks deadlines, builds your profile, and unlocks dream universities.
              </p>
              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="group h-14 rounded-full bg-indigo-600 px-8 text-lg font-semibold hover:bg-indigo-700 shadow-2xl shadow-indigo-200">
                  <Link href="/signup" className="flex items-center gap-2">
                    Start Free Journey 
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-14 rounded-full border-zinc-200 px-8 text-lg font-semibold hover:bg-zinc-50">
                  <Link href="/signin">View Demo Dashboard</Link>
                </Button>
              </div>
            </div>

            {/* Feature Bento Grid */}
            <div className="mt-32 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 transition-all hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900">Global Search</h3>
                <p className="mt-3 text-zinc-600">Access top universities across 15+ countries with real-time intake data and localized requirements.</p>
              </div>

              <div className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-indigo-600 p-8 text-white transition-all hover:shadow-xl hover:shadow-indigo-200">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">AI Counselling</h3>
                <p className="mt-3 text-indigo-100">Talk to Gemini-powered agents that analyze your GPA and budget to find "Safe" and "Dream" targets.</p>
              </div>

              <div className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 transition-all hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Smart Tracking</h3>
                <p className="mt-3 text-zinc-600">Centralized document management for SOPs, LORs, and transcripts with deadline alerts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="border-t border-zinc-100 bg-zinc-50/50 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
                The 4-Step Road to Success
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-zinc-600">
                We've automated the heavy lifting so you can focus on learning.
              </p>
            </div>

            <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-4">
              {[
                { title: "Profile Building", desc: "Build a strong academic profile." },
                { title: "AI Shortlisting", desc: "Match with best-fit universities." },
                { title: "University Locking", desc: "Confirm your final choices." },
                { title: "Application Prep", desc: "Submit and track everything." },
              ].map((step, idx) => (
                <div key={idx} className="group relative flex flex-col items-center">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-black text-indigo-600 shadow-sm border border-zinc-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    0{idx + 1}
                  </div>
                  <h4 className="text-lg font-bold text-zinc-900">{step.title}</h4>
                  <p className="mt-2 text-center text-sm text-zinc-500">{step.desc}</p>
                  {idx < 3 && (
                    <div className="absolute right-[-40%] top-7 hidden w-full border-t border-dashed border-zinc-200 lg:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-zinc-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-bold tracking-tight text-zinc-900">
                StudyPath AI
              </span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-zinc-500">
              <Link href="#" className="hover:text-indigo-600">Features</Link>
              <Link href="#" className="hover:text-indigo-600">Privacy</Link>
              <Link href="#" className="hover:text-indigo-600">Contact</Link>
            </div>
            <p className="text-sm text-zinc-400">
              © 2026 StudyPath AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}