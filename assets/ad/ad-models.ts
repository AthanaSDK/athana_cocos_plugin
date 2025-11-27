/**
 * 广告类型
 */
export enum AdType {
    /**
     * 未知
     */
    Unknown = "Unknown",

    /**
     * 激励
     */
    Rewarded = "Rewarded",

    /**
     * 横幅
     */
    Banner = "Banner",

    /**
     * 原生
     */
    Native = "Native",

    /**
     * 插屏
     */
    Interstitial = "Interstitial",

    /**
     * 应用启动
     */
    AppOpen = "AppOpen"

}

export class AdParam {
    public type: AdType;
    public adUnitId: string;
    public placement?: string;

    constructor(type: AdType, adUnitId: string, placement?: string) {
        this.type = type;
        this.adUnitId = adUnitId;
        this.placement = placement;
    }
}

export class AdIsReadyResult {
    public adType: AdType;
    public isReady: boolean;

    constructor(adType: AdType, isReady: boolean) {
        this.adType = adType;
        this.isReady = isReady;
    }
}

/**
 * 横幅广告尺寸
 */
export class AdSize {
    /** 铺满父容器 */
    public static readonly MATCH_PARENT = -1;

    /** 宽度 */
    public width: number;
    /** 高度 */
    public height: number;

    /**
     * 构造函数
     * 
     * @param width 广告宽度
     * @param height 广告高度
     */
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    /**
     * 自适应宽度
     * 
     * @param height 高度
     * @returns 广告尺寸
     */
    public static fullWidth(height: number): AdSize {
        return new AdSize(AdSize.MATCH_PARENT, height);
    }
}

/**
 * 横幅广告展示位置
 */
export enum AdAlignment {
    /**
     * 顶部起点
     *
     * 根据语言阅读方向分为：
     * - LTR 为左上角（默认值）
     * - RTL 为右上角
     */
    TOP_START = "TOP_START",

    /**
     * 顶部居中
     */
    TOP_CENTER = "TOP_CENTER",

    /**
     * 顶部末尾
     *
     * 根据语言阅读方向分为：
     * - LTR 为右上角（默认值）
     * - RTL 为左上角
     */
    TOP_END = "TOP_END",

    /**
     * 底部起点
     *
     * 根据语言阅读方向分为：
     * - LTR 为左下角（默认值）
     * - RTL 为右下角
     */
    BOTTOM_START = "BOTTOM_START",

    /**
     * 底部居中
     */
    BOTTOM_CENTER = "BOTTOM_CENTER",
    /**
     * 底部末尾
     *
     * 根据语言阅读方向分为：
     * - LTR 为右下角（默认值）
     * - RTL 为左下角
     */
    BOTTOM_END = "BOTTOM_END",
}

/**
 * 创建横幅广告参数
 */
export class CreateBannerParam {
    /** 广告位Id */
    public adUnitId: string;
    /** 广告尺寸 */
    public size: AdSize;
    /** 调用广告的位置 */
    public placement?: string;
    /** 广告展示位置，默认值为 AdAlignment.BOTTOM_CENTER */
    public alignment: AdAlignment = AdAlignment.BOTTOM_CENTER;

    /**
     * 构造函数
     * 
     * @param adUnitId 广告位Id
     * @param size 广告尺寸
     * @param placement 广告展示位置
     * @param alignment 广告展示对齐方式
     */
    constructor(adUnitId: string, size: AdSize, placement?: string, alignment: AdAlignment = AdAlignment.BOTTOM_CENTER) {
        this.adUnitId = adUnitId;
        this.size = size;
        this.placement = placement;
        this.alignment = alignment;
    }
}

/**
 * 广告信息
 */
export class ProxyAd {
    /**
     * 广告类型
     *
     * - 1 - Rewarded
     * - 2 - MREC
     * - 3 - Native
     * - 4 - Interstitial
     * - 5 - App Open
     */
    public type: number;
    /**
     * 广告展示类型：
     *
     * - 1 - FullScreen Ad 全屏
     * - 2 - Banner Ad 横幅
     */
    public classify: number;
    /**
     * 广告平台
     */
    public platform: string;
    /**
     * 广告渠道
     */
    public source: string;
    /**
     * 广告位
     */
    public adUnitId: string;
    /**
     * 调用广告的位置
     */
    public placement?: string;
    /**
     * 广告收益货币
     */
    public currency: string;
    /**
     * 广告收益
     */
    public revenue: number;
    /**
     * 广告收益数额精度
     */
    public revenuePrecision?: string;
    
}

/**
 * 广告类型
 * 
 * @param value 数值类型的广告类型
 * @returns AdType 枚举类型的广告类型
 */
export function toAdType(value: number): AdType {
    if (value < 0 || value >= Object.keys(AdType).length) {
        return AdType.Unknown
    }
    var adType: AdType;
    switch (value) {
        case 1: adType = AdType.Rewarded; break;
        case 2: adType = AdType.Banner; break;
        case 3: adType = AdType.Native; break;
        case 4: adType = AdType.Interstitial; break;
        case 5: adType = AdType.AppOpen; break;
        default: adType = AdType.Unknown;
    };
    return adType;
}

/**
 * 广告错误信息
 */
export class AdError {
    /** 错误码 */
    public code: number;
    /** 错误信息 */
    public message: string;
    /** 广告源错误码 */
    public networkErrorCode?: number;
    /** 广告源错误信息 */
    public networkErrorMessage?: string;

    /**  构造函数
     * 
     * @param code 错误码
     * @param message 错误信息
     * @param networkErrorCode 广告源错误码
     * @param networkErrorMessage 广告源错误信息
     */
    constructor(code: number, message: string, networkErrorCode?: number, networkErrorMessage?: string) {
        this.code = code;
        this.message = message;
        this.networkErrorCode = networkErrorCode;
        this.networkErrorMessage = networkErrorMessage;
    }
}

/**
 * 广告事件结果
 */
export class AdEventResult {
    /** 广告信息 */
    public ad: ProxyAd;
    /** 广告错误信息 */
    public error?: AdError;

    constructor(ad: ProxyAd, error?: AdError) {
        this.ad = ad;
        this.error = error;
    }
}