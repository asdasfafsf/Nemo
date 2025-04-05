import { spawn } from 'child_process';
import path from 'path';
import { describe, it, expect } from 'vitest';
import env from '../../config/env';

describe('worker.ts 통합 테스트', () => {
  // 경로 설정
  const scriptPath = env.scriptRootPath || '/Users/han-wongeun/Desktop/workspace/node/nemo/src/script';
  const workerTsPath = path.resolve('./src/script/worker.ts');
  

  console.log('야도데체오9그러냐??', workerTsPath)
  it('스크립트를 실행하고 결과를 반환해야 함', async () => {
    // 테스트 데이터
    const testData = { key: 'value', number: 123 };
    
    // worker.js 실행 및 결과 수집 함수
    const runWorker = () => {
      return new Promise<any>((resolve, reject) => {
        // 컴파일된 worker.js 실행 (환경 변수 설정)
        const worker = spawn('ts-node', [
          '--esm',  // ESM 모드 지원 플래그 추가
          workerTsPath,
          'test1',
          'testAction',
          JSON.stringify(testData)
        ], {
          env: {
            ...process.env,
            NODE_ENV: 'test'
          }
        });
        
        let output = '';
        let errorOutput = '';
        
        // 출력 수집
        worker.stdout.on('data', (data) => {
          output += data.toString();
          console.log(`워커 출력: ${data.toString()}`);  // 디버깅용 로그 추가
        });
        
        // 오류 출력 로깅
        worker.stderr.on('data', (data) => {
          errorOutput += data.toString();
          console.error(`워커 오류: ${data.toString()}`);
        });
        
        // 종료 시 결과 반환
        worker.on('close', (code) => {
          console.log(`워커 종료 코드: ${code}`);  // 디버깅용 로그 추가
          
          if (code !== 0) {
            reject(new Error(`워커가 종료 코드 ${code}로 종료됨: ${errorOutput}`));
            return;
          }
          
          try {
            const result = JSON.parse(output);
            resolve(result);
          } catch (error) {
            reject(new Error(`결과 파싱 실패: ${output}`));
          }
        });
      });
    };
    
    // 워커 실행 및 결과 검증
    const result = await runWorker();
    
    expect(result.code).toBe(0);
    expect(result.message).toBe("성공");
    expect(result.data).toEqual(testData);
  });
});
