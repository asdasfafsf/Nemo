import env from '../config/env';
import { isExist, readFile } from "../utils/file";

/**
 * 스크립트 존재 여부 확인
 * @param {Object} param0 - 파라미터 객체
 * @param {string} param0.key1 - 첫번째 키
 * @param {string} param0.key2 - 두번째 키
 * @returns {Promise<boolean>} 스크립트 존재 여부
 */
export const isExistScript = async ({key1, key2}: {key1: string, key2: string}) => {
    const scriptRootPath = env.scriptRootPath;
    const scriptPath = `${scriptRootPath}/${key1}.js`;
    return await isExist(scriptPath);
}

/**
 * 스크립트 읽기
 * @param {Object} param0 - 파라미터 객체
 * @param {string} param0.key1 - 첫번째 키
 * @param {string} param0.key2 - 두번째 키
 * @returns {Promise<string>} 스크립트
 */
export const readScript = async ({key1, key2}: {key1: string, key2: string}) => {
    const scriptRootPath = env.scriptRootPath;
    const scriptPath = `${scriptRootPath}/${key1}.js`;
    return await readFile(scriptPath);
} 