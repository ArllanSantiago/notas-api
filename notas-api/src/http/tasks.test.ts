import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import type { Server } from 'node:http';
import { TaskSchema } from '../domain/task.js';
import { createTaskServer } from './server.js';
import { InMemoryTaskStore } from '../store/task-store.js';
import { TaskService } from '../service/task-service.js';
import type { TaskStore } from '../store/task-store.js';

describe('task HTTP API', () => {
  let server: Server;
  let baseUrl: string;

  beforeEach(async () => {
    await startServer(new TaskService(new InMemoryTaskStore()));
  });

  afterEach(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it('creates tasks, trims titles, and rejects invalid titles without storing them', async () => {
    const createdResponse = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: '  Submit report  ' }),
    });
    assert.equal(createdResponse.status, 201);
    const task = TaskSchema.parse(await createdResponse.json());
    assert.match(task.id, /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    assert.equal(task.title, 'Submit report');
    assert.equal(task.status, 'open');

    const invalidResponse = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: '   ' }),
    });
    assert.equal(invalidResponse.status, 400);
    assert.deepEqual(await invalidResponse.json(), {
      error: { code: 'VALIDATION_ERROR', message: 'Invalid task title' },
    });
    assert.deepEqual(await (await fetch(`${baseUrl}/tasks`)).json(), [task]);
  });

  it('rejects malformed JSON bodies', async () => {
    const response = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{',
    });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {
      error: { code: 'VALIDATION_ERROR', message: 'Request body must be valid JSON' },
    });
  });

  it('returns the documented validation error for invalid filters and IDs', async () => {
    const invalidFilter = await fetch(`${baseUrl}/tasks?status=pending`);
    assert.equal(invalidFilter.status, 400);
    assert.deepEqual(await invalidFilter.json(), {
      error: { code: 'VALIDATION_ERROR', message: 'Invalid task status filter' },
    });

    const invalidId = await fetch(`${baseUrl}/tasks/not-a-uuid`, {
      method: 'DELETE',
    });
    assert.equal(invalidId.status, 400);
    assert.deepEqual(await invalidId.json(), {
      error: { code: 'VALIDATION_ERROR', message: 'Invalid task ID' },
    });
  });

  it('returns a payload-too-large error when the request body exceeds the limit', async () => {
    const response = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'a'.repeat(1_048_576) }),
    });

    assert.equal(response.status, 413);
    assert.deepEqual(await response.json(), {
      error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request body is too large' },
    });
  });

  it('lists all tasks by default and filters open and done tasks', async () => {
    const created = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Filter test' }),
    });
    const task = TaskSchema.parse(await created.json());

    assert.deepEqual(await (await fetch(`${baseUrl}/tasks?status=all`)).json(), [
      { ...task, title: 'Filter test', status: 'open' },
    ]);
    assert.deepEqual(await (await fetch(`${baseUrl}/tasks?status=open`)).json(), [
      { ...task, title: 'Filter test', status: 'open' },
    ]);

    const completed = await fetch(`${baseUrl}/tasks/${task.id}/complete`, {
      method: 'PATCH',
    });
    assert.equal(completed.status, 200);
    assert.deepEqual(await completed.json(), { ...task, title: 'Filter test', status: 'done' });
    assert.deepEqual(await (await fetch(`${baseUrl}/tasks?status=done`)).json(), [
      { ...task, title: 'Filter test', status: 'done' },
    ]);

    const invalidFilter = await fetch(`${baseUrl}/tasks?status=pending`);
    assert.equal(invalidFilter.status, 400);
  });

  it('completes idempotently and returns not found for a missing task', async () => {
    const createResponse = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Complete me' }),
    });
    const task = TaskSchema.parse(await createResponse.json());

    for (let index = 0; index < 2; index += 1) {
      const response = await fetch(`${baseUrl}/tasks/${task.id}/complete`, {
        method: 'PATCH',
      });
      assert.equal(response.status, 200);
      assert.equal((await response.json()).status, 'done');
    }

    const missingResponse = await fetch(
      `${baseUrl}/tasks/123e4567-e89b-42d3-a456-426614174000/complete`,
      { method: 'PATCH' },
    );
    assert.equal(missingResponse.status, 404);
    assert.deepEqual(await missingResponse.json(), {
      error: {
        code: 'NOT_FOUND',
        message: 'Task "123e4567-e89b-42d3-a456-426614174000" was not found',
      },
    });

    const missingDeleteResponse = await fetch(
      `${baseUrl}/tasks/123e4567-e89b-42d3-a456-426614174000`,
      { method: 'DELETE' },
    );
    assert.equal(missingDeleteResponse.status, 404);
    assert.equal((await missingDeleteResponse.json()).error.code, 'NOT_FOUND');
  });

  it('deletes tasks and validates IDs', async () => {
    const createResponse = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Delete me' }),
    });
    const task = TaskSchema.parse(await createResponse.json());

    const deleteResponse = await fetch(`${baseUrl}/tasks/${task.id}`, {
      method: 'DELETE',
    });
    assert.equal(deleteResponse.status, 204);
    assert.equal(await deleteResponse.text(), '');
    assert.deepEqual(await (await fetch(`${baseUrl}/tasks`)).json(), []);

    const invalidIdResponse = await fetch(`${baseUrl}/tasks/not-a-uuid`, {
      method: 'DELETE',
    });
    assert.equal(invalidIdResponse.status, 400);

    const missingResponse = await fetch(
      `${baseUrl}/tasks/123e4567-e89b-42d3-a456-426614174000`,
      { method: 'DELETE' },
    );
    assert.equal(missingResponse.status, 404);
  });

  it('returns NOT_FOUND for unknown routes and unsupported methods', async () => {
    for (const response of [
      await fetch(`${baseUrl}/missing`),
      await fetch(`${baseUrl}/tasks`, { method: 'PUT' }),
    ]) {
      assert.equal(response.status, 404);
      assert.deepEqual(await response.json(), {
        error: { code: 'NOT_FOUND', message: 'Route not found' },
      });
    }
  });

  it('returns a generic internal error without exposing unexpected details', async () => {
    const sentinel = 'private diagnostic sentinel';
    const failingStore: TaskStore = {
      create: () => {
        throw new Error(sentinel);
      },
      list: () => [],
      complete: () => undefined,
      remove: () => false,
    };

    await closeServer();
    await startServer(new TaskService(failingStore));

    const response = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Cause an internal error' }),
    });
    const body = await response.text();

    assert.equal(response.status, 500);
    assert.deepEqual(JSON.parse(body), {
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
    });
    assert.equal(body.includes(sentinel), false);
  });

  async function startServer(taskService: TaskService): Promise<void> {
    server = createTaskServer(taskService);
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', () => {
        server.off('error', reject);
        resolve();
      });
    });

    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    baseUrl = `http://127.0.0.1:${address.port}`;
  }

  async function closeServer(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
