// 1. 타입 헬퍼: 메시지가 모든 코드에 존재하는지 검사
type EnsureMessageExistsForAllCodes = {
    [C in typeof RESPONSE_CODE[keyof typeof RESPONSE_CODE]]: 
      C extends keyof typeof RESPONSE_MESSAGES ? true : false
  };
  
// 2. 타입 헬퍼: 기술 메시지가 모든 코드에 존재하는지 검사
type EnsureTechMessageExistsForAllCodes = {
[C in typeof RESPONSE_CODE[keyof typeof RESPONSE_CODE]]: 
    C extends keyof typeof RESPONSE_TECH_MESSAGES ? true : false
};

// 3. 컴파일 오류를 위한 타입 (누락된 메시지가 있으면 never 타입이 됨)
type CompileCheck = 
false extends EnsureMessageExistsForAllCodes[keyof EnsureMessageExistsForAllCodes] ? never :
false extends EnsureTechMessageExistsForAllCodes[keyof EnsureTechMessageExistsForAllCodes] ? never :
true;

// 4. 타입 컴파일러에게 검사를 강제하는 변수 
const _typeCheck: CompileCheck = true;

export const RESPONSE_CODE = {
    // 성공 코드
    SUCCESS: '0000',
    
    // 클라이언트/요청 오류 (1000번대)
    CLIENT_ERROR: '1000',                       // 일반적인 클라이언트 오류
    INVALID_PARAMETERS: '1001',                 // 잘못된 매개변수
    MISSING_REQUIRED_PARAMETERS: '1002',        // 필수 매개변수 누락
    INVALID_SCRIPT_ID: '1003',                  // 존재하지 않는 스크립트 ID
    UNAUTHORIZED: '1004',                       // 인증 실패
    FORBIDDEN: '1005',                          // 권한 없음
    REQUEST_TIMEOUT: '1006',                    // 클라이언트 요청 타임아웃
    RATE_LIMIT_EXCEEDED: '1007',                // 요청 빈도 제한 초과
    INVALID_FORMAT: '1008',                     // 잘못된 데이터 형식
    REQUEST_TOO_LARGE: '1009',                  // 요청 데이터 크기 초과
    
    // 스크립트 관련 오류
    SCRIPT_DOWNLOAD_ERROR: '2000',              // 스크립트 다운로드 실패
    
    // 스크래핑 엔진 오류 (4000번대)
    SCRAPING_ENGINE_ERROR: '4000',
    SCRAPING_ENGINE_ABNORMAL_TERMINATION: '4001',
    SCRAPING_ENGINE_OUT_OF_MEMORY: '4002',
    SCRAPING_ENGINE_TIMEOUT: '4003',
    SCRAPING_ENGINE_FORCE_TERMINATED: '4004',
    SCRAPING_ENGINE_INITIALIZATION_FAILED: '4005',
    SCRAPING_ENGINE_DEPENDENCY_ERROR: '4006',
    SCRAPING_ENGINE_INCONSISTENT_STATE: '4007',
    SCRAPING_ENGINE_BROWSER_CRASH: '4008',
    SCRAPING_ENGINE_NETWORK_DISRUPTION: '4009',
    
    // 일반 오류
    ERROR: '9999',
} as const;

// 응답 메시지를 더 유저 친화적으로 작성
export const RESPONSE_MESSAGES = {
    [RESPONSE_CODE.SUCCESS]: '성공적으로 작업을 완료했습니다.',
    
    // 클라이언트/요청 오류 메시지 (1000번대)
    [RESPONSE_CODE.CLIENT_ERROR]: '요청을 처리할 수 없습니다. 입력 정보를 확인해 주세요.',
    [RESPONSE_CODE.INVALID_PARAMETERS]: '전달해 주신 정보에 문제가 있습니다. 올바른 값을 입력해 주세요.',
    [RESPONSE_CODE.MISSING_REQUIRED_PARAMETERS]: '필수 정보가 누락되었습니다. 모든 필수 항목을 입력해 주세요.',
    [RESPONSE_CODE.INVALID_SCRIPT_ID]: '요청하신 스크립트를 찾을 수 없습니다. 스크립트 ID를 확인해 주세요.',
    [RESPONSE_CODE.UNAUTHORIZED]: '인증에 실패했습니다. 로그인 정보를 확인해 주세요.',
    [RESPONSE_CODE.FORBIDDEN]: '해당 작업에 대한 권한이 없습니다. 관리자에게 문의해 주세요.',
    [RESPONSE_CODE.REQUEST_TIMEOUT]: '요청 처리 시간이 너무 오래 걸렸습니다. 다시 시도해 주세요.',
    [RESPONSE_CODE.RATE_LIMIT_EXCEEDED]: '요청이 너무 많습니다. 잠시 후에 다시 시도해 주세요.',
    [RESPONSE_CODE.INVALID_FORMAT]: '데이터 형식이 올바르지 않습니다. 입력 형식을 확인해 주세요.',
    [RESPONSE_CODE.REQUEST_TOO_LARGE]: '요청 데이터가 너무 큽니다. 더 작은 단위로 나누어 요청해 주세요.',
    
    // 스크립트 관련 오류 메시지
    [RESPONSE_CODE.SCRIPT_DOWNLOAD_ERROR]: '스크립트를 다운로드하는 중 문제가 발생했습니다. 네트워크 연결을 확인해 주세요.',
    
    // 스크래핑 엔진 오류 메시지 (4000번대)
    [RESPONSE_CODE.SCRAPING_ENGINE_ERROR]: '정보 수집 중 문제가 발생했습니다. 다시 시도해 볼까요?',
    [RESPONSE_CODE.SCRAPING_ENGINE_ABNORMAL_TERMINATION]: '정보 수집 도중 갑자기 중단되었습니다. 잠시 후 다시 시도해 주세요.',
    [RESPONSE_CODE.SCRAPING_ENGINE_OUT_OF_MEMORY]: '수집할 정보가 너무 많아서 메모리가 부족해졌습니다. 작업을 나누어서 진행해 보세요.',
    [RESPONSE_CODE.SCRAPING_ENGINE_TIMEOUT]: '정보 수집에 시간이 너무 오래 걸려 중단되었습니다. 범위를 좁혀서 다시 시도해 보세요.',
    [RESPONSE_CODE.SCRAPING_ENGINE_FORCE_TERMINATED]: '작업이 강제로 중단되었습니다. 시스템 상태를 확인해 주세요.',
    [RESPONSE_CODE.SCRAPING_ENGINE_INITIALIZATION_FAILED]: '정보 수집을 위한 준비 과정에서 문제가 발생했습니다. 설정을 확인해 주세요.',
    [RESPONSE_CODE.SCRAPING_ENGINE_DEPENDENCY_ERROR]: '정보 수집에 필요한 도구를 찾을 수 없습니다. 필요한 프로그램이 모두 설치되어 있는지 확인해 주세요.',
    [RESPONSE_CODE.SCRAPING_ENGINE_INCONSISTENT_STATE]: '정보 수집 중 내부 상태가 일관성을 잃었습니다. 새로운 작업으로 다시 시작해 보세요.',
    [RESPONSE_CODE.SCRAPING_ENGINE_BROWSER_CRASH]: '웹 브라우저가 갑자기 종료되었습니다. 사이트가 너무 무거운 콘텐츠를 포함하고 있을 수 있습니다.',
    [RESPONSE_CODE.SCRAPING_ENGINE_NETWORK_DISRUPTION]: '인터넷 연결이 불안정하여 정보 수집이 중단되었습니다. 네트워크 상태를 확인해 주세요.',
    
    [RESPONSE_CODE.ERROR]: '죄송합니다, 예상치 못한 문제가 발생했습니다. 나중에 다시 시도해 주세요.',
} as const;

// 개발자용 상세 메시지 (디버깅용)
export const RESPONSE_TECH_MESSAGES = {
    [RESPONSE_CODE.SUCCESS]: '작업 성공',
    
    // 클라이언트/요청 오류 기술 메시지 (1000번대)
    [RESPONSE_CODE.CLIENT_ERROR]: '클라이언트 일반 오류',
    [RESPONSE_CODE.INVALID_PARAMETERS]: '잘못된 매개변수',
    [RESPONSE_CODE.MISSING_REQUIRED_PARAMETERS]: '필수 매개변수 누락',
    [RESPONSE_CODE.INVALID_SCRIPT_ID]: '유효하지 않은 스크립트 ID',
    [RESPONSE_CODE.UNAUTHORIZED]: '인증 실패',
    [RESPONSE_CODE.FORBIDDEN]: '권한 부족',
    [RESPONSE_CODE.REQUEST_TIMEOUT]: '클라이언트 요청 타임아웃',
    [RESPONSE_CODE.RATE_LIMIT_EXCEEDED]: '요청 빈도 제한 초과',
    [RESPONSE_CODE.INVALID_FORMAT]: '잘못된 데이터 형식',
    [RESPONSE_CODE.REQUEST_TOO_LARGE]: '요청 크기 초과',
    
    // 스크립트 관련 기술 메시지
    [RESPONSE_CODE.SCRIPT_DOWNLOAD_ERROR]: '스크립트 다운로드 실패 - 네트워크 연결 오류',
    
    // 스크래핑 엔진 오류 기술 메시지 (4000번대)
    [RESPONSE_CODE.SCRAPING_ENGINE_ERROR]: '스크래핑 엔진 일반 오류',
    [RESPONSE_CODE.SCRAPING_ENGINE_ABNORMAL_TERMINATION]: '스크래핑 엔진 비정상 종료',
    [RESPONSE_CODE.SCRAPING_ENGINE_OUT_OF_MEMORY]: '스크래핑 엔진 메모리 부족 오류 (OOM)',
    [RESPONSE_CODE.SCRAPING_ENGINE_TIMEOUT]: '스크래핑 작업 타임아웃',
    [RESPONSE_CODE.SCRAPING_ENGINE_FORCE_TERMINATED]: '스크래핑 엔진 강제 종료됨',
    [RESPONSE_CODE.SCRAPING_ENGINE_INITIALIZATION_FAILED]: '스크래핑 엔진 초기화 실패',
    [RESPONSE_CODE.SCRAPING_ENGINE_DEPENDENCY_ERROR]: '스크래핑 엔진 외부 종속성 오류',
    [RESPONSE_CODE.SCRAPING_ENGINE_INCONSISTENT_STATE]: '스크래핑 엔진 내부 상태 불일치',
    [RESPONSE_CODE.SCRAPING_ENGINE_BROWSER_CRASH]: '브라우저 프로세스 충돌',
    [RESPONSE_CODE.SCRAPING_ENGINE_NETWORK_DISRUPTION]: '네트워크 연결 중단',
    
    [RESPONSE_CODE.ERROR]: '일반 오류',
} as const;


// 5. 원래 RESPONSE_PAIR 정의는 그대로 유지 
export const RESPONSE_PAIR: {
  [K in keyof typeof RESPONSE_CODE]: {
    code: typeof RESPONSE_CODE[K];
    message: typeof RESPONSE_MESSAGES[typeof RESPONSE_CODE[K]];
    techMessage: typeof RESPONSE_TECH_MESSAGES[typeof RESPONSE_CODE[K]];
  };
} = Object.fromEntries(
  Object.entries(RESPONSE_CODE).map(([key, code]) => [
    key,
    {
      code,
      message: RESPONSE_MESSAGES[code],
      techMessage: RESPONSE_TECH_MESSAGES[code]
    }
  ])
) as any;