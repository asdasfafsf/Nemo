# Nemo: 동적 스크립트 실행 엔진

[![TypeScript](https://img.shields.io/badge/TypeScript-^5.8.3-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-^20.17.30-green.svg?logo=node.js)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-^5.4.17-yellowgreen.svg?logo=vite)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-^3.1.1-6E9F18.svg?logo=vitest)](https://vitest.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-managed-orange.svg?logo=pnpm)](https://pnpm.io/)
[![Fastify](https://img.shields.io/badge/Fastify-^5.2.2-lightgrey.svg?logo=fastify)](https://www.fastify.io/)

"바다를 헤엄치는 스크래핑 워커" - Nemo는 **`nemo-box` 플랫폼을 통해 생성된 스크립트를 외부 저장소에서 동적으로 로드하고 안전하게 실행하는 데 특화된 실행 엔진**입니다.

Nemo의 주요 역할은 다음과 같습니다.

- **스크립트 실행 요청 처리:** API 요청을 통해 실행할 스크립트(`key1`, `key2`로 식별)와 필요한 파라미터를 전달받습니다.
- **동적 스크립트 로딩:** 요청된 스크립트가 로컬에 없거나 업데이트가 필요한 경우, 외부 저장소(예: AWS S3)에서 해당 스크립트 코드를 다운로드합니다.
- **안전한 스크립트 실행:** `nemo-box`에서 생성된 스크립트를 격리된 환경에서 실행하고, 그 결과를 API 응답으로 반환합니다.
- **API 인터페이스:** Fastify 기반의 API 서버를 통해 외부 시스템에서 스크립트 실행을 트리거하고 결과를 수신할 수 있습니다 (`POST /execute`).

**참고:** 스크립트의 생성 및 관리는 별도의 `nemo-box` 플랫폼에서 이루어집니다. Nemo는 실행 환경만을 제공합니다.

## 기술 스택

- **언어:** TypeScript
- **런타임:** Node.js
- **빌드 도구:** Vite
- **테스트 프레임워크:** Vitest
- **패키지 매니저:** pnpm
- **웹 프레임워크 (API):** Fastify
- **데이터 유효성 검사/직렬화:** typia
- **스크립트 저장소 :** AWS S3 (스크립트 저장 및 데이터 저장)

## 프로젝트 구조

```
.
├── dist/               # 빌드 결과물
├── node_modules/       # 의존성 모듈
├── src/                # 소스 코드 루트
│   ├── config/         # 환경 변수 및 설정
│   ├── constants/      # 상수 정의
│   ├── errors/         # 사용자 정의 에러
│   ├── script/         # 스크립트 로딩, 실행, 다운로드 핵심 로직
│   │   ├── loader.ts     # 스크립트 로딩/실행 진입점 (loadScript, runScript)
│   │   ├── download.ts   # 외부 스크립트 다운로드 로직
│   │   ├── executor.ts   # 스크립트 실행 로직
│   │   ├── metadata.ts   # 스크립트 메타데이터 관련
│   │   ├── script.ts     # 스크립트 유틸리티/베이스
│   │   ├── worker.ts     # 스크립트 워커 관련
│   │   └── index.ts      # script 모듈 index
│   ├── types/          # 타입 정의 (TypeScript 인터페이스)
│   ├── utils/          # 범용 유틸리티 함수
│   ├── server.ts       # Fastify API 서버 로직
│   └── s3.ts           # AWS S3 연동 로직
├── test/               # 테스트 코드 (Vitest) - src/test일 수도 있음 (확인 필요)
├── .env.example        # 환경 변수 예시 파일
├── .git/               # Git 저장소 메타데이터
├── .gitignore
├── .dockerignore
├── dockerfile          # Docker 빌드 설정
├── package.json        # 프로젝트 메타데이터 및 의존성
├── pnpm-lock.yaml      # pnpm 의존성 락 파일
├── readme.md           # 프로젝트 설명 (이 파일)
├── tsconfig.json       # TypeScript 컴파일 설정
├── vite.config.ts      # Vite 빌드 설정
└── vitest.config.ts    # Vitest 설정
```

## 스크립트 실행 아키텍처: 어떻게 동작하나요?

Nemo는 외부에서 만들어진 다양한 스크립트(예: `nemo-box` 플랫폼 사용)를 받아 안전하고 유연하게 실행하는 것을 목표로 합니다. 이를 위해 다음과 같은 핵심 아이디어를 바탕으로 설계되었습니다.

1.  **최신 스크립트 확인 및 준비:**

    - 실행 요청이 오면, Nemo는 가장 먼저 **요청된 스크립트가 이미 로컬(서버)에 최신 버전으로 준비되어 있는지 확인**합니다.
    - 이를 위해, 로컬에 저장된 스크립트 파일과 함께 **마지막으로 업데이트된 시간을 기록한 정보(메타데이터 파일)**를 관리합니다.
    - 그리고 **원본 스크립트가 저장된 외부 저장소(예: AWS S3)를 확인**하여, 그곳에 더 새로운 버전의 스크립트가 올라와 있는지 (파일의 최종 수정 시간 비교) 살펴봅니다.
    - 만약 스크립트가 로컬에 없거나, 외부 저장소에 더 최신 버전이 있다면, **Nemo는 해당 스크립트를 외부 저장소에서 다운로드**하여 로컬에 저장하고 업데이트 정보를 갱신합니다. 이 과정을 통해 실제 실행 단계에서는 항상 최신 스크립트를 사용할 수 있도록 보장합니다. 다운로드 실패 시에는 안정성을 위해 몇 차례 재시도합니다.

2.  **안전한 실행 환경 분리:**

    - 스크립트가 로컬에 준비되면, Nemo는 스크립트 실행을 위해 **완전히 독립된 별도의 작업 공간(자식 프로세스)**을 만듭니다.
    - 메인 서버 프로그램과 분리된 공간에서 스크립트를 실행함으로써, 특정 스크립트에서 오류가 발생하거나 예상보다 많은 자원을 사용하더라도 **메인 서버 전체의 안정성에는 영향을 주지 않도록** 보호합니다.

3.  **유연한 스크립트 로딩 및 실행:**

    - 독립된 작업 공간(자식 프로세스)은 메인 서버로부터 **실행할 스크립트 파일의 위치 정보**와 **작업에 필요한 데이터(파라미터)**를 전달받습니다.
    - 작업 공간 내의 실행 담당자(`worker.ts` 기반)는 전달받은 파일 위치를 이용해, **필요한 시점에 해당 스크립트 코드를 즉시 불러와 실행**합니다. (최신 자바스크립트 기능인 동적 `import()` 활용) 이를 통해 Nemo는 미리 정의되지 않은 다양한 종류의 스크립트를 유연하게 처리할 수 있습니다.
    - 실행되는 스크립트는 **미리 약속된 방식(인터페이스)**에 따라 작성되어야 합니다. 예를 들어, `nemo`라는 특정 함수 내부에 주된 로직을 구현하고, 정해진 형식으로 결과나 오류 정보를 반환해야 합니다.

4.  **결과 취합 및 전달:**
    - 스크립트 실행이 완료되면, 독립된 작업 공간은 그 **결과(또는 오류 정보)를 표준화된 형식의 메시지(JSON)**로 만들어 메인 서버에 다시 전달합니다. 이 통신은 **표준 입출력 스트림**이라는 기본적인 통로를 사용합니다.
    - 메인 서버는 이 메시지를 받아 최종적으로 API 요청을 보낸 사용자(또는 시스템)에게 응답합니다.

이러한 과정을 통해 Nemo는 외부 스크립트의 동적인 관리와 안전한 실행이라는 두 가지 목표를 달성합니다.

## 시작하기

### 요구 사항

- Node.js (v20 이상 권장)
- pnpm

### 설치

```bash
pnpm install
```

### 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고, 필요한 환경 변수를 설정합니다. (스크립트 저장소 접근 정보 - 예: AWS 자격 증명, S3 버킷, 서버 포트 등)

```bash
cp .env.example .env
# .env 파일 수정
```

### 개발 모드 실행

Vite를 사용하여 코드를 빌드하고 변경 사항을 감시합니다.

```bash
# 코드 변경 시 자동 빌드
pnpm run dev
```

API 서버와 빌드 감시를 동시에 실행합니다. 서버는 `dist/server.js`를 실행하며, 코드 변경 시 자동으로 재시작됩니다.

```bash
# 개발 서버 실행 (빌드 감시 + 서버 재시작)
pnpm run dev:server
```

### 빌드

프로덕션용 코드를 빌드합니다. 결과물은 `dist/` 디렉토리에 생성됩니다.

```bash
pnpm run build
```

### 테스트

Vitest를 사용하여 테스트를 실행합니다.

```bash
# 전체 테스트 실행
pnpm run test

# 테스트 커버리지 리포트 생성
pnpm run coverage

# 테스트 파일 변경 감지 및 자동 재실행
pnpm run test:watch
```

## API

### `GET /health`

서버의 상태를 확인합니다.

- **성공 응답 (200):**
  ```json
  {
    "code": "SUCCESS",
    "message": "요청 성공",
    "data": null
  }
  ```

### `POST /execute`

`nemo-box`에서 생성된 스크립트 중 지정된 스크립트를 로드하고 실행합니다.

- **요청 본문 (예시):** (정확한 형식은 `src/types/common.ts`의 `Request` 타입 확인 필요)
  ```json
  {
    "key1": "some-script-identifier", // nemo-box에서 관리되는 스크립트 ID
    "key2": "version-or-other-qualifier", // 스크립트 버전 또는 구분자
    "parameters": {
      // 스크립트 실행에 필요한 파라미터
      "url": "https://example.com",
      "targetElement": "#content"
    }
  }
  ```
- **성공 응답 (200):** 스크립트 실행 결과 (형식은 실행된 스크립트에 따라 다름)
  ```json
  // 성공 응답 (200)
  {
    "code": "0000",
    "message": "성공적으로 작업을 완료했습니다.",
    "techMessage": "작업 성공",
    "data": {
      // 실제 스크립트 실행 결과가 여기에 포함됩니다.
      // 예시: "scrapedTitle": "Example Domain", "itemCount": 5
    }
  }
  ```
- **오류 응답 (200 또는 400):**

  ```json
  // 유효하지 않은 파라미터 (400 - 클라이언트 측에서 반환)
  {
    "code": "1001",
    "message": "전달해 주신 정보에 문제가 있습니다. 올바른 값을 입력해 주세요.",
    "techMessage": "잘못된 매개변수",
    "data": null
  }

  // 스크립트 다운로드 오류 (200 - 서버 측 처리 중 발생)
  {
    "code": "2000",
    "message": "스크립트를 다운로드하는 중 문제가 발생했습니다. 네트워크 연결을 확인해 주세요.",
    "techMessage": "스크립트 다운로드 실패 - 네트워크 연결 오류",
    "data": null
  }

  // 스크래핑 엔진 타임아웃 (200 - 서버 측 처리 중 발생)
  {
    "code": "4003",
    "message": "정보 수집에 시간이 너무 오래 걸려 중단되었습니다. 범위를 좁혀서 다시 시도해 보세요.",
    "techMessage": "스크래핑 작업 타임아웃",
    "data": null
  }

  // 일반 오류 (200 - 서버 측 처리 중 발생)
  {
    "code": "9999",
    "message": "죄송합니다, 예상치 못한 문제가 발생했습니다. 나중에 다시 시도해 주세요.",
    "techMessage": "일반 오류", // 혹은 구체적인 내부 오류 메시지
    "data": null
  }

  // 스크립트 내부 정의 오류 (200 - 서버 측 처리 중 발생)
  // 참고: 스크립트 작성 시 특정 상황에 대한 오류는 10000번대 코드를 사용하여 직접 정의할 수 있습니다.
  {
    "code": "10001", // 예시: 스크립트에서 정의한 사용자 정의 오류 코드
    "message": "로그인 정보가 일치하지 않습니다.", // 스크립트에서 정의한 메시지
    "techMessage": "스크립트 내 로그인 실패 처리", // 스크립트에서 정의한 기술 메시지
    "data": null // 혹은 스크립트에서 전달하는 추가 정보
  }
  ```

## 기여

(기여 방법에 대한 안내 추가)

## 라이선스

ISC
