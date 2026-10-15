# Plano técnico - 002 Tratamento de Erros HTTP e CLI

## Objetivo

Formalizar e testar o mapeamento de erros existentes nas bordas HTTP e CLI, corrigindo a exposição de detalhes técnicos na CLI sem alterar regras de negócio nem formatos de sucesso.

## Arquitetura

Dependências mantidas: `http/cli -> service -> store`; erros de domínio continuam definidos no domínio e não dependem das interfaces.

| Camada | Arquivos | Alterações planejadas |
| --- | --- | --- |
| Domínio | `notas-api/src/domain/errors.ts` | Manter `TaskNotFoundError` como erro de domínio; sem mudança de regra ou nova classe prevista. |
| Serviço | `notas-api/src/service/task-service.ts` | Sem alteração: continua lançando `TaskNotFoundError` para tarefa inexistente em conclusão/remoção. |
| HTTP | `notas-api/src/http/tasks.ts`, `notas-api/src/http/server.ts` | Consolidar e verificar mapeamento de falhas HTTP, preservando status/códigos definidos e evitando que detalhe interno chegue ao cliente. |
| CLI | `notas-api/src/cli.ts` | Separar mensagem pública de diagnóstico inesperado: a interface imprime somente mensagem genérica no `stderr`, mantém código de saída `1` e encaminha o erro original a um destino diagnóstico interno, sem escrevê-lo nos streams do usuário. |
| Testes | `notas-api/src/http/tasks.test.ts`, `notas-api/src/cli.test.ts` | Adicionar casos de contrato de erro e regressão para garantir que mensagens genéricas não incluam detalhes técnicos. |

Não alterar `src/store`, modelos de tarefa ou contratos de sucesso. Não criar novas categorias de erro de domínio.

## Modelo de dados e erros

Não há mudança nos dados de tarefa. Formas públicas relevantes:

- Erro HTTP: `{ "error": { "code": string, "message": string } }`.
- `TaskNotFoundError`: falha de domínio para UUID válido sem tarefa correspondente.
- Entradas inválidas: JSON/campos/filtros/IDs malformados; são rejeitadas na borda e não viram erros de domínio.
- Falha inesperada: erro técnico não previsto, tratado como erro interno na borda, sem expor sua causa ao consumidor.
- Erro de corpo excedente: categoria de transporte com resposta HTTP própria (`413`), não erro de domínio.

## Contratos

### HTTP

| Cenário | Resposta |
| --- | --- |
| JSON malformado, título/filtro inválido ou ID não UUID | `400`; código `VALIDATION_ERROR`; corpo JSON padronizado |
| Corpo acima do limite de requisição | `413`; código `PAYLOAD_TOO_LARGE`; mensagem apropriada |
| UUID válido de tarefa inexistente em conclusão/remoção | `404`; código `NOT_FOUND`; mensagem de tarefa não encontrada |
| Rota inexistente ou método não suportado | `404`; código `NOT_FOUND` |
| Falha inesperada | `500`; código `INTERNAL_ERROR`; mensagem genérica sem causa técnica |

As respostas de sucesso permanecem inalteradas. Erros com corpo usam JSON; remoção bem-sucedida mantém a resposta `204` sem corpo.

### CLI

Os comandos permanecem `add --title <título>`, `list [--status all|open|done]`, `complete <id>` e `delete <id>`.

| Cenário | `stdout` | `stderr` | Exit code |
| --- | --- | --- | --- |
| Uso, argumentos ou validação inválidos | Sem resultado de sucesso | Mensagem apropriada ao problema | `1` |
| UUID válido sem tarefa correspondente | Sem resultado de sucesso | Mensagem de tarefa não encontrada | `1` |
| Falha inesperada | Sem resultado de sucesso | Mensagem genérica, sem detalhe técnico | `1` |
| Falha inesperada com diagnóstico interno | Sem dado diagnóstico no stream público | Sem detalhe técnico; causa encaminhada ao destino diagnóstico interno | `1` |
| Sucesso | Formato JSON existente | Sem mensagem de falha | `0` |

O destino diagnóstico deve ser distinto dos streams públicos da CLI. A feature não define nem adiciona uma plataforma geral de logging.

## Decisões e trade-offs

- Preservar a autonomia dos contratos: HTTP possui códigos de status e identificadores; CLI possui mensagens e exit code. Não exigir texto/código idêntico entre as interfaces.
- Manter o tratamento de `TaskNotFoundError` nas bordas; não capturar nem converter essa exceção dentro do serviço.
- Manter mensagem genérica para falhas inesperadas e registrar/encaminhar a causa separadamente, para equilibrar segurança do usuário e capacidade de diagnóstico.
- Preservar o mapeamento HTTP já existente onde ele cumpre a spec; concentrar mudanças de comportamento na separação entre saída pública e diagnóstica da CLI.
- Tratar métodos não suportados como `404`, como define a spec atual, mesmo que outras APIs frequentemente usem `405`; não mudar o contrato sem revisão da spec.

## Estratégia de teste (`node:test`)

1. **HTTP — entradas e transporte:** confirmar `400/VALIDATION_ERROR` para JSON malformado, título/filtro inválido e ID inválido; confirmar `413/PAYLOAD_TOO_LARGE` quando o limite é excedido.
2. **HTTP — domínio e roteamento:** confirmar `404/NOT_FOUND` para conclusão/remoção de tarefa inexistente, rota inexistente e método não suportado.
3. **HTTP — inesperado:** injetar uma falha técnica com mensagem sentinela no serviço; confirmar `500/INTERNAL_ERROR` e garantir que o corpo não contém a mensagem sentinela.
4. **CLI — previsíveis:** cobrir uso/argumentos, validação, ID inválido e tarefa inexistente; verificar `stdout` vazio, mensagem apropriada em `stderr` e exit code `1`.
5. **CLI — inesperado:** injetar erro técnico com mensagem sentinela; verificar que o usuário recebe somente mensagem genérica, o código original é enviado ao destino diagnóstico separado e o exit code é `1`.
6. **Regressão:** confirmar que operações bem-sucedidas mantêm suas saídas e códigos (`0`/HTTP existente); executar `npm test` e `npm run typecheck` no diretório `notas-api/`.

## Riscos e pontos para decisão humana

1. **Destino diagnóstico interno da CLI:** atualmente não há logger configurado na aplicação, e o `console.error` existente escreve no `stderr` visível ao usuário. A implementação precisa conectar um destino diagnóstico que não seja o stream público. A decisão sobre a infraestrutura concreta (por exemplo, logger externo ao processo, sink configurável ou outro mecanismo operacional) deve ser tomada antes da tarefa correspondente; não usar o `stderr` da CLI para detalhes técnicos.
2. **Status de método não suportado:** a spec fixa `404`, diferentemente da convenção `405` usada por algumas APIs. O plano preserva `404`; qualquer mudança precisa voltar à revisão da spec.
