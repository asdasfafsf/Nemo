import env from '../config/env';
import typia from "typia";
import { isExist, readFile } from "../utils/file";
import { Metadata } from "../types/metadata";

/**
 * 메타데이터 존재 여부 확인
 * @param {Object} param0 - 파라미터 객체
 * @param {string} param0.key1 - 첫번째 키
 * @param {string} param0.key2 - 두번째 키
 * @returns {Promise<boolean>} 메타데이터 존재 여부
 */
export const isExistMetadata = async ({key1, key2}: {key1: string, key2: string}) => {
    const scriptRootPath = env.scriptRootPath;
    const metadataPath = `${scriptRootPath}/${key1}.metadata`;
    return await isExist(metadataPath);
}

/**
 * 메타데이터 읽기
 * @param {Object} param0 - 파라미터 객체
 * @param {string} param0.key1 - 첫번째 키
 * @param {string} param0.key2 - 두번째 키
 * @returns {Promise<Metadata>} 메타데이터
 */
export const readMetadata = async ({key1, key2}: {key1: string, key2: string}): Promise<Metadata> => {
    const scriptRootPath = env.scriptRootPath;
    const metadataPath = `${scriptRootPath}/${key1}.metadata`;
    const content = await readFile(metadataPath);
    const parsedMetadata = JSON.parse(content);
    const metadata = {
        ...parsedMetadata,
        lastModified: new Date(parsedMetadata.lastModified)
    }
    typia.assert<Metadata>(metadata);
    return metadata;
} 