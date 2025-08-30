import { Request } from "express";

export interface RequestWithBody<T> extends Request<{}, {}, T> {}
export interface RequestWithBodyAndParams<T, J> extends Request<T, {}, J> {}
export interface RequestWithParams<T> extends Request<T, {}, {}, {}> {}