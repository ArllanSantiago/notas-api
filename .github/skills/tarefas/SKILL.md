---
name: tarefas
description: Quebra o plano em tarefas pequenas, ordenadas e testáveis. Use quando precisar gerar o tasks.md de uma feature com plano pronto.
---

Gere o `tasks.md` da feature indicada (o texto após o comando é o número ou caminho).

- Leia `spec.md` e `plan.md` da feature.
- Gere uma lista numerada em que cada tarefa:
  - é pequena o suficiente para um único commit;
  - tem critério claro de "pronto" (ex: teste X passou);
  - declara dependências, quando houver;
  - começa com "- [ ]" para marcarmos o progresso.
- Ordene por dependência. Não implemente nada.