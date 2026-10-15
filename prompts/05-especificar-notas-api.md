# Prompt 05 - Especificar uma feature

## Explicação prévia dos itens pedidos
- **Formato**: skill do agente em `.github/skills/especificar/SKILL.md` (e não arquivo de prompt em `.github/prompts/`), com frontmatter `name` e `description`.
- **Escopo**: descreve O QUE e POR QUÊ, sem código nem decisões de implementação.
- **Constituição**: deve ser lida em `specs/constitution.md`, na raiz do workspace, e seus princípios devem ser respeitados.
- **Arquivo de saída**: criar `specs/<NNN>-<slug>/spec.md` na raiz do workspace, usando o próximo número livre.
- **Conteúdo**: contexto/problema, user stories, requisitos funcionais, critérios de aceite EARS, fora de escopo e questões em aberto.
- **Ambiguidade**: perguntar antes de finalizar quando houver algo ambíguo.

## Prompt original
Crie a skill .github/skills/especificar/SKILL.md com o conteúdo a seguir:

---
name: especificar
description: Cria a especificação (O QUE e POR QUÊ) de uma feature, sem código. Use quando precisar especificar uma nova feature.
---

Escreva uma ESPECIFICAÇÃO para a feature descrita pelo usuário.

Regras:

- Leia `specs/constitution.md` na raiz do workspace e respeite todos os princípios.
- NÃO escreva código nem decisões de implementação.
- Crie `specs/<NNN>-<slug>/spec.md` na raiz do workspace (próximo número livre) com:
  1. Contexto/Problema.
  2. User Stories ("Como <papel>, quero <objetivo>, para <benefício>").
  3. Requisitos funcionais numerados (RF-1...).
  4. Critérios de aceite em EARS ("Quando <evento>, o sistema deve <resposta>").
  5. Fora de Escopo.
  6. Questões em aberto.
- Se algo estiver ambíguo, PERGUNTE antes de finalizar.
