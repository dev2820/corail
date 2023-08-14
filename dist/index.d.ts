export * from "./rail";
declare const _default: {
    isFailed: (value: any) => value is {
        failed: Symbol;
        err: any;
    };
    railRight: <Fns extends import("./type").Fn[]>(...funcs: Fns) => (args: any) => Promise<{
        failed: Symbol;
        err: any;
    } | ReturnType<Fns[0]>>;
    rail: <Fns_1 extends import("./type").Fn[]>(...funcs: Fns_1) => (args: any) => Promise<{
        failed: Symbol;
        err: any;
    } | ReturnType<Fns_1[number]>>;
};
export default _default;
