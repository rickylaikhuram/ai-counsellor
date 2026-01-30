import TaskItem from "./TaskItem";
import { TaskListProps } from "../types/props";


export default function TaskList({
  tasks,
  universities,
  sessionId,
}: TaskListProps) {
  // Separate general tasks from university-specific tasks
  const generalTasks = tasks.filter((task) => !task.universityId);
  const universityTasks = tasks.filter((task) => task.universityId);

  // Group university tasks by university
  const tasksByUniversity = universities.map((uni) => ({
    university: uni.university,
    tasks: universityTasks.filter(
      (task) => task.universityId === uni.universityId,
    ),
  }));

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No tasks available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* General Tasks */}
      {generalTasks.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            General Tasks
          </h3>
          <div className="space-y-2">
            {generalTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* University-Specific Tasks */}
      {tasksByUniversity.map(
        ({ university, tasks: uniTasks }) =>
          uniTasks.length > 0 && (
            <div
              key={university.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {university.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {university.city && `${university.city}, `}
                {university.country}
              </p>
              <div className="space-y-2">
                {uniTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          ),
      )}
    </div>
  );
}
