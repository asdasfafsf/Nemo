import { RESPONSE_PAIR } from '../constants/common';
import typia from 'typia';
import { Response } from '../types';


const [nodePath, scriptPath, key2, dataJson] = process.argv;
(async function() {
    try {
        const script = await import(scriptPath);

        if (typeof script.nemo !== 'function') {
            console.log(JSON.stringify({
                ...RESPONSE_PAIR.SCRAPING_ENGINE_UNDEFINED_NEMO,
                data: null
            }));
        }
        
        const data = dataJson ? JSON.parse(dataJson) : {};

        const result = await script.nemo(data);
        if (!typia.is<Response<any>>(result)) {
            console.log(JSON.stringify({
                ...RESPONSE_PAIR.INVALID_OUTPUT_FORMAT,
                data: result
            }));
        }

        console.log(JSON.stringify(result));
    } catch (error) {
        console.log(JSON.stringify({
            ...RESPONSE_PAIR.ERROR,
            data: null
        }));
    }
}());
