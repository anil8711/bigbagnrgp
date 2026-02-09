// src/components/TaskScheduler.tsx
"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import CompletedTaskList from "../components/CompletedTaskList";

interface Task {
  id: string | number;
  task: string;
  priority: string;
  deadline: string;
  done: boolean;
}

const TaskScheduler: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState("");
  const [taskPriority, setTaskPriority] = useState("Top");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  const TASKS_STORAGE_KEY = "tasks";
  const COMPLETED_TASKS_STORAGE_KEY = "completedTasks";

  // Load from localStorage on mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY) || "[]");
    setTasks(storedTasks);

    const storedCompletedTasks = JSON.parse(localStorage.getItem(COMPLETED_TASKS_STORAGE_KEY) || "[]");
    setCompletedTasks(storedCompletedTasks);
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Save completed tasks to localStorage
  useEffect(() => {
    localStorage.setItem(COMPLETED_TASKS_STORAGE_KEY, JSON.stringify(completedTasks));
  }, [completedTasks]);

  const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
  };

  const handleTaskPriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTaskPriority(e.target.value);
  };

  const handleTaskDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskDeadline(e.target.value);
  };

  const addTask = () => {
    if (taskName.trim() === "" || taskDeadline === "") {
      alert("Enter a task. Must not be empty!");
      return;
    }

    // Parse YYYY-MM-DD manually into a local Date (avoids UTC timezone issues)
    const [year, month, day] = taskDeadline.split("-").map(Number);
    const selDate = new Date(year, month - 1, day);
    const currDate = new Date();

    // Normalize to midnight
    selDate.setHours(0, 0, 0, 0);
    currDate.setHours(0, 0, 0, 0);

    if (selDate < currDate) {
      alert("Can't go back in time.");
      return;
    }

    const newTask: Task = {
      id: tasks.length + 1,
      task: taskName,
      priority: taskPriority,
      deadline: taskDeadline,
      done: false,
    };

    setTasks([...tasks, newTask]);

    setTaskName("");
    setTaskPriority("Top");
    setTaskDeadline("");
  };

  const handleEditTask = (id: string | number) => {
    const taskToEdit = tasks.find((t) => t.id === id);
    if (!taskToEdit) return;

    setTaskName(taskToEdit.task);
    setTaskPriority(taskToEdit.priority);
    setTaskDeadline(taskToEdit.deadline);

    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (id: string | number) => {
    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);
  };

  const markDone = (id: string | number) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, done: true } : t
    );
    setTasks(updatedTasks);

    const completedTask = tasks.find((t) => t.id === id);
    if (completedTask) {
      setCompletedTasks([...completedTasks, completedTask]);
    }
  };

  const filteredTasks = tasks
    .filter((t) => !t.done)
    .filter((t) =>
      t.task.toLowerCase().includes(searchKeyword.toLowerCase())
    )
    .filter((t) => (filterPriority ? t.priority === filterPriority : true));

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        {/* Task Form */}
        <TaskForm
          taskName={taskName}
          taskPriority={taskPriority}
          taskDeadline={taskDeadline}
          handleTaskNameChange={handleTaskNameChange}
          handleTaskPriorityChange={handleTaskPriorityChange}
          handleTaskDeadlineChange={handleTaskDeadlineChange}
          addTask={addTask}
        />

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row items-center gap-3 bg-white p-4 rounded-md shadow-md">
          <input
            type="text"
            placeholder="Search tasks"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="Top">High Priority</option>
            <option value="Middle">Medium Priority</option>
            <option value="Low">Not Important</option>
          </select>
        </div>

        {/* Task List */}
        <h2 className="text-xl font-semibold text-gray-700">Tasks</h2>
        <TaskList
          tasks={filteredTasks}
          markDone={markDone}
          handleEditTask={handleEditTask}
          handleDeleteTask={handleDeleteTask}
        />

        {/* Completed Tasks */}
        <CompletedTaskList completedTasks={completedTasks} />
      </main>
    </div>
  );
};

export default TaskScheduler;
