import { Codec } from "./native-codec";
import { _decorator, native, DebugMode } from "cc";
import { NativeEventListener } from "./native-event-listener";

const { ccclass, property } = _decorator;

type JsBridgeWrapperListener = (message?: string) => void;

@ccclass('NativeDispathcer')
export class NativeDispathcer {

    codec: Codec;

    private _listeners: Map<string, JsBridgeWrapperListener[]> = new Map();

    private _handlerMap: Map<NativeEventListener<any>, JsBridgeWrapperListener> = new Map();

    private addListener(method: string, listener: JsBridgeWrapperListener) {
        native.jsbBridgeWrapper.addNativeEventListener(method, listener);
        let list = this._listeners.get(method)
        if (list == null) {
            list = [];
            this._listeners.set(method, list);
        }
        list.push(listener);
    }

    private removeListener<T>(method: string, handler: NativeEventListener<T>) {
        let listener = this._handlerMap.get(handler);
        if (listener == null) {
            return;
        }
        this._handlerMap.delete(handler);

        let list = this._listeners.get(method)
        if (list != null) {
            const index = list.indexOf(listener);
            if (index > -1) {
                native.jsbBridgeWrapper.removeNativeEventListener(method, listener);
                list.splice(index, 1);
            }
        }
    }

    init(codec: Codec): NativeDispathcer {
        if (DebugMode) {
            console.debug("[NativeDispathcer] init. codec = ", codec);
        }
        this.codec = codec;
        return this;
    }

    once<T>(method: string, handler: NativeEventListener<T>) {
        if (DebugMode) {
            console.debug("[NativeDispathcer] once", method);
        }

        let listener: JsBridgeWrapperListener = (message: string) => {
            const ack = this.codec.decode<T>(message)
            handler(ack);

            this.removeListener<T>(method, handler);
        }
        this._handlerMap.set(handler, listener);
        this.addListener(method, listener);
    }

    off<T>(method: string, handler: NativeEventListener<T>) {
        if (DebugMode) {
            console.debug("[NativeDispathcer] off", method);
        }
        this.removeListener<T>(method, handler);
    }

    on<T>(method: string, handler: NativeEventListener<T>) {
        if (DebugMode) {
            console.debug("[NativeDispathcer] on", method);
        }
        let listener: JsBridgeWrapperListener = (message: string) => {
            const ack = this.codec.decode<T>(message)
            handler(ack);
        }
        this._handlerMap.set(handler, listener);
        this.addListener(method, listener);
    }

    destroy() {
        native.jsbBridgeWrapper.removeAllListeners();
        this._listeners.clear();
     }
}