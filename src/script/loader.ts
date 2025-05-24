import { needDownload, downloadScript } from "./download";
import { executeScript } from "./executor";
import { Request } from "../types/common";
import { NemoError } from "../errors/NemoError";
import { RESPONSE_PAIR } from "../constants";
/**
 * 스크립트를 로드하는 함수
 * @param {Object} param0 - 파라미터 객체
 * @param {string} param0.key1 - 첫번째 키
 * @param {string} param0.key2 - 두번째 키
 * @returns {Promise<void>}
 */
export const loadScript = async ({key1, key2}: {key1: string, key2: string}) => {
    console.log("loadScript", {key1, key2});
    const need = await needDownload({key1, key2});
    if (need) {
        console.log("downloadScript", {key1, key2});
        await downloadScript({key1, key2});
        console.log("downloadScript end", {key1, key2});
    } 

    console.log("loadScript end", {key1, key2});
};

export const runScript = async (request: Request<any>) => {
    try {
        const result = await executeScript(request);
        return result;
    } catch (error) {
        console.error(error);
        if (error instanceof NemoError) {
            throw error;
        }
        throw new NemoError(RESPONSE_PAIR.ERROR, { cause: error });
    }
}