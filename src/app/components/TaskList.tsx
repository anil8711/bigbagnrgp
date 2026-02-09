// src/components/TaskList.tsx
import React from "react";

interface Task {
  id: string | number;
  task: string;
  priority: string;
  deadline: string;
  done: boolean;
}

interface TaskListProps {
  tasks: Task[];
  markDone: (id: string | number) => void;
  handleEditTask: (id: string | number) => void;
  handleDeleteTask: (id: string | number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  markDone,
  handleEditTask,
  handleDeleteTask,
}) => {
  return (
    <div className="mt-6 p-4 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Task List</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Priority</th>
              <th className="px-4 py-2 border-b">Deadline</th>
              <th className="px-4 py-2 border-b">State</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{t.task}</td>
                  <td className="px-4 py-2 border-b">{t.priority}</td>
                  <td className="px-4 py-2 border-b">{t.deadline}</td>
                  <td className="px-4 py-2 border-b">
                    {!t.done ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => markDone(t.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                        >
                          Done
                        </button>
                        <button
                          onClick={() => handleEditTask(t.id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(t.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <span className="text-green-600 font-medium">Completed</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                  No tasks available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
