import { Request } from "express";

export interface RequestWithBody<T> extends Request<{}, {}, T> {}
export interface RequestWithQuery<T> extends Request<{}, {},{}, T> {}
export interface RequestWithParamsAndBody<T, J> extends Request<T, {}, J> {}
export interface RequestWithBodyAndParamsAndQuery<T, J, C> extends Request<T, {}, J, C> {}
export interface RequestWithParams<T> extends Request<T, {}, {}, {}> {}
export interface RequestWithParamsAndQuery<T, J> extends Request<T, {}, {}, J> {}