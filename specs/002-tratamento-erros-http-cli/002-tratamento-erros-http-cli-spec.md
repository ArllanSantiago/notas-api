# 002 - Tratamento de Erros HTTP e CLI

## 1. Contexto/Problema

A API HTTP e a CLI oferecem as mesmas operações de tarefas, mas precisam comunicar falhas de maneira previsível e segura em suas respectivas interfaces. Erros de entrada e de domínio devem ser distinguíveis de falhas inesperadas, sem revelar detalhes internos ao consumidor.

Esta feature especifica o comportamento observável dos erros nas duas interfaces. Não altera regras de negócio nem os resultados de operações bem-sucedidas.

## 2. User Stories

- Como integrador HTTP, quero receber respostas de erro estruturadas e com status apropriado, para tratar falhas sem interpretar detalhes internos.
- Como usuário da CLI, quero receber uma mensagem de erro e um código de saída diferente de zero quando um comando falhar, para identificar que a operação não foi concluída.
- Como operador, quero que falhas inesperadas não revelem detalhes técnicos ao consumidor, para evitar exposição acidental de informação interna.

## 3. Requisitos Funcionais

- RF-1: A API HTTP deve representar erros com corpo no formato JSON `{ "error": { "code": string, "message": string } }`.
- RF-2: Erros HTTP de entrada inválida, incluindo JSON malformado, título inválido, filtro inválido ou ID que não seja UUID, devem usar status `400` e código `VALIDATION_ERROR`.
- RF-3: Um corpo HTTP acima do limite aceito deve resultar em status `413` e código `PAYLOAD_TOO_LARGE`.
- RF-4: Um UUID válido que não identifique uma tarefa existente deve resultar em status `404` e código `NOT_FOUND`.
- RF-5: Uma rota inexistente ou um método não suportado para uma rota deve resultar em status `404` e código `NOT_FOUND`.
- RF-6: Uma falha HTTP inesperada deve resultar em status `500` e código `INTERNAL_ERROR`; a mensagem retornada ao cliente deve ser genérica e não revelar detalhes técnicos.
- RF-7: A CLI deve enviar mensagens de falha para `stderr` e terminar com código de saída `1` para argumentos inválidos, entradas inválidas, IDs inválidos, tarefas inexistentes ou falhas inesperadas.
- RF-8: Falhas de uso ou de validação da CLI devem apresentar uma mensagem apropriada ao problema. Um ID válido sem tarefa correspondente deve apresentar a mensagem de erro de domínio de tarefa não encontrada.
- RF-9: Uma falha inesperada na CLI deve apresentar somente uma mensagem genérica ao usuário, sem incluir detalhes técnicos na saída da CLI.
- RF-10: A CLI deve manter as informações de diagnóstico de falhas inesperadas disponíveis para operação interna, sem as expor na mensagem apresentada ao usuário.
- RF-11: As operações bem-sucedidas devem manter os contratos existentes de status, saída e código de saída zero.

## 4. Critérios de Aceite (EARS)

- Quando a API receber JSON malformado, título inválido, filtro inválido ou ID em formato inválido, o sistema deve responder com status `400`, código `VALIDATION_ERROR` e corpo no formato de erro definido.
- Quando a API receber um corpo acima do limite aceito, o sistema deve responder com status `413`, código `PAYLOAD_TOO_LARGE` e mensagem apropriada.
- Quando a API tentar concluir ou remover um UUID válido sem tarefa correspondente, o sistema deve responder com status `404`, código `NOT_FOUND` e mensagem de tarefa não encontrada.
- Quando a API receber uma rota inexistente ou método não suportado, o sistema deve responder com status `404`, código `NOT_FOUND`.
- Quando ocorrer uma falha inesperada durante uma requisição HTTP, o sistema deve responder com status `500` e código `INTERNAL_ERROR`, sem incluir a causa técnica na resposta.
- Quando o usuário fornecer argumentos inválidos, sintaxe incorreta, título inválido, filtro inválido ou ID inválido à CLI, o sistema deve imprimir uma mensagem apropriada em `stderr`, não imprimir resultado de sucesso em `stdout` e terminar com código `1`.
- Quando o usuário fornecer um UUID válido de tarefa inexistente à CLI, o sistema deve imprimir uma mensagem de tarefa não encontrada em `stderr`, não imprimir resultado de sucesso em `stdout` e terminar com código `1`.
- Quando ocorrer uma falha inesperada na CLI, o sistema deve imprimir uma mensagem genérica em `stderr`, não revelar a causa técnica na saída apresentada ao usuário e terminar com código `1`.
- Quando ocorrer uma falha inesperada na CLI, o sistema deve preservar informação diagnóstica para operação interna, sem incorporá-la à mensagem apresentada ao usuário.
- Quando uma operação HTTP ou CLI for bem-sucedida, o sistema deve preservar o status ou código de saída zero e o formato de sucesso atualmente definido para a interface.

## 5. Fora de Escopo

- Alterar operações de tarefas, regras de domínio ou formatos de sucesso.
- Exigir que HTTP e CLI usem códigos de erro ou textos idênticos.
- Introduzir novas categorias de erro de negócio ou novas operações.
- Definir mecanismos de observabilidade, monitoramento ou transporte de logs.
- Alterar a localização/idioma das mensagens existentes.

## 6. Questões em Aberto

- Nenhuma questão bloqueadora identificada para especificar o comportamento descrito.
