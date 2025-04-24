import { RESPONSE_CODE, RESPONSE_MESSAGES, RESPONSE_TECH_MESSAGES } from "../constants/common";
import typia from "typia";
export type Request<T> = {
    key1: string;
    key2: string;
    config: RequestConfig;
    data: T;
}

export type RequestConfig = {
    timeout?: number & typia.tags.Minimum<1000> & typia.tags.Maximum<300000>;
    memory?: number & typia.tags.Minimum<1> & typia.tags.Maximum<1000>;
}


export type Response<T> = {
    code: ResponseCode 
    message: ResponseMessage;
    techMessage: ResponseTechMessage;
    data: T;
}


export type ResponseCode = 
    typeof RESPONSE_CODE[keyof typeof RESPONSE_CODE]
    & (typia.tags.Pattern<"^[1][0-9]{5}$"> & 
    typia.tags.MinLength<5> & 
    typia.tags.MaxLength<5>);
export type ResponseMessage = string;
export type ResponseTechMessage = string;
