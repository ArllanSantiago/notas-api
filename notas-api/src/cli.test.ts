import assert from 'node:assert/strict';
import test from 'node:test';
import { TaskSchema } from './domain/task.js';
import { InMemoryTaskStore } from './store/task-store.js';
import type { TaskStore } from './store/task-store.js';
import { TaskService } from './service/task-service.js';
import { runCli, type CliOutput } from './cli.js';

function createCliHarness() {
  let stdout = '';
  let stderr = '';
  const diagnostics: unknown[] = [];
  const taskService = new TaskService(new InMemoryTaskStore());
  const output: CliOutput = {
    stdout: (text) => {
      stdout += text;
    },
    stderr: (text) => {
      stderr += text;
    },
  };

  return {
    taskService,
    output,
    diagnostics,
    run: (args: string[]) =>
      runCli(args, taskService, output, (error) => {
        diagnostics.push(error);
      }),
    getStdout: () => stdout,
    getStderr: () => stderr,
  };
}

test('add and list commands print JSON and use the default all filter', () => {
  const harness = createCliHarness();

  assert.equal(
    harness.run(['add', '--title', '  Write tests  ']),
    0,
  );
  const task = TaskSchema.parse(JSON.parse(harness.getStdout()));
  assert.equal(task.title, 'Write tests');
  assert.equal(task.status, 'open');
  assert.equal(harness.getStderr(), '');

  assert.equal(harness.run(['list']), 0);
  assert.deepEqual(JSON.parse(harness.getStdout().split('\n')[1]!), [task]);
});

test('list validates its optional status filter', () => {
  const harness = createCliHarness();

  assert.equal(
    harness.run(['list', '--status', 'pending']),
    1,
  );
  assert.equal(harness.getStdout(), '');
  assert.equal(harness.getStderr(), 'Invalid task status filter\n');
});

test('complete is idempotent and delete removes a task', () => {
  const harness = createCliHarness();
  assert.equal(
    harness.run(['add', '--title', 'Finish task']),
    0,
  );
  const task = TaskSchema.parse(JSON.parse(harness.getStdout()));

  assert.equal(
    harness.run(['complete', task.id]),
    0,
  );
  assert.equal(
    harness.run(['complete', task.id]),
    0,
  );
  const completed = TaskSchema.parse(JSON.parse(harness.getStdout().split('\n')[2]!));
  assert.equal(completed.status, 'done');

  assert.equal(harness.run(['delete', task.id]), 0);
  assert.deepEqual(JSON.parse(harness.getStdout().split('\n')[3]!), {
    id: task.id,
    deleted: true,
  });
  assert.deepEqual(harness.taskService.list(), []);
});

test('invalid arguments, titles, IDs, and missing tasks return nonzero with stderr messages', () => {
  const harness = createCliHarness();

  assert.equal(harness.run(['add', '--title', '  ']), 1);
  assert.equal(harness.getStderr(), 'Invalid task title\n');

  assert.equal(harness.run(['complete', 'not-a-uuid']), 1);
  assert.equal(harness.getStderr(), 'Invalid task title\nInvalid task ID\n');

  assert.equal(
    harness.run(['complete', '123e4567-e89b-42d3-a456-426614174000']),
    1,
  );
  assert.match(harness.getStderr(), /was not found/);

  assert.equal(harness.run(['add', 'Wrong syntax']), 1);
  assert.match(harness.getStderr(), /Usage:/);
  assert.equal(harness.getStdout(), '');
});

test('predictable CLI failures keep success output empty and do not emit diagnostics', () => {
  const missingId = '123e4567-e89b-42d3-a456-426614174000';
  const cases: Array<{ args: string[]; expectedStderr: string }> = [
    {
      args: ['unknown'],
      expectedStderr:
        'Usage: add --title <title> | list [--status all|open|done] | complete <id> | delete <id>\n',
    },
    {
      args: ['add', '--title', '   '],
      expectedStderr: 'Invalid task title\n',
    },
    {
      args: ['list', '--status', 'pending'],
      expectedStderr: 'Invalid task status filter\n',
    },
    {
      args: ['complete', 'not-a-uuid'],
      expectedStderr: 'Invalid task ID\n',
    },
    {
      args: ['delete', missingId],
      expectedStderr: `Task "${missingId}" was not found\n`,
    },
  ];

  for (const { args, expectedStderr } of cases) {
    const harness = createCliHarness();

    assert.equal(harness.run(args), 1, `args: ${args.join(' ')}`);
    assert.equal(harness.getStdout(), '', `args: ${args.join(' ')}`);
    assert.equal(harness.getStderr(), expectedStderr, `args: ${args.join(' ')}`);
    assert.deepEqual(harness.diagnostics, [], `args: ${args.join(' ')}`);
  }
});

test('unexpected failures expose only a generic message and reach diagnostics', () => {
  const harness = createCliHarness();
  const sentinel = 'private diagnostic sentinel';
  const failingStore: TaskStore = {
    create: () => {
      throw new Error(sentinel);
    },
    list: () => [],
    complete: () => undefined,
    remove: () => false,
  };
  const diagnosticErrors: unknown[] = [];
  const failingService = new TaskService(failingStore);

  const exitCode = runCli(
    ['add', '--title', 'Trigger unexpected failure'],
    failingService,
    harness.output,
    (error) => diagnosticErrors.push(error),
  );

  assert.equal(exitCode, 1);
  assert.equal(harness.getStdout(), '');
  assert.equal(harness.getStderr(), 'Internal error\n');
  assert.equal(harness.getStderr().includes(sentinel), false);
  assert.equal(diagnosticErrors.length, 1);
  const diagnosticError = diagnosticErrors[0];
  assert.ok(diagnosticError instanceof Error);
  assert.equal(diagnosticError.message, sentinel);
});
