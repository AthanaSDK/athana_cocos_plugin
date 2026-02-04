import { bridge } from "../bridge/native-bridge";
import { AthanaEvent } from "./event-models";

export class EventService {

    sendEvent(param: AthanaEvent) {
        const methodName = "sendEvent";
        bridge.send2Native(methodName, param);
    }

}