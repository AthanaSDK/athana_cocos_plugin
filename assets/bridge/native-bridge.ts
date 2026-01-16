import { native } from 'cc'
import { NATIVE } from "cc/env";
import { NativeDispathcer } from './native-dispatcher';
import { Codec, NativeCodec } from './native-codec';

export class NativeBridge {
    
    dispathcer: NativeDispathcer
    private codec: Codec

    init(): NativeBridge {
        this.codec = new NativeCodec()
        this.dispathcer = new NativeDispathcer()
        this.dispathcer.init(this.codec);
        return this;
    }

    send2Native<T>(methodName: string, data?: T) {
        if (NATIVE) {
            native.jsbBridgeWrapper.dispatchEventToNative(methodName, this.codec.encode(data));
        }
    }

    destroy() {
        this.dispathcer.destroy();
    }

}

export const bridge = new NativeBridge().init();