# notas-api

## Stack
- Node 22 LTS, TypeScript ESM com `strict`.
- zod na fronteira (HTTP/CLI).
- Testes com `node:test` via tsx.
- Sem framework HTTP: usa `node:http` de propósito.

## Comandos
- Execute os comandos a partir de `notas-api/`.
- `npm run dev`: API em http://localhost:3000
- `npm run cli`: executa `src/cli.ts`
- `npm test`: roda `src/**/*.test.ts`
- `npm run typecheck`: `tsc --noEmit`

## Estrutura
- `notas-api/src/domain`: tipos + zod, sem IO
- `notas-api/src/store`: persistência in-memory atrás de interface
- `notas-api/src/service`: regras de negócio
- `notas-api/src/http`: camada HTTP
- `notas-api/src/cli.ts`: entrada CLI
- `specs/` na raiz do workspace: cada feature fica em `specs/<NNN>-<slug>/`
- Artefatos da feature: `<NNN>-<slug>-spec.md`, `<NNN>-<slug>-plan.md` e `<NNN>-<slug>-tasks.md` dentro da pasta numerada

## Convenções
- Camadas não pulam: http/cli -> service -> store.
- Entrada externa sempre validada com zod.
- Erros de domínio são classes, traduzidas na borda.
- Lógica nova nasce com teste.
- `typecheck` e `test` sempre verdes.
- Nunca commitar segredos nem ler `.env`.

## Fluxo de trabalho
- `/especificar` -> `/planejar` -> `/tarefas` -> `/implementar`.
- Revisão humana entre as fases.
- Artefatos em `specs/<NNN>-<slug>/`, com o mesmo prefixo numerado e slug nos nomes dos arquivos: `<NNN>-<slug>-spec.md`, `<NNN>-<slug>-plan.md` e `<NNN>-<slug>-tasks.md`.
- Não criar arquivos genéricos `spec.md`, `plan.md` ou `tasks.md` dentro das pastas de features.
