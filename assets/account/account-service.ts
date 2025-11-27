import { EventTarget } from "cc";
import { bridge } from "../bridge/native-bridge";
import { SdkCallback, SdkResult } from "../bridge/sdk-result";
import { AccountBindingParam, AccountInfo, RegisterUserParam, SignInParam, SignInWithUIParam, TriAccountBindMap } from "./account-models";

export class AccountService extends EventTarget {

    currentUser(callback: SdkCallback<AccountInfo | null>) {
        const methodName = "currentUser";
        bridge.dispathcer.once<SdkResult<AccountInfo | null>>(
            methodName,
            (result) => {
                if (result.error != null) {
                    callback.onError(result.error);
                } else {
                    callback.onSuccess(result.data);
                }
            },
            this);
        bridge.send2Native<void>(methodName);
    }

    registerUser(param: RegisterUserParam, callback: SdkCallback<AccountInfo>) {
        const methodName = "registerUser";
        bridge.dispathcer.once<SdkResult<AccountInfo>>(
            methodName,
            (result) => {
                if (result.error != null) {
                    callback.onError(result.error);
                } else {
                    callback.onSuccess(result.data);
                }
            },
            this);
        bridge.send2Native(methodName, param);
    }

    signIn(param: SignInParam, callback: SdkCallback<AccountInfo>) {
        const methodName = "signIn";
        bridge.dispathcer.once<SdkResult<AccountInfo>>(
            methodName,
            (result) => {
                if (result.error != null) {
                    callback.onError(result.error);
                } else {
                    callback.onSuccess(result.data);
                }
            },
            this);
        bridge.send2Native(methodName, param);
    }

    signInWithUI(param: SignInWithUIParam, callback: SdkCallback<AccountInfo>) {
        const methodName = "signInWithUI";
        bridge.dispathcer.once<SdkResult<AccountInfo>>(
            methodName,
            (result) => {
                if (result.error != null) {
                    callback.onError(result.error);
                } else {
                    callback.onSuccess(result.data);
                }
            },
            this);
        bridge.send2Native(methodName, param);
    }

    signOut(callback: SdkCallback<void>) {
        const methodName = "signOut";
        bridge.dispathcer.once<SdkResult<void>>(
            methodName,
            (result) => {
                if (result.error != null) {
                    callback.onError(result.error);
                } else {
                    callback.onSuccess(result.data);
                }
            },
            this);
        bridge.send2Native(methodName);
    }

    queryAllAccountBind(callback: SdkCallback<TriAccountBindMap>, extra?: Map<string, any>) {
        const methodName = "queryAllAccountBind";
        bridge.dispathcer.once<SdkResult<TriAccountBindMap>>(
            methodName,
            (result) => {
                if (result.error != null) {
                    callback.onError(result.error);
                } else {
                    callback.onSuccess(result.data);
                }
            },
            this);
        bridge.send2Native(methodName, extra);
    }

    accountBinding(param: AccountBindingParam, callback: SdkCallback<boolean>) {
        const methodName = "accountBinding";
        bridge.dispathcer.once<SdkResult<boolean>>(
            methodName,
            (result) => {
                if (result.error != null) {
                    callback.onError(result.error);
                } else {
                    callback.onSuccess(result.data);
                }
            },
            this);
        bridge.send2Native(methodName, param);
    }

    accountUnbind(param: AccountBindingParam, callback: SdkCallback<boolean>) {
        const methodName = "accountUnbind";
        bridge.dispathcer.once<SdkResult<boolean>>(
            methodName,
            (result) => {
                if (result.error != null) {
                    callback.onError(result.error);
                } else {
                    callback.onSuccess(result.data);
                }
            },
            this);
        bridge.send2Native(methodName, param);
    }

}