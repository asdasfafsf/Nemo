import { PutObjectCommand, S3Client, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { ObjectCannedACL } from '@aws-sdk/client-s3';
import env from './config/env';
import { NemoError } from './errors/NemoError';
import { RESPONSE_PAIR } from './constants';

const s3Client = new S3Client({
    endpoint: env.S3.endpoint,
    region: env.S3.region,
    forcePathStyle: true,
    credentials: {
        accessKeyId: env.S3.accessKey,
        secretAccessKey: env.S3.secretKey
    },
});


/**
 * 파일 업로드
 * @param fileName 파일 이름
 * @param content 파일 내용
 * @returns 업로드 결과
 */
export const uploadFile = async ({
    fileName, 
    content, 
    contentType = 'text/plain', 
    acl = 'public-read'
}: {
    fileName: string, 
    content: string, 
    contentType?: string, 
    acl?: ObjectCannedACL
}) => {
    try {
        const command = new PutObjectCommand({
            Bucket: env.S3.bucketName,
            Key: fileName,
            Body: content,
            ContentType: contentType,
            ACL: acl,
    });

        const result = await s3Client.send(command);
        return result;
    } catch (e: any) {
        throw new NemoError(RESPONSE_PAIR.ERROR);
    }
}


/**
 * 파일 다운로드
 * @param fileName 파일 이름
 * @returns 다운로드 결과
 */
export const downloadFile = async ({fileName}: {fileName: string}) => {
    try {
        const command = new GetObjectCommand({
            Bucket: env.S3.bucketName,
            Key: fileName,
        }); 

        const result = await s3Client.send(command);
        return result;
    } catch (e: any) {
        if (e.message.includes('The specified key does not exist')) {
            throw new NemoError(RESPONSE_PAIR.INVALID_SCRIPT_ID);
        }
        throw new NemoError(RESPONSE_PAIR.ERROR);
    }
}

/**
 * 파일의 마지막 수정 시간 조회
 * @param fileName 파일 이름
 * @returns 마지막 수정 시간 (Date)
 */
export const getLastModified = async ({fileName}: {fileName: string}) => {
    try {
        const command = new HeadObjectCommand({
            Bucket: env.S3.bucketName,
            Key: fileName,
        });

        const result = await s3Client.send(command);
        return result.LastModified ?? null;
    } catch (e) {
        const metadata = (e as any).$metadata;
        if (metadata.httpStatusCode === 404) {
            throw new NemoError(RESPONSE_PAIR.INVALID_SCRIPT_ID);
        }
        throw new NemoError(RESPONSE_PAIR.ERROR);
    }
}