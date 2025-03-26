import { describe, it, expect } from 'vitest';
import axios from 'axios';
import crypto from 'crypto';
import { uploadFile } from '../s3';
import env from '../config/env';

describe('S3 uploadFile', () => {
  it('should upload file to s3 and be downloadable', async () => {
    // 동적 파일 내용 생성 (매번 다른 내용)
    const randomContent = crypto.randomBytes(64).toString('hex');
    const fileName = `test2.txt`;
    
    // 파일 업로드
    const result = await uploadFile({fileName, content: randomContent});
    const fileUrl = `${env.S3.endpoint}/${env.S3.bucketName}/${fileName}`;

    expect(result).toBeDefined();
    expect(fileUrl).toBeDefined();
    
    // 업로드된 파일 다운로드 테스트
    const response = await axios.get(fileUrl);
    
    // 다운로드한 내용이 업로드한 내용과 일치하는지 확인
    expect(response.status).toBe(200);
    expect(response.data).toBe(randomContent);
    
    // 선택적: 테스트 후 파일 삭제 (cleanup)
    // await deleteFile(fileName);
  });
 
}); 
