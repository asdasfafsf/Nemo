import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import env from './config/env';

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
export const uploadFile = async ({fileName, content}: {fileName: string, content: string}) => {
    const command = new PutObjectCommand({
        Bucket: env.S3.bucketName,
        Key: fileName,
        Body: content,
        ContentType: 'text/plain',
        ACL: 'public-read',
    });

    console.log(env);
    const result = await s3Client.send(command);
    return result;
}