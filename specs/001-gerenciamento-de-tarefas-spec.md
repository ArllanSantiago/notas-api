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
- RF-10: HTTP e CLI devem aplicar as mesmas regras e produzir resultados equivalentes sobre os mesmos dados.

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
- Quando uma operação for feita por HTTP ou CLI, o sistema deve refletir o resultado na outra interface.

## 5. Fora de Escopo
- Autenticação e múltiplos usuários.
- Edição do título.
- Reabrir tarefa concluída.
- Prazos, prioridades, tags e busca textual.
- Paginação e ordenação customizada.

## 6. Questões em Aberto
- Limite máximo de tamanho do título?
- Concluir tarefa já concluída deve ser sucesso silencioso (assumido aqui) ou erro?
- Identificadores removidos podem ser reutilizados?
- Remoção deve ser definitiva (assumido) ou lógica?
- O estado é compartilhado entre HTTP e CLI (assumido pelo RF-10) ou cada um tem o seu?
