import { Codec } from "./native-codec";
import { EventTarget, _decorator } from "cc";
import { NativeEventListener } from "./native-event-listener";
import { SdkResult } from "./sdk-result";

const { ccclass, property } = _decorator;

@ccclass('NativeDispathcer')
export class NativeDispathcer {

    codec: Codec;

    private _eventTarget: EventTarget = new EventTarget();

    init(codec: Codec): NativeDispathcer {
        console.info("[NativeDispathcer] init. codec = ", codec);
        this.codec = codec;
        return this;
    }

    once<T>(method: string, handler: NativeEventListener<T>, thisArg?: any) {
        console.info("[NativeDispathcer] once", method);
        this._eventTarget.once(method, handler, thisArg);
    }

    off<T>(method: string, handler: NativeEventListener<T>, thisArg: any) {
        console.info("[NativeDispathcer] off", method);
        this._eventTarget.off(method, handler, thisArg);
    }

    on<T>(method: string, handler: NativeEventListener<T>, thisArg?: any) {
        console.info("[NativeDispathcer] on", method);
        this._eventTarget.on(method, handler, thisArg);
    }

    dispatch(methodName: string, message?: string) {
        console.info("[NativeDispathcer] dispatch", methodName);
        const ack = this.codec.decode<SdkResult<any>>(message)
        this._eventTarget.emit(methodName, ack);
    }

    destroy() { }
}