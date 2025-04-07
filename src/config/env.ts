import dotenv from 'dotenv';
import typia from 'typia';
import { EnvConfig } from '../types/env';

const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production.env' 
  : process.env.NODE_ENV === 'test' 
    ? '.env.test.env' 
    : '.env.development.env';

dotenv.config({ path: envFile });

// 환경 변수 객체 생성
const rawEnv = {
  S3: {
    secretKey: process.env.S3_SECRET_KEY,
    accessKey: process.env.S3_ACCESS_KEY,
    bucketName: process.env.S3_BUCKET_NAME,
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
  },
  scriptRootPath: process.env.SCRIPT_ROOT_PATH,
  serverPort: Number(process.env.SERVER_PORT),
};

// Typia로 환경 변수 검증
const validateResult = typia.validate<EnvConfig>(rawEnv);

if (!validateResult.success) {
  throw new Error('필수 환경 변수가 설정되지 않았습니다.');
}

// 검증된 환경 변수 내보내기
const env = validateResult.data;

export default env;