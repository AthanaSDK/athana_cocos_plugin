//
//  AccountProxyService.swift
//  Athana Demo
//
//  Created by CWJoy on 19/12/2025.
//
import AthanaCore
import AthanaSDK

struct AccountProxyService: SDKService {

    let methodCurrentUser = "currentUser"
    let methodRegisterUser = "registerUser"
    let methodSignIn = "signIn"
    let methodSignInWithUI = "signInWithUI"
    let methodSignOut = "signOut"
    let methodAccountBinding = "accountBinding"
    let methodAccountUnbind = "accountUnbind"
    let methodQueryAllAccountBind = "queryAllAccountBind"
    let methodUpdateUserInfo = "updateUserInfo"

    func initialize() {
        CocosEventDispatcher.shared.register(
            methodCurrentUser,
            listener: {
                Task {
                    let result = await Athana.shared.currentUser()
                    CocosEventDispatcher.shared.send(
                        methodCurrentUser,
                        data: SdkResult<AccountInfo>(data: result)
                    )
                }
            }
        )

        CocosEventDispatcher.shared.register(
            methodRegisterUser,
            listener: { data in registerUser(data) },
            codec: JSONCodec<RegisterUserParam>()
        )

        CocosEventDispatcher.shared.register(
            methodSignIn,
            listener: { data in signIn(data) },
            codec: JSONCodec<SignInParam>()
        )

        CocosEventDispatcher.shared.register(
            methodSignInWithUI,
            listener: { data in signInWithUI(data) },
            codec: JSONCodec<SignInWithUIParam>()
        )

        CocosEventDispatcher.shared.register(
            methodSignOut,
            listener: {
                withActor(
                    {
                        await handleSdkError(
                            methodSignOut,
                            action: {
                                try await Athana.shared.signOut()
                                CocosEventDispatcher.shared.send(
                                    methodSignOut,
                                    data: SdkResult<Bool>(data: true)
                                )
                            }
                        )
                    }
                )
            },
        )

        CocosEventDispatcher.shared.register(
            methodAccountBinding,
            listener: { data in accountBinding(data) },
            codec: JSONCodec<AccountBindingParam>()
        )

        CocosEventDispatcher.shared.register(
            methodAccountUnbind,
            listener: { data in accountUnbind(data) },
            codec: JSONCodec<AccountBindingParam>()
        )

        CocosEventDispatcher.shared.register(
            methodQueryAllAccountBind,
            listener: { data in queryAllAccountBind(data) },
            codec: JSONCodec<AnyCodable>()
        )

        CocosEventDispatcher.shared.register(
            methodUpdateUserInfo,
            listener: { data in updateUserInfo(data) },
            codec: JSONCodec<AnyCodable>()
        )
    }

    func registerUser(_ data: RegisterUserParam?) {
        withActor(
            {
                await handleSdkError(
                    methodRegisterUser,
                    action: {
                        let result = try await Athana.shared.signIn(
                            signInType: data?.signInType.toSignInType()
                                ?? .ANONYMOUS,
                            customUserId: data?.customUserId ?? -1,
                            extra: data?.extra?.toDict()
                        )
                        CocosEventDispatcher.shared.send(
                            methodRegisterUser,
                            data: SdkResult<AccountInfo>(data: result)
                        )
                    }
                )
            }
        )
    }

    func signIn(_ data: SignInParam?) {
        guard let param = data else {
            let msg =
                "Missing param in calling \(methodSignIn) funcation"
            LoggingService.shared.warn(
                tag: AthanaCocos.TAG,
                message: msg
            )
            CocosEventDispatcher.shared.send(
                methodSignIn,
                data: SdkResult<AccountInfo>(
                    error: SdkError(.SDK_REQUEST_ERROR, msg: msg)
                )
            )
            return
        }
        guard let type = param.signInType.toSignInType() else {
            let msg = "Unkonwn SignIn Type[\(param.signInType)]"
            LoggingService.shared.warn(
                tag: AthanaCocos.TAG,
                message: msg
            )
            CocosEventDispatcher.shared.send(
                methodSignIn,
                data: SdkResult<AccountInfo>(
                    error: SdkError(.SDK_REQUEST_ERROR, msg: msg)
                )
            )
            return
        }

        withActor(
            {
                await handleSdkError(
                    methodSignIn,
                    action: {
                        let result = try await Athana.shared.signIn(
                            signInType: type,
                            customUserId: param.customUserId ?? -1,
                            extra: param.extra?.toDict()
                        )
                        CocosEventDispatcher.shared.send(
                            methodSignIn,
                            data: SdkResult<AccountInfo>(data: result)
                        )
                    }
                )
            }
        )
    }

    func signInWithUI(_ data: SignInWithUIParam?) {

        var types: [Int] = []
        data?.enabledSignInTypes?.forEach {
            let id = $0.toSignInType()?.rawValue
            if id != nil {
                types.append(id!)
            }
        }

        withActor(
            {
                await handleSdkError(
                    methodSignInWithUI,
                    action: {
                        let result = try await Athana.shared.signInWithUI(
                            ppUrl: data?.privacyPolicyUrl,
                            usUrl: data?.termsOfServiceUrl,
                            customUserId: data?.customUserId ?? -1,
                            enabledsTypes: types
                        )
                        CocosEventDispatcher.shared.send(
                            methodSignInWithUI,
                            data: SdkResult<AccountInfo>(data: result)
                        )
                    }
                )
            }
        )
    }

    func accountBinding(_ data: AccountBindingParam?) {
        guard let typeString = data?.signInType else {
            let msg = "Missing SignIn Type"
            LoggingService.shared.warn(
                tag: AthanaCocos.TAG,
                message: msg
            )
            CocosEventDispatcher.shared.send(
                methodAccountBinding,
                data: SdkResult<Bool>(
                    error: SdkError(.SDK_REQUEST_ERROR, msg: msg)
                )
            )
            return
        }
        
        guard let type = typeString.toSignInType() else {
            let msg = "Unkonwn SignIn Type[\(typeString)]"
            LoggingService.shared.warn(
                tag: AthanaCocos.TAG,
                message: msg
            )
            CocosEventDispatcher.shared.send(
                methodAccountBinding,
                data: SdkResult<Bool>(
                    error: SdkError(.SDK_REQUEST_ERROR, msg: msg)
                )
            )
            return
        }
        withActor(
            {
                await handleSdkError(
                    methodAccountBinding,
                    action: {
                        let result = try await Athana.shared.accountBinding(signInType: type)
                        CocosEventDispatcher.shared.send(
                            methodSignInWithUI,
                            data: SdkResult<Bool>(data: result)
                        )
                    }
                )
            }
        )
    }

    func accountUnbind(_ data: AccountBindingParam?) {

    }

    func queryAllAccountBind(_ data: AnyCodable?) {
        withActor(
            {
                await handleSdkError(
                    methodQueryAllAccountBind,
                    action: {
                        let result = try await Athana.shared.queryAllAccountBind()
                        CocosEventDispatcher.shared.send(
                            methodQueryAllAccountBind,
                            data: SdkResult<TriAccountBindMap>(data: result)
                        )
                    }
                )
            }
        )
    }

    func updateUserInfo(_ data: AnyCodable?) {

    }
}

struct RegisterUserParam: Codable {
    let signInType: String
    let ua: String?
    let deviceId: String?
    let customUserId: Int?
    let extra: [String: AnyCodable]?
    let triAccount: AccountInfo?
}

struct SignInParam: Codable {
    let signInType: String
    let ua: String?
    let deviceId: String?
    let customUserId: Int?
    let extra: [String: AnyCodable]?
}

struct SignInWithUIParam: Codable {
    let enabledSignInTypes: [String]?
    let customUserId: Int?
    let privacyPolicyUrl: String?
    let termsOfServiceUrl: String?
}

struct AccountBindingParam: Codable {
    let signInType: String
    let triOpenID: String?
    let extra: [String: AnyCodable]?
}
