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

# /tmp에 node_modules 심링크 생성해서 ESM 로더가 모듈을 찾도록 함
RUN mkdir -p /tmp \
    && ln -s /app/node_modules /tmp/node_modules

# 외부 스크립트 루트 경로
ENV SCRIPT_ROOT_PATH=/tmp

# ESM 환경에서도 node_modules를 참조하도록 설정
ENV NODE_PATH=/app/node_modules

# ESM 로더가 bare specifier를 CJS 스타일로 해석하게 하는 옵션
ENV NODE_OPTIONS="--experimental-specifier-resolution=node"

# 애플리케이션 실행
CMD ["node", "./dist/server.js"]