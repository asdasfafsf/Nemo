import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { needDownload, downloadScript } from '../../script/download';
import * as metadataModule from '../../script/metadata';
import * as scriptModule from '../../script/script';
import * as s3Module from '../../s3';

describe('스크립트 다운로드', () => {
  // 테스트 전후 처리
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('needDownload', () => {
    it('메타데이터가 없는 경우 다운로드 필요', async () => {
      vi.spyOn(metadataModule, 'isExistMetadata').mockResolvedValue(false);
      
      const result = await needDownload({ key1: 'test', key2: 'test' });
      expect(result).toBe(true);
    });

    it('메타데이터의 lastModified가 S3보다 오래된 경우 다운로드 필요', async () => {
      const oldDate = new Date('2024-01-01');
      const newDate = new Date('2024-03-01');
      
      vi.spyOn(metadataModule, 'isExistMetadata').mockResolvedValue(true);
      vi.spyOn(metadataModule, 'readMetadata').mockResolvedValue({
        lastModified: oldDate
      });
      vi.spyOn(s3Module, 'getLastModified').mockResolvedValue(newDate);
      
      const result = await needDownload({ key1: 'test', key2: 'test' });
      expect(result).toBe(true);
    });

    it('S3의 lastModified가 없는 경우 다운로드 필요', async () => {
      vi.spyOn(metadataModule, 'isExistMetadata').mockResolvedValue(true);
      vi.spyOn(metadataModule, 'readMetadata').mockResolvedValue({
        lastModified: new Date()
      });
      vi.spyOn(s3Module, 'getLastModified').mockResolvedValue(null);
      
      const result = await needDownload({ key1: 'test', key2: 'test' });
      expect(result).toBe(true);
    });

    it('스크립트 파일이 없는 경우 다운로드 필요', async () => {
      const date = new Date();
      
      vi.spyOn(metadataModule, 'isExistMetadata').mockResolvedValue(true);
      vi.spyOn(metadataModule, 'readMetadata').mockResolvedValue({
        lastModified: date
      });
      vi.spyOn(s3Module, 'getLastModified').mockResolvedValue(date);
      vi.spyOn(scriptModule, 'isExistScript').mockResolvedValue(false);
      
      const result = await needDownload({ key1: 'test', key2: 'test' });
      expect(result).toBe(true);
    });

    it('모든 조건이 충족되면 다운로드 불필요', async () => {
      const date = new Date();
      
      vi.spyOn(metadataModule, 'isExistMetadata').mockResolvedValue(true);
      vi.spyOn(metadataModule, 'readMetadata').mockResolvedValue({
        lastModified: date
      });
      vi.spyOn(s3Module, 'getLastModified').mockResolvedValue(date);
      vi.spyOn(scriptModule, 'isExistScript').mockResolvedValue(true);
      
      const result = await needDownload({ key1: 'test', key2: 'test' });
      expect(result).toBe(false);
    });
  });

  describe('downloadScript', () => {
    it('스크립트 다운로드', async () => {
      const result = await downloadScript({ key1: 'test', key2: 'test' });
      expect(result).toBe('');
    });
  });
}); 