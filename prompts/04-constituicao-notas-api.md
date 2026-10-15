# Prompt 04 - Constituição da Notas API

## Explicação prévia dos itens pedidos
- **Arquivo**: `specs/constitution.md` na raiz do workspace, para registrar os princípios não-negociáveis do projeto.
- **Princípios**: camadas explícitas, validação com zod na fronteira, erros de domínio, testes, segurança por padrão, spec antes de código e tarefas pequenas e reversíveis.
- **Stack obrigatória**: Node 22, TypeScript ESM strict, zod, node:test via tsx e node:http.

## Prompt original
Crie um arquivo NOVO em specs/constitution.md na raiz do workspace com o conteúdo que vou ditar.
Não altere nenhum arquivo existente.

# Constitution - Notas API

Princípios não-negociáveis que toda spec, plan, tarefa e código seguem.

1. Camadas explícitas. Dependências fluem http/cli -> service -> store. Domínio não faz IO.
2. Validação na fronteira. Toda entrada externa é validada com zod antes de virar domínio.
3. Erros são de domínio. Falhas previsíveis viram classes de erro, traduzidas em status/saída na borda.
4. Teste é parte da tarefa. Nenhuma lógica nova entra sem teste. typecheck e test sempre verdes.
5. Segurança por padrão. Sem segredos no repo. Ações destrutivas passam por guardrails (deny list + pre-commit), não pela confiança no modelo.
6. Spec antes de código. Mudanças relevantes passam por spec -> plan -> tasks -> implementar, com revisão humana entre as fases.
7. Pequeno e reversível. Cada tarefa cabe em um commit.

## Stack obrigatória

Node 22, TypeScript ESM strict, zod, node:test via tsx, node:http.
