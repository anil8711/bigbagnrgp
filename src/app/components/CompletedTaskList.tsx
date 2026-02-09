// src/components/CompletedTaskList.tsx
import React from "react";

interface CompletedTask {
  id: string | number;
  task: string;
  priority: string;
  deadline: string;
}

interface CompletedTaskListProps {
  completedTasks: CompletedTask[];
}

const CompletedTaskList: React.FC<CompletedTaskListProps> = ({ completedTasks }) => {
  return (
    <div className="mt-6 p-4 hologram w-full max-w-5xl mx-auto">
  <h2 className="text-xl font-semibold mb-4 text-black">Completed Tasks</h2>
  <div className="overflow-x-auto">
    <table className="w-full border border-cyan-400/30 rounded-md">
      <thead>
        <tr className="bg-cyan-400/10 text-left text-black">
          <th className="px-4 py-2 border-b border-cyan-400/30">Task Name</th>
          <th className="px-4 py-2 border-b border-cyan-400/30">Priority</th>
          <th className="px-4 py-2 border-b border-cyan-400/30">Deadline</th>
        </tr>
      </thead>
      <tbody>
        {completedTasks.length > 0 ? (
          completedTasks.map((ct) => (
            <tr
              key={ct.id}
              className="hover:scale-102 transition-transform duration-300 hover:bg-gradient-to-r from-cyan-400/20 to-purple-400/20"
            >
              <td className="px-4 py-2 border-b border-cyan-400/20 text-black">{ct.task}</td>
              <td className="px-4 py-2 border-b border-cyan-400/20 text-black">{ct.priority}</td>
              <td className="px-4 py-2 border-b border-cyan-400/20 text-black">{ct.deadline}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3} className="px-4 py-4 text-center text-black/60">
              No completed tasks yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default CompletedTaskList;
