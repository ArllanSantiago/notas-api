import type { CreateTaskInput, Task, TaskFilter } from '../domain/task.js';
import { TaskNotFoundError } from '../domain/errors.js';
import type { TaskStore } from '../store/task-store.js';

export class TaskService {
  constructor(private readonly store: TaskStore) {}

  create(input: CreateTaskInput): Task {
    return this.store.create(input);
  }

  list(filter: TaskFilter = 'all'): Task[] {
    return this.store.list(filter);
  }

  complete(id: string): Task {
    const task = this.store.complete(id);
    if (!task) {
      throw new TaskNotFoundError(id);
    }

    return task;
  }

  remove(id: string): void {
    if (!this.store.remove(id)) {
      throw new TaskNotFoundError(id);
    }
  }
}
