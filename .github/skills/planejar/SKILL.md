---
name: planejar
description: Gera o plano técnico (COMO) a partir de uma spec existente. Use quando precisar planejar a implementação de uma feature já especificada.
---

Gere o PLANO TÉCNICO da feature indicada (o texto após o comando é o número ou o caminho).

- Localize e leia a spec da feature indicada (pelo número, slug ou caminho) e `specs/constitution.md`.
- As specs seguem o padrão `specs/<NNN>-<slug>/<NNN>-<slug>-spec.md`. Para o plano, preserve o diretório, prefixo e slug, substituindo somente `-spec.md` por `-plan.md` (por exemplo, `003-relatorios-spec.md` -> `003-relatorios-plan.md`).
- Não crie nomes genéricos `plan.md`; se os artefatos existentes da feature ainda estiverem em formato genérico, renomeie-os para o padrão antes de prosseguir.
- O plano deve conter:
  1. Arquitetura - camadas/arquivos criados ou alterados (http/cli -> service -> store).
  2. Modelo de dados - tipos e schemas zod.
  3. Contratos - rotas HTTP e/ou comandos de CLI, com entrada/saída.
  4. Decisões e trade-offs.
  5. Estratégia de teste (node:test).
- Não implemente nada ainda. Aponte riscos e pontos que precisam de decisão humana.