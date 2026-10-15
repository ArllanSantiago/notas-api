# Prompt 08 - Implementar tarefas de uma feature

## Explicação prévia dos itens pedidos
- **Formato**: skill do agente em `.github/skills/implementar/SKILL.md` (e não arquivo de prompt em `.github/prompts/`), com frontmatter `name` e `description`.
- **Entrada**: usar `tasks.md` da feature indicada pelo texto após o comando.
- **Execução**: implementar uma tarefa por vez, respeitando dependências, `plan.md`, instructions e constitution.
- **Validação**: atualizar testes e rodar `npm run test` e `npm run typecheck`; só marcar a tarefa concluída quando ambos estiverem verdes.
- **Limite**: parar após uma fatia coesa para pedir revisão; não desativar testes ou tipos e parar para avisar se a spec estiver errada.

## Prompt original
Crie a skill .github/skills/implementar/SKILL.md com o conteúdo a seguir:

---
name: implementar
description: Implementa as tarefas pendentes de tasks.md uma a uma, com testes. Use quando precisar implementar uma feature que já tem tasks.md.
---

Implemente as tarefas de `tasks.md` da feature indicada (texto após o comando).

Uma tarefa por vez:

1. Escolha a próxima "- [ ]" cujas dependências já estão prontas.
2. Implemente seguindo o `plan.md`, as instructions e a constitution.
3. Escreva/atualize testes e rode `npm run test` e `npm run typecheck`.
4. Só marque "- [x]" quando estiver verde.
5. Pare ao concluir uma fatia coesa e peça revisão.

Nunca desative testes/tipos para "passar". Se a spec estiver errada, pare e avise.
