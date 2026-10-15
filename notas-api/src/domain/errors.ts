export class TaskNotFoundError extends Error {
  constructor(id: string) {
    super(`Task "${id}" was not found`);
    this.name = 'TaskNotFoundError';
  }
}
