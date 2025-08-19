FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./apps/web/

RUN npm install --prefix ./apps/web

COPY . .

WORKDIR /app/apps/web

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/node_modules ./node_modules
COPY --from=builder /app/apps/web/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]