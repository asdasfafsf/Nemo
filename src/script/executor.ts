import { spawn } from "child_process";
import { Response, Request } from "../types/common";
import typia from "typia";
import { RESPONSE_PAIR } from "../constants";

/**
 * 스크립트를 실행하는 함수
 * @param param0 스크립트 키 정보
 * @returns 스크립트 실행 결과
 */
export const executeScript = async (request: Request<any>): Promise<Response<any>> => {
    if (!typia.is<Request<any>>(request)) {
        return {
            ...RESPONSE_PAIR.INVALID_PARAMETERS,
            data: null
        }
    }

    const finalConfig = {
        timeout: 30000,
        memory: 300,
        ...request.config
    };
    const config = finalConfig;
    const { key1, key2 } = request;

    const script = spawn('node', [key1, key2]);


    return new Promise((resolve, reject) => {
        script.stdout.on('data', (data) => {
            if (typia.is<Response<any>>(data)) {
                resolve(data);
            } else {
                resolve({
                    ...RESPONSE_PAIR.INVALID_OUTPUT_FORMAT,
                    data: null
                })
            }
        });
        script.stderr.on('data', (data) => {
            console.error(data.toString());
        });
    });
};