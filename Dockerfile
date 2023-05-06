FROM node:lts-alpine as builder

WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY src ./src

RUN npm install
RUN npm run build

FROM node:lts-alpine
WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY --from=builder /app/dist ./dist

RUN npm install --only=production

CMD ["node","dist/index.js"]