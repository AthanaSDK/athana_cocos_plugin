import { EventTarget } from "cc";
import { bridge } from "../bridge/native-bridge";
import { AthanaError, AthanaErrorType } from "../bridge/sdk-result";
import { AdEventResult, AdIsReadyResult, AdParam, AdType, CreateBannerParam, ProxyAd } from "./ad-models";
import { AthanaBanner } from "./banner";

const methodAdOnLoaded: string = "adOnLoaded";
const methodAdOnLoadFailed: string = "adOnLoadFailed";
const methodAdOnDisplayed: string = "adOnDisplayed";
const methodAdOnDisplayFailed: string = "adOnDisplayFailed";
const methodAdOnRewarded: string = "adOnRewarded";
const methodAdOnClick: string = "adOnClick";
const methodAdOnClose: string = "adOnClose";

/**
 * 广告服务
 */
export class AdService extends EventTarget {

    /**
     * 加载开屏广告
     * 
     * @param adUnitId 广告位 ID
     */
    loadAppOpenAd(adUnitId: string) {
        const methodName = "loadAd";
        bridge.send2Native(methodName, new AdParam(AdType.AppOpen, adUnitId));
    }

    /**
     * 判断开屏广告是否准备好
     * 
     * @param adUnitId 广告位 ID
     * @returns Promise<boolean> 是否准备好
     */
    isReadyAppOpenAd(adUnitId: string): Promise<boolean> {
        const methodName = "isReadyAd";
        return new Promise((resolve, reject) => {
            bridge.dispathcer.once<AdIsReadyResult>(
                methodName,
                (result) => resolve(result.isReady),
                this
            );
            bridge.send2Native(methodName, new AdParam(AdType.AppOpen, adUnitId));
        });
    }

    /**
     * 展示开屏广告
     * 
     * @param adUnitId 广告位 ID
     * @param placement 广告展示位置
     */
    showAppOpenAd(adUnitId: string, placement?: string) {
        const methodName = "showAd";
        bridge.send2Native(methodName, new AdParam(AdType.AppOpen, adUnitId, placement));
    }

    /**
     * 加载插屏广告
     * 
     * @param adUnitId 广告位 ID
     */
    loadInterstitialAd(adUnitId: string) {
        const methodName = "loadAd";
        bridge.send2Native(methodName, new AdParam(AdType.Interstitial, adUnitId));
    }

    /**
     * 判断插屏广告是否准备好
     * 
     * @param adUnitId 广告位 ID
     * @returns Promise<boolean> 是否准备好
     */
    isReadyInterstitialAd(adUnitId: string): Promise<boolean> {
        const methodName = "isReadyAd";
        return new Promise((resolve, reject) => {
            bridge.dispathcer.once<AdIsReadyResult>(
                methodName,
                (result) => resolve(result.isReady),
                this
            );
            bridge.send2Native(methodName, new AdParam(AdType.Interstitial, adUnitId));
        });
    }

    /**
     * 展示插屏广告
     *
     * @param adUnitId 广告位 ID
     * @param placement 广告展示位置
     */
    showInterstitialAd(adUnitId: string, placement?: string) {
        const methodName = "showAd";
        bridge.send2Native(methodName, new AdParam(AdType.Interstitial, adUnitId, placement));
    }

    /**
     * 加载激励广告
     * 
     * @param adUnitId 广告位 ID
     */
    loadRewardedAd(adUnitId: string) {
        const methodName = "loadAd";
        bridge.send2Native(methodName, new AdParam(AdType.Rewarded, adUnitId));
    }

    /**
     * 判断激励广告是否准备好
     *
     * @param adUnitId 广告位 ID
     * @returns Promise<boolean> 是否准备好
     */
    isReadyRewardedAd(adUnitId: string): Promise<boolean> {
        const methodName = "isReadyAd";
        return new Promise((resolve, reject) => {
            bridge.dispathcer.once<AdIsReadyResult>(
                methodName,
                (result) => resolve(result.isReady),
                this
            );
            bridge.send2Native(methodName, new AdParam(AdType.Rewarded, adUnitId));
        });
    }

    /**
     * 展示激励广告
     * @param adUnitId 广告位 ID
     * @param placement 广告展示位置
     */
    showRewardedAd(adUnitId: string, placement?: string) {
        const methodName = "showAd";
        bridge.send2Native(methodName, new AdParam(AdType.Rewarded, adUnitId, placement));
    }

    /**
     * 创建横幅广告
     * @param param 创建横幅广告参数
     * @returns Promise<AthanaBanner> 横幅广告实例
     */
    createBannerAd(param: CreateBannerParam): Promise<AthanaBanner> {
        const methodName = "bannerCreate";

        return new Promise((resolve, reject) => {
            bridge.dispathcer.once<AdIsReadyResult>(
                methodName,
                (result) => {
                    if (result.isReady) {
                        const banner = new AthanaBanner();
                        resolve(banner);
                    } else {
                        const error = new AthanaError(AthanaErrorType.SDK_REQUEST_ERROR, null, "Create banner ad failed");
                        reject(error);
                    }
                },
                this
            );
            bridge.send2Native(methodName, param);
        });
    }

    /**
     * 注册广告加载成功回调
     * @param adType 广告类型
     * @param callback 回调函数
     */
    registerOnLoaded(adType: AdType, callback: (ad: ProxyAd) => void) {
        const methodName = methodAdOnLoaded + '-' + adType;
        bridge.dispathcer.on<ProxyAd>(methodName, callback, this);
    }

    /**
     * 注销广告加载成功回调
     * @param adType 广告类型
     * @param callback 回调函数
     */
    unregisterOnLoaded(adType: AdType, callback: (ad: ProxyAd) => void) {
        const methodName = methodAdOnLoaded + '-' + adType;
        bridge.dispathcer.off<ProxyAd>(methodName, callback, this);
    }

    /**
     * 注册广告加载失败回调
     * @param adType 广告类型
     * @param callback 回调函数
     */
    registerOnLoadFailed(adType: AdType, callback: (error: AdEventResult) => void) {
        const methodName = methodAdOnLoadFailed + '-' + adType;
        bridge.dispathcer.on<AdEventResult>(methodName, callback, this);
    }

    /**
     * 注销广告加载失败回调
     * @param adType 广告类型
     * @param callback 回调函数
     */
    unregisterOnLoadFailed(adType: AdType, callback: (error: AdEventResult) => void) {
        const methodName = methodAdOnLoadFailed + '-' + adType;
        bridge.dispathcer.off<AdEventResult>(methodName, callback, this);
    }

    /**
     * 注册广告展示回调
     * @param adType 广告类型
     * @param callback 回调函数
     */
    registerOnDisplayed(adType: AdType, callback: (ad: ProxyAd) => void) {
        const methodName = methodAdOnDisplayed + '-' + adType;
        bridge.dispathcer.on<ProxyAd>(methodName, callback, this);
    }

    /**
     * 注销广告展示回调
     * @param adType 广告类型 
     * @param callback 回调函数
     */
    unregisterOnDisplayed(adType: AdType, callback: (ad: ProxyAd) => void) {
        const methodName = methodAdOnDisplayed + '-' + adType;
        bridge.dispathcer.off<ProxyAd>(methodName, callback, this);
    }

    /**
     * 注册广告展示失败回调
     * @param adType 广告类型
     * @param callback 回调函数
     */
    registerOnDisplayFailed(adType: AdType, callback: (error: AdEventResult) => void) {
        const methodName = methodAdOnDisplayFailed + '-' + adType;
        bridge.dispathcer.on<AdEventResult>(methodName, callback, this);
    }

    /**
     * 注销广告展示失败回调
     * @param adType 广告类型
     * @param callback 回调函数
     */
    unregisterOnDisplayFailed(adType: AdType, callback: (error: AdEventResult) => void) {
        const methodName = methodAdOnDisplayFailed + '-' + adType;
        bridge.dispathcer.off<AdEventResult>(methodName, callback, this);
    }

    /**
     * 注册广告激励回调
     * @param adType 广告类型
     * @param callback 回调函数
     */
    registerOnRewarded(adType: AdType, callback: (ad: ProxyAd) => void) {
        const methodName = methodAdOnRewarded + '-' + adType;
        bridge.dispathcer.on<ProxyAd>(methodName, callback, this);
    }

    /**
     * 注销广告激励回调
     * @param adType 广告类型
     * @param callback 回调函数
     */
    unregisterOnRewarded(adType: AdType, callback: (ad: ProxyAd) => void) {
        const methodName = methodAdOnRewarded + '-' + adType;
        bridge.dispathcer.off<ProxyAd>(methodName, callback, this);
    }

    /**
     * 注册广告点击回调
     * @param adType 广告类型
     * @param callback 回调函数
     */
    registerOnClick(adType: AdType, callback: (ad: ProxyAd) => void) {
        const methodName = methodAdOnClick + '-' + adType;
        bridge.dispathcer.on<ProxyAd>(methodName, callback, this);
    }

    /**
     * 注销广告点击回调
     * @param adType 广告类型
     * @param callback 回调函数
     */
    unregisterOnClick(adType: AdType, callback: (ad: ProxyAd) => void) {
        const methodName = methodAdOnClick + '-' + adType;
        bridge.dispathcer.off<ProxyAd>(methodName, callback, this);
    }

    /**
     * 注册广告关闭回调
     * @param adType 广告类型
     * @param callback 回调函数
     */
    registerOnClose(adType: AdType, callback: (ad: ProxyAd) => void) {
        const methodName = methodAdOnClose + '-' + adType;
        bridge.dispathcer.on<ProxyAd>(methodName, callback, this);
    }

    /**
     * 注销广告关闭回调
     * @param adType 广告类型
     * @param callback 回调函数
     */
    unregisterOnClose(adType: AdType, callback: (ad: ProxyAd) => void) {
        const methodName = methodAdOnClose + '-' + adType;
        bridge.dispathcer.off<ProxyAd>(methodName, callback, this);
    }

}