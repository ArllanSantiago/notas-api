# 001 - Gerenciamento de Tarefas

## 1. Contexto/Problema
Usuários precisam registrar e acompanhar tarefas pessoais de forma simples. Hoje não há como criar, consultar, concluir ou descartar tarefas. A capacidade deve estar disponível tanto por HTTP (integração com outros sistemas) quanto por CLI (uso direto no terminal), com comportamento equivalente.

## 2. User Stories
- Como usuário, quero criar uma tarefa com um título, para registrar o que preciso fazer.
- Como usuário, quero listar todas as tarefas, apenas as abertas ou apenas as concluídas, para focar no que importa.
- Como usuário, quero concluir uma tarefa, para marcar o trabalho como feito.
- Como usuário, quero remover uma tarefa, para eliminar itens que não fazem mais sentido.
- Como integrador, quero executar as mesmas operações via HTTP, para automatizar o fluxo.
- Como usuário de terminal, quero executar as mesmas operações via CLI, para trabalhar sem uma interface web.

## 3. Requisitos Funcionais
- RF-1: Criar tarefa informando um título.
- RF-2: Toda tarefa nova nasce como aberta e recebe um identificador único.
- RF-3: O título é obrigatório e não pode ser vazio ou composto só de espaços.
- RF-4: Listar tarefas com filtro `all` (padrão), `open` ou `done`.
- RF-5: Concluir uma tarefa existente pelo seu identificador.
- RF-6: Remover uma tarefa existente pelo seu identificador.
- RF-7: Operar sobre identificador inexistente deve resultar em erro de "não encontrado".
- RF-8: Todas as operações (RF-1, RF-4, RF-5, RF-6) estão disponíveis via HTTP.
- RF-9: Todas as operações (RF-1, RF-4, RF-5, RF-6) estão disponíveis via CLI.
- RF-10: HTTP e CLI devem aplicar as mesmas regras de negócio. Quando operarem sobre a mesma instância de serviço/store, devem produzir resultados equivalentes; não há requisito de compartilhamento ou persistência de dados entre processos independentes.

## 4. Critérios de Aceite (EARS)
- Quando o usuário criar uma tarefa com título válido, o sistema deve registrá-la como aberta e devolver seus dados, incluindo o identificador.
- Quando o usuário criar uma tarefa com título vazio ou só com espaços, o sistema deve rejeitar o pedido com erro de validação e não criar a tarefa.
- Quando o usuário listar sem filtro ou com `all`, o sistema deve retornar todas as tarefas.
- Quando o usuário listar com `open`, o sistema deve retornar somente tarefas abertas.
- Quando o usuário listar com `done`, o sistema deve retornar somente tarefas concluídas.
- Quando o usuário informar um filtro diferente de `all`, `open` ou `done`, o sistema deve rejeitar o pedido com erro de validação.
- Quando o usuário concluir uma tarefa existente, o sistema deve marcá-la como concluída e devolver seus dados.
- Quando o usuário concluir uma tarefa já concluída, o sistema deve manter o estado concluído sem erro.
- Quando o usuário remover uma tarefa existente, o sistema deve excluí-la, e ela não deve mais aparecer em listagens.
- Quando o usuário concluir ou remover um identificador inexistente, o sistema deve responder com erro de "não encontrado".
- Quando uma operação falhar na CLI, o sistema deve exibir a mensagem de erro e encerrar com código de saída diferente de zero.
- Quando uma operação for bem-sucedida na CLI, o sistema deve encerrar com código de saída zero.
- Quando HTTP e CLI operarem sobre a mesma instância de serviço/store, uma operação feita por uma interface deve ser refletida na outra.
- Títulos válidos devem ter no máximo 255 caracteres; espaços em branco no início e no fim devem ser removidos antes do armazenamento.
- Identificadores devem ser UUIDs gerados com `node:crypto`; a remoção é definitiva e UUIDs removidos não são reutilizados.
- A CLI deve oferecer `add --title <título>`, `list [--status all|open|done]`, `complete <id>` e `delete <id>`. Todos os sucessos imprimem JSON; falhas imprimem mensagem em `stderr` e resultam em código de saída diferente de zero.

## 5. Fora de Escopo
- Autenticação e múltiplos usuários.
- Edição do título.
- Reabrir tarefa concluída.
- Prazos, prioridades, tags e busca textual.
- Paginação e ordenação customizada.

## 6. Decisões de Escopo
- O título tem limite máximo de 255 caracteres; espaços externos são removidos antes de persistir.
- Concluir uma tarefa já concluída é idempotente e retorna sucesso.
- Identificadores são UUIDs; remoção é definitiva e identificadores removidos não são reutilizados.
- RF-10 trata de equivalência de regras sobre uma mesma instância. O store em memória não compartilha dados entre processos independentes; persistência entre execuções está fora do escopo.
- A CLI usa os comandos e formatos de saída descritos no RF-9 e nos critérios de aceite acima.
