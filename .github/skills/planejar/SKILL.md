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