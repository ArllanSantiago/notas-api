# Plano técnico — 001 Gerenciamento de Tarefas

## Objetivo

Implementar criação, listagem, conclusão e remoção de tarefas por HTTP e CLI, usando as mesmas regras de domínio e serviços. Este plano não altera a spec nem implementa código.

## Arquitetura

Dependências: `http/cli -> service -> store`; `domain` não realiza IO e não depende das camadas externas.

| Camada | Arquivos propostos | Responsabilidade |
| --- | --- | --- |
| Domínio | `notas-api/src/domain/task.ts` | Tipos, schemas Zod para os dados de tarefa e estados/filtros válidos. Títulos têm até 255 caracteres e são aparados nas extremidades antes do armazenamento. |
| Store | `notas-api/src/store/task-store.ts` | Interface do repositório e implementação em memória, com operações de criar, listar, concluir e remover. Gera IDs UUID com `node:crypto`. |
| Serviço | `notas-api/src/service/task-service.ts` | Regras de negócio compartilhadas: criar, filtrar, concluir de forma idempotente e remover. Recebe o store por injeção; expõe erro de domínio para tarefa inexistente. |
| HTTP | `notas-api/src/http/server.ts`, `notas-api/src/http/tasks.ts` | Servidor `node:http`, roteamento, leitura/validação das entradas com Zod e tradução de erros de domínio para respostas HTTP. |
| Composição/entrada | `notas-api/src/app.ts`, `notas-api/src/index.ts` | Criar store e serviço e iniciar o servidor HTTP no ponto de entrada existente. |
| CLI | `notas-api/src/cli.ts` | Validar argumentos, chamar o mesmo serviço, imprimir resultado/erro e definir o código de saída. Separar a função executável da lógica principal para permitir testes. |

O serviço não deve importar módulos HTTP ou CLI. As duas interfaces devem chamar o serviço, sem duplicar regras. A fábrica de composição cria as dependências necessárias para cada entrada. Como o store é em memória, processos independentes não compartilham seus dados; RF-10 garante equivalência de regras e resultados apenas quando as interfaces usam a mesma instância.

## Modelo de dados

- `Task`: `{ id: string; title: string; status: 'open' | 'done' }`.
- `TaskStatus`: união `'open' | 'done'`.
- `TaskFilter`: união `'all' | 'open' | 'done'`.
- `CreateTaskInput`: `{ title: string }`.
- Schemas Zod de domínio para criação, tarefa, status e filtro. A validação de título deve rejeitar strings vazias ou compostas somente por espaços, impor máximo de 255 caracteres e remover espaços externos; a validação da fronteira HTTP/CLI acontece antes de chamar o serviço.
- O identificador é um UUID gerado no store com `node:crypto`.
- A conclusão não altera novamente uma tarefa já concluída. Remoção é definitiva, conforme a suposição expressa na spec.

Não incluir timestamps ou outros atributos não exigidos pela feature.

## Contratos

### HTTP

Todas as respostas com corpo usam JSON.

| Operação | Entrada | Sucesso | Erros esperados |
| --- | --- | --- | --- |
| `POST /tasks` | Corpo `{ "title": string }` | `201`, corpo com a tarefa criada (`id`, `title`, `status`) | `400` para JSON inválido ou título inválido |
| `GET /tasks?status=all\|open\|done` | Query opcional `status`, padrão `all` | `200`, array de tarefas | `400` para filtro inválido |
| `PATCH /tasks/:id/complete` | ID no caminho | `200`, tarefa concluída | `404` se inexistente |
| `DELETE /tasks/:id` | ID no caminho | `204`, sem corpo | `404` se inexistente |

Formato recomendado para erros: `{ "error": { "code": string, "message": string } }`. Usar um código estável para validação e outro para não encontrado. Erros inesperados devem resultar em `500`, sem expor detalhes internos.

### CLI

Proposta de comandos:

- `node src/cli.ts add --title "<título>"` — imprime a tarefa criada como JSON.
- `node src/cli.ts list [--status all|open|done]` — imprime um array JSON; `all` é o padrão.
- `node src/cli.ts complete <id>` — imprime a tarefa concluída como JSON.
- `node src/cli.ts delete <id>` — imprime confirmação de remoção como JSON.

Em sucesso, o processo termina com código `0`; em argumento inválido, validação ou tarefa inexistente, imprime a mensagem em `stderr` e termina com código diferente de zero.

## Decisões e trade-offs

- **Reutilização de regras:** HTTP e CLI dependem do mesmo serviço, reduzindo divergências e mantendo a validação de entrada nas bordas.
- **Store em memória:** é simples e segue a estrutura atual do projeto, mas perde os dados ao encerrar o processo. HTTP e CLI em processos independentes não compartilham dados; RF-10 garante as mesmas regras e equivalência quando operam sobre a mesma instância.
- **Conclusão idempotente:** repetir a conclusão de tarefa existente retorna sucesso com estado `done`, conforme o critério de aceite.
- **Remoção definitiva:** simples e compatível com o critério de aceite; identificadores removidos não devem ser reutilizados se a geração de UUID for adotada.
- **Sem campos extras:** não adicionar timestamps, paginação, autenticação ou edição de título; permanecem fora do escopo da spec.
- **Erros explícitos:** falhas previsíveis viram erros de domínio e são traduzidas na borda HTTP/CLI, sem retorno de sucesso disfarçado.

## Estratégia de teste (`node:test`)

1. **Domínio:** aceitar título válido; rejeitar vazio/brancos; aceitar somente os filtros permitidos; validar as formas da tarefa.
2. **Store:** criar com ID único e estado inicial `open`; listar por estado e `all`; concluir; remover; retornar ausência quando ID não existe.
3. **Serviço:** regras compartilhadas; conclusão repetida sem erro; erro de domínio para conclusão/remoção de ID inexistente.
4. **HTTP:** testes de integração com servidor em porta efêmera para os quatro endpoints, códigos e formatos de sucesso/erro, filtro padrão, filtro inválido e não encontrado.
5. **CLI:** testar a função principal com argumentos e streams controlados, cobrindo sucesso, validação, não encontrado e códigos de saída sem executar subprocessos desnecessariamente.
6. **Regressão:** executar `npm test` e `npm run typecheck` a partir de `notas-api/`.

## Riscos e decisões humanas pendentes

1. **Limite da memória:** dados não sobrevivem ao processo e não são compartilhados entre execuções independentes. Persistência compartilhada exigirá uma spec futura.
2. **Portabilidade de IDs:** UUID reduz muito a chance de colisão, sem constituir garantia matemática de unicidade; o store deve evitar sobrescrever uma entrada em caso de colisão.
