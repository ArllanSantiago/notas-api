import { InMemoryTaskStore, type TaskStore } from './store/task-store.js';
import { TaskService } from './service/task-service.js';

export interface TaskApplication {
  taskService: TaskService;
}

export function createTaskApplication(
  store: TaskStore = new InMemoryTaskStore(),
): TaskApplication {
  return { taskService: new TaskService(store) };
}
