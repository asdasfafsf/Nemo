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

# 빌드 스테이지에서 생성된 dist 폴더만 복사
COPY --from=builder /app/dist ./dist

CMD ["node", "./dist/server.js"]