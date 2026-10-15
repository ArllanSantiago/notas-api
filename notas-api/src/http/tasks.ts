import type { IncomingMessage, ServerResponse } from 'node:http';
import { z } from 'zod';
import { TaskNotFoundError } from '../domain/errors.js';
import { CreateTaskInputSchema, TaskFilterSchema } from '../domain/task.js';
import type { TaskService } from '../service/task-service.js';

const MAX_REQUEST_BODY_SIZE = 1_048_576;
const TaskIdSchema = z.uuid();

class InvalidJsonRequestError extends Error {}
class RequestBodyTooLargeError extends Error {}

function sendJson(response: ServerResponse, statusCode: number, body: unknown): void {
  response.statusCode = statusCode;
  response.setHeader('content-type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(body));
}

function sendError(
  response: ServerResponse,
  statusCode: number,
  code: string,
  message: string,
): void {
  sendJson(response, statusCode, { error: { code, message } });
}

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of request) {
    const buffer = Buffer.from(chunk);
    size += buffer.byteLength;
    if (size > MAX_REQUEST_BODY_SIZE) {
      throw new RequestBodyTooLargeError();
    }

    chunks.push(buffer);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new InvalidJsonRequestError();
  }
}

function parseTaskId(rawId: string): string | undefined {
  let id: string;
  try {
    id = decodeURIComponent(rawId);
  } catch {
    return undefined;
  }

  const result = TaskIdSchema.safeParse(id);
  return result.success ? result.data : undefined;
}

export async function handleTaskRequest(
  request: IncomingMessage,
  response: ServerResponse,
  taskService: TaskService,
): Promise<void> {
  const url = new URL(request.url ?? '/', 'http://localhost');
  const { pathname } = url;

  if (request.method === 'POST' && pathname === '/tasks') {
    const body = await readJsonBody(request);
    const parsed = CreateTaskInputSchema.safeParse(body);
    if (!parsed.success) {
      sendError(response, 400, 'VALIDATION_ERROR', 'Invalid task title');
      return;
    }

    sendJson(response, 201, taskService.create(parsed.data));
    return;
  }

  if (request.method === 'GET' && pathname === '/tasks') {
    const rawFilter = url.searchParams.get('status');
    const parsed = TaskFilterSchema.safeParse(rawFilter ?? 'all');
    if (!parsed.success) {
      sendError(response, 400, 'VALIDATION_ERROR', 'Invalid task status filter');
      return;
    }

    sendJson(response, 200, taskService.list(parsed.data));
    return;
  }

  const completeMatch = pathname.match(/^\/tasks\/([^/]+)\/complete$/);
  if (request.method === 'PATCH' && completeMatch) {
    const id = parseTaskId(completeMatch[1]!);
    if (!id) {
      sendError(response, 400, 'VALIDATION_ERROR', 'Invalid task ID');
      return;
    }

    sendJson(response, 200, taskService.complete(id));
    return;
  }

  const deleteMatch = pathname.match(/^\/tasks\/([^/]+)$/);
  if (request.method === 'DELETE' && deleteMatch) {
    const id = parseTaskId(deleteMatch[1]!);
    if (!id) {
      sendError(response, 400, 'VALIDATION_ERROR', 'Invalid task ID');
      return;
    }

    taskService.remove(id);
    response.statusCode = 204;
    response.end();
    return;
  }

  sendError(response, 404, 'NOT_FOUND', 'Route not found');
}

export function handleTaskRequestError(error: unknown, response: ServerResponse): void {
  if (error instanceof InvalidJsonRequestError) {
    sendError(response, 400, 'VALIDATION_ERROR', 'Request body must be valid JSON');
    return;
  }

  if (error instanceof RequestBodyTooLargeError) {
    sendError(response, 413, 'PAYLOAD_TOO_LARGE', 'Request body is too large');
    return;
  }

  if (error instanceof TaskNotFoundError) {
    sendError(response, 404, 'NOT_FOUND', error.message);
    return;
  }

  console.error('Unhandled HTTP request error:', error);
  sendError(response, 500, 'INTERNAL_ERROR', 'Internal server error');
}
