import assert from 'node:assert/strict';
import test from 'node:test';
import { InMemoryTaskStore } from './task-store.js';

test('create assigns a unique UUID and starts each task as open', () => {
  const store = new InMemoryTaskStore();
  const first = store.create({ title: 'First task' });
  const second = store.create({ title: 'Second task' });

  assert.match(first.id, /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  assert.notEqual(first.id, second.id);
  assert.equal(first.status, 'open');
  assert.equal(second.status, 'open');
});

test('list returns all tasks or filters by status', () => {
  const store = new InMemoryTaskStore();
  const openTask = store.create({ title: 'Open task' });
  const doneTask = store.create({ title: 'Done task' });
  store.complete(doneTask.id);

  assert.deepEqual(store.list('all').map((task) => task.id), [openTask.id, doneTask.id]);
  assert.deepEqual(store.list('open').map((task) => task.id), [openTask.id]);
  assert.deepEqual(store.list('done').map((task) => task.id), [doneTask.id]);
});

test('complete updates an existing task and returns undefined for a missing ID', () => {
  const store = new InMemoryTaskStore();
  const task = store.create({ title: 'Task' });

  assert.deepEqual(store.complete(task.id), { ...task, status: 'done' });
  assert.equal(store.complete('missing-id'), undefined);
  assert.equal(store.list('done').length, 1);
});

test('remove deletes an existing task and reports missing IDs', () => {
  const store = new InMemoryTaskStore();
  const task = store.create({ title: 'Task' });

  assert.equal(store.remove(task.id), true);
  assert.deepEqual(store.list('all'), []);
  assert.equal(store.remove(task.id), false);
});

test('returned tasks cannot mutate the stored state', () => {
  const store = new InMemoryTaskStore();
  const task = store.create({ title: 'Original title' });
  task.title = 'Changed title';

  assert.equal(store.list('all')[0]?.title, 'Original title');
});
