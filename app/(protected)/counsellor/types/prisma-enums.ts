//
//
//
//

import {
  ChatMessage,
  CounsellingSession,
  Profile,
  ShortlistedUniversity,
  Task,
  University,
} from "@/app/generated/prisma/client";
import {
  DecisionPath,
  Level,
  Priority,
  SessionStage,
  TaskStatus,
  UniversityCategory,
} from "@/app/generated/prisma/enums";

export interface ActionPlanViewProps {
  sessionId: string;
  userId: string; // Added to fix action call
  stage: SessionStage;
  tasks: Array<{
    id: string;
    title: string;
    description: string | null;
    priority: Priority;
    dueDate: Date | null;
    status: TaskStatus;
    university: University | null;
  }>;
  shortlisted: Array<{
    university: University;
  }>;
}

export interface LockDecisionProps {
  sessionId: string;
  shortlisted: Array<{
    id: string;
    category: UniversityCategory;
    university: University;
  }>;
}
export interface ProfileAnalysisStepProps {
  sessionId: string;
  userId: string;
  profile: Profile;
}
export interface SessionHeaderProps {
  session: CounsellingSession & {
    chatMessages: ChatMessage[];
    shortlisted: ShortlistedUniversity[];
    tasks: Task[];
  };
}

export interface ShortlistViewProps {
  sessionId: string;
  shortlisted: Array<{
    id: string;
    category: UniversityCategory;
    reasoning: string;
    risks: string;
    costLevel: Level;
    acceptanceChance: Level;
    university: University;
  }>;
  decisionPath: DecisionPath | null;
  profile: { userId: string };
}
