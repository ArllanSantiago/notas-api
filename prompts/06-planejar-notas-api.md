# Prompt 06 - Planejar uma feature

## Explicação prévia dos itens pedidos
- **Formato**: skill do agente em `.github/skills/planejar/SKILL.md` (e não arquivo de prompt em `.github/prompts/`), com frontmatter `name` e `description`.
- **Entradas**: usar o número ou caminho indicado após o comando; ler a spec da feature e `specs/constitution.md` na raiz do workspace.
- **Arquivo de saída**: criar `plan.md` na mesma pasta da spec.
- **Conteúdo do plano**: arquitetura e camadas, modelo de dados com tipos e schemas zod, contratos HTTP/CLI, decisões e trade-offs, e estratégia de testes com `node:test`.
- **Limite**: não implementar ainda; destacar riscos e pontos que precisam de decisão humana.

## Prompt original
Crie a skill .github/skills/planejar/SKILL.md com o conteúdo a seguir:

---
name: planejar
description: Gera o plano técnico (COMO) a partir de uma spec existente. Use quando precisar planejar a implementação de uma feature já especificada.
---

Gere o PLANO TÉCNICO da feature indicada (o texto após o comando é o número ou o caminho).

- Leia o `spec.md` da feature e `specs/constitution.md`.
- Crie `plan.md` na mesma pasta da spec, contendo:
  1. Arquitetura - camadas/arquivos criados ou alterados (http/cli -> service -> store).
  2. Modelo de dados - tipos e schemas zod.
  3. Contratos - rotas HTTP e/ou comandos de CLI, com entrada/saída.
  4. Decisões e trade-offs.
  5. Estratégia de teste (node:test).
- Não implemente nada ainda. Aponte riscos e pontos que precisam de decisão humana.
