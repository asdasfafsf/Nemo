import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { uploadFile, downloadFile, getLastModified } from '../../s3';
import { RESPONSE_PAIR } from '../../constants';

describe('S3 operations', () => {
  it('should upload file to s3 and get it back correctly', async () => {
    // 동적 파일 내용 생성
    const randomContent = crypto.randomBytes(64).toString('hex');
    const fileName = `test-${Date.now()}.txt`;
    
    // 파일 업로드
    const uploadResult = await uploadFile({fileName, content: randomContent});
    expect(uploadResult).toBeDefined();
    
    // 메타데이터 검증
    const metadata = uploadResult.$metadata;
    expect(metadata.httpStatusCode).toBe(200);
    
    // LastModified 검증
    const lastModified = await getLastModified({fileName});
    expect(lastModified).toBeDefined();
    expect(lastModified instanceof Date).toBe(true);
    expect(lastModified!.getTime()).toBeLessThanOrEqual(Date.now());
    
    const getResult = await downloadFile({fileName});
    expect(getResult.Body).toBeDefined();

    const content = await getResult?.Body?.transformToString();
    expect(content).toBe(randomContent);
  });

  it('should throw error when getting LastModified of non-existent file', async () => {
    const nonExistentFile = `non-existent-${Date.now()}.txt`;
    await expect(getLastModified({fileName: nonExistentFile}))
        .rejects.toThrow(RESPONSE_PAIR.INVALID_SCRIPT_ID.message);
  });

  it('should throw error when getting non-existent file', async () => {
    const nonExistentFile = `non-existent-${Date.now()}.txt`;
    await expect(downloadFile({fileName: nonExistentFile}))
        .rejects.toThrow(RESPONSE_PAIR.INVALID_SCRIPT_ID.message);
  });
});

