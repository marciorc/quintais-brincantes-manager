FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./apps/api/
COPY prisma/ ./prisma/

RUN npm install --prefix ./apps/api

COPY . .

WORKDIR /app/apps/api

RUN npx prisma generate --schema ../prisma/schema.prisma

EXPOSE 3001

CMD ["npm", "start"]