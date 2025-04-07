import { RESPONSE_PAIR } from "../constants/common";

export class NemoError extends Error {
    readonly code: typeof RESPONSE_PAIR[keyof typeof RESPONSE_PAIR]['code'];
    readonly techMessage: typeof RESPONSE_PAIR[keyof typeof RESPONSE_PAIR]['techMessage'];

    constructor(
        responsePair: typeof RESPONSE_PAIR[keyof typeof RESPONSE_PAIR],
        options?: ErrorOptions
    ) {
        super(responsePair.message, options);

        this.name = 'NemoError';
        this.code = responsePair.code;
        this.techMessage = responsePair.techMessage;

        // 스택 트레이스 보존
        Error.captureStackTrace(this, this.constructor);
    }
}

