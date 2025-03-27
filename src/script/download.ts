import typia from "typia";
import { getLastModified, downloadFile } from "../s3";
import { isExistMetadata, readMetadata } from "./metadata";
import { isExistScript } from "./script";
import env from "../config/env";
import { writeFile } from "../utils/file";
import { NemoError } from "../errors/NemoError";
import { RESPONSE_PAIR } from "../constants";

/**
 * 다운로드가 필요한지 확인하는 함수
 * @param {Object} param0 - 파라미터 객체
 * @param {string} param0.key1 - 첫번째 키
 * @param {string} param0.key2 - 두번째 키
 * @returns {Promise<boolean>} 다운로드 필요 여부
 * @throws {Error} 다운로드 필요 여부를 확인하는 중 오류가 발생한 경우
 */
export const needDownload = async (
    {key1, key2}: {key1: string, key2: string}
): Promise<boolean> => {
    try {
        const hasMetaData = await isExistMetadata({key1, key2});
        if (hasMetaData) {
            const metadata = await readMetadata({key1, key2});
            if (!typia.is<Date>(metadata.lastModified)) {
                return true;
            }

            const modified = await getLastModified({fileName: key1});   
            if (!modified 
                || !typia.is<Date>(modified) 
                || modified.getTime() > metadata.lastModified.getTime()
            ) {
                return true;
            }

            return !(await isExistScript({key1, key2}));
        }
    } catch (e) {
        return true;
    }
   
    return true;
};

/**
 * 스크립트를 다운로드하는 함수
 * @param {Object} param0 - 파라미터 객체
 * @param {string} param0.key1 - 첫번째 키
 * @param {string} param0.key2 - 두번째 키
 * @returns {Promise<string>} 다운로드된 스크립트
 */
export const downloadScript = async ({key1, key2}: {key1: string, key2: string}): Promise<string> => {
    const MAX_RETRIES = 3;
    let retries = 0;
    
    while (retries < MAX_RETRIES) {
        try {
            const result = await downloadFile({fileName: `script/${key1}.js`});
            const content = await result.Body?.transformToString();
            
            if (!content) {
                throw new NemoError(RESPONSE_PAIR.SCRIPT_DOWNLOAD_ERROR);
            }
            
            await writeFile(`${env.scriptRootPath}/${key1}.js`, content);
            await writeFile(`${env.scriptRootPath}/${key1}.metadata`, JSON.stringify({
                lastModified: result.LastModified ?? new Date(1970, 1, 1)
            }));
            return content;
        } catch (error: any) {
            retries++;
            
            if (retries >= MAX_RETRIES) {
                if (error instanceof NemoError) {
                    throw error;
                }
                
                throw new NemoError(RESPONSE_PAIR.SCRIPT_DOWNLOAD_ERROR);
            }
            
            // 재시도 전 잠시 대기 (지수 백오프)
            const waitTime = Math.min(1000 * Math.pow(2, retries), 10000);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
    
    // 코드가 여기까지 도달하면 안되지만, TypeScript를 만족시키기 위함
    throw new NemoError(RESPONSE_PAIR.SCRIPT_DOWNLOAD_ERROR);
}; 