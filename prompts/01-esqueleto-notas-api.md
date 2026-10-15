# Prompt 01 - Esqueleto do projeto notas-api

## Explicação prévia dos itens pedidos
- **Local do projeto**: criar a pasta `notas-api/` na raiz do workspace para código, configuração e prompts; manter `specs/` na raiz do workspace e reutilizar o repositório Git existente, sem criar um repositório aninhado.
- **Git**: reutilizar o repositório existente na raiz do workspace; não criar um repositório aninhado em `notas-api/`.
- **package.json com "type":"module"**: habilita ESM (import/export) nativo no Node.
- **Dependências**: `zod` (validação em runtime); dev: `typescript`, `tsx` (executa TS direto), `@types/node` (tipos do Node).
- **tsconfig.json**: target ES2022; module/moduleResolution NodeNext (resolução ESM do Node); `strict`, `esModuleInterop`, `skipLibCheck`, `forceConsistentCasingInFileNames` ligados; `outDir` dist, `rootDir` src, `include` ["src"].
- **Scripts npm**: `dev` (tsx src/index.ts), `cli` (tsx src/cli.ts), `test` (runner nativo do Node com tsx em `src/**/*.test.ts`), `typecheck` (tsc --noEmit).
- **.gitignore**: node_modules, .env, .env.*, dist.
- **Restrição**: não criar arquivos em src/ ainda.
- **Verificação**: rodar `npm run typecheck`.

## Prompt original
Crie o esqueleto de um Projeto Node.js chamado notas-api dentro da pasta `notas-api/` na raiz do workspace. Coloque código e arquivos de configuração do projeto nessa pasta; mantenha `specs/` na raiz do workspace. Reutilize o repositório Git existente na raiz do workspace e não crie um repositório aninhado.
- git inicializado (reutilize o repositório existente na raiz do workspace; não rode `git init` em `notas-api/`)
- package.json com "type":"module"
- dependencias: zod; dev: typescript, tsx, @types/node
- tsconfig.json com target ES2022, module e moduleResolution NodeNext, strict, esModuleInterop, skipLibCheck e forceConsistentCasingInFileNames true, outDir dist, rootDir src, include ["src"]
- scripts npm: dev = "tsx src/index.ts", cli = "tsx src/cli.ts"; test = "node --import tsx --test \"src/**/*.test.ts\""; typecheck = "tsc --noEmit";
- .gitignore cobrindo node_modules, .env, .env.*, dist;
Não crie nenhum arquivo em src/ ainda. Ao final, rode npm run typecheck para confirmar que está tudo válido.

Adicione este prompt em `notas-api/prompts/` de forma ordenada, e adicione um arquivo por prompt, explicando previamente cada item pedido.
