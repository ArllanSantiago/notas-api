# Prompt 03 - Instruções específicas para src/service

## Explicação prévia
- **Arquivo**: `notas-api/.github/instructions/service.instructions.md`, instruções que só se aplicam a arquivos casando com `applyTo`.
- **applyTo**: `notas-api/src/service/**`, restringe as regras à camada de service.
- **Regras**: funções puras onde possível; nunca importar de `src/http` (respeita a regra de camadas).
- **Ajuste**: o frontmatter foi escrito com `---` (o prompt trazia `--`, que não seria reconhecido).

## Prompt original
Crie o arquivo notas-api/.github/instructions/service.instructions.md com as instruções a seguir:

---
applyTo: "notas-api/src/service/**"
---
Regras de service: funções puras onde possível; nunca importar de src/http.
