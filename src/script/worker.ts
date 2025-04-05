import path from 'path';
import { RESPONSE_PAIR } from '../constants/common';
import env from '../config/env';


const scriptRootPath = env.scriptRootPath || './scripts';
const [nodePath, workerPath, key1, key2, dataJson] = process.argv;

console.log('워커를 실행해요!11111')
try {
    const scriptPath = path.resolve(scriptRootPath, `${key1}.js`);
    
    // require() 대신 동적 import() 사용
    const script = await import(scriptPath);

    console.log('워커를 실행해요!')
    
    if (typeof script.nemo !== 'function') {
        console.log(JSON.stringify({
            ...RESPONSE_PAIR.SCRAPING_ENGINE_UNDEFINED_NEMO,
            data: null
        }));
        process.exit(0);
    }
    
    const data = dataJson ? JSON.parse(dataJson) : {};
    
    const result = script.nemo(data);
    console.log(JSON.stringify(result));
    process.exit(0);
} catch (error: any) {
    console.log(JSON.stringify({
        ...RESPONSE_PAIR.ERROR,
        data: null
    }));
    process.exit(1);
}