import { _decorator } from "cc";
const { ccclass, property } = _decorator;

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
 * Athana SDK 错误码
 */
export enum ErrorCode {
    /**
     * 成功
     */
    SUCCESS = "SUCCESS",

    /**
     * 服务错误
     */
    SERVER_ERROR = "SERVER_ERROR",

    /**
     * 请求参数错误
     */
    REQUEST_PARAM_ERROR = "REQUEST_PARAM_ERROR",

    /**
     * 凭证无效
     */
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",

    /**
     * 请求频率超出限制
     */
    REQUEST_TOO_MANY = "REQUEST_TOO_MANY",

    /**
     * 请求体为空
     */
    REQUEST_BODY_EMPTY = "REQUEST_BODY_EMPTY",

    /**
     * 请求体长度超出限制
     */
    REQUEST_BODY_TOO_LARGE = "REQUEST_BODY_TOO_LARGE",

    /**
     * 用户凭证失效/错误
     */
    REQUEST_USER_TOKEN_ERROR = "REQUEST_USER_TOKEN_ERROR"
}

/**
 * Athana SDK 错误信息
 */
export class AthanaError {

    /** 错误类型 */
    public type: AthanaErrorType;

    /** 错误码 */
    public code?: ErrorCode = null;

    /** 错误信息 */
    public message?: string = null;

    constructor(type: AthanaErrorType, code?: ErrorCode, message?: string) {
        this.type = type;
        this.code = code;
        this.message = message;
    }
}

export interface SdkResult<T> {
    data?: T;
    error?: AthanaError;
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