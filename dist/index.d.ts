export * from "./rail";
declare const _default: {
    isFailed: (value: any) => value is {
        failed: Symbol;
        err: any;
    };
    rail: <Fns extends import("./type").Fn[]>(...funcs: Fns) => (args: any) => Promise<{
        failed: Symbol;
        err: any;
    } | ReturnType<Fns[number]>>;
};
export default _default;
