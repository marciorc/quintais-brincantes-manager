# API Quintais Brincantes

API REST para gestão de Quintais Brincantes - Sistema de gerenciamento de crianças, responsáveis, turmas e administradores.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados
- **Swagger** - Documentação da API
- **JWT** - Autenticação (preparado para implementação)
- **bcryptjs** - Criptografia de senhas
- **Joi** - Validação de dados

## 📁 Estrutura do Projeto

```
apps/api/
├── config/
│   ├── database.js          # Configuração do Prisma
│   └── swagger.js           # Configuração do Swagger
├── controllers/
│   ├── adminController.js   # Controller de administradores
│   ├── criancaController.js # Controller de crianças
│   ├── responsavelController.js # Controller de responsáveis
│   └── turmaController.js   # Controller de turmas
├── routes/
│   ├── adminRoutes.js       # Rotas de administradores
│   ├── criancaRoutes.js     # Rotas de crianças
│   ├── responsavelRoutes.js # Rotas de responsáveis
│   └── turmaRoutes.js       # Rotas de turmas
├── services/
│   ├── adminService.js      # Lógica de negócio - administradores
│   ├── criancaService.js    # Lógica de negócio - crianças
│   ├── responsavelService.js # Lógica de negócio - responsáveis
│   └── turmaService.js      # Lógica de negócio - turmas
├── utils/
│   ├── helpers.js           # Funções auxiliares
│   └── validation.js        # Validações com Joi
├── .env.example             # Exemplo de variáveis de ambiente
├── package.json             # Dependências do projeto
├── server.js                # Servidor principal
└── README.md                # Esta documentação
```

## 🛠️ Instalação

### Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL
- npm ou yarn

### 1. Instalar dependências

```bash
cd apps/api
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# Configurações do Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/quintais_brincantes_manager"

# Configurações JWT
JWT_SECRET="sua-chave-secreta-jwt-muito-segura-aqui"

# Configurações do Servidor
PORT=3001
NODE_ENV=development
```

### 3. Configurar banco de dados

```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev

# (Opcional) Executar seed
npx prisma db seed
```

### 4. Iniciar servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📚 Documentação da API

A documentação completa da API está disponível via Swagger UI:

- **URL**: `http://localhost:3001/api-docs`
- **Health Check**: `http://localhost:3001/health`

## 🔗 Endpoints Principais

### Responsáveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/responsaveis` | Lista todos os responsáveis |
| GET | `/api/responsaveis/:id` | Busca responsável por ID |
| GET | `/api/responsaveis/:id/criancas` | Lista crianças do responsável |
| GET | `/api/responsaveis/statistics` | Estatísticas dos responsáveis |
| POST | `/api/responsaveis` | Cria novo responsável |
| POST | `/api/responsaveis/authenticate` | Autentica responsável |
| PUT | `/api/responsaveis/:id` | Atualiza responsável |
| DELETE | `/api/responsaveis/:id` | Remove responsável |

### Crianças

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/criancas` | Lista todas as crianças |
| GET | `/api/criancas/:id` | Busca criança por ID |
| GET | `/api/criancas/responsavel/:responsavelId` | Lista crianças por responsável |
| GET | `/api/criancas/turma/:turmaId` | Lista crianças por turma |
| GET | `/api/criancas/sem-turma` | Lista crianças sem turma |
| GET | `/api/criancas/statistics` | Estatísticas das crianças |
| POST | `/api/criancas` | Cria nova criança |
| POST | `/api/criancas/update-turma-multiple` | Atualiza turma de múltiplas crianças |
| PUT | `/api/criancas/:id` | Atualiza criança |
| DELETE | `/api/criancas/:id` | Remove criança |

### Turmas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/turmas` | Lista todas as turmas |
| GET | `/api/turmas/:id` | Busca turma por ID |
| GET | `/api/turmas/:id/criancas` | Lista crianças da turma |
| GET | `/api/turmas/vazias` | Lista turmas vazias |
| GET | `/api/turmas/statistics` | Estatísticas das turmas |
| POST | `/api/turmas` | Cria nova turma |
| POST | `/api/turmas/:id/add-criancas` | Adiciona crianças à turma |
| POST | `/api/turmas/:id/remove-criancas` | Remove crianças da turma |
| PUT | `/api/turmas/:id` | Atualiza turma |
| DELETE | `/api/turmas/:id` | Remove turma |

### Administradores

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/admins` | Lista todos os administradores |
| GET | `/api/admins/:id` | Busca administrador por ID |
| GET | `/api/admins/statistics` | Estatísticas dos administradores |
| GET | `/api/admins/dashboard` | Dashboard administrativo |
| POST | `/api/admins` | Cria novo administrador |
| POST | `/api/admins/authenticate` | Autentica administrador |
| POST | `/api/admins/:id/change-password` | Altera senha do administrador |
| PUT | `/api/admins/:id` | Atualiza administrador |
| DELETE | `/api/admins/:id` | Remove administrador |

## 📊 Parâmetros de Query

### Paginação

Todos os endpoints de listagem suportam paginação:

- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10, máximo: 100)

Exemplo: `/api/criancas?page=2&limit=20`

### Busca

Endpoints de listagem suportam busca via parâmetro `search`:

- Responsáveis: busca por nome ou email
- Crianças: busca por nome ou data de nascimento
- Turmas: busca por nome
- Administradores: busca por nome ou email

Exemplo: `/api/responsaveis?search=maria`

### Filtros Específicos

#### Crianças
- `responsavelId`: Filtrar por responsável
- `turmaId`: Filtrar por turma

#### Turmas e Administradores
- `simple=true`: Retorna formato simplificado

## 📝 Exemplos de Uso

### Criar Responsável

```bash
curl -X POST http://localhost:3001/api/responsaveis \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "contato": "(11) 99999-9999",
    "senha": "123456"
  }'
```

### Criar Criança

```bash
curl -X POST http://localhost:3001/api/criancas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "dataNascimento": "15/03/2018",
    "responsavelId": 1,
    "turmaId": 1
  }'
```

### Criar Turma

```bash
curl -X POST http://localhost:3001/api/turmas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Turma A - Manhã"
  }'
```

## 🔒 Validações

A API implementa validações rigorosas usando Joi:

### Responsável
- **nome**: 2-100 caracteres, obrigatório
- **email**: formato válido, único, obrigatório
- **contato**: 8-20 caracteres, obrigatório
- **senha**: mínimo 6 caracteres, obrigatório

### Criança
- **nome**: 2-100 caracteres, obrigatório
- **dataNascimento**: obrigatório
- **responsavelId**: número inteiro positivo, obrigatório
- **turmaId**: número inteiro positivo, opcional

### Turma
- **nome**: 2-50 caracteres, único, obrigatório

### Administrador
- **nome**: 2-100 caracteres, obrigatório
- **email**: formato válido, único, obrigatório
- **senha**: mínimo 6 caracteres, obrigatório

## 🛡️ Segurança

- Senhas são criptografadas com bcryptjs (12 rounds)
- Validação de dados em todas as rotas
- Sanitização de objetos (remoção de campos sensíveis)
- Headers de segurança com Helmet
- CORS configurado para permitir todas as origens

## 📈 Monitoramento

### Health Check

```bash
curl http://localhost:3001/health
```

Resposta:
```json
{
  "status": "OK",
  "message": "API Quintais Brincantes está funcionando",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Logs

A API utiliza Morgan para logging de requisições HTTP.

## 🚀 Deploy

### Variáveis de Ambiente para Produção

```env
NODE_ENV=production
PORT=3001
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="chave-super-secreta-de-producao"
```

### Docker (Opcional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar testes com coverage
npm run test:coverage
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request