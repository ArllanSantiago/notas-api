import { channel } from 'node:diagnostics_channel';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { z } from 'zod';
import { createTaskApplication } from './app.js';
import { TaskNotFoundError } from './domain/errors.js';
import { CreateTaskInputSchema, TaskFilterSchema } from './domain/task.js';
import type { TaskService } from './service/task-service.js';

const unexpectedErrorChannel = channel('notas-api.cli.unexpected-error');
const TaskIdSchema = z.uuid();
const USAGE =
  'Usage: add --title <title> | list [--status all|open|done] | complete <id> | delete <id>';

export interface CliOutput {
  stdout: (text: string) => void;
  stderr: (text: string) => void;
}

export type CliDiagnostic = (error: unknown) => void;

function writeJson(output: CliOutput, value: unknown): void {
  output.stdout(`${JSON.stringify(value)}\n`);
}

function writeUsageError(output: CliOutput): number {
  output.stderr(`${USAGE}\n`);
  return 1;
}

export function runCli(
  args: string[],
  taskService: TaskService,
  output: CliOutput,
  diagnoseUnexpected: CliDiagnostic,
): number {
  try {
    switch (args[0]) {
      case 'add': {
        if (args.length !== 3 || args[1] !== '--title') {
          return writeUsageError(output);
        }

        const input = CreateTaskInputSchema.safeParse({ title: args[2] });
        if (!input.success) {
          output.stderr('Invalid task title\n');
          return 1;
        }

        writeJson(output, taskService.create(input.data));
        return 0;
      }
      case 'list': {
        if (args.length !== 1 && (args.length !== 3 || args[1] !== '--status')) {
          return writeUsageError(output);
        }

        const filter = TaskFilterSchema.safeParse(args.length === 1 ? 'all' : args[2]);
        if (!filter.success) {
          output.stderr('Invalid task status filter\n');
          return 1;
        }

        writeJson(output, taskService.list(filter.data));
        return 0;
      }
      case 'complete':
      case 'delete': {
        if (args.length !== 2) {
          return writeUsageError(output);
        }

        const id = TaskIdSchema.safeParse(args[1]);
        if (!id.success) {
          output.stderr('Invalid task ID\n');
          return 1;
        }

        if (args[0] === 'complete') {
          writeJson(output, taskService.complete(id.data));
        } else {
          taskService.remove(id.data);
          writeJson(output, { id: id.data, deleted: true });
        }
        return 0;
      }
      default:
        return writeUsageError(output);
    }
  } catch (error) {
    if (error instanceof TaskNotFoundError) {
      output.stderr(`${error.message}\n`);
    } else {
      output.stderr('Internal error\n');
      diagnoseUnexpected(error);
    }
    return 1;
  }
}

const scriptPath = process.argv[1];
if (scriptPath && import.meta.url === pathToFileURL(resolve(scriptPath)).href) {
  const { taskService } = createTaskApplication();
  process.exitCode = runCli(
    process.argv.slice(2),
    taskService,
    {
      stdout: (text) => {
        process.stdout.write(text);
      },
      stderr: (text) => {
        process.stderr.write(text);
      },
    },
    (error) => {
      unexpectedErrorChannel.publish({ error });
    },
  );
}
