//
//  AdProxyService.swift
//  Athana Demo
//
//  Created by CWJoy on 19/12/2025.
//
import AthanaCore
import AthanaSDK

private let methodAdOnLoaded = "adOnLoaded"
private let methodAdOnLoadFailed = "adOnLoadFailed"
private let methodAdOnDisplayed = "adOnDisplayed"
private let methodAdOnDisplayFailed = "adOnDisplayFailed"
private let methodAdOnRewarded = "adOnRewarded"
private let methodAdOnClick = "adOnClick"
private let methodAdOnClose = "adOnClose"

class AdProxyService: SDKService {

    let methodLoadAd = "loadAd"
    let methodIsReadyAd = "isReadyAd"
    let methodShowAd = "showAd"

    let methodAdBannerCreate = "bannerCreate"
    let methodAdBannerShow = "bannerShow"
    let methodAdBannerHide = "bannerHide"
    let methodAdBannerUpdateSize = "bannerUpdateSize"
    let methodAdBannerUpdateAlignment = "bannerUpdateAlignment"
    let methodAdBannerDestroy = "bannerDestroy"

    func initialize() {
        CocosEventDispatcher.shared.register(
            methodLoadAd,
            listener: { data in
                guard let param = data else {
                    let msg =
                        "Missing param in calling \(self.methodLoadAd) funcation"
                    LoggingService.shared.warn(
                        tag: AthanaCocos.TAG,
                        message: msg
                    )
                    return
                }

                var result: Bool? = nil
                switch param.type.toAdType() {
                case .AppOpen:
                    result = Athana.shared
                        .getAdService()?.loadAppOpenAd(
                            adUnitId: param.adUnitId
                        )
                    break
                case .Interstitial:
                    result = Athana.shared
                        .getAdService()?.loadInterstitialAd(
                            adUnitId: param.adUnitId
                        )
                    break
                case .Rewarded:
                    result = Athana.shared
                        .getAdService()?.loadRewardedAd(
                            adUnitId: param.adUnitId
                        )
                    break
                default:
                    let msg =
                        "Not match adType(\(param.type)) in calling \(self.methodLoadAd) funcation"
                    LoggingService.shared.warn(
                        tag: AthanaCocos.TAG,
                        message: msg
                    )
                    break
                }
            },
            codec: JSONCodec<AdParam>()
        )

        CocosEventDispatcher.shared.register(
            methodIsReadyAd,
            listener: { data in
                guard let param = data else {
                    let msg =
                        "Missing param in calling \(self.methodIsReadyAd) funcation"
                    LoggingService.shared.warn(
                        tag: AthanaCocos.TAG,
                        message: msg
                    )
                    return
                }

                var result: Bool? = false
                switch param.type.toAdType() {
                case .AppOpen:
                    result = Athana.shared
                        .getAdService()?.isReadyAppOpenAd(
                            adUnitId: param.adUnitId
                        )
                    break
                case .Interstitial:
                    result = Athana.shared
                        .getAdService()?.isReadyInterstitialAd(
                            adUnitId: param.adUnitId
                        )
                    break
                case .Rewarded:
                    result = Athana.shared
                        .getAdService()?.isReadyRewardedAd(
                            adUnitId: param.adUnitId
                        )
                    break
                default:
                    let msg =
                        "Not match adType(\(param.type)) in calling \(self.methodIsReadyAd) funcation"
                    LoggingService.shared.warn(
                        tag: AthanaCocos.TAG,
                        message: msg
                    )
                    break
                }

                CocosEventDispatcher.shared.send(
                    self.methodIsReadyAd,
                    data: AdIsReadyResult(
                        type: param.type,
                        isReady: result == true
                    )
                )
            },
            codec: JSONCodec<AdParam>()
        )

        CocosEventDispatcher.shared.register(
            methodShowAd,
            listener: { data in
                guard let param = data else {
                    let msg =
                        "Missing param in calling \(self.methodShowAd) funcation"
                    LoggingService.shared.warn(
                        tag: AthanaCocos.TAG,
                        message: msg
                    )
                    return
                }

                var result: Bool? = false
                switch param.type.toAdType() {
                case .AppOpen:
                    result = Athana.shared
                        .getAdService()?.showAppOpenAd(
                            adUnitId: param.adUnitId,
                            placement: param.placement
                        )
                    break
                case .Interstitial:
                    result = Athana.shared
                        .getAdService()?.showInterstitialAd(
                            adUnitId: param.adUnitId,
                            placement: param.placement
                        )
                    break
                case .Rewarded:
                    result = Athana.shared
                        .getAdService()?.showRewardedAd(
                            adUnitId: param.adUnitId,
                            placement: param.placement
                        )
                    break
                default:
                    let msg =
                        "Not match adType(\(param.type)) in calling \(self.methodShowAd) funcation"
                    LoggingService.shared.warn(
                        tag: AthanaCocos.TAG,
                        message: msg
                    )
                    break
                }
            },
            codec: JSONCodec<AdParam>()
        )

        CocosEventDispatcher.shared.register(
            methodAdBannerCreate,
            listener: { data in self.createBanner(data) },
            codec: JSONCodec<CreateBannerParam>()
        )

        CocosEventDispatcher.shared.register(
            methodAdBannerShow,
            listener: { self.bannerShow() }
        )

        CocosEventDispatcher.shared.register(
            methodAdBannerHide,
            listener: { self.bannerHide() }
        )

        CocosEventDispatcher.shared.register(
            methodAdBannerUpdateSize,
            listener: { data in self.bannerUpdateSize(data?.size) },
            codec: JSONCodec<CreateBannerParam>()
        )

        CocosEventDispatcher.shared.register(
            methodAdBannerUpdateAlignment,
            listener: { data in self.bannerUpdateAlignment(data?.alignment) },
            codec: JSONCodec<CreateBannerParam>()
        )

        CocosEventDispatcher.shared.register(
            methodAdBannerDestroy,
            listener: { self.bannerDestroy() }
        )
    }

    private var _banner: AdBanner? = nil

    private func createBanner(_ data: CreateBannerParam?) {
        _banner?.destroy()
        guard let param = data else {
            CocosEventDispatcher.shared.send(
                methodAdBannerCreate,
                data: AdIsReadyResult(
                    type: AdType.Banner.toString(),
                    isReady: false
                )
            )
            return
        }
        _banner = Athana.shared.getAdService()?.createBanner(
            adUnitId: param.adUnitId,
            placement: param.placement,
            size: param.size,
            alignment: param.alignment.toAdAlignment()
        )
        CocosEventDispatcher.shared.send(
            methodAdBannerCreate,
            data: AdIsReadyResult(
                type: AdType.Banner.toString(),
                isReady: _banner != nil
            )
        )
    }
    
    func setAdListener() {
        let listener = AdServiceListener()
        Athana.shared.setAdListener(listener: listener)
    }

    private func bannerShow() {
        do {
            try _banner?.show()
        } catch {
            let msg = "Cannot to show banner"
            LoggingService.shared.warn(
                tag: AthanaCocos.TAG,
                message: msg,
                error: error
            )
        }
    }

    private func bannerHide() {
        _banner?.hide()
    }

    private func bannerUpdateSize(_ size: AdSize?) {
        guard let param = size else {
            let msg = "Failed to update size on this banner"
            LoggingService.shared.warn(
                tag: AthanaCocos.TAG,
                message: msg
            )
            return
        }
        _banner?.updateSize(param)
    }

    private func bannerUpdateAlignment(_ alignment: String?) {
        guard let param = alignment?.toAdAlignment() else {
            let msg = "Failed to update alignment on this banner"
            LoggingService.shared.warn(
                tag: AthanaCocos.TAG,
                message: msg
            )
            return
        }
        _banner?.updateAlignment(param)
    }

    private func bannerDestroy() {
        _banner?.destroy()
        _banner = nil
    }

}

struct AdParam: Codable {
    let type: String
    let adUnitId: String
    let placement: String?
}

struct AdIsReadyResult: Codable {
    let type: String
    let isReady: Bool

    init(type: String, isReady: Bool) {
        self.type = type
        self.isReady = isReady
    }
}

struct CreateBannerParam: Codable {
    let adUnitId: String
    let size: AdSize
    let placement: String?
    let alignment: String
}

private struct AdErrorObj: Codable {
    
    public let ad: ProxyAd
    public let error: AdError?
    
    init(ad: ProxyAd, error: AdError?) {
        self.ad = ad
        self.error = error
    }
}

private class AdServiceListener: BaseAdServiceListener {

    override func onLoaded(ad: ProxyAd) {
        super.onLoaded(ad: ad)
        CocosEventDispatcher.shared.send(
            methodAdOnLoaded + "-" + ad.adType.toString(),
            data: ad
        )
    }

    override func onLoadFailed(ad: ProxyAd, error: AdError?) {
        super.onLoadFailed(ad: ad, error: error)
        CocosEventDispatcher.shared.send(
            methodAdOnLoadFailed + "-" + ad.adType.toString(),
            data: AdErrorObj(ad: ad, error: error)
        )
    }

    override func onDisplayed(ad: ProxyAd) {
        super.onDisplayed(ad: ad)
        CocosEventDispatcher.shared.send(
            methodAdOnDisplayed + "-" + ad.adType.toString(),
            data: ad
        )
    }

    override func onDisplayFailed(ad: ProxyAd, error: AdError?) {
        super.onDisplayFailed(ad: ad, error: error)
        CocosEventDispatcher.shared.send(
            methodAdOnDisplayFailed + "-" + ad.adType.toString(),
            data: AdErrorObj(ad: ad, error: error)
        )
    }

    override func onRewarded(ad: ProxyAd) {
        super.onRewarded(ad: ad)
        CocosEventDispatcher.shared.send(
            methodAdOnRewarded + "-" + ad.adType.toString(),
            data: ad
        )
    }

    override func onClick(ad: ProxyAd) {
        super.onClick(ad: ad)
        CocosEventDispatcher.shared.send(
            methodAdOnClick + "-" + ad.adType.toString(),
            data: ad
        )
    }

    override func onClosed(ad: ProxyAd) {
        super.onClosed(ad: ad)
        CocosEventDispatcher.shared.send(
            methodAdOnClose + "-" + ad.adType.toString(),
            data: ad
        )
    }
}
