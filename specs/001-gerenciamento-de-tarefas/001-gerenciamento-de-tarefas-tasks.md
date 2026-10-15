# Tarefas — 001 Gerenciamento de Tarefas

Implemente as tarefas na ordem abaixo.

1. - [x] **Resolver decisões em aberto e alinhar os artefatos**
   - RF-10 foi limitado à equivalência de regras sobre a mesma instância; não há compartilhamento entre processos independentes.
   - Definidos: título de até 255 caracteres com espaços externos removidos, IDs UUID, remoção definitiva e contrato CLI com JSON em todo sucesso.
   - Spec e plano atualizados conforme as decisões.
   - **Dependências:** nenhuma.
   - **Pronto quando:** concluído; spec e plano estão alinhados.

2. - [x] **Criar modelo de domínio e schemas Zod**
   - Definir `Task`, status, filtro, entrada de criação e schemas em `src/domain/task.ts`.
   - Validar título não vazio/somente espaços, limite de 255 caracteres e remoção de espaços externos; validar status e filtros permitidos.
   - Adicionar testes `node:test` cobrindo entradas válidas e inválidas. Configurar `tsconfig.json` para incluir os tipos Node necessários aos testes.
   - **Dependências:** tarefa 1.
   - **Pronto quando:** 6 testes do domínio e `npm run typecheck` passam.

3. - [x] **Implementar store de tarefas**
   - Definir a interface e implementar o store conforme a estratégia de compartilhamento escolhida na tarefa 1.
   - Cobrir criação com UUID único e estado inicial aberto, listagem por filtro, conclusão, remoção, IDs inexistentes e isolamento contra mutação dos resultados retornados.
   - **Dependências:** tarefas 1 e 2.
   - **Pronto quando:** 5 testes do store, 11 testes da suíte completa e `npm run typecheck` passam.

4. - [x] **Implementar serviço e erros de domínio**
   - Implementar criação, listagem, conclusão idempotente e remoção, sem dependências de HTTP ou CLI.
   - Representar tarefa inexistente por `TaskNotFoundError` e cobrir as regras com testes.
   - **Dependências:** tarefas 2 e 3.
   - **Pronto quando:** 5 testes do serviço comprovam as regras, incluindo concluir duas vezes e IDs inexistentes; 16 testes da suíte completa e `npm run typecheck` passam.

5. - [x] **Compor dependências compartilhadas**
   - Criar a fábrica/composição da aplicação para construir store e serviço sem duplicar regras entre as entradas.
   - Criar `createTaskApplication`, com store em memória isolado por padrão e opção de injetar uma instância compartilhada.
   - Testar o isolamento padrão e o compartilhamento entre composições que recebem o mesmo store.
   - **Dependências:** tarefas 3 e 4.
   - **Pronto quando:** 2 testes de composição, 18 testes da suíte completa e `npm run typecheck` passam.

6. - [x] **Implementar API HTTP**
   - Implementar `POST /tasks`, `GET /tasks`, `PATCH /tasks/:id/complete` e `DELETE /tasks/:id` usando `node:http` e o serviço.
   - Validar corpo, query e UUID do caminho com Zod; traduzir erros de validação, domínio, corpo acima de 1 MiB e inesperados em respostas HTTP consistentes.
   - Adicionar testes de integração com porta efêmera para os quatro endpoints e seus casos de sucesso e erro.
   - **Dependências:** tarefas 2, 4 e 5.
   - **Pronto quando:** 5 testes de integração HTTP e 23 testes da suíte completa passam; `npm run typecheck` passa.

7. - [x] **Implementar interface CLI**
   - Implementar os comandos de criação, listagem, conclusão e remoção com a sintaxe acordada na tarefa 1.
   - Validar argumentos com Zod, chamar o serviço compartilhado, imprimir sucesso/erro nos streams apropriados e definir o código de saída correto.
   - Adicionar testes da função principal com argumentos e streams controlados.
   - **Dependências:** tarefas 2, 4 e 5.
   - **Pronto quando:** 4 testes CLI, 27 testes da suíte completa e `npm run typecheck` passam; comandos de sucesso e falha foram verificados via `npm run cli`.

8. - [x] **Verificar paridade entre HTTP e CLI**
   - Adicionar teste de integração que executa criação, listagem, conclusão e remoção pelas duas interfaces e confirma resultados equivalentes.
   - Comprovar que cada interface observa as alterações da outra quando ambas usam a mesma instância; processos independentes permanecem isolados conforme a decisão da tarefa 1.
   - **Dependências:** tarefas 6 e 7.
   - **Pronto quando:** o teste de paridade e a suíte completa (28 testes) passam; `npm run typecheck` passa.

9. - [x] **Executar validação final**
   - Executar a suíte completa de testes e a verificação de tipos no diretório `notas-api/`.
   - Corrigir falhas introduzidas pela feature e confirmar que os comandos de entrada existentes iniciam corretamente.
   - **Dependências:** tarefas 6, 7 e 8.
   - **Pronto quando:** `npm test` passou com 28 testes, `npm run typecheck` passou e a API foi iniciada e respondeu `HTTP 200` em `/tasks`; a CLI também foi verificada com sucesso e erro.
