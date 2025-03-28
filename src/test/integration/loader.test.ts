import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import { loadScript } from '../../script/loader';
import { downloadScript } from '../../script/download';
import { NemoError } from '../../errors/NemoError';
import { RESPONSE_PAIR } from '../../constants';


describe('loadScript', () => {
  it('스크립트 로드', async () => {
    await loadScript({ key1: 'test1', key2: 'test1' });
    expect(downloadScript).toHaveBeenCalledWith({ key1: 'test1', key2: 'test1' });
  });

  it('스크립트 로드 실패', async () => {
    await expect(loadScript({ key1: 'test1111111', key2: 'test111111' }))
        .rejects
        .toThrow(new NemoError(RESPONSE_PAIR.INVALID_SCRIPT_ID));
  });
});

