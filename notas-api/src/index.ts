import { createTaskApplication } from './app.js';
import { createTaskServer } from './http/server.js';

const { taskService } = createTaskApplication();
const server = createTaskServer(taskService);

server.listen(3000, () => {
  console.log('notas-api listening on http://localhost:3000');
});
