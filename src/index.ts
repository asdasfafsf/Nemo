import env from './config/env';
import { loadScript } from './loader';

console.log(env);

loadScript({key1: 'key1', key2: 'key2'});



console.log('야')