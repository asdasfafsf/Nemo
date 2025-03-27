import { describe, it, expect, vi } from 'vitest';
import { needDownload, downloadScript, decryptScript, loadScript, readMetadata } from '../loader';
import * as fileUtils from '../utils/file';
import * as loader from '../loader';
import * as s3Module from '../s3';


describe('readMetadata : 메타데이터 읽기', async () => {
    it('should be defined', () => {
        expect(readMetadata).toBeDefined();
    });

    it('메타데이터가 존재하는 경우', async () => {
        const dummyMetadata = {
            lastModified: new Date(),
        };
        vi.spyOn(fileUtils, 'readFile')
            .mockResolvedValue(JSON.stringify(dummyMetadata));
  
        const result = await readMetadata({key1: 'test', key2: 'test'});
        expect(result).toBeDefined();
    });

});


describe('needDownload : 파일 다운로드 필요 여부 확인', async () => {
    it('should be defined', () => {
        expect(needDownload).toBeDefined();
    });
    

    it('메타데이터가 존재하지 않는 경우', async () => {
        vi.spyOn(loader, 'isExistMetadata').mockResolvedValue(false);

        const result = await needDownload({key1: 'test', key2: 'test'});
        expect(result).toBe(true);
    });

    it('메타데이터가 존재하지만 메타데이터 포맷이 올바르지 않은 경우', async () => {
        vi.spyOn(loader, 'isExistMetadata')
            .mockResolvedValue(true);

        vi.spyOn(loader, 'readMetadata')
            .mockResolvedValue({});

        const result = await needDownload({key1: 'test', key2: 'test'});
        expect(result).toBe(true);
    });

    it('메타데이터가 존재하고 메타데이터 포맷이 올바른 경우, Modified 결과에 의해 정해짐', async () => {
        vi.spyOn(loader, 'isExistMetadata')
            .mockResolvedValue(true);
        vi.spyOn(loader, 'readMetadata')
            .mockResolvedValue({
                lastModified: new Date(1970, 1, 1),
            });
        vi.spyOn(s3Module, 'getLastModified')
            .mockResolvedValue(new Date(1971, 1, 1));


        const result = await needDownload({key1: 'test', key2: 'test'});
        expect(result).toBe(true);
    });


    
    it ('메타데이터가 존재하고 메타데이터 포맷이 올바른 경우, Modified 결과에 의해 정해짐', async () => {
        vi.spyOn(loader, 'isExistMetadata')
            .mockResolvedValue(true);

        vi.spyOn(loader, 'readMetadata')
            .mockResolvedValue({
                lastModified: new Date(1971, 1, 1),
            });

        vi.spyOn(s3Module, 'getLastModified')
            .mockResolvedValue(new Date(1970, 1, 1));

        vi.spyOn(loader, 'isExistScript')
            .mockResolvedValue(true);

        const result = await needDownload({key1: 'test', key2: 'test'});
        expect(result).toBe(false);
    }); 
    
});


// describe('needDownload : 스크립트 다운로드 필요 여부 확인', async () => {
//     it('should be defined', () => {
//         expect(needDownload).toBeDefined();
//     });

//     it('스크립트 다운로드가 필요한 경우', async () => {
//         vi.spyOn(fs, 'access').mockRejectedValue(new Date(1970, 1, 1));
//         vi.spyOn(s3Module, 'getLastModified').mockResolvedValue(new Date());

//         const result = await needDownload({key1: 'test', key2: 'test'});
//         expect(result).toBe(true);
//     });

//     it('스크립트 다운로드가 필요하지 않은 경우', async () => {
//         const result = await needDownload({key1: 'test', key2: 'test'});
//         expect(result).toBe(false);
//     });

//     it('스크립트가 존재하지 않을 경우', async () => {
//         const result = await needDownload({key1: 'test', key2: 'test'});
//         expect(result).toBe(false);
//     });
// });

// describe('downloadScript : 스크립트 다운로드', async () => {
//     it('should be defined', () => {
//         expect(downloadScript).toBeDefined();
//     });
// });

// describe('decryptScript : 스크립트 복호화', async () => {
//     it('should be defined', () => {
//         expect(decryptScript).toBeDefined();
//     });
// });


// describe('loadScript : 스크립트 로드', async () => {
//     it('should be defined', () => {
//         expect(loadScript).toBeDefined();
//     });
// });

