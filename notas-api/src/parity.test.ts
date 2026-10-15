import assert from 'node:assert/strict';
import { once } from 'node:events';
import type { Server } from 'node:http';
import test from 'node:test';
import { runCli } from './cli.js';
import { TaskSchema } from './domain/task.js';
import { createTaskServer } from './http/server.js';
import { createTaskApplication } from './app.js';

test('HTTP and CLI observe the same tasks when composed with one application instance', async () => {
  const application = createTaskApplication();
  const server = createTaskServer(application.taskService);
  await listen(server);

  try {
    const baseUrl = getBaseUrl(server);
    const output = createCliOutput();
    const run = (args: string[]) =>
      runCli(args, application.taskService, output.streams, () => {});
    const cliJson = (line: number) => JSON.parse(output.stdoutLines[line]!);

    assert.equal(run(['add', '--title', '  Created by CLI  ']), 0);
    const cliTask = TaskSchema.parse(cliJson(0));
    assert.equal(cliTask.title, 'Created by CLI');

    const openFromHttp = await fetch(`${baseUrl}/tasks?status=open`);
    assert.equal(openFromHttp.status, 200);
    assert.deepEqual(await openFromHttp.json(), [cliTask]);

    const httpCreateResponse = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Created by HTTP' }),
    });
    assert.equal(httpCreateResponse.status, 201);
    const httpTask = TaskSchema.parse(await httpCreateResponse.json());

    assert.equal(run(['list', '--status', 'open']), 0);
    assert.deepEqual(cliJson(1), [cliTask, httpTask]);

    const httpCompleteResponse = await fetch(`${baseUrl}/tasks/${cliTask.id}/complete`, {
      method: 'PATCH',
    });
    assert.equal(httpCompleteResponse.status, 200);
    assert.equal(run(['list', '--status', 'done']), 0);
    assert.deepEqual(cliJson(2), [{ ...cliTask, status: 'done' }]);

    assert.equal(run(['complete', httpTask.id]), 0);
    assert.equal(TaskSchema.parse(cliJson(3)).status, 'done');
    assert.deepEqual(
      await (await fetch(`${baseUrl}/tasks?status=done`)).json(),
      [{ ...cliTask, status: 'done' }, { ...httpTask, status: 'done' }],
    );

    assert.equal(run(['delete', cliTask.id]), 0);
    const afterCliDelete = await fetch(`${baseUrl}/tasks`);
    assert.deepEqual(await afterCliDelete.json(), [{ ...httpTask, status: 'done' }]);

    const httpDelete = await fetch(`${baseUrl}/tasks/${httpTask.id}`, { method: 'DELETE' });
    assert.equal(httpDelete.status, 204);
    assert.equal(run(['list']), 0);
    assert.deepEqual(cliJson(5), []);

    assert.equal(output.stderrLines.length, 0);
  } finally {
    await close(server);
  }
});

function createCliOutput() {
  const stdoutLines: string[] = [];
  const stderrLines: string[] = [];
  return {
    stdoutLines,
    stderrLines,
    streams: {
      stdout: (text: string) => stdoutLines.push(text.trim()),
      stderr: (text: string) => stderrLines.push(text.trim()),
    },
  };
}

async function listen(server: Server): Promise<void> {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
}

function getBaseUrl(server: Server): string {
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  return `http://127.0.0.1:${address.port}`;
}

async function close(server: Server): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}
