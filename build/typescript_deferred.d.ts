declare module "typescript-deferred" {

    export interface ImmediateSuccessCB<T, TP> {
        (value: T): TP;
    }
    export interface ImmediateErrorCB<TP> {
        (err: any): TP;
    }
    export interface DeferredSuccessCB<T, TP> {
        (value: T): ThenableInterface<TP>;
    }
    export interface DeferredErrorCB<TP> {
        (error: any): ThenableInterface<TP>;
    }
    export interface ThenableInterface<T> {
        then<TP>(successCB?: ImmediateSuccessCB<T, TP>, errorCB?: ImmediateErrorCB<TP>): ThenableInterface<TP>;
        then<TP>(successCB?: DeferredSuccessCB<T, TP>, errorCB?: ImmediateErrorCB<TP>): ThenableInterface<TP>;
        then<TP>(successCB?: ImmediateSuccessCB<T, TP>, errorCB?: DeferredErrorCB<TP>): ThenableInterface<TP>;
        then<TP>(successCB?: DeferredSuccessCB<T, TP>, errorCB?: DeferredErrorCB<TP>): ThenableInterface<TP>;
    }
    export interface PromiseInterface<T> extends ThenableInterface<T> {
        then<TP>(successCB?: ImmediateSuccessCB<T, TP>, errorCB?: ImmediateErrorCB<TP>): PromiseInterface<TP>;
        then<TP>(successCB?: DeferredSuccessCB<T, TP>, errorCB?: ImmediateErrorCB<TP>): PromiseInterface<TP>;
        then<TP>(successCB?: ImmediateSuccessCB<T, TP>, errorCB?: DeferredErrorCB<TP>): PromiseInterface<TP>;
        then<TP>(successCB?: DeferredSuccessCB<T, TP>, errorCB?: DeferredErrorCB<TP>): PromiseInterface<TP>;
        otherwise(errorCB?: ImmediateErrorCB<T>): PromiseInterface<T>;
        otherwise(errorCB?: DeferredErrorCB<T>): PromiseInterface<T>;
        always<TP>(errorCB?: ImmediateErrorCB<TP>): PromiseInterface<TP>;
        always<TP>(errorCB?: DeferredErrorCB<TP>): PromiseInterface<TP>;
    }
    export interface DeferredInterface<T> {
        resolve(value?: T): DeferredInterface<T>;
        resolve(value?: ThenableInterface<T>): DeferredInterface<T>;
        reject(error?: any): DeferredInterface<T>;
        promise: PromiseInterface<T>;
    }
    export function create<T>(): DeferredInterface<T>;
    export function when<T>(value?: T): PromiseInterface<T>;
    export function when<T>(value?: ThenableInterface<T>): PromiseInterface<T>;
    

}
