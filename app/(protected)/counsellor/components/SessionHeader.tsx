"use client";

import { useState } from "react";
import { createNewSession } from "../actions";
import { SessionHeaderProps } from "../types/prisma-enums";


export default function SessionHeader({ session }: SessionHeaderProps) {
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  async function handleCreateNew() {
    setCreating(true);
    const result = await createNewSession(session.userId);

    if (result.success) {
      // Page will revalidate and show new session
      setShowModal(false);
    }
    setCreating(false);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Counsellor</h1>
          <p className="text-sm text-gray-500">
            Session started: {new Date(session.createdAt).toLocaleDateString()}
          </p>
        </div>

        {!session.isLocked && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Start New Session
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Start a New Session?
              </h3>
              <p className="text-gray-600 text-sm">
                Your current session will be saved for reference, but you'll
                begin a new counselling journey from scratch.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> All your current session data (intent,
                shortlist, tasks) will remain accessible but read-only. You
                cannot resume this session after starting a new one.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={creating}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNew}
                disabled={creating}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {creating ? "Creating..." : "Start New"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
