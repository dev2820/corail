import type { Fn } from "./type";
type Failed = {
    failed: Symbol;
    err: any;
};
export declare const isFailed: (value: any) => value is Failed;
export declare const rail: <Fns extends Fn[]>(...funcs: Fns) => (args: any) => Promise<Failed | ReturnType<Fns[number]>>;
export declare const railRight: <Fns extends Fn[]>(...funcs: Fns) => (args: any) => Promise<Failed | ReturnType<Fns[0]>>;
export {};
