# Quintais Brincantes Manager

Website e Sistema para gestão de Quintais Brincantes.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Prisma** - ORM para PostgreSQL
- **AdminJS** - Painel administrativo
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas

### Frontend
- **Next.js** - Framework React
- **React** - Biblioteca de interface
- **Axios** - Cliente HTTP
- **js-cookie** - Gerenciamento de cookies

### Banco de Dados
- **PostgreSQL** - Banco de dados principal

## 📁 Estrutura do Projeto

```
quitais-brincantes-manager/
├── apps/
│   ├── api/                      # Backend API
│   │   ├── controllers/          # Controladores
│   │   ├── routes/               # Rotas da API
│   │   ├── services/             # Serviços
│   │   └── src/
│   │       ├── adminjs/          # Configuração AdminJS
│   │       │   ├── actions/      # Ações customizadas
│   │       │   ├── components/   # Componentes React
│   │       │   └── resources/    # Recursos do AdminJS
│   │       ├── templates/        # Templates HTML
│   │       └── utils/            # Utilitários
│   └── web/                      # Frontend Next.js
│       ├── components/           # Componentes React
│       ├── pages/                # Páginas Next.js
│       └── public/               # Arquivos estáticos
├── prisma/                       # Schema e migrações
├── docker-compose.yml            # Configuração Docker
└── package.json                  # Dependências do projeto
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (versão 20)
- PostgreSQL
- npm ou yarn

### 1. Clone o repositório
```bash
git clone git@github.com:marciorc/quintais-brincantes-manager.git
cd quintais-brincantes-manager
```

### 2. Instale as dependências
```bash
npm install
cd apps/web && npm install
cd ../..
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
# Banco de dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/quintais_brincantes_manager"

# JWT
JWT_SECRET="sua-chave-secreta-jwt"
    Pode ser gerado com comando: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

# Superuser AdminJS
SUPERUSER_PASSWORD="senha-do-superuser"

# Portas
PORT=3001
```

### 4. Configure o banco de dados
```bash
# Gere o cliente Prisma
npm run prisma:generate

# Execute as migrações
npm run prisma:migrate

# Crie um superuser para o painel admin
npm run prisma:seed
```

### 5. Inicie o desenvolvimento
```bash
# Inicia API e frontend simultaneamente
npm run dev

# Ou individualmente:
npm run dev:api    # Apenas API (porta 3001)
npm run dev:web    # Apenas frontend (porta 3000)
```

### 6. Acesse o sistema
- **Painel AdminJS**: `http://localhost:3001/admin`
- **Frontend Web**: `http://localhost:3000`
- **Página de Login Admin**: `http://localhost:3000/admin/login`

## 🎯 Funcionalidades

### Painel Administrativo (AdminJS)
- **Dashboard customizado** com links rápidos para cadastros
- **Gestão completa** de Crianças, Responsáveis, Turmas e Admins
- **Interface responsiva** e moderna

### API REST
- **Autenticação JWT** para responsáveis
- **CRUD completo** para todos os modelos
- **Validações** de dados

### Frontend Web
- **Interface responsiva** para responsáveis
- **Sistema de login** seguro
- **Visualização de dados** das crianças
- **Navegação intuitiva**

## 🔐 Acesso ao Sistema

### Painel Administrativo
- **URL**: `http://localhost:3001/admin`
- **Login**: 
  - **Usuário**: `superuser`
  - **Senha**: Valor definido em `SUPERUSER_PASSWORD` no arquivo `.env`

### Frontend Web
- **URL**: `http://localhost:3000`
- **Login**: Use o email e senha do responsável

## 📋 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia API + frontend
npm run dev:api      # Apenas API
npm run dev:web      # Apenas frontend

# Banco de dados
npm run prisma:generate    # Gera cliente Prisma
npm run prisma:migrate     # Executa migrações
npm run prisma:seed        # Cria superuser admin

# Produção
npm start           # Inicia apenas a API
```

## 🐳 Docker

Para usar com Docker:
```bash
docker-compose up -d
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Quintais Brincantes Manager**