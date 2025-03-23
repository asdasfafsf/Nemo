import { RESPONSE_CODE } from "../constants/common";

export type Request<T> = {
    key1: string;
    key2: string;
    data: T;
}


export type Response<T> = {
    code: ResponseCode;
    message: string;
    data: T;
}


export type ResponseCode = typeof RESPONSE_CODE[keyof typeof RESPONSE_CODE];