import { spawn } from "child_process";
import { Response, Request } from "../types/common";
import typia from "typia";
import { RESPONSE_PAIR } from "../constants";
import path from "path";
import env from "../config/env";
import { fileURLToPath } from 'url';

// ESM에서 __dirname 구현
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 스크립트를 실행하는 함수
 * @param param0 스크립트 키 정보
 * @returns 스크립트 실행 결과
 */
export const executeScript = async (request: Request<unknown>): Promise<Response<any>> => {
    return await new Promise((resolve, reject) => {   
        try {
            if (!typia.is<Request<unknown>>(request)) {
                    resolve({
                        ...RESPONSE_PAIR.INVALID_PARAMETERS,
                        data: null
                    })
            }
            
            const finalConfig = {
                timeout: 10000,
                memory: 300,
                ...request.config
            };
            const config = finalConfig;
            const { key1, key2 } = request;

            const script = spawn(
                'node',
                [
                    path.resolve(__dirname, 'worker.js'),
                    path.resolve(env.scriptRootPath, `${key1}.js`),
                    key2,
                    JSON.stringify(request.data)
                ]
            );

        
            const timeout = setTimeout(() => {
                resolve({
                    ...RESPONSE_PAIR.REQUEST_TIMEOUT,
                    data: null
                });
                script.kill();
            }, Number(config.timeout));

            let data = '';

            script.stdout.on('data', async (out) => {
                try {   
                    data += out;
                } catch (e) {
                    clearTimeout(timeout);  
                    resolve({
                        ...RESPONSE_PAIR.ERROR,
                        data: null
                    });
                }
            });

            script.stderr.on('data', async (data) => {
                try {
                    clearTimeout(timeout);  
                    resolve({
                        ...RESPONSE_PAIR.ERROR,
                        data: null
                    });
                } catch (e) {
                    clearTimeout(timeout);  
                    resolve({
                        ...RESPONSE_PAIR.ERROR,
                        data: null
                    });
                }
            });

            script.on('close', async (code) => {
                try {
                    clearTimeout(timeout);  
                    if (typia.json.isStringify(data)) {
                        data = JSON.parse(data);
                    }

                    if (typia.is<Response<any>>(data)) {
                        resolve(data);
                    } else {
                        resolve({
                            ...RESPONSE_PAIR.INVALID_OUTPUT_FORMAT,
                                data: null
                            })
                    }
                } catch (e) {
                    clearTimeout(timeout);  
                    resolve({
                        ...RESPONSE_PAIR.ERROR,
                        data: null
                    })
                }
            });
            

        
    } catch (e) {
        resolve({
            ...RESPONSE_PAIR.ERROR,
            data: null
        })
    } finally {

    }});
};