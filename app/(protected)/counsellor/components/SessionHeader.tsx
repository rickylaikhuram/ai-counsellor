"use client";

import { useState } from "react";
import { createNewSession } from "../actions";
import { SessionHeaderProps } from "../types/prisma-enums";
import {
  Sparkles,
  History,
  PlusCircle,
  AlertCircle,
  X,
  Info,
  Loader2,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/libs/utils";

export default function SessionHeader({ session }: SessionHeaderProps) {
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  async function handleCreateNew() {
    setCreating(true);
    const result = await createNewSession(session.userId);

    if (result.success) {
      setShowModal(false);
    }
    setCreating(false);
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-zinc-100">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
                AI Counsellor
              </h1>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border",
                  session.isLocked
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-indigo-50 text-indigo-700 border-indigo-100",
                )}
              >
                {session.isLocked ? "Finalized" : "Active Session"}
              </span>
            </div>
            <div className="flex items-center gap-4 text-zinc-400 font-bold text-xs uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                Started: {new Date(session.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                ID: {session.id.slice(-8).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {!session.isLocked && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-zinc-100 text-zinc-500 font-black text-sm rounded-2xl hover:bg-zinc-50 hover:text-zinc-900 transition-all active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            Start New Session
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full p-10 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <AlertCircle className="w-32 h-32" />
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8 relative z-10">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-amber-50 text-amber-600 border border-amber-100 mb-6">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-zinc-900 tracking-tight mb-2">
                Start a New Session?
              </h3>
              <p className="text-zinc-500 font-medium leading-relaxed">
                Your current session will be archived, and you'll begin a new
                journey from scratch.
              </p>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 rounded-[1.5rem] p-6 mb-8 relative z-10">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-indigo-800 leading-relaxed">
                  NOTE: Current data (shortlist, strategy, tasks) will remain
                  accessible as read-only. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <button
                onClick={() => setShowModal(false)}
                disabled={creating}
                className="flex-1 px-6 py-4 border-2 border-zinc-100 text-zinc-500 font-bold rounded-2xl hover:bg-zinc-50 disabled:opacity-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={handleCreateNew}
                disabled={creating}
                className="flex-1 px-6 py-4 bg-zinc-900 text-white font-black rounded-2xl hover:bg-black shadow-lg shadow-zinc-200 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {creating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <PlusCircle className="w-4 h-4" />
                )}
                {creating ? "Creating..." : "Start New"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
