import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isExistScript, readScript } from '../../../script/script';
import * as fileUtils from '../../../utils/file';

describe('스크립트 파일 처리', () => {
  // 테스트 전후 처리
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isExistScript', () => {
    it('스크립트 파일이 존재하는 경우 true 반환', async () => {
      vi.spyOn(fileUtils, 'isExist').mockResolvedValue(true);
      
      const result = await isExistScript({ key1: 'test', key2: 'test' });
      expect(result).toBe(true);
    });

    it('스크립트 파일이 존재하지 않는 경우 false 반환', async () => {
      vi.spyOn(fileUtils, 'isExist').mockResolvedValue(false);
      
      const result = await isExistScript({ key1: 'test', key2: 'test' });
      expect(result).toBe(false);
    });
  });

  describe('readScript', () => {
    it('스크립트 파일 내용 읽기', async () => {
      const mockScript = 'console.log("Hello, Nemo!");';
      
      vi.spyOn(fileUtils, 'readFile').mockResolvedValue(mockScript);
      
      const result = await readScript({ key1: 'test', key2: 'test' });
      expect(result).toBe(mockScript);
    });
  });
}); 