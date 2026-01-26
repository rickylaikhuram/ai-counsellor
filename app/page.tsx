import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, CheckCircle2, Globe, ShieldCheck, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-950 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">StudyPath AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="text-zinc-600 hover:text-zinc-900">
              <Link href="/signin">Signin</Link>
            </Button>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          {/* Decorative backgrounds */}
          <div className="absolute left-1/2 top-0 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white opacity-70 blur-3xl"></div>
          
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <div className="mb-8 inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1 text-sm font-medium text-indigo-700">
                <Zap className="mr-2 h-4 w-4 fill-indigo-500 text-indigo-500" />
                Next-Gen Study Abroad Counselling
              </div>
              <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-zinc-900 sm:text-7xl">
                Plan your study-abroad journey with a <span className="text-indigo-600">guided AI counsellor.</span>
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-600 sm:text-xl">
                Get personalized university recommendations, track your applications, and receive AI-guided support throughout your study abroad journey.
              </p>
              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="h-14 bg-indigo-600 px-8 text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200">
                  <Link href="/signup" className="flex items-center gap-2">
                    Start Your Journey <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-14 border-zinc-200 px-8 text-lg hover:bg-zinc-50">
                  <Link href="/signin">Signin to Dashboard</Link>
                </Button>
              </div>
            </div>

            {/* Feature preview or image could go here */}
            <div className="mt-24 rounded-3xl border border-zinc-200 bg-zinc-50/50 p-4 shadow-2xl">
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-inner">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                  <div className="flex flex-col items-start text-left">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                      <Globe className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900">Global Reach</h3>
                    <p className="mt-2 text-zinc-600 leading-relaxed">Access top universities across USA, UK, Canada, Australia, and Europe with localized insights.</p>
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                      <Zap className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900">AI Counselling</h3>
                    <p className="mt-2 text-zinc-600 leading-relaxed">Our advanced AI model analyzes your profile to suggest safe, target, and dream universities.</p>
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900">Smart Tracking</h3>
                    <p className="mt-2 text-zinc-600 leading-relaxed">Never miss a deadline. Manage tasks, SOPs, and document readiness in one central dashboard.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stages Preview */}
        <section className="bg-zinc-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">A Guided, Stage-Based Experience</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">We break down the overwhelming study-abroad process into clear, actionable stages.</p>
            </div>
            
            <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Profile Building",
                "Discovery & AI Search",
                "University Locking",
                "Application Prep"
              ].map((stage, idx) => (
                <div key={idx} className="relative flex flex-col items-center rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
                    {idx + 1}
                  </div>
                  <h4 className="text-lg font-bold text-zinc-900">{stage}</h4>
                  <div className="mt-4 flex items-center text-sm font-medium text-indigo-600">
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Unlock Next Step
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-indigo-600" />
              <span className="font-bold tracking-tight text-zinc-900">StudyPath AI</span>
            </div>
            <p className="text-sm text-zinc-500">© 2026 StudyPath AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
