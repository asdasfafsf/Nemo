import path from 'path';
import { RESPONSE_PAIR } from '../constants/common';
import env from '../config/env';
import typia from 'typia';


const scriptRootPath = env.scriptRootPath || './scripts';
const [nodePath, workerPath, key1, key2, dataJson] = process.argv;
(async () => {
    try {
        const scriptPath = path.resolve(scriptRootPath, `${key1}.js`);
        const script = await import(scriptPath);

        if (typeof script.nemo !== 'function') {
            console.log(JSON.stringify({
                ...RESPONSE_PAIR.SCRAPING_ENGINE_UNDEFINED_NEMO,
                data: null
            }));
            process.exit(0);
        }
        
        const data = dataJson ? JSON.parse(dataJson) : {};

        const result = await script.nemo(data);
        if (!typia.is<Response>(result)) {
            console.log(JSON.stringify({
                ...RESPONSE_PAIR.INVALID_OUTPUT_FORMAT,
                data: result
            }));
            process.exit(0);
        }

        console.log(JSON.stringify(result));
        process.exit(0);
    } catch (error) {
        console.log(JSON.stringify({
            ...RESPONSE_PAIR.ERROR,
            data: null
        }));
        process.exit(1);
    }
})();
