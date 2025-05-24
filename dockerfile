# 1단계: 빌드 스테이지
FROM node:22-alpine AS builder

WORKDIR /app

# .npmrc 파일 먼저 복사
COPY .npmrc ./
COPY package*.json ./
RUN npm install -g ts-patch
RUN npm install

COPY . .
RUN npm run build

# 2단계: 실행 스테이지
FROM node:22-alpine

WORKDIR /app

COPY .npmrc ./
COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts

COPY --from=builder /app/dist ./dist

RUN apk add --no-cache chromium nss ttf-freefont \
    && mkdir -p /tmp \
    && ln -s /app/node_modules /tmp/node_modules

ENV NODE_PATH=/app/node_modules
ENV NODE_OPTIONS="--experimental-specifier-resolution=node"
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

CMD ["node", "./dist/server.js"]