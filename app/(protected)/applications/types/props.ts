import { ShortlistedUniversity, Task, University } from "@/app/generated/prisma/client";

type TaskWithUniversity = Task & {
  university: University | null;
};

type ShortlistedWithUniversity = ShortlistedUniversity & {
  university: University;
};

export interface TaskListProps {
  tasks: TaskWithUniversity[];
  universities: ShortlistedWithUniversity[];
  sessionId: string;
}

export interface TaskItemProps {
  task: Task;
}
export interface ProgressSummaryProps {
  tasks: Task[];
}

export interface LockedShortlistProps {
  universities: ShortlistedWithUniversity[];
}