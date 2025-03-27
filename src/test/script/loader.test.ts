import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadScript } from '../../script/loader';
import * as downloadModule from '../../script/download';
import * as scriptModule from '../../script/script';
import * as decryptModule from '../../script/decrypt';

describe('스크립트 로더', () => {
  // 테스트 전후 처리
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadScript', () => {
    it('다운로드가 필요한 경우 다운로드 후 복호화', async () => {
      const script = 'console.log("Downloaded script");';
      
      vi.spyOn(downloadModule, 'needDownload').mockResolvedValue(true);
      vi.spyOn(downloadModule, 'downloadScript').mockResolvedValue(script);
      vi.spyOn(decryptModule, 'decryptScript').mockResolvedValue(script);
      
      const result = await loadScript({ key1: 'test', key2: 'test' });
      
      expect(downloadModule.needDownload).toHaveBeenCalledWith({ key1: 'test', key2: 'test' });
      expect(downloadModule.downloadScript).toHaveBeenCalledWith({ key1: 'test', key2: 'test' });
      expect(decryptModule.decryptScript).toHaveBeenCalledWith(script);
      expect(result).toBe(script);
    });

    it('다운로드가 필요하지 않은 경우 로컬 파일 읽어서 복호화', async () => {
      const script = 'console.log("Local script");';
      
      vi.spyOn(downloadModule, 'needDownload').mockResolvedValue(false);
      vi.spyOn(scriptModule, 'readScript').mockResolvedValue(script);
      vi.spyOn(decryptModule, 'decryptScript').mockResolvedValue(script);
      
      const result = await loadScript({ key1: 'test', key2: 'test' });
      
      expect(downloadModule.needDownload).toHaveBeenCalledWith({ key1: 'test', key2: 'test' });
      expect(scriptModule.readScript).toHaveBeenCalledWith({ key1: 'test', key2: 'test' });
      expect(decryptModule.decryptScript).toHaveBeenCalledWith(script);
      expect(result).toBe(script);
    });
  });
}); 