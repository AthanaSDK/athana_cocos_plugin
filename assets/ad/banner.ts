import { EventTarget } from "cc";
import { bridge } from "../bridge/native-bridge";
import { AdAlignment, AdSize } from "./ad-models";

export class AthanaBanner extends EventTarget {

    private _isDestroyed = false;

    show() {
        if (this._isDestroyed) {
            console.warn("AthanaBanner - banner is destroyed");
            return;
        }
        const methodName = "bannerShow";
        bridge.send2Native(methodName);
    }

    hide() {
        if (this._isDestroyed) {
            console.warn("AthanaBanner - banner is destroyed");
            return;
        }
        const methodName = "bannerHide";
        bridge.send2Native(methodName);
    }

    updateSize(size: AdSize) {
        if (this._isDestroyed) {
            console.warn("AthanaBanner - banner is destroyed");
            return;
        }
        const methodName = "bannerUpdateSize";
        bridge.send2Native(methodName, size);
    }

    updateAlignment(alignment: AdAlignment) {
        if (this._isDestroyed) {
            console.warn("AthanaBanner - banner is destroyed");
            return;
        }
        const methodName = "bannerUpdateAlignment";
        bridge.send2Native(methodName, alignment);
    }

    destroy() {
        if (this._isDestroyed) {
            console.warn("AthanaBanner - banner is destroyed");
            return;
        }
        const methodName = "bannerDestroy";
        bridge.send2Native(methodName);
        this._isDestroyed = true;
    }

}