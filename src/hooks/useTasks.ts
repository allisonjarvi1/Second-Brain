import { useLocalStorage } from './useLocalStorage';
import { seedTasks } from '../data/seedData';
import type { Task } from '../types';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('second-brain-tasks', seedTasks);

  function addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }

  function updateTask(id: string, updates: Partial<Task>) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)),
    );
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return { tasks, addTask, updateTask, deleteTask };
}
