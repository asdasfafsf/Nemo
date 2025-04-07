import fs from 'fs/promises';


/**
 * 파일 존재 여부 확인
 * @param path 파일 경로
 * @returns 파일 존재 여부
 */
export const isExist = async (path: string) => {
    try {
        await fs.access(path);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * 파일 읽기
 * @param path 파일 경로
 * @returns 파일 내용
 */
export const readFile = async (path: string) => {
    const content = await fs.readFile(path, 'utf-8');
    return content;
}


/**
 * 파일 쓰기
 * @param path 파일 경로
 * @param content 파일 내용
 */
export const writeFile = async (path: string, content: string) => {
    await fs.writeFile(path, content);
}