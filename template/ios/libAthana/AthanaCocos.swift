//
//  AthanaCocos.swift
//  athana-demo
//
//  Created by CWJoy on 15/12/2025.
//
import Foundation
import os
import UIKit
import AthanaCore
import AthanaSDK
import AppTrackingTransparency

#if canImport(AthanaAdapterApple)
    import AthanaAdapterApple
#endif
#if canImport(AthanaAdapterAppLovin)
    import AthanaAdapterAppLovin
#endif
#if canImport(AthanaAdapterAppsFlyer)
    import AthanaAdapterAppsFlyer
#endif
#if canImport(AthanaAdapterFirebase)
    import AthanaAdapterFirebase
#endif
#if canImport(AthanaAdapterGoogle)
    import AthanaAdapterGoogle
#endif
#if canImport(AthanaAdapterMeta)
    import AthanaAdapterMeta
#endif

@objc public class AthanaCocos: NSObject {

    static let TAG = "ATHANA-Cocos"
    
    @objc public static let shared = AthanaCocos()

    private var initialized = false
    private var launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil

    override private init() {
        let adService = AdProxyService()
        
        let services: [SDKService] = [
            AccountProxyService(),
            adService,
            EventProxyService(),
            IapProxyService(),
        ]

        services.forEach { $0.initialize() }

        CocosEventDispatcher.shared.register(
            "init",
            listener: { (data: SdkInitParam?) in
                guard let param = data else {
                    os_log(
                        "%s",
                        type: .error,
                        "[\(AthanaCocos.TAG)] Missing param in calling init funcation"
                    )
                    return
                }

                #if canImport(AthanaAdapterApple)
                    Athana.shared.registerOf(
                        service: AccountService.shared,
                        provider: AppleAccountServiceProvider()
                    )
                #endif

                #if canImport(AthanaAdapterAppLovin)
                    let maxConfig = param.adConfigs?.max
                    if maxConfig != nil {
                        let preloadAds: [Int: String]?
                        let keys = maxConfig!.preloadAds
                        if keys != nil {
                            preloadAds = Dictionary(
                                uniqueKeysWithValues: keys!.map { (k, v) in
                                    (k.toAdType().rawValue, v)
                                }
                            )
                        } else {
                            preloadAds = nil
                        }

                        Athana.shared.registerOf(
                            service: AdService.shared,
                            provider: MaxAdServiceProvider(),
                            config: MaxAdServiceProviderConfig(
                                devKey: maxConfig!.sdkKey,
                                privacyPolicyUrl: maxConfig?.privacyPolicyUrl,
                                termsOfServiceUrl: maxConfig?.termsOfServiceUrl,
                                preloadAds: preloadAds,
                                autoLoadNext: maxConfig!.preload,
                                debug: maxConfig!.debug,
                            )
                        )
                    }
                #endif

                #if canImport(AthanaAdapterAppsFlyer)
                    let appsflyerConfig = param.conversionConfigs?.appsflyer
                    if appsflyerConfig != nil {
                        // 配置 AppsFlyer
                        Athana.shared.registerOf(
                            service: ConversionService.shared,
                            provider: AppsFlyerConversionServiceProvider(),
                            config: AppsFlyerServiceProviderConfig(
                                devKey: appsflyerConfig!.sdkKey,
                                appId: appsflyerConfig!.appStoreId
                            )
                        )
                    }
                #endif

                #if canImport(AthanaAdapterFirebase)
                    Athana.shared.registerOf(
                        service: ErrorRecordService.shared,
                        provider: FirebaseErrorRecordServiceProvider()
                    )
                    Athana.shared.registerOf(
                        service: LoggingService.shared,
                        provider: FirebaseLoggingServiceProvider()
                    )
                    Athana.shared.registerOf(
                        service: ConversionService.shared,
                        provider: FirebaseConversionServiceProvider()
                    )
                    Athana.shared.registerOf(
                        service: EventService.shared,
                        provider: FirebaseEventServiceProvider()
                    )
                    Athana.shared.registerOf(
                        service: PushService.shared,
                        provider: FirebasePushServiceProvider()
                    )
                #endif

                #if canImport(AthanaAdapterGoogle)
                    Athana.shared.registerOf(
                        service: AccountService.shared,
                        provider: GoogleAccountServiceProvider()
                    )
                #endif

                #if canImport(AthanaAdapterMeta)
                    Athana.shared.registerOf(
                        service: AccountService.shared,
                        provider: FacebookAccountServiceProvider()
                    )
                    Athana.shared.registerOf(
                        service: ConversionService.shared,
                        provider: MetaConversionServiceProvider()
                    )
                #endif

                // 配置 Athana
                Athana.shared.initialize(
                    UIApplication.shared,
                    config: AthanaConfig(
                        appId: Int(param.appId) ?? 0,
                        appKey: param.appKey,
                        appSecret: param.appSecret,
                        debugMode: param.debug,
                        readClipBoard: param.readClipBoard,
                    ),
                    didFinishLaunchingWithOptions: AthanaCocos.shared.launchOptions
                )
            },
            codec: JSONCodec<SdkInitParam>()
        )

        CocosEventDispatcher.shared.register(
            "start",
            listener: { data in
                requestATT()
                Athana.shared.start(privacyGrant: data?.privacyGrant == true)
                adService.setAdListener()
            },
            codec: JSONCodec<SdkStartParam>()
        )

        let rmn = "requestReview"
        CocosEventDispatcher.shared.register(
            rmn,
            listener: {
                withActor(
                    {
                        await handleSdkError(
                            rmn,
                            action: {
                                try await Athana.shared.requestReview()
                                CocosEventDispatcher.shared.send(
                                    rmn,
                                    data: SdkResult<Bool>(data: true)
                                )
                            }
                        )
                    },
                    isMain: true
                )
            }
        )
        
        CocosEventDispatcher.shared.register(
            "requestNotifications",
            listener: {
                Athana.shared.requestNotications()
            }
        )
    }

    @objc public func dispatch(_ methodName: String, arg: String? = nil) {
        CocosEventDispatcher.shared.dispatch(methodName, arg: arg)
    }

    @objc public func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) {
        self.launchOptions = launchOptions
    }

    @objc public func application(
        _ app: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey: Any] = [:]
    ) -> Bool {
        return Athana.shared.application(app, open: url, options: options)
    }
    
    @objc public func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        Athana.shared.application(application, didRegisterForRemoteNotificationsWithDeviceToken: deviceToken)
    }

    @objc public func scene(
        _ scene: UIScene,
        continue userActivity: NSUserActivity
    ) {
        Athana.shared.scene(scene, continue: userActivity)
    }

    @objc public func scene(
        _ scene: UIScene,
        openURLContexts URLContexts: Set<UIOpenURLContext>
    ) -> Bool {
        return Athana.shared.scene(scene, openURLContexts: URLContexts)
    }
    
}

private func requestATT() {
    Task {
        if #available(iOS 14.0, *) {
            var state = ATTrackingManager.trackingAuthorizationStatus
            switch state {
            case .authorized, .denied, .restricted:
                break
            case .notDetermined:
                state = await ATTrackingManager.requestTrackingAuthorization()
                break
            default:
                break
            }
        }
    }
}

protocol Codec {

    associatedtype DataType

    func de(_ json: String) throws -> DataType

    func en(_ data: DataType) throws -> String

}

class CocosEventDispatcher: NSObject {

    public static let shared = CocosEventDispatcher()

    override private init() {}

    private var bridge = JsbBridgeWrapper.sharedInstance()

    private var handlers: [String: (String?) -> Void] = [:]

    func register<T: Codable, C: Codec>(
        _ methodName: String,
        listener: @escaping (T?) -> Void,
        codec: C
    ) where T == C.DataType {
        os_log(
            "%s",
            type: .debug,
            "[\(AthanaCocos.TAG)] bridge register: method -> \(methodName)"
        )

        handlers[methodName] = { arg in
            guard let json = arg else {
                os_log(
                    "%s",
                    type: .debug,
                    "[\(AthanaCocos.TAG)] From Cocos: method -> \(methodName)"
                )
                listener(nil)
                return
            }

            do {
                os_log(
                    "%s",
                    type: .debug,
                    "[\(AthanaCocos.TAG)] From Cocos: method -> \(methodName), message -> \(json)"
                )
                if (json.isEmpty) {
                    listener(nil)
                } else {
                    let data = try codec.de(json)
                    listener(data)
                }
            } catch {
                os_log(
                    "%s",
                    type: .error,
                    "[\(AthanaCocos.TAG)] Failed to decode method(\(methodName)) message. error: \(error)"
                )
            }
        }
    }

    func register(
        _ methodName: String,
        listener: @escaping () -> Void
    ) {
        os_log(
            "%s",
            type: .debug,
            "[\(AthanaCocos.TAG)] bridge register: method -> \(methodName)"
        )

        handlers[methodName] = { arg in
            os_log(
                "%s",
                type: .debug,
                "[\(AthanaCocos.TAG)] From Cocos: method -> \(methodName)"
            )
            listener()
        }
    }

    func unregister(_ methodName: String) {
        handlers.removeValue(forKey: methodName)
    }

    func dispatch(_ methodName: String, arg: String? = nil) {
        guard let handler = handlers[methodName] else {
            os_log(
                "%s",
                type: .error,
                "[\(AthanaCocos.TAG)] Not found method = \(methodName)"
            )
            return
        }
        handler(arg)
    }

    func send(_ methodName: String) {
        os_log(
            "%s",
            type: .debug,
            "[\(AthanaCocos.TAG)] To Cocos: method = \(methodName)"
        )
        Task { @MainActor in
            bridge?.dispatchEvent(toScript: methodName)
            //            JsbBridgeUtils.send(methodName)
        }
    }

    func send<T: Codable>(_ methodName: String, data: T) {
        do {
            let data = try JSONEncoder().encode(data)
            guard let json = String(data: data, encoding: .utf8) else {
                throw AthanaError(
                    .SDK_REQUEST_ERROR,
                    message: "Cannot convert Bytes to String"
                )
            }

            os_log(
                "%s",
                type: .debug,
                "[\(AthanaCocos.TAG)] To Cocos: method = \(methodName), data = \(json)"
            )
            Task { @MainActor in
                bridge?.dispatchEvent(toScript: methodName, arg: json)
                //                JsbBridgeUtils.send(methodName, arg: json)
            }
        } catch {
            os_log(
                "%s",
                type: .error,
                "[\(AthanaCocos.TAG)] Failed to Cocos: method = \(methodName), error: \(error)"
            )
        }
    }

    func remove(_ methodName: String) {
        bridge?.removeAllListeners(forEvent: methodName)
        handlers.removeValue(forKey: methodName)
    }

    func destroy() {
        handlers.forEach {
            remove($0.key)
        }
        handlers.removeAll()
    }

}

class JSONCodec<T: Codable>: Codec {

    func de(_ json: String) throws -> T {
        guard let data = json.data(using: .utf8) else {
            throw AthanaError(
                .SDK_REQUEST_ERROR,
                message: "Cannot convert String(\(json)) to Bytes"
            )
        }
        return try JSONDecoder().decode(T.self, from: data)
    }

    func en(_ data: T) throws -> String {
        let data = try JSONEncoder().encode(data)
        guard let str = String(data: data, encoding: .utf8) else {
            throw AthanaError(
                .SDK_REQUEST_ERROR,
                message: "Cannot convert Bytes to String"
            )
        }
        return str
    }

}

struct NoParam: Codable {

}

struct SdkError: Codable {

    let type: AthanaErrorType
    let errorCode: Int?
    let msg: String?
    let message: String?

    init(
        _ type: AthanaErrorType,
        errorCode: Int? = nil,
        msg: String? = nil,
        message: String? = nil
    ) {
        self.type = type
        self.errorCode = errorCode
        self.msg = msg
        self.message = message
    }

}

struct SdkResult<T: Codable>: Codable {

    let data: T?
    let error: SdkError?

    init(data: T? = nil, error: SdkError? = nil) {
        self.data = data
        self.error = error
    }

}

struct SdkInitParam: Codable {
    public let appId: String
    public let appKey: String
    public let appSecret: String
    public let testMode: Bool
    public let debug: Bool
    public let accountConfigs: AccountServiceConfig?
    public let adConfigs: AdServiceConfigs?
    public let conversionConfigs: ConversionServiceConfig?
    public let readClipBoard: Bool

    init(
        appId: String,
        appKey: String,
        appSecret: String,
        testMode: Bool,
        debug: Bool,
        accountConfigs: AccountServiceConfig? = nil,
        adConfigs: AdServiceConfigs? = nil,
        conversionConfigs: ConversionServiceConfig? = nil,
        readClipBoard: Bool = false
    ) {
        self.appId = appId
        self.appKey = appKey
        self.appSecret = appSecret
        self.testMode = testMode
        self.debug = debug
        self.accountConfigs = accountConfigs
        self.adConfigs = adConfigs
        self.conversionConfigs = conversionConfigs
        self.readClipBoard = readClipBoard
    }

}

struct SdkStartParam: Codable {
    public let privacyGrant: Bool

    init(privacyGrant: Bool = false) {
        self.privacyGrant = privacyGrant
    }
}

struct AccountServiceConfig: Codable {
    public let enabldSignInTypes: [SignInType]?

    init(enabldSignInTypes: [SignInType]? = nil) {
        self.enabldSignInTypes = enabldSignInTypes
    }
}

struct AdServiceConfigs: Codable {

    let max: MaxAdServiceConfig?

    init(max: MaxAdServiceConfig? = nil) {
        self.max = max
    }

}

struct MaxAdServiceConfig: Codable {

    let sdkKey: String
    let privacyPolicyUrl: String?
    let termsOfServiceUrl: String?
    let preloadAds: [String: String]?
    let debug: Bool
    let preload: Bool

    init(
        sdkKey: String,
        privacyPolicyUrl: String? = nil,
        termsOfServiceUrl: String? = nil,
        preloadAds: [String: String]? = nil,
        debug: Bool = false,
        preload: Bool = true
    ) {
        self.sdkKey = sdkKey
        self.privacyPolicyUrl = privacyPolicyUrl
        self.termsOfServiceUrl = termsOfServiceUrl
        self.preloadAds = preloadAds
        self.debug = debug
        self.preload = preload
    }

}

struct ConversionServiceConfig: Codable {

    let appsflyer: AppsFlyerServiceConfig?

    init(appsflyer: AppsFlyerServiceConfig? = nil) {
        self.appsflyer = appsflyer
    }

}

struct AppsFlyerServiceConfig: Codable {
    let sdkKey: String
    let appStoreId: String
    let manualStart: Bool

    init(
        sdkKey: String,
        appStoreId: String,
        manualStart: Bool = false
    ) {
        self.sdkKey = sdkKey
        self.appStoreId = appStoreId
        self.manualStart = manualStart
    }
}

protocol SDKService {

    func initialize()

}

public enum AnyCodable: Codable {
    case string(String)
    case number(Double)
    case bool(Bool)
    case dictionary([String: AnyCodable])
    case array([AnyCodable])
    case nilValue

    public init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        
        if let x = try? container.decode(String.self) {
            self = .string(x)
        } else if let x = try? container.decode(Double.self) {
            self = .number(x)
        } else if let x = try? container.decode(Bool.self) {
            self = .bool(x)
        } else if let x = try? container.decode([String: AnyCodable].self) {
            self = .dictionary(x)
        } else if let x = try? container.decode([AnyCodable].self) {
            self = .array(x)
        } else if container.decodeNil() {
            self = .nilValue
        } else {
            throw DecodingError.typeMismatch(AnyCodable.self, DecodingError.Context(codingPath: decoder.codingPath, debugDescription: "不支持的类型"))
        }
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        switch self {
        case .string(let x): try container.encode(x)
        case .number(let x): try container.encode(x)
        case .bool(let x): try container.encode(x)
        case .dictionary(let x): try container.encode(x)
        case .array(let x): try container.encode(x)
        case .nilValue: try container.encodeNil()
        }
    }
    
    func take() -> Any? {
        return switch self {
        case .string(let x): x
        case .number(let x): x
        case .bool(let x): x
        case .dictionary(let x): x.mapValues { $0.take() }
        case .array(let x): x.map { $0.take() }
        case .nilValue: nil
        }
    }
}

extension [String: AnyCodable] {
    
    func toDict() -> [String: Any] {
        var newValues: [String: Any] = [:]
        self.forEach {
            let key = $0.key
            let value = $0.value
            
            switch value {
            case .nilValue:
                break
            default:
                newValues[key] = value.take()
                break
            }
        }
        return newValues
    }
    
}

func withActor(_ action: @escaping () async -> Void, isMain: Bool = false) {
    if isMain {
        Task { @MainActor in
            await action()
        }
    } else {
        Task {
            await action()
        }
    }
}

func handleSdkError(
    _ methodName: String,
    action: @escaping () async throws -> Void
) async {
    do {
        try await action()
    } catch {
        let sdkError: SdkError
        guard let athanaError = error as? AthanaError else {
            sdkError = SdkError(.SDK_REQUEST_ERROR, msg: "\(error)")
            CocosEventDispatcher.shared.send(
                methodName,
                data: SdkResult<Bool>(error: sdkError)
            )
            return
        }
        sdkError = SdkError(athanaError.type, errorCode: athanaError.errorCode, message: athanaError.message)
        CocosEventDispatcher.shared.send(
            methodName,
            data: SdkResult<Bool>(error: sdkError)
        )
    }
}
