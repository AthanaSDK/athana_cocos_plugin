//
//  IapProxyService.swift
//  Athana Demo
//
//  Created by CWJoy on 16/12/2025.
//
import AthanaCore
import AthanaSDK

struct IapProxyService: SDKService {
    
    static let methodIsAvailable = "isAvailable"
    static let methodQueryProducts = "queryProducts"
    static let methodPurchase = "purchase"
    static let methodQueryPurchaseHistory = "queryPurchaseHistory"
    static let methodVerifyOrder = "verifyOrder"
    static let methodRestorePurchase = "restorePurchase"
    
    func initialize() {
        CocosEventDispatcher.shared.register(
            IapProxyService.methodIsAvailable,
            listener: {
                withActor(
                    {
                        await handleSdkError(
                            IapProxyService.methodIsAvailable,
                            action: {
                                let result = try await Athana.shared
                                    .storeIsAvailable()
                                CocosEventDispatcher.shared.send(
                                    IapProxyService.methodIsAvailable,
                                    data: SdkResult<Bool>(data: result)
                                )
                            }
                        )
                    }
                )
            }
        )
        
        CocosEventDispatcher.shared.register(
            IapProxyService.methodQueryProducts,
            listener: { (data: QueryProductsParam?) in
                guard let param = data else {
                    let msg =
                    "Missing param in calling \(IapProxyService.methodQueryProducts) funcation"
                    LoggingService.shared.warn(
                        tag: AthanaCocos.TAG,
                        message: msg
                    )
                    CocosEventDispatcher.shared.send(
                        IapProxyService.methodQueryProducts,
                        data: SdkResult<[IapProduct]>(
                            error: SdkError(.SDK_REQUEST_ERROR, msg: msg)
                        )
                    )
                    return
                }
                
                withActor(
                    {
                        await handleSdkError(
                            IapProxyService.methodQueryProducts,
                            action: {
                                let results = try await Athana.shared
                                    .queryProducts(param.keys)
                                CocosEventDispatcher.shared.send(
                                    IapProxyService.methodQueryProducts,
                                    data: SdkResult<[IapProduct]>(data: results)
                                )
                            }
                        )
                    }
                )
            },
            codec: JSONCodec<QueryProductsParam>()
        )
        
        CocosEventDispatcher.shared.register(
            IapProxyService.methodPurchase,
            listener: { (data: PurchaseParam?) in
                
                guard let param = data else {
                    let msg =
                    "Missing param in calling \(IapProxyService.methodPurchase) funcation"
                    LoggingService.shared.warn(
                        tag: AthanaCocos.TAG,
                        message: msg
                    )
                    CocosEventDispatcher.shared.send(
                        IapProxyService.methodPurchase,
                        data: SdkResult<Bool>(
                            error: SdkError(.SDK_REQUEST_ERROR, msg: msg)
                        )
                    )
                    return
                }
                
                withActor(
                    {
                        await handleSdkError(
                            IapProxyService.methodPurchase,
                            action: {
                                let products = try await Athana.shared
                                    .queryProducts([param.productId])
                                if products.isEmpty {
                                    let msg = "Not found this Product"
                                    LoggingService.shared.warn(
                                        tag: AthanaCocos.TAG,
                                        message: msg + "(\(param.productId))"
                                    )
                                    CocosEventDispatcher.shared.send(
                                        IapProxyService.methodPurchase,
                                        data: SdkResult<Bool>(
                                            error: SdkError(
                                                .SDK_REQUEST_ERROR,
                                                msg: msg
                                            )
                                        )
                                    )
                                    return
                                }
                                
                                let iapProduct = if param.subsIndex != nil {
                                    products[param.subsIndex!]
                                } else {
                                    products.first
                                }
                                
                                let result = try await Athana.shared.purchase(
                                    iapProduct!,
                                    param.clientOrderId ?? -1
                                )
                                
                                if (!result) {
                                    let msg = "Failed to purchase"
                                    LoggingService.shared.warn(
                                        tag: AthanaCocos.TAG,
                                        message: msg + "(\(param.productId))"
                                    )
                                    CocosEventDispatcher.shared.send(
                                        IapProxyService.methodPurchase,
                                        data: SdkResult<Bool>(
                                            error: SdkError(
                                                .SDK_REQUEST_ERROR,
                                                msg: msg
                                            )
                                        )
                                    )
                                } else {
                                    CocosEventDispatcher.shared.send(
                                        IapProxyService.methodPurchase,
                                        data: SdkResult<Bool>(data: true)
                                    )
                                }
                                
                            }
                        )
                    }
                )
            },
            codec: JSONCodec<PurchaseParam>()
        )
        
        CocosEventDispatcher.shared.register(
            IapProxyService.methodQueryPurchaseHistory,
            listener: {
                withActor(
                    {
                        await handleSdkError(
                            IapProxyService.methodQueryPurchaseHistory,
                            action: {
                                let results = try await Athana.shared
                                    .queryPurchaseHistory()
                                CocosEventDispatcher.shared.send(
                                    IapProxyService.methodQueryPurchaseHistory,
                                    data: SdkResult<[IapPurchaseDetail]>(
                                        data: results
                                    )
                                )
                            }
                        )
                    }
                )
            }
        )
        
        CocosEventDispatcher.shared.register(
            IapProxyService.methodVerifyOrder,
            listener: { data in
                guard let param = data else {
                    let msg =
                    "Missing param in calling \(IapProxyService.methodVerifyOrder) funcation"
                    LoggingService.shared.warn(
                        tag: AthanaCocos.TAG,
                        message: msg
                    )
                    CocosEventDispatcher.shared.send(
                        IapProxyService.methodVerifyOrder,
                        data: SdkResult<Bool>(
                            error: SdkError(.SDK_REQUEST_ERROR, msg: msg)
                        )
                    )
                    return
                }
                
                withActor(
                    {
                        await handleSdkError(
                            IapProxyService.methodVerifyOrder,
                            action: {
                                let orders = try await Athana.shared.queryPurchaseHistory()
                                let order = orders.first(where: { $0.purchaseId == param.purchaseId} )
                                if orders.isEmpty || order == nil {
                                    let msg = "Not found this Purchase"
                                    LoggingService.shared.warn(
                                        tag: AthanaCocos.TAG,
                                        message: msg + "(\(param.purchaseId))"
                                    )
                                    CocosEventDispatcher.shared.send(
                                        IapProxyService.methodVerifyOrder,
                                        data: SdkResult<Bool>(
                                            error: SdkError(.SDK_REQUEST_ERROR, msg: msg)
                                        )
                                    )
                                    return
                                }
                                
                                let result = try await Athana.shared.verifyOrder(order!)
                                CocosEventDispatcher.shared.send(
                                    IapProxyService.methodVerifyOrder,
                                    data: SdkResult<Bool>(data: result)
                                )
                            }
                        )
                    }
                )
            },
            codec: JSONCodec<VerifyOrderParam>()
        )

        CocosEventDispatcher.shared.register(
            IapProxyService.methodRestorePurchase,
            listener: {
                withActor(
                    {
                        await handleSdkError(
                            IapProxyService.methodRestorePurchase,
                            action: {
                                try await Athana.shared.restorePurchase()
                                try? await Task.sleep(nanoseconds: 4 * 1_000_000_000)
                                CocosEventDispatcher.shared.send(
                                    IapProxyService.methodRestorePurchase,
                                    data: SdkResult<Bool>(data: true)
                                )
                            }
                        )
                    }
                )
            }
        )
        
    }
    
}

struct QueryProductsParam: Codable {
    
    let keys: Set<String>
    
}

struct PurchaseParam: Codable {
    
    let productId: String
    let subsIndex: Int?
    let clientOrderId: Int?
    let consumable: Bool
    let extra: [String: AnyCodable]?
    
    init(
        productId: String,
        subsIndex: Int? = 0,
        clientOrderId: Int? = 0,
        consumable: Bool = true,
        extra: [String: AnyCodable]? = nil
    ) {
        self.productId = productId
        self.subsIndex = subsIndex
        self.clientOrderId = clientOrderId
        self.consumable = consumable
        self.extra = extra
    }
}

struct VerifyOrderParam: Codable {
    
    let purchaseId: String
    let consumable: Bool
    let extra: [String: AnyCodable]?
    
    init(
        purchaseId: String,
        consumable: Bool = true,
        extra: [String: AnyCodable]? = nil
    ) {
        self.purchaseId = purchaseId
        self.consumable = consumable
        self.extra = extra
    }
    
}
