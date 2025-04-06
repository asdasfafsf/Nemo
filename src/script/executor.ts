import { spawn } from "child_process";
import { Response, Request } from "../types/common";
import typia from "typia";
import { RESPONSE_PAIR } from "../constants";
import path from "path";
import env from "../config/env";
/**
 * 스크립트를 실행하는 함수
 * @param param0 스크립트 키 정보
 * @returns 스크립트 실행 결과
 */
export const executeScript = async (request: Request<unknown>): Promise<Response<any>> => {
    if (!typia.is<Request<unknown>>(request)) {
        return {
            ...RESPONSE_PAIR.INVALID_PARAMETERS,
            data: null
        }
    }

    const finalConfig = {
        timeout: 0,
        memory: 300,
        ...request.config
    };
    const config = finalConfig;
    const { key1, key2 } = request;

    const script = spawn(
        'node', 
        [
            path.resolve(env.scriptRootPath, `${key1}.js`),
            key2,
            JSON.stringify(request.data)
        ]
    );

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            resolve({
                ...RESPONSE_PAIR.REQUEST_TIMEOUT,
                data: null
            });
            script.kill();
        }, Number(config.timeout));

        script.stdout.on('data', (data) => {
            if (typia.is<Response<any>>(data)) {
                clearTimeout(timeout);  
                resolve(data);
            } else {
                clearTimeout(timeout);  
                resolve({
                    ...RESPONSE_PAIR.INVALID_OUTPUT_FORMAT,
                    data: null
                })
            }
        });
        script.stderr.on('data', (data) => {
            clearTimeout(timeout);  
            resolve({
                ...RESPONSE_PAIR.ERROR,
                data: null
            });
        });

        script.on('close', (code) => {
            clearTimeout(timeout);  
            resolve({
                ...RESPONSE_PAIR.ERROR,
                data: null
            });
        });
    });
};