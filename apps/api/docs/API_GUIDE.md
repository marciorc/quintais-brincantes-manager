# Guia Completo da API Quintais Brincantes

## Visão Geral

Esta API foi desenvolvida seguindo os princípios REST e oferece endpoints completos para gerenciamento de:

- **Responsáveis**: Pais ou responsáveis pelas crianças
- **Crianças**: Crianças cadastradas no sistema
- **Turmas**: Grupos/classes onde as crianças são organizadas
- **Administradores**: Usuários com acesso administrativo ao sistema

## Arquitetura

A API segue o padrão MVC (Model-View-Controller) adaptado para APIs REST:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Routes      │───▶│   Controllers   │───▶│    Services     │───▶│    Database     │
│  (Endpoints)    │    │   (HTTP Logic)  │    │ (Business Logic)│    │   (Prisma)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Validation    │    │     Helpers     │    │     Utils       │
│     (Joi)       │    │   (Responses)   │    │  (Encryption)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Padrões de Response

### Sucesso

```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "data": {
    // dados retornados
  }
}
```

### Erro

```json
{
  "success": false,
  "error": "Tipo do erro",
  "message": "Mensagem descritiva do erro",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "details": {
    // detalhes adicionais (opcional)
  }
}
```

### Paginação

```json
{
  "success": true,
  "message": "Dados encontrados com sucesso",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "data": {
    "data": [
      // array de itens
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

## Códigos de Status HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Operação bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 400 | Bad Request | Dados inválidos ou malformados |
| 401 | Unauthorized | Não autenticado |
| 403 | Forbidden | Não autorizado |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Conflito (ex: email já existe) |
| 500 | Internal Server Error | Erro interno do servidor |

## Modelos de Dados

### Responsavel

```json
{
  "id": 1,
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "contato": "(11) 99999-9999",
  "criancas": [
    {
      "id": 1,
      "nome": "João Silva",
      "dataNascimento": "15/03/2018"
    }
  ],
  "criadoEm": "2024-01-01T12:00:00.000Z"
}
```

### Crianca

```json
{
  "id": 1,
  "nome": "João Silva",
  "dataNascimento": "15/03/2018",
  "turmaId": 1,
  "turma": {
    "id": 1,
    "nome": "Turma A - Manhã"
  },
  "responsavelId": 1,
  "responsavel": {
    "id": 1,
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "contato": "(11) 99999-9999"
  },
  "criadoEm": "2024-01-01T12:00:00.000Z"
}
```

### Turma

```json
{
  "id": 1,
  "nome": "Turma A - Manhã",
  "criancas": [
    {
      "id": 1,
      "nome": "João Silva",
      "dataNascimento": "15/03/2018",
      "responsavel": {
        "id": 1,
        "nome": "Maria Silva",
        "email": "maria@email.com",
        "contato": "(11) 99999-9999"
      }
    }
  ],
  "criadoEm": "2024-01-01T12:00:00.000Z"
}
```

### Admin

```json
{
  "id": 1,
  "nome": "Administrador",
  "email": "admin@quintaisbrincantes.com",
  "criadoEm": "2024-01-01T12:00:00.000Z"
}
```

## Casos de Uso Comuns

### 1. Cadastrar Nova Família

```bash
# 1. Criar responsável
curl -X POST http://localhost:3001/api/responsaveis \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "contato": "(11) 99999-9999",
    "senha": "123456"
  }'

# 2. Criar criança vinculada ao responsável
curl -X POST http://localhost:3001/api/criancas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "dataNascimento": "15/03/2018",
    "responsavelId": 1
  }'
```

### 2. Organizar Turmas

```bash
# 1. Criar turma
curl -X POST http://localhost:3001/api/turmas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Turma A - Manhã"
  }'

# 2. Adicionar crianças à turma
curl -X POST http://localhost:3001/api/turmas/1/add-criancas \
  -H "Content-Type: application/json" \
  -d '{
    "criancaIds": [1, 2, 3]
  }'
```

### 3. Consultar Dados

```bash
# Listar crianças de uma turma
curl http://localhost:3001/api/criancas/turma/1

# Listar crianças de um responsável
curl http://localhost:3001/api/criancas/responsavel/1

# Buscar responsáveis por nome
curl "http://localhost:3001/api/responsaveis?search=maria"

# Listar com paginação
curl "http://localhost:3001/api/criancas?page=2&limit=20"
```

### 4. Obter Estatísticas

```bash
# Dashboard administrativo
curl http://localhost:3001/api/admins/dashboard

# Estatísticas de crianças
curl http://localhost:3001/api/criancas/statistics

# Estatísticas de turmas
curl http://localhost:3001/api/turmas/statistics
```

## Validações Detalhadas

### Responsável

#### Criação (POST)
- **nome**: Obrigatório, 2-100 caracteres
- **email**: Obrigatório, formato válido, único no sistema
- **contato**: Obrigatório, 8-20 caracteres
- **senha**: Obrigatório, mínimo 6 caracteres

#### Atualização (PUT)
- **nome**: Opcional, 2-100 caracteres
- **email**: Opcional, formato válido, único no sistema
- **contato**: Opcional, 8-20 caracteres
- **senha**: Opcional, mínimo 6 caracteres

### Criança

#### Criação (POST)
- **nome**: Obrigatório, 2-100 caracteres
- **dataNascimento**: Obrigatório, formato livre
- **responsavelId**: Obrigatório, deve existir no sistema
- **turmaId**: Opcional, deve existir no sistema se fornecido

#### Atualização (PUT)
- **nome**: Opcional, 2-100 caracteres
- **dataNascimento**: Opcional
- **responsavelId**: Opcional, deve existir no sistema
- **turmaId**: Opcional, deve existir no sistema se fornecido

### Turma

#### Criação (POST)
- **nome**: Obrigatório, 2-50 caracteres, único no sistema

#### Atualização (PUT)
- **nome**: Opcional, 2-50 caracteres, único no sistema

### Administrador

#### Criação (POST)
- **nome**: Obrigatório, 2-100 caracteres
- **email**: Obrigatório, formato válido, único no sistema
- **senha**: Obrigatório, mínimo 6 caracteres

#### Atualização (PUT)
- **nome**: Opcional, 2-100 caracteres
- **email**: Opcional, formato válido, único no sistema
- **senha**: Opcional, mínimo 6 caracteres

## Regras de Negócio

### Responsáveis
- Não podem ser removidos se possuem crianças vinculadas
- Email deve ser único no sistema
- Senhas são criptografadas automaticamente

### Crianças
- Devem estar vinculadas a um responsável existente
- Podem estar em apenas uma turma por vez
- Podem existir sem turma (crianças não alocadas)

### Turmas
- Nome deve ser único no sistema
- Não podem ser removidas se possuem crianças vinculadas (exceto com force=true)
- Quando removidas com force=true, as crianças são desvinculadas automaticamente

### Administradores
- Email deve ser único no sistema
- Não é possível remover o último administrador do sistema
- Senhas são criptografadas automaticamente

## Operações Especiais

### Transferência de Crianças entre Turmas

```bash
# Atualizar turma de múltiplas crianças
curl -X POST http://localhost:3001/api/criancas/update-turma-multiple \
  -H "Content-Type: application/json" \
  -d '{
    "criancaIds": [1, 2, 3],
    "turmaId": 2
  }'

# Remover crianças de turma (definir turmaId como null)
curl -X POST http://localhost:3001/api/criancas/update-turma-multiple \
  -H "Content-Type: application/json" \
  -d '{
    "criancaIds": [1, 2, 3],
    "turmaId": null
  }'
```

### Remoção Forçada de Turma

```bash
# Remove turma e desvincula crianças automaticamente
curl -X DELETE "http://localhost:3001/api/turmas/1?force=true"
```

### Alteração de Senha de Administrador

```bash
curl -X POST http://localhost:3001/api/admins/1/change-password \
  -H "Content-Type: application/json" \
  -d '{
    "senhaAtual": "senhaAtual123",
    "novaSenha": "novaSenha456"
  }'
```

## Tratamento de Erros

### Erros de Validação

```json
{
  "success": false,
  "error": "Dados inválidos",
  "message": "Os dados fornecidos não atendem aos critérios de validação",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "details": [
    {
      "field": "email",
      "message": "Email deve ter um formato válido"
    },
    {
      "field": "senha",
      "message": "Senha deve ter pelo menos 6 caracteres"
    }
  ]
}
```

### Erros de Conflito

```json
{
  "success": false,
  "error": "Conflito",
  "message": "Email já está em uso",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Erros de Não Encontrado

```json
{
  "success": false,
  "error": "Não encontrado",
  "message": "Responsável não encontrado",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Performance e Otimização

### Paginação
- Limite máximo de 100 itens por página
- Paginação padrão: 10 itens por página
- Use paginação para listas grandes

### Includes Otimizados
- Relacionamentos são incluídos automaticamente quando relevantes
- Campos sensíveis (senhas) são removidos automaticamente
- Use o parâmetro `simple=true` para respostas mais leves

### Índices de Banco
- Emails são únicos e indexados
- IDs são chaves primárias indexadas
- Relacionamentos possuem índices de chave estrangeira

## Monitoramento e Logs

### Health Check
```bash
curl http://localhost:3001/health
```

### Logs de Requisição
- Todas as requisições são logadas via Morgan
- Formato: `IP - - [timestamp] "METHOD /path HTTP/version" status size "referer" "user-agent"`

### Logs de Erro
- Erros são logados no console com stack trace
- Em produção, considere usar um serviço de logging como Winston

## Segurança

### Criptografia
- Senhas são hasheadas com bcryptjs (12 rounds)
- Comparação segura de senhas

### Headers de Segurança
- Helmet.js configurado para headers básicos de segurança
- CORS configurado para permitir todas as origens (ajustar para produção)

### Validação
- Todos os inputs são validados com Joi
- Sanitização automática de objetos de resposta
- Validação de tipos e formatos

### Recomendações para Produção
- Configurar CORS para domínios específicos
- Implementar rate limiting
- Usar HTTPS
- Configurar logs estruturados
- Implementar autenticação JWT
- Adicionar middleware de autenticação nas rotas protegidas

