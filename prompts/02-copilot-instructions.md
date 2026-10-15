# Prompt 02 - .github/copilot-instructions.md

## Explicação prévia dos itens pedidos
- **Arquivo**: `notas-api/.github/copilot-instructions.md`, memória do projeto injetada em toda conversa; deve ser curto (~40 linhas) e factual, sem manual de estilo.
- **Stack**: Node 22 LTS, TypeScript ESM strict, zod na fronteira, testes com node:test via tsx, node:http sem framework.
- **Comandos**: dev (localhost:3000), cli, test e typecheck, extraídos do `notas-api/package.json`, uma linha cada; devem ser executados a partir de `notas-api/`.
- **Estrutura**: `notas-api/src/domain`, `notas-api/src/store`, `notas-api/src/service`, `notas-api/src/http`, `notas-api/src/cli.ts`; `specs/` fica na raiz do workspace.
- **Convenções**: camadas não pulam (http/cli -> service -> store); zod na entrada; erros de domínio como classes traduzidas na borda; lógica nova com teste; typecheck/test verdes; nunca commitar segredos nem ler .env.
- **Fluxo de trabalho**: /especificar -> /planejar -> /tarefas -> /implementar, com revisão humana entre fases; artefatos em `specs/` na raiz do workspace.

## Prompt original
Crie `notas-api/.github/copilot-instructions.md`, a memória do projeto, injetada em toda conversa; precisa ser curta e FACTUAL. Seções:
- Stack: node 22 LTS, typescript ESM strict, zod na fronteira (HTTP/CLI); testes com node:test via tsx, sem framework HTTP (node:http de propósito).
- Comandos: dev (API em localhost:3000), cli, test e typecheck, extraia de `notas-api/package.json`, uma linha cada; devem ser executados a partir de `notas-api/`.
- Estrutura: `notas-api/src/domain` (tipos+zod, sem IO), `notas-api/src/store` (persistência in-memory atrás de interface), `notas-api/src/service` (regras), `notas-api/src/http`, `notas-api/src/cli.ts`; `specs/` na raiz do workspace (spec-driven).
- Convenções: camadas não pulam (http/cli -> service -> store); entrada externa validada com zod; erros de domínio são classes traduzidas na borda; lógica nova nasce com teste; typecheck e test sempre verdes; nunca commitar segredos nem ler .env.
- Fluxo de trabalho: /especificar -> /planejar -> /tarefas -> /implementar, com revisão humana entre as fases; artefatos em `specs/` na raiz do workspace. Máximo ~40 linhas. Nada de manual de estilo.
