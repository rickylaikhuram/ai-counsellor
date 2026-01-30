"use server";
import { requireOnboarding } from "@/libs/auth";
import prisma from "@/libs/prisma";
import { SessionStage } from "@/app/generated/prisma/client";
import IntentStep from "./components/IntentStep";
import ProfileAnalysisStep from "./components/ProfileAnalysisStep";
import DecisionPathStep from "./components/DecisionPathStep";
import ShortlistView from "./components/ShortlistView";
import LockDecision from "./components/LockDecision";
import ActionPlanView from "./components/ActionPlanView";
import ProgressIndicator from "./components/ProgressIndicator";
import SessionHeader from "./components/SessionHeader";

export default async function CounsellorPage() {
  // Require completed onboarding - redirects if profile incomplete
  const user = await requireOnboarding();

  // Get or create counselling session
  let session = await prisma.counsellingSession.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      chatMessages: {
        orderBy: { timestamp: "asc" },
      },
      shortlisted: {
        include: {
          university: true,
        },
      },
      tasks: {
        include: {
          university: true,
        },
        orderBy: { priority: "desc" },
      },
    },
  });

  // If no session exists, create initial one
  if (!session) {
    session = await prisma.counsellingSession.create({
      data: {
        userId: user.id,
        stage: SessionStage.INTENT_CONFIRMED,
      },
      include: {
        chatMessages: true,
        shortlisted: {
          include: {
            university: true,
          },
        },
        tasks: {
          include: {
            university: true,
          },
        },
      },
    });
  }

  // Render current stage component based on session state
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Session Header with New Session option */}
        <SessionHeader session={session} />

        {/* Progress Indicator */}
        <ProgressIndicator
          currentStage={session.stage}
          isLocked={session.isLocked}
        />

        {/* Main Content Area */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          {/* Stage 1: Intent Confirmation */}
          {session.stage === SessionStage.INTENT_CONFIRMED &&
            !session.intent && <IntentStep sessionId={session.id} />}

          {/* Stage 2: Profile Analysis (automatic after intent) */}
          {session.stage === SessionStage.INTENT_CONFIRMED &&
            session.intent && (
              <ProfileAnalysisStep
                sessionId={session.id}
                userId={user.id}
                profile={user.profile!}
              />
            )}

          {/* Stage 3: Decision Path Selection */}
          {session.stage === SessionStage.PROFILE_ANALYZED && (
            <DecisionPathStep
              sessionId={session.id}
              messages={session.chatMessages}
              riskLevel={session.riskLevel}
            />
          )}

          {/* Stage 4: University Shortlisting */}
          {session.stage === SessionStage.DECISION_FRAMED && (
            <ShortlistView
              sessionId={session.id}
              shortlisted={session.shortlisted}
              decisionPath={session.decisionPath}
              profile={user.profile!}
            />
          )}

          {/* Stage 5: Lock Decision */}
          {session.stage === SessionStage.SHORTLISTED && !session.isLocked && (
            <LockDecision
              sessionId={session.id}
              shortlisted={session.shortlisted}
            />
          )}

          {/* Stage 6: Action Plan View */}
          {(session.stage === SessionStage.LOCKED ||
            session.stage === SessionStage.ACTION_PLAN_CREATED) && (
            <ActionPlanView
              sessionId={session.id}
              userId={user.id}
              tasks={session.tasks}
              shortlisted={session.shortlisted}
              stage={session.stage}
            />
          )}
        </div>

        {/* Chat History (Read-only context) */}
        {session.chatMessages.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Session Context
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {session.chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg ${
                    msg.role === "ASSISTANT"
                      ? "bg-blue-50 text-blue-900"
                      : "bg-gray-50 text-gray-900"
                  }`}
                >
                  <div className="text-xs font-medium mb-1 uppercase text-gray-500">
                    {msg.role}
                  </div>
                  <div className="text-sm whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
