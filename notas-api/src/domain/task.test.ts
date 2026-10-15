import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CreateTaskInputSchema,
  TaskFilterSchema,
  TaskSchema,
  TaskStatusSchema,
} from './task.js';

test('CreateTaskInputSchema trims whitespace and accepts a valid title', () => {
  assert.deepEqual(CreateTaskInputSchema.parse({ title: '  Buy milk  ' }), {
    title: 'Buy milk',
  });
});

test('CreateTaskInputSchema rejects empty, whitespace-only, and oversized titles', () => {
  for (const title of ['', ' \t\n ', 'a'.repeat(256)]) {
    assert.equal(CreateTaskInputSchema.safeParse({ title }).success, false);
  }
});

test('CreateTaskInputSchema accepts titles up to 255 characters', () => {
  assert.equal(CreateTaskInputSchema.safeParse({ title: 'a'.repeat(255) }).success, true);
});

test('TaskStatusSchema accepts only supported statuses', () => {
  assert.equal(TaskStatusSchema.safeParse('open').success, true);
  assert.equal(TaskStatusSchema.safeParse('done').success, true);
  assert.equal(TaskStatusSchema.safeParse('pending').success, false);
});

test('TaskFilterSchema accepts only supported filters', () => {
  for (const filter of ['all', 'open', 'done']) {
    assert.equal(TaskFilterSchema.safeParse(filter).success, true);
  }

  assert.equal(TaskFilterSchema.safeParse('pending').success, false);
});

test('TaskSchema validates UUID, title, and status', () => {
  assert.equal(
    TaskSchema.safeParse({
      id: '123e4567-e89b-42d3-a456-426614174000',
      title: 'Buy milk',
      status: 'open',
    }).success,
    true,
  );
  assert.equal(
    TaskSchema.safeParse({
      id: 'not-a-uuid',
      title: 'Buy milk',
      status: 'open',
    }).success,
    false,
  );
});
