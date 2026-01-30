import { ProgressSummaryProps } from "../types/props";

export default function ProgressSummary({ tasks }: ProgressSummaryProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "IN_PROGRESS",
  ).length;
  const todoTasks = tasks.filter((t) => t.status === "TODO").length;

  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Overall Progress
      </h3>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Completion</span>
          <span className="font-medium">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Task Breakdown */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-400">{todoTasks}</div>
          <div className="text-sm text-gray-600">To Do</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {inProgressTasks}
          </div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {completedTasks}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>
    </div>
  );
}
