import { RESPONSE_PAIR } from '../constants/common';
import typia from 'typia';
import { Response } from '../types';
import process from 'process';

const [nodePath, workerPath,scriptPath, key2, dataJson] = process.argv;
(async function() {
    try {
        const script = await import(scriptPath);
        if (typeof script.nemo !== 'function') {
            process.stdout.write(JSON.stringify({
                ...RESPONSE_PAIR.SCRAPING_ENGINE_UNDEFINED_NEMO,
                data: null
            }));

            return;
        }
        
        const data = dataJson ? JSON.parse(dataJson) : {};

        const result = await script.nemo(data);
        if (!typia.is<Response<any | null>>(result)) {
            process.stdout.write(JSON.stringify({
                ...RESPONSE_PAIR.INVALID_OUTPUT_FORMAT,
                data: result,
            }));

            return;
        }

        process.stdout.write(JSON.stringify(result));
    } catch (error) {
        process.stdout.write(JSON.stringify({
            ...RESPONSE_PAIR.ERROR,
            techMessage: (error as Error).message ?? '정의되지 않은 오류입니다',
            data: null
        }));
    }
}());
