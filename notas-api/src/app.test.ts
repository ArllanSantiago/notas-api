import assert from 'node:assert/strict';
import test from 'node:test';
import { createTaskApplication } from './app.js';
import { InMemoryTaskStore } from './store/task-store.js';

test('createTaskApplication creates isolated in-memory stores by default', () => {
  const firstApplication = createTaskApplication();
  const secondApplication = createTaskApplication();

  firstApplication.taskService.create({ title: 'First application task' });

  assert.equal(firstApplication.taskService.list().length, 1);
  assert.deepEqual(secondApplication.taskService.list(), []);
});

test('createTaskApplication can compose interfaces over the same store instance', () => {
  const store = new InMemoryTaskStore();
  const httpApplication = createTaskApplication(store);
  const cliApplication = createTaskApplication(store);

  const task = httpApplication.taskService.create({ title: 'Shared task' });

  assert.deepEqual(cliApplication.taskService.list(), [task]);
});
