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