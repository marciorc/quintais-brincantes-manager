# K6 Performance Tests - quintais-brincantes-manager

Este diretório contém os testes de performance da API usando [k6](https://k6.io/).  
Os testes estão localizados em `apps/api/k6-tests/scripts/`.

---

## Estrutura dos testes

- `smoke-tests.js` — Teste rápido para validar endpoints principais.
- `load-test.js` — Teste de carga com múltiplos VUs e stages.
- Outros testes podem ser adicionados na mesma pasta `scripts/`.

---

## Pré-requisitos

- Node.js instalado (para o backend).
- API rodando localmente, por exemplo na porta `3001`.
- [k6](https://k6.io/docs/getting-started/installation/) instalado.

- Variável de ambiente para autenticação:  
  - `SUPERUSER_PASSWORD` — senha do superuser da API.

> ⚠️ Lembre-se: o k6 **não roda com `process.env`**. Use `__ENV` para variáveis de ambiente.

---

## Configurando a variável de ambiente

No Linux/Ubuntu, você pode exportar a senha temporariamente ou passar direto no comando:

```bash
# Passando direto no comando
SUPERUSER_PASSWORD="SUPERUSER_PASSWORD" k6 run scripts/smoke-tests.js
```

**Se houver caracteres que o shell interpreta (`$`, `!`, etc.), coloque entre aspas duplas ou escape com `\`.**