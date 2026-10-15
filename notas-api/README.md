# notas-api

Projeto Node.js + TypeScript (ESM) para uma API de notas.

## Stack
- Node.js 20+ (recomendado), TypeScript, [tsx](https://tsx.is) para execução direta
- [zod](https://zod.dev) para validação
- Runner de testes nativo do Node (`node --test`)

## Instalação
Execute os comandos a partir da pasta `notas-api/`.

```bash
npm install
```

## Scripts
| Comando | Descrição |
|---|---|
| `npm run dev` | Executa `src/index.ts` com tsx |
| `npm run cli` | Executa `src/cli.ts` com tsx (arquivo ainda não criado) |
| `npm test` | Roda os testes `src/**/*.test.ts` |
| `npm run typecheck` | Verifica tipos com `tsc --noEmit` |

## Estrutura
```
workspace/
├── specs/       # especificações e constituição do projeto
└── notas-api/
    ├── prompts/ # prompts usados na construção do projeto, em ordem
    ├── src/     # código-fonte (ponto de entrada: index.ts)
    ├── tsconfig.json
    └── package.json
```

## Configuração
Variáveis de ambiente devem ficar em `.env` (ignorado pelo git).

## Notas
- `tsconfig.json`: ES2022, NodeNext, `strict`, `rootDir` = `src`, `outDir` = `dist`.
- Em imports relativos, use a extensão `.js` (exigência do NodeNext), ex.: `import { x } from "./x.js"`.
