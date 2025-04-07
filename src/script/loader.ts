import { needDownload, downloadScript } from "./download";
import { executeScript } from "./executor";
import { Request } from "../types/common";
/**
 * 스크립트를 로드하는 함수
 * @param {Object} param0 - 파라미터 객체
 * @param {string} param0.key1 - 첫번째 키
 * @param {string} param0.key2 - 두번째 키
 * @returns {Promise<void>}
 */
export const loadScript = async ({key1, key2}: {key1: string, key2: string}) => {
    const need = await needDownload({key1, key2});
    if (need) {
        await downloadScript({key1, key2});
    } 
};

export const runScript = async (request: Request<any>) => {
    return await executeScript(request);
}