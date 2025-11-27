import { log, native } from 'cc'
import { NATIVE } from "cc/env";
import { NativeDispathcer } from './native-dispatcher';
import { Codec, NativeCodec } from './native-codec';

export class NativeBridge {
    
    dispathcer: NativeDispathcer
    private codec: Codec

    onNative = (arg0: string, arg1: string) => {
        console.debug(`From Native: method = ${arg0}, data = ${arg1}`,);
        this.dispathcer.dispatch(arg0, arg1);
    }

    init(): NativeBridge {
        this.codec = new NativeCodec()
        this.dispathcer = new NativeDispathcer()
        this.dispathcer.init(this.codec);
        this.append();
        return this;
    }

    send2Native<T>(methodName: string, data?: T) {
        if (NATIVE) {
            native.bridge.sendToNative(methodName, this.codec.encode(data));
        }
    }

    destroy() {

    }

    private append() {
        if (NATIVE) {
            native.bridge.onNative = this.onNative;
        }
    }

}

export const bridge = new NativeBridge().init();