import typia from "typia";
import { getLastModified } from "../s3";
import { isExistMetadata, readMetadata } from "./metadata";
import { isExistScript } from "./script";

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
    // 다운로드 로직 구현 예정
    return '';
} 