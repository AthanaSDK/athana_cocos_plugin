import { AthanaConfig } from "./config/athana-config";
import { bridge } from "./bridge/native-bridge";
import { SdkCallback, SdkResult } from "./bridge/sdk-result";
import { AccountService } from "./account/account-service";
import { AccountBindingParam, AccountInfo, RegisterUserParam, SignInParam, SignInWithUIParam, TriAccountBindMap, UpdateUserInfoParam } from "./account/account-models";
import { AdService } from "./ad/ad-service";
import { EventService } from "./event/event-service";
import { IapService } from "./iap/iap-service";
import { IapProduct, IapPurchaseDetail, PurchaseParam, VerifyOrderParam } from "./iap/iap-models";
import { AthanaEvent } from "./event/event-models";

export {
    AthanaConfig,
    AccountServiceConfig,
    AdServiceConfigs,
    MaxAdServiceConfig,
    ConversionServiceConfigs,
    AppsFlyerServiceConfig
} from "./config/athana-config";

export type { SdkCallback } from "./bridge/sdk-result";
export {
    SignInType,
    AccountInfo,
    RegisterUserParam,
    SignInParam,
    SignInWithUIParam,
    AccountBindingParam,
    TriAccountBindMap,
    UpdateUserInfoParam
} from "./account/account-models";
export {
    IapProduct,
    IapPurchaseDetail,
    PurchaseParam,
    VerifyOrderParam
} from "./iap/iap-models";
export { AthanaEvent } from "./event/event-models";
export { AdType, AdSize, AdAlignment, CreateBannerParam, toAdType, ProxyAd, AdEventResult } from "./ad/ad-models";
export { AthanaBanner } from "./ad/banner";
export { AthanaError, AthanaErrorType } from "./bridge/sdk-result";

/**
 * Athana Cocos SDK 主入口
 */
export class Athana {

    private static _isInitialized: boolean = false;
    private static _accountService: AccountService = new AccountService();
    private static _adService: AdService = new AdService();
    private static _eventService: EventService = new EventService();
    private static _iapService: IapService = new IapService();

    /**
     * 初始化 SDK
     * 
     * @param config SDK 配置参数
     */
    static init(config: AthanaConfig) {
        let jsonString = JSON.stringify(config);
        console.info(`Athana Cocos - init(${config.appId})`);
        console.debug(`Athana Cocos - init(${jsonString})`);
        if (this._isInitialized) {
            console.warn("Athana Cocos - already initialized");
            return;
        }
        this._isInitialized = true;
        bridge.send2Native<AthanaConfig>("init", config);
    }

    /**
     * 启动 SDK
     * 
     * @param privacyGrant 隐私政策是否同意
     */
    static start(privacyGrant: boolean = false) {
        if (!this._isInitialized) {
            console.warn("Athana Cocos - not initialized yet");
            return;
        }
        bridge.send2Native<object>("start", { "privacyGrant": privacyGrant });
    }

    /**
     * 获取当前用户
     * 
     * @param callback 回调函数，返回当前用户信息，当未登入或凭证失效则返回 null
     */
    static currentUser(callback: SdkCallback<AccountInfo | null>) {
        if (!this._isInitialized) {
            console.warn("Athana Cocos - not initialized yet");
            return;
        }
        this._accountService.currentUser(callback);
    }

    /**
     * 注册平台用户
     * 
     * @param param 注册参数 
     * @param callback 回调函数，返回注册结果
     */
    static registerUser(param: RegisterUserParam, callback: SdkCallback<AccountInfo>) {
        if (!this._isInitialized) {
            console.warn("Athana Cocos - not initialized yet");
            return;
        }
        this._accountService.registerUser(param, callback);
    }

    /**
     * 用户登入
     * 
     * @param param 登入参数 
     * @param callback 回调函数，返回登入结果
     */
    static signIn(param: SignInParam, callback: SdkCallback<AccountInfo>) {
        if (!this._isInitialized) {
            console.warn("Athana Cocos - not initialized yet");
            return;
        }
        this._accountService.signIn(param, callback);
    }

    /**
     * 使用内置UI进行用户登入
     * 
     * @param param 内置UI配置参数
     * @param callback 回调函数，返回登入结果
     */
    static signInWithUI(param: SignInWithUIParam, callback: SdkCallback<AccountInfo>) {
        if (!this._isInitialized) {
            console.warn("Athana Cocos - not initialized yet");
            return;
        }
        this._accountService.signInWithUI(param, callback);
    }

    /**
     * 用户登出
     * 
     * @param callback 回调函数，返回登出结果
     */
    static signOut(callback?: SdkCallback<void>) {
        if (!this._isInitialized) {
            console.warn("Athana Cocos - not initialized yet");
            return;
        }
        this._accountService.signOut(callback);
    }

    /**
     * 查询所有三方账户绑定信息
     * 
     * @param callback 回调函数，返回绑定信息
     * @param extra 额外参数
     */
    static queryAllAccountBind(callback: SdkCallback<TriAccountBindMap>, extra?: Map<string, any>) {
        if (!this._isInitialized) {
            console.warn("Athana Cocos - not initialized yet");
            return;
        }
        this._accountService.queryAllAccountBind(callback, extra);
    }

    /**
     * 绑定三方账户
     * 
     * @param param 绑定参数
     * @param callback 回调函数，返回绑定结果
     */
    static accountBinding(param: AccountBindingParam, callback: SdkCallback<boolean>) {
        if (!this._isInitialized) {
            console.warn("Athana Cocos - not initialized yet");
            return;
        }
        this._accountService.accountBinding(param, callback);
    }

    /**
     * 解绑三方账户
     * 
     * @param param 解绑参数，{@link AccountBindingParam.triOpenID} 必传
     * @param callback 回调函数，返回解绑结果
     */
    static accountUnbind(param: AccountBindingParam, callback: SdkCallback<boolean>) {
        if (!this._isInitialized) {
            console.warn("Athana Cocos - not initialized yet");
            return;
        }
        if (param.triOpenID == null) {
            console.warn("Athana Cocos - accountUnbind failed, triOpenID is required");
            return;
        }
        this._accountService.accountUnbind(param, callback);
    }

    /**
     * 更新用户信息
     * @param param 更新参数 
     * @param callback 回调函数，返回更新结果
     */
    static updateUserInfo(param: UpdateUserInfoParam, callback?: SdkCallback<void>) {
        if (!this._isInitialized) {
            console.warn("Athana Cocos - not initialized yet");
            return;
        }
        this._accountService.updateUserInfo(param, callback);
    }

    /**
     * 查询本地商店服务是否可用
     * 
     * @param callback 回调函数，返回是否可用
     */
    static isIapAvailable(callback: SdkCallback<boolean>) {
        if (!this._isInitialized) {
            console.warn("Athana Cocos - not initialized yet");
            return;
        }
        this._iapService.isAvailable(callback);
    }

    /**
     * 查询商品信息
     * 
     * @param keys 商品键列表
     * @param callback 回调函数，返回商品信息列表
     */
    static queryProducts(keys: string[], callback: SdkCallback<IapProduct[]>) {
        if (!this._isInitialized) {
            console.warn("Athana Cocos - not initialized yet");
            return;
        }
        if (keys.length == 0) {
            console.warn("Athana Cocos - queryProducts failed, keys is empty");
            return;
        }
        this._iapService.queryProducts(keys, callback);
    }

    /**
     * 购买商品
     * 
     * @param param 购买参数
     * @param callback 回调函数，返回购买结果
     */
    static purchase(param: PurchaseParam, callback: SdkCallback<boolean>) {
        if (!this._isInitialized) {
            console.warn("Athana Cocos - not initialized yet");
            return;
        }
        this._iapService.purchase(param, callback);
    }

    /**
     * 查询购买历史记录
     * 
     * - 只返回有效期内的订阅类订单，以及非消耗型商品订单
     * 
     * @param callback 回调函数，返回购买历史列表
     */
    static queryPurchaseHistory(callback: SdkCallback<IapPurchaseDetail[]>) {
        if (!this._isInitialized) {
            console.warn("Athana Cocos - not initialized yet");
            return;
        }
        this._iapService.queryPurchaseHistory(callback);
    }

    /**
     * 验证订单
     * 
     * @param param 验证订单参数
     * @param callback 回调函数，返回验证结果
     */
    static verifyOrder(param: VerifyOrderParam, callback: SdkCallback<void>) {
        if (!this._isInitialized) {
            console.warn("Athana Cocos - not initialized yet");
            return;
        }
        this._iapService.verifyOrder(param, callback);
    }

    /**
     * 请求应用商店评分
     * 
     * @param callback 回调函数，返回请求结果
     */
    static requestReview(callback: SdkCallback<void>) {
        if (!this._isInitialized) {
            console.warn("Athana Cocos - not initialized yet");
            return;
        }
        const methodName = "requestReview";
        bridge.dispathcer.once<SdkResult<void>>(
            methodName,
            (result) => {
                if (result.error != null) {
                    callback.onError(result.error);
                } else {
                    callback.onSuccess(result.data);
                }
            },
            this);
        bridge.send2Native<void>(methodName);
    }

    /**
     * 获取广告服务
     */
    static get adService(): AdService {
        if (!this._isInitialized) {
            console.warn("Athana Cocos - not initialized yet");
        }
        return this._adService;
    }

    /**
     * 发送事件
     * 
     * @param param 事件参数
     * @param callback 回调函数，返回发送结果
     */
    static sendEvent(param: AthanaEvent) {
        if (!this._isInitialized) {
            console.warn("Athana Cocos - not initialized yet");
            return;
        }
        this._eventService.sendEvent(param);
    }

}