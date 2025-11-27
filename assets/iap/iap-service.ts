import { EventTarget } from "cc";
import { bridge } from "../bridge/native-bridge";
import { SdkCallback, SdkResult } from "../bridge/sdk-result";
import { IapProduct, IapPurchaseDetail, PurchaseParam, VerifyOrderParam } from "./iap-models";

export class IapService extends EventTarget {

    queryProducts(keys: string[], callback: SdkCallback<IapProduct[]>) {
        const methodName = "queryProducts";
        bridge.dispathcer.once<SdkResult<IapProduct[]>>(
            methodName,
            (result) => {
                if (result.error != null) {
                    callback.onError(result.error);
                } else {
                    callback.onSuccess(result.data);
                }
            },
            this);
        bridge.send2Native<object>(methodName, { "keys" : keys });
    }

    purchase(param: PurchaseParam, callback: SdkCallback<boolean>) {
        const methodName = "purchase";
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
        bridge.send2Native<PurchaseParam>(methodName, param);
    }

    queryPurchaseHistory(callback: SdkCallback<IapPurchaseDetail[]>) {
        const methodName = "queryPurchaseHistory";
        bridge.dispathcer.once<SdkResult<IapPurchaseDetail[]>>(
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

    verifyOrder(param: VerifyOrderParam, callback: SdkCallback<void>) {
        const methodName = "verifyOrder";
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
        bridge.send2Native<VerifyOrderParam>(methodName, param);
    }

}