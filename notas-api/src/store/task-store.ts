import { randomUUID } from 'node:crypto';
import type { CreateTaskInput, Task, TaskFilter } from '../domain/task.js';

export interface TaskStore {
  create(input: CreateTaskInput): Task;
  list(filter: TaskFilter): Task[];
  complete(id: string): Task | undefined;
  remove(id: string): boolean;
}

export class InMemoryTaskStore implements TaskStore {
  private readonly tasks = new Map<string, Task>();

  create(input: CreateTaskInput): Task {
    let id = randomUUID();
    while (this.tasks.has(id)) {
      id = randomUUID();
    }

    const task: Task = { id, title: input.title, status: 'open' };
    this.tasks.set(id, task);
    return { ...task };
  }

  list(filter: TaskFilter): Task[] {
    return [...this.tasks.values()]
      .filter((task) => filter === 'all' || task.status === filter)
      .map((task) => ({ ...task }));
  }

  complete(id: string): Task | undefined {
    const task = this.tasks.get(id);
    if (!task) {
      return undefined;
    }

    const completedTask: Task = { ...task, status: 'done' };
    this.tasks.set(id, completedTask);
    return { ...completedTask };
  }

  remove(id: string): boolean {
    return this.tasks.delete(id);
  }
}
