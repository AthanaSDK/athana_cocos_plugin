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
    /**
     * 事件发送目标
     * 
     * 默认 null 表示发送全部渠道，可以指定发送到哪些渠道，例如 ["platform", "firebase"]
     * 
     * - platform: 平台事件
     * - firebase: Firebase Analytics 事件
     */
    public sendTargets?: string[];

    constructor(key: string, params?: Map<string, any>, type: string = "game", sendTargets?: string[]) {
        this.key = key;
        this.type = type;
        if (params != null) {
            this.params = Object.fromEntries(params);
        } else {
            this.params = null;
        }
        this.sendTargets = sendTargets;
    }
}