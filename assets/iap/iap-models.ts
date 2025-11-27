/**
 * 内购商品信息
 */
export class IapProduct {
    /**
     * 商品主键
     */
    public key: string;
    /**
     * 商品名称
     */
    public title: string;
    /**
     * 商品介绍
     */
    public description: string;
    /**
     * 价格，附加货币符号和货币代号。例如：US$ 9.99
     */
    public price: string;
    /**
     * 原始价格，例如 ：9.99
     */
    public rawPrice: number;
    /**
     * 货币代号，例如：USD
     */
    public currencyCode: string;
    /**
     * 货币符号，例如：$
     */
    public currencySymbol: string;
    /**
     * 商品类型
     *
     * - 1：消耗类商品
     * - 2：订阅类商品
     */
    public productType: number;
    /**
     * 订阅价格下标
     */
    public subsInex?: number;

    constructor(key: string, title: string, description: string, price: string, rawPrice: number, currencyCode: string, currencySymbol: string, productType: number, subsInex?: number) {
        this.key = key;
        this.title = title;
        this.description = description;
        this.price = price;
        this.rawPrice = rawPrice;
        this.currencyCode = currencyCode;
        this.currencySymbol = currencySymbol;
        this.productType = productType;
        this.subsInex = subsInex;
    }
}

/**
 * 订单状态
 */
enum PurchaseState {
    /**
     * 处理中
     */
    PENDING = "PENDING",

    /**
     * 已购买
     */
    PURCHASED = "PURCHASED",

    /**
     * 错误
     */
    ERROR = "ERROR",

    /**
     * 取消
     */
    CANCEL = "CANCEL",

    /**
     * 恢复购买
     */
    RESTORE = "RESTORE"
}

/**
 * 订单信息
 */
export class IapPurchaseDetail {
    /**
     * 商品Key
     */
    public productId: string;
    /**
     * 订单状体
     */
    public state: PurchaseState;
    /**
     * 商店订单流水号
     */
    public purchaseId?: string;
    /**
     * 商店订单凭证
     */
    public purchaseToken?: string;
    /**
     * 是否已确认
     */
    public isAcknowledged?: boolean;
    /**
     * 是否自动续订
     */
    public isAutoRenewing?: boolean;
}

/**
 * 购买参数
 */
export class PurchaseParam {

    /** 商品Key */
    public productId: string;
    /** 订阅价格下标，见：{@link IapProduct.subsInex} */
    public subsInex?: number;
    /** 自定义订单ID - 游戏订单ID */
    public clientOrderId?: number;
    /** 是否消耗型商品 */
    public consumable: boolean = true;
    /** 额外参数 */
    public extra?: Map<string, any>;

    /**
     * 构造函数
     * 
     * @param productId 商品Key
     * @param subsInex 订阅价格下标，见：{@link IapProduct.subsInex}
     * @param clientOrderId 自定义订单ID - 游戏订单ID
     * @param consumable 是否消耗型商品
     * @param extra 额外参数
     */
    constructor(productId: string, subsInex?: number, clientOrderId?: number, consumable: boolean = true, extra?: Map<string, any>) {
        this.productId = productId;
        this.subsInex = subsInex;
        this.clientOrderId = clientOrderId;
        this.consumable = consumable;
        this.extra = extra;
    }
}

/**
 * 验证订单参数
 */
export class VerifyOrderParam {
    /** 购买ID */
    public purchaseId: string;
    /** 是否消耗型商品 */
    public consumable: boolean = true;
    /** 额外参数 */
    public extra?: Map<string, any>;

    /**
     * 构造函数
     * 
     * @param purchaseId 购买ID
     * @param consumable 是否消耗型商品
     * @param extra 额外参数
     */
    constructor(purchaseId: string, consumable: boolean = true, extra?: Map<string, any>) {
        this.purchaseId = purchaseId;
        this.consumable = consumable;
        this.extra = extra;
    }
}