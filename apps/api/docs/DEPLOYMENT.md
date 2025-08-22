# Guia de Deploy - API Quintais Brincantes

## Pré-requisitos

- Node.js 18+ 
- PostgreSQL 12+
- Git
- PM2 (para produção)

## Deploy Local

### 1. Clonar e Configurar

```bash
# Clonar repositório
git clone <repository-url>
cd quintais-brincantes-manager/apps/api

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env
# Editar .env com suas configurações
```

### 2. Configurar Banco de Dados

```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev

# (Opcional) Executar seed
npx prisma db seed
```

### 3. Iniciar Aplicação

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## Deploy em Servidor

### 1. Preparar Servidor

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Instalar PM2
sudo npm install -g pm2
```

### 2. Configurar PostgreSQL

```bash
# Acessar PostgreSQL
sudo -u postgres psql

# Criar banco e usuário
CREATE DATABASE quintais_brincantes_manager;
CREATE USER quintais_user WITH PASSWORD 'senha_segura';
GRANT ALL PRIVILEGES ON DATABASE quintais_brincantes_manager TO quintais_user;
\q
```

### 3. Deploy da Aplicação

```bash
# Clonar repositório
git clone <repository-url>
cd quintais-brincantes-manager/apps/api

# Instalar dependências de produção
npm ci --only=production

# Configurar ambiente
cp .env.example .env
nano .env
```

Configurar `.env`:
```env
NODE_ENV=production
PORT=3001
DATABASE_URL="postgresql://quintais_user:senha_segura@localhost:5432/quintais_brincantes_manager"
JWT_SECRET="chave-super-secreta-de-producao-muito-longa-e-aleatoria"
```

### 4. Configurar Banco de Dados

```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate deploy

# (Opcional) Executar seed
npx prisma db seed
```

### 5. Configurar PM2

Criar arquivo `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'quintais-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

```bash
# Criar diretório de logs
mkdir logs

# Iniciar com PM2
pm2 start ecosystem.config.js --env production

# Salvar configuração PM2
pm2 save

# Configurar PM2 para iniciar no boot
pm2 startup
```

### 6. Configurar Nginx (Opcional)

```bash
# Instalar Nginx
sudo apt install nginx -y

# Criar configuração
sudo nano /etc/nginx/sites-available/quintais-api
```

Configuração Nginx:
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/quintais-api /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

## Deploy com Docker

### 1. Dockerfile

```dockerfile
FROM node:18-alpine

# Instalar dependências do sistema
RUN apk add --no-cache openssl

# Criar diretório da aplicação
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci --only=production

# Gerar cliente Prisma
RUN npx prisma generate

# Copiar código da aplicação
COPY . .

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Alterar propriedade dos arquivos
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expor porta
EXPOSE 3001

# Comando de inicialização
CMD ["npm", "start"]
```

### 2. Docker Compose

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://quintais_user:senha_segura@db:5432/quintais_brincantes_manager
      - JWT_SECRET=chave-super-secreta-de-producao
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=quintais_brincantes_manager
      - POSTGRES_USER=quintais_user
      - POSTGRES_PASSWORD=senha_segura
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### 3. Deploy com Docker

```bash
# Build e iniciar
docker-compose up -d

# Executar migrações
docker-compose exec api npx prisma migrate deploy

# Ver logs
docker-compose logs -f api
```

## Deploy na Nuvem

### Heroku

1. **Preparar aplicação**:
```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Criar app
heroku create quintais-api
```

2. **Configurar banco**:
```bash
# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Configurar variáveis
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=sua-chave-secreta
```

3. **Deploy**:
```bash
# Adicionar Procfile
echo "web: npm start" > Procfile

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Executar migrações
heroku run npx prisma migrate deploy
```

### Railway

1. **Conectar repositório** no dashboard do Railway
2. **Configurar variáveis de ambiente**:
   - `NODE_ENV=production`
   - `JWT_SECRET=sua-chave-secreta`
3. **Adicionar PostgreSQL** como serviço
4. **Deploy automático** via Git

### DigitalOcean App Platform

1. **Criar App** no dashboard
2. **Conectar repositório**
3. **Configurar build**:
   - Build Command: `npm ci && npx prisma generate`
   - Run Command: `npm start`
4. **Adicionar banco PostgreSQL**
5. **Configurar variáveis de ambiente**

## Monitoramento

### PM2 Monitoring

```bash
# Status dos processos
pm2 status

# Logs em tempo real
pm2 logs

# Monitoramento
pm2 monit

# Restart
pm2 restart quintais-api

# Reload (zero downtime)
pm2 reload quintais-api
```

### Health Checks

```bash
# Script de health check
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health)
if [ $response -eq 200 ]; then
    echo "API is healthy"
    exit 0
else
    echo "API is unhealthy"
    exit 1
fi
```

### Logs

```bash
# Configurar logrotate
sudo nano /etc/logrotate.d/quintais-api
```

```
/path/to/app/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 nodejs nodejs
    postrotate
        pm2 reloadLogs
    endscript
}
```

## Backup

### Banco de Dados

```bash
# Backup
pg_dump -h localhost -U quintais_user -d quintais_brincantes_manager > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
psql -h localhost -U quintais_user -d quintais_brincantes_manager < backup_file.sql
```

### Automatizar Backup

```bash
# Criar script de backup
nano backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="quintais_brincantes_manager"
DB_USER="quintais_user"

mkdir -p $BACKUP_DIR

pg_dump -h localhost -U $DB_USER -d $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Manter apenas últimos 7 backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql"
```

```bash
# Tornar executável
chmod +x backup.sh

# Adicionar ao crontab (backup diário às 2h)
crontab -e
0 2 * * * /path/to/backup.sh
```

## SSL/HTTPS

### Let's Encrypt com Certbot

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado
sudo certbot --nginx -d seu-dominio.com

# Renovação automática
sudo crontab -e
0 12 * * * /usr/bin/certbot renew --quiet
```

## Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco**:
   - Verificar DATABASE_URL
   - Testar conexão: `psql $DATABASE_URL`

2. **Porta em uso**:
   - Verificar processos: `lsof -i :3001`
   - Matar processo: `kill -9 PID`

3. **Permissões**:
   - Verificar propriedade dos arquivos
   - Ajustar permissões: `chmod 755 server.js`

4. **Memória insuficiente**:
   - Monitorar uso: `htop`
   - Ajustar instâncias PM2

### Logs Úteis

```bash
# Logs da aplicação
pm2 logs quintais-api

# Logs do sistema
sudo journalctl -u nginx
sudo journalctl -f

# Logs do PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-*.log
```

## Atualizações

### Deploy de Nova Versão

```bash
# Fazer backup
./backup.sh

# Atualizar código
git pull origin main

# Instalar dependências
npm ci --only=production

# Executar migrações
npx prisma migrate deploy

# Restart sem downtime
pm2 reload quintais-api
```

### Rollback

```bash
# Voltar para versão anterior
git checkout HEAD~1

# Reinstalar dependências
npm ci --only=production

# Rollback de migrações (se necessário)
npx prisma migrate reset

# Restart
pm2 restart quintais-api
```