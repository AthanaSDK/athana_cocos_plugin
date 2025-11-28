import { EventTarget } from "cc";
import { bridge } from "../bridge/native-bridge";
import { AthanaEvent } from "./event-models";

export class EventService extends EventTarget {

    sendEvent(param: AthanaEvent) {
        const methodName = "sendEvent";
        bridge.send2Native(methodName, param);
    }

}