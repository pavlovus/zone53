# Multi-stage production build for ZONE 53 Stateless Backend
FROM node:22-alpine AS build-env
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

FROM node:22-alpine AS production-env
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
COPY package.json package-lock.json ./
COPY --from=production-env /app/node_modules ./node_modules
COPY --from=build-env /app/dist ./dist

USER node
EXPOSE 4000

CMD ["node", "dist/index.js"]
