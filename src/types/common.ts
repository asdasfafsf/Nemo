import { RESPONSE_CODE, RESPONSE_MESSAGES, RESPONSE_TECH_MESSAGES } from "../constants/common";

export type Request<T> = {
    key1: string;
    key2: string;
    data: T;
}


export type Response<T> = {
    code: ResponseCode;
    message: ResponseMessage;
    techMessage: ResponseTechMessage;
    data: T;
}


export type ResponseCode = typeof RESPONSE_CODE[keyof typeof RESPONSE_CODE];
export type ResponseMessage = typeof RESPONSE_MESSAGES[keyof typeof RESPONSE_MESSAGES];
export type ResponseTechMessage = typeof RESPONSE_TECH_MESSAGES[keyof typeof RESPONSE_TECH_MESSAGES];
