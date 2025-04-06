import { Request, Response } from './common';

export type HttpRequest<T> = Request<T>;
export type HttpResponse = Response<any>;