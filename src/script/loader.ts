import { readScript } from "./script";
import { needDownload, downloadScript } from "./download";

/**
 * 스크립트를 로드하는 함수
 * @param {Object} param0 - 파라미터 객체
 * @param {string} param0.key1 - 첫번째 키
 * @param {string} param0.key2 - 두번째 키
 * @returns {Promise<string>} 로드된 스크립트
 */
export const loadScript = async ({key1, key2}: {key1: string, key2: string}): Promise<string> => {
    const need = await needDownload({key1, key2});
    
    if (need) {
        await downloadScript({key1, key2});
    } 

    const script = await readScript({key1, key2});
    
    return script;
}; 