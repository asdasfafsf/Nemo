import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isExistMetadata, readMetadata } from '../../../script/metadata';
import * as fileUtils from '../../../utils/file';

describe('메타데이터 처리', () => {
  // 테스트 전후 처리
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isExistMetadata', () => {
    it('메타데이터 파일이 존재하는 경우 true 반환', async () => {
      vi.spyOn(fileUtils, 'isExist').mockResolvedValue(true);
      
      const result = await isExistMetadata({ key1: 'test', key2: 'test' });
      expect(result).toBe(true);
    });

    it('메타데이터 파일이 존재하지 않는 경우 false 반환', async () => {
      vi.spyOn(fileUtils, 'isExist').mockResolvedValue(false);
      
      const result = await isExistMetadata({ key1: 'test', key2: 'test' });
      expect(result).toBe(false);
    });
  });

  describe('readMetadata', () => {
    it('메타데이터 파일을 읽고 날짜를 Date 객체로 변환', async () => {
      const mockMetadata = {
        version: '1.0.0',
        lastModified: '2024-03-20T00:00:00Z'
      };
      
      vi.spyOn(fileUtils, 'readFile').mockResolvedValue(JSON.stringify(mockMetadata));
      
      const result = await readMetadata({ key1: 'test', key2: 'test' });
      
      expect(result.lastModified).toBeInstanceOf(Date);
      expect(result.lastModified.toISOString()).toBe('2024-03-20T00:00:00.000Z');
    });
  });
}); 