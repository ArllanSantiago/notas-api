# Constituion - Notas API

Principios não-negociaveis que toda spec, plan tarefa e  codigo seguem.
1. Camadas explicitas. Dependências fluem http/cli -> service -> store. Domínio não faz IO.
2. Validações na  fronteira. Toda entra  externa é validada com zod antes de virar dominio.
3. Erros são de domínio. Falhas previsíveis viram classes de erro, traduzidas em status/saída na borda.
4. Teste é parte da tarefa. Nenhuma lógica nova entra sem teste. typecheck e test  sempre verdes.
5. Segurança por padrão. Sem segredos no repo. Ações destrutivas passam por guardrails(deny list + pre-commit), não pela confiança no model.
6. Spec antes de código. Mudanças relevantes passam por spec -> plan ->  task  -> implament, com revisão humana entre as fases.
7. Pequeno e reversível. Cada  tarefa cabe em um commit

## Stack obrigatória

Node 22, Typescript ESM strict,  zod, node:test via tsx, note:http