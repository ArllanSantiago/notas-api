import assert from 'node:assert/strict';
import test from 'node:test';
import { TaskNotFoundError } from '../domain/errors.js';
import { InMemoryTaskStore } from '../store/task-store.js';
import { TaskService } from './task-service.js';

test('service creates and lists tasks using the store', () => {
  const service = new TaskService(new InMemoryTaskStore());

  const task = service.create({ title: 'Write tests' });

  assert.equal(task.title, 'Write tests');
  assert.equal(task.status, 'open');
  assert.deepEqual(service.list(), [task]);
});

test('service lists tasks with the requested filter', () => {
  const service = new TaskService(new InMemoryTaskStore());
  const openTask = service.create({ title: 'Open' });
  const doneTask = service.create({ title: 'Done' });
  service.complete(doneTask.id);

  assert.deepEqual(service.list('open'), [openTask]);
  assert.deepEqual(service.list('done'), [{ ...doneTask, status: 'done' }]);
});

test('completing a task repeatedly succeeds and keeps it done', () => {
  const service = new TaskService(new InMemoryTaskStore());
  const task = service.create({ title: 'Complete me' });

  assert.deepEqual(service.complete(task.id), { ...task, status: 'done' });
  assert.deepEqual(service.complete(task.id), { ...task, status: 'done' });
});

test('completing or removing a missing task throws TaskNotFoundError', () => {
  const service = new TaskService(new InMemoryTaskStore());

  assert.throws(() => service.complete('missing-id'), TaskNotFoundError);
  assert.throws(() => service.remove('missing-id'), TaskNotFoundError);
});

test('removing a task prevents it from appearing in subsequent lists', () => {
  const service = new TaskService(new InMemoryTaskStore());
  const task = service.create({ title: 'Remove me' });

  service.remove(task.id);

  assert.deepEqual(service.list(), []);
  assert.throws(() => service.remove(task.id), TaskNotFoundError);
});
