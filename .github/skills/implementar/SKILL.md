---
name: implementar
description: Implementa as tarefas pendentes do artefato numerado de tarefas, uma a uma, com testes. Use quando precisar implementar uma feature que já tem plano e lista de tarefas.
---

Implemente as tarefas de `<NNN>-<slug>-tasks.md` da pasta numerada da feature indicada (texto após o comando). A pasta e os três artefatos devem seguir `specs/<NNN>-<slug>/<NNN>-<slug>-{spec,plan,tasks}.md`.

Uma tarefa por vez:

1. Escolha a próxima "- [ ]" cujas dependências já estão prontas.
2. Implemente seguindo `<NNN>-<slug>-plan.md`, as instructions e `specs/constitution.md`.
3. Escreva/atualize testes e rode `npm run test` e `npm run typecheck`.
4. Só marque "- [x]" quando estiver verde.
5. Pare ao concluir uma fatia coesa e peça revisão.

Nunca desative testes/tipos para "passar". Se a spec estiver errada, pare e avise.