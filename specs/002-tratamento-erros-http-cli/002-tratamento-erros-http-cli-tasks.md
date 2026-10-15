# Tarefas - 002 Tratamento de Erros HTTP e CLI

Implemente na ordem de dependência abaixo; cada tarefa deve formar uma fatia revisável e testável.

1. - [x] **Cobrir contratos de erro HTTP**
   - Acrescentar testes de integração para erros de validação, corpo acima do limite, tarefa inexistente, rota inexistente, método não suportado e falha inesperada.
   - Para falha inesperada, usar mensagem técnica sentinela e verificar que o cliente recebe `500/INTERNAL_ERROR` sem essa mensagem.
   - Ajustar o handler somente se os resultados observados não corresponderem à spec.
   - **Dependências:** nenhuma.
   - **Pronto quando:** 9 testes de integração verificam status, código e corpo dos cenários HTTP; 32 testes da suíte completa e `npm run typecheck` passam.

2. - [x] **Separar diagnóstico interno da saída da CLI**
   - Introduzir uma interface/callback injetável para diagnóstico de falhas inesperadas e ligá-la ao ponto de entrada da CLI sem encaminhar detalhes técnicos para `stdout` ou `stderr` públicos.
   - Preservar mensagens de uso/validação e de tarefa inexistente, além do código de saída `1` para falhas.
   - Adicionar testes que injetem erro com mensagem sentinela, confirmem mensagem genérica na saída pública e verifiquem que o erro original chega ao callback de diagnóstico.
   - **Dependências:** nenhuma.
   - **Pronto quando:** teste CLI comprova isolamento de streams, mensagem genérica, callback de diagnóstico e exit code `1`; 33 testes da suíte completa e `npm run typecheck` passam.

3. - [x] **Completar testes de contrato para falhas previsíveis da CLI**
   - Cobrir sintaxe e argumentos inválidos, título/filtro inválido, ID que não seja UUID e UUID válido sem tarefa correspondente.
   - Confirmar que cada falha escreve uma mensagem apropriada em `stderr`, não imprime JSON de sucesso em `stdout` e retorna código `1`.
   - Manter testes de sucesso existentes para garantir que seus contratos não mudem.
   - **Dependências:** tarefa 2.
   - **Pronto quando:** testes verificam sintaxe, título/filtro inválido, ID inválido e tarefa inexistente; 34 testes da suíte completa e `npm run typecheck` passam.

4. - [x] **Executar validação de regressão**
   - Executar testes e typecheck completos a partir de `notas-api/`.
   - Confirmar que os testes HTTP e CLI mantêm os contratos de sucesso existentes.
   - **Dependências:** tarefas 1, 2 e 3.
   - **Pronto quando:** `npm test` passou com 34 testes, `npm run typecheck` passou e a CLI real foi verificada em sucesso (`0`) e falha (`1`).
