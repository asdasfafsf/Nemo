import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isExist, readFile, writeFile } from '../utils/file';
import fs from 'fs/promises';

// fs 모듈 모킹
vi.mock('fs/promises', () => ({
    default: {
        access: vi.fn(),
        readFile: vi.fn(),
        writeFile: vi.fn()
    }
}));

describe('file utils', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('isExist', () => {
        it('파일이 존재하는 경우 true 반환', async () => {
            vi.mocked(fs.access).mockResolvedValue(undefined);
            
            const result = await isExist('test.txt');
            expect(result).toBe(true);
        });

        it('파일이 존재하지 않는 경우 false 반환', async () => {
            vi.mocked(fs.access).mockRejectedValue(new Error('파일 없음'));
            
            const result = await isExist('test.txt');
            expect(result).toBe(false);
        });
    });

    describe('readFile', () => {
        it('파일 내용을 정상적으로 읽어옴', async () => {
            const mockContent = '테스트 내용';
            vi.mocked(fs.readFile).mockResolvedValue(mockContent);
            
            const result = await readFile('test.txt');
            expect(result).toBe(mockContent);
        });

        it('파일 읽기 실패시 에러 발생', async () => {
            vi.mocked(fs.readFile).mockRejectedValue(new Error('읽기 실패'));
            
            await expect(readFile('test.txt'))
                .rejects
                .toThrow('읽기 실패');
        });
    });

    describe('writeFile', () => {
        it('파일을 정상적으로 씀', async () => {
            const content = '테스트 내용';
            vi.mocked(fs.writeFile).mockResolvedValue(undefined);
            
            await writeFile('test.txt', content);
            expect(fs.writeFile).toHaveBeenCalledWith('test.txt', content);
        });

        it('파일 쓰기 실패시 에러 발생', async () => {
            vi.mocked(fs.writeFile).mockRejectedValue(new Error('쓰기 실패'));
            
            await expect(writeFile('test.txt', '내용'))
                .rejects
                .toThrow('쓰기 실패');
        });
    });
});
