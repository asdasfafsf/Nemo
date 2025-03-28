import { RESPONSE_CODE, RESPONSE_MESSAGES, RESPONSE_TECH_MESSAGES } from "../constants/common";
import typia from "typia";
export type Request<T> = {
    key1: string;
    key2: string;
    data: T;
}



export type Response<T> = {
    code: ResponseCode 
    message: ResponseMessage;
    techMessage: ResponseTechMessage;
    data: T;
}


export type ResponseCode = 
    typeof RESPONSE_CODE[keyof typeof RESPONSE_CODE]
    | (typia.tags.Pattern<"^[1][0-9]{4}$"> & 
    typia.tags.MinLength<5> & 
    typia.tags.MaxLength<5>);
export type ResponseMessage = typeof RESPONSE_MESSAGES[keyof typeof RESPONSE_MESSAGES];
export type ResponseTechMessage = typeof RESPONSE_TECH_MESSAGES[keyof typeof RESPONSE_TECH_MESSAGES];
