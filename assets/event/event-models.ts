/**
 * 事件对象
 */
export class AthanaEvent {

    /**
     * 事件分类
     */
    public type: string;
    /**
     * 事件名
     */
    public key: string;
    /**
     * 事件参数
     */
    public params?: Object;

    constructor(key: string, params?: Map<string, any>, type: string = "game") {
        this.key = key;
        this.type = type;
        if (params != null) {
            this.params = Object.fromEntries(params);
        } else {
            this.params = null;
        }
    }
}