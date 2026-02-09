// src/components/TaskForm.tsx
import React from "react";

interface TaskFormProps {
  taskName: string;
  taskPriority: string;
  taskDeadline: string;
  handleTaskNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTaskPriorityChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleTaskDeadlineChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addTask: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  taskName,
  taskPriority,
  taskDeadline,
  handleTaskNameChange,
  handleTaskPriorityChange,
  handleTaskDeadlineChange,
  addTask,
}) => {
  return (
<div className="flex flex-col md:flex-row items-center gap-3 p-4 hologram w-full max-w-4xl mx-auto text-black">
  {/* Task Name Input */}
  <input
    type="text"
    placeholder="Enter task..."
    value={taskName}
    onChange={handleTaskNameChange}
    className="input-hologram text-black px-3 py-2 w-full md:w-1/3 rounded-md"
  />

  {/* Priority Dropdown */}
  <select
    value={taskPriority}
    onChange={handleTaskPriorityChange}
    className="input-hologram text-black px-3 py-2 w-full md:w-1/4 rounded-md"
  >
    <option value="Top">High Priority</option>
    <option value="Middle">Medium Priority</option>
    <option value="Low">Not Important</option>
  </select>

  {/* Deadline Input */}
  <input
    type="date"
    value={taskDeadline}
    onChange={handleTaskDeadlineChange}
    className="input-hologram text-black px-3 py-2 w-full md:w-1/4 rounded-md"
  />

  {/* Add Button */}
  <button
    onClick={addTask}
    className="button-hologram text-black px-4 py-2 w-full md:w-auto rounded-md"
  >
    Add Task
  </button>
</div>


  );
};

export default TaskForm;
