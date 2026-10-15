---
name: tarefas
description: Quebra o plano em tarefas pequenas, ordenadas e testáveis. Use quando precisar gerar o artefato numerado de tarefas de uma feature com plano pronto.
---

Gere o artefato `<NNN>-<slug>-tasks.md` da feature indicada (o texto após o comando é o número ou caminho).

- Localize a pasta numerada da feature pelo número, slug ou caminho e leia `<NNN>-<slug>-spec.md` e `<NNN>-<slug>-plan.md`.
- Salve a lista na mesma pasta como `<NNN>-<slug>-tasks.md`; preserve exatamente o prefixo e o slug usados pela spec e pelo plano.
- Não crie `tasks.md` genérico; se um artefato anterior ainda usar esse nome, renomeie-o para o padrão antes de prosseguir.
- Gere uma lista numerada em que cada tarefa:
  - é pequena o suficiente para um único commit;
  - tem critério claro de "pronto" (ex: teste X passou);
  - declara dependências, quando houver;
  - começa com "- [ ]" para marcarmos o progresso.
- Ordene por dependência. Não implemente nada.