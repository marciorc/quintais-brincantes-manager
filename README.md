# Quintais Brincantes Manager

Website e Sistema para gestão de Quintais Brincantes, focado em facilitar o gerenciamento de crianças, responsáveis, turmas e administradores. Este projeto é composto por um backend robusto em Node.js (Express.js) e um frontend interativo em Next.js (React), utilizando PostgreSQL como banco de dados.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js**: Ambiente de execução JavaScript.
- **Express.js**: Framework web para construção da API RESTful.
- **Prisma**: ORM (Object-Relational Mapper) para interação com o banco de dados PostgreSQL, facilitando operações de CRUD e migrações.
- **JWT (JSON Web Tokens)**: Utilizado para autenticação segura de usuários.
- **bcryptjs**: Biblioteca para criptografia de senhas, garantindo a segurança das credenciais.

### Frontend
- **Next.js**: Framework React para renderização do lado do servidor (SSR) e geração de sites estáticos, otimizando a performance e SEO.
- **React**: Biblioteca JavaScript para construção de interfaces de usuário reativas e componentizadas.
- **Axios**: Cliente HTTP baseado em Promises para fazer requisições à API.
- **js-cookie**: Biblioteca para manipulação de cookies no lado do cliente.

### Banco de Dados
- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional, robusto e escalável.

## 📁 Estrutura do Projeto

O projeto `quintais-brincantes-manager` é organizado em uma estrutura monorepo, contendo duas aplicações principais (`api` e `web`) e configurações de banco de dados e Docker.

```
quintais-brincantes-manager/
├── apps/
│   ├── api/                      # Backend API (Node.js/Express.js)
│   │   ├── controllers/          # Lógica de negócio para cada rota
│   │   ├── k6-tests/             # Testes de performance com k6
│   │   ├── routes/               # Definição das rotas da API (Admin, Criança, Responsável, Turma)
│   │   ├── services/             # Serviços de negócio e interação com o Prisma
│   │   └── utils/                # Utilitários e funções auxiliares (ex: validação)
│   └── web/                      # Frontend Web (Next.js/React)
│       ├── components/           # Componentes React reutilizáveis
│       ├── pages/                # Páginas da aplicação Next.js
│       └── public/               # Arquivos estáticos (imagens, fontes, etc.)
├── prisma/                       # Schema do banco de dados e migrações do Prisma
├── docker-compose.yml            # Configuração para orquestração de containers Docker
└── package.json                  # Dependências e scripts do projeto
```

## 🛠️ Instalação e Configuração

Para configurar e executar o projeto localmente, siga os passos abaixo:

### Pré-requisitos
- Node.js (versão 20 ou superior)
- PostgreSQL (servidor de banco de dados)
- npm ou Yarn (gerenciador de pacotes)
- Docker e Docker Compose (opcional, para ambiente conteinerizado)

### 1. Clone o repositório

```bash
git clone https://github.com/marciorc/quintais-brincantes-manager.git
cd quintais-brincantes-manager
```

### 2. Instale as dependências

```bash
npm install
cd apps/web && npm install
cd ../..
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```dotenv
# Configuração do Banco de Dados PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/quintais_brincantes_manager"

# Chave Secreta para JWT (JSON Web Tokens)
JWT_SECRET="sua-chave-secreta-jwt" # Pode ser gerada com: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"

# Senha do Superusuário para o acesso administrativo (se houver um sistema de administração customizado)
SUPERUSER_PASSWORD="senha-do-superuser"

# Porta para a API (Backend)
PORT=3001
```

### 4. Configure o banco de dados

Execute os comandos abaixo para gerar o cliente Prisma, aplicar as migrações e criar um superusuário (se aplicável):

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 5. Inicie o desenvolvimento

Você pode iniciar a API e o frontend simultaneamente ou individualmente:

```bash
npm run dev          # Inicia API (porta 3001) e frontend (porta 3000) simultaneamente

# Ou individualmente:
npm run dev:api      # Apenas a API (porta 3001)
npm run dev:web      # Apenas o frontend (porta 3000)
```

### 6. Acesse o sistema

Após iniciar o desenvolvimento, você pode acessar as seguintes URLs:

- **Frontend Web**: `http://localhost:3000`
- **Documentação da API (Swagger UI)**: `http://localhost:3001/api-docs`

## 🎯 Funcionalidades

### API REST
- **Autenticação JWT**: Segurança nas requisições para responsáveis e administradores.
- **CRUD completo**: Operações de Criação, Leitura, Atualização e Exclusão para todos os modelos de dados (Administradores, Crianças, Responsáveis, Turmas).
- **Validações de dados**: Garantia da integridade e consistência dos dados.
- **Estatísticas**: Endpoints para obter estatísticas sobre os dados gerenciados.

### Frontend Web
- **Interface responsiva**: Experiência de usuário otimizada para responsáveis em qualquer dispositivo.
- **Sistema de login seguro**: Autenticação de responsáveis para acesso aos dados.
- **Visualização de dados das crianças**: Responsáveis podem visualizar informações de suas crianças.
- **Navegação intuitiva**: Facilidade de uso e acesso às funcionalidades.

## 🔐 Acesso ao Sistema

### Acesso Administrativo (via API)
O acesso administrativo é gerenciado diretamente pela API, utilizando as rotas de `admins`. A autenticação é feita via JWT. As credenciais de superusuário são definidas no arquivo `.env` para a criação inicial.

### Frontend Web
- **URL**: `http://localhost:3000`
- **Login**: Utilize o e-mail e senha de um responsável cadastrado.

## 📋 Scripts Disponíveis

Os seguintes scripts estão disponíveis no `package.json` para facilitar o desenvolvimento e a manutenção do projeto:

```bash
# Desenvolvimento
npm run dev          # Inicia API + frontend
npm run dev:api      # Apenas API
npm run dev:web      # Apenas frontend

# Banco de dados
npm run prisma:generate    # Gera cliente Prisma
npm run prisma:migrate     # Executa migrações
npm run prisma:seed        # Cria superuser admin (se aplicável)

# Produção
npm start           # Inicia apenas a API
```

## 🐳 Docker

Para executar o projeto utilizando Docker e Docker Compose, siga este comando:

```bash
docker-compose up -d
```