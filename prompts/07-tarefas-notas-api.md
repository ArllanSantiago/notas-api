# Prompt 07 - Criar tarefas de uma feature

## Explicação prévia dos itens pedidos
- **Formato**: skill do agente em `.github/skills/tarefas/SKILL.md` (e não arquivo de prompt em `.github/prompts/`), com frontmatter `name` e `description`.
- **Entradas**: ler `spec.md` e `plan.md` da feature indicada pelo número ou caminho.
- **Arquivo de saída**: `tasks.md` da feature.
- **Formato das tarefas**: lista numerada com checkbox, critério claro de conclusão e dependências declaradas quando houver.
- **Ordenação e escopo**: ordenar por dependência e não implementar as tarefas.

## Prompt original
Crie a skill .github/skills/tarefas/SKILL.md com o conteúdo a seguir:

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
