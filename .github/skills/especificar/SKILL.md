---
name: especificar
description: Cria a especificação (O QUE e POR QUÊ) de uma feature, sem código. Use quando precisar especificar uma nova feature.
---

Escreva uma ESPECIFICAÇÃO para a feature descrita pelo usuário.

Regras:

- Leia `specs/constitution.md` na raiz do workspace e respeite todos os princípios.
- NÃO escreva código nem decisões de implementação.
- Determine o próximo número livre de três dígitos examinando os diretórios `specs/<NNN>-<slug>/`; não reutilize números existentes. Normalize o slug em minúsculas e kebab-case.
- Crie a spec em `specs/<NNN>-<slug>/<NNN>-<slug>-spec.md`. O diretório e o nome-base do arquivo devem usar exatamente o mesmo prefixo numerado e slug. Exemplo: `specs/003-relatorios/003-relatorios-spec.md`.
- Todos os artefatos da feature devem permanecer nesse diretório: `...-spec.md`, `...-plan.md` e `...-tasks.md`. Não crie arquivos genéricos `spec.md`, `plan.md` ou `tasks.md`.
- Inclua:
  1. Contexto/Problema.
  2. User Stories ("Como <papel>, quero <objetivo>, para <benefício>").
  3. Requisitos funcionais numerados (RF-1...).
  4. Critérios de aceite em EARS ("Quando <evento>, o sistema deve <resposta>").
  5. Fora de Escopo.
  6. Questões em aberto.
- Se algo estiver ambíguo, PERGUNTE antes de finalizar.