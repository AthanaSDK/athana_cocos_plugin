import { EventTarget } from "cc";
import { bridge } from "../bridge/native-bridge";
import { SdkCallback, SdkResult } from "../bridge/sdk-result";
import { AthanaEvent } from "./event-models";

export class EventService extends EventTarget {

    sendEvent(param: AthanaEvent, callback?: SdkCallback<void>) {
        const methodName = "sendEvent";
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
        bridge.send2Native(methodName, param);
    }

}