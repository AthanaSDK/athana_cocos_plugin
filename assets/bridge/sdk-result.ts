import { _decorator } from "cc";

/**
 * Athana SDK 错误类型
 */
export enum AthanaErrorType {
    /**
     * SDK 未初始化
     */
    SDK_NOT_INITIAL = "SDK_NOT_INITIAL",

    /**
     * 网络错误
     */
    NETWORK_ERROR = "NETWORK_ERROR",

    /**
     * SDK 请求失败
     */
    SDK_REQUEST_ERROR = "SDK_REQUEST_ERROR",

    /**
     * SDK 服务端返回格式异常
     */
    SDK_RESPONSE_ERROR = "SDK_RESPONSE_ERROR",

    /**
     * SDK 操作被用户取消
     */
    SDK_USER_CANCELLED = "SDK_USER_CANCELLED",
}

/**
 * Athana SDK 错误信息
 */
export class AthanaError {

    /** 错误类型 */
    public readonly type: AthanaErrorType;

    /** 错误码 */
    public readonly errorCode?: number = null;

    /** 错误信息 */
    readonly msg?: string = null;

    /** 额外错误信息 */
    readonly message?: string = null;

    constructor(type: AthanaErrorType, errorCode?: number, msg?: string, message?: string) {
        this.type = type;
        this.errorCode = errorCode;
        this.msg = msg;
        this.message = message;
    }

    takeErrMsg(): string | null {
        return this.msg ?? this.message;
    }
}

export interface SdkResult<T> {
    readonly data?: T;
    readonly error?: AthanaError;
}

/**
 * SDK 回调接口
 */
export interface SdkCallback<T> {

    /**
     * 操作成功回调
     * 
     * @param data 回调成功时返回的数据
     */
    onSuccess(data?: T | null): void;

    /**
     * 操作失败回调
     * 
     * @param error 错误信息
     */
    onError(error: AthanaError): void;

}