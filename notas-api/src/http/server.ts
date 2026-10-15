import { createServer } from 'node:http';
import type { TaskService } from '../service/task-service.js';
import { handleTaskRequest, handleTaskRequestError } from './tasks.js';

export function createTaskServer(taskService: TaskService) {
  return createServer((request, response) => {
    void handleTaskRequest(request, response, taskService).catch((error: unknown) => {
      handleTaskRequestError(error, response);
    });
  });
}
