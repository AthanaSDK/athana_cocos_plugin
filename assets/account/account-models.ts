/**
 * 登入方式
 */
export enum SignInType {
    /**
     * 游客
     */
    ANONYMOUS = "ANONYMOUS",

    /**
     * Google 账户
     */
    GOOGLE = "GOOGLE",

    /**
     * Facebook 账户
     */
    FACEBOOK = "FACEBOOK",

    /**
     * Google Play 游戏登录
     */
    GOOGLE_PLAY_GAMES = "GOOGLE_PLAY_GAMES",

    /**
     * 自校验登录
     */
    BY_CLIENT_SELF = "BY_CLIENT_SELF"
}

/**
 * 平台用户信息
 */
export class AccountInfo {
    /**
     * 平台用户Id
     */
    public userId: number;
    /**
     * 平台用户访问凭证
     */
    public accessToken: string;
    /**
     * 登录方式
     */
    public signInType: SignInType;
    /**
     * 第三方账户 OpenID
     */
    public triOpenId?: string;
    /**
     * 第三方账户访问凭证
     */
    public triAccessToken?: string;
    /**
     * 用户属性
     */
    public userProperty: UserProperty;

    constructor(userId: number, accessToken: string, signInType: SignInType, triOpenId?: string, triAccessToken?: string, userProperty?: UserProperty) {
        this.userId = userId;
        this.accessToken = accessToken;
        this.signInType = signInType;
        this.triOpenId = triOpenId;
        this.triAccessToken = triAccessToken;
        this.userProperty = userProperty;
    }
}

/**
 * 用户属性
 */
export class UserProperty {
    /**
     * 昵称，来源于第三方账号
     */
    public nickname?: string;
    /**
     * 邮箱
     */
    public email?: string;
    /**
     * 电话
     */
    public phone?: string;
    /**
     * 账户头像图片链接
     */
    public avatarUrl?: string;
    /**
     * 额外属性
     */
    public extra?: Map<string, any>;

    constructor(nickname?: string, email?: string, phone?: string, avatarUrl?: string, extra?: Map<string, any>) {
        this.nickname = nickname;
        this.email = email;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
        this.extra = extra;
    }
}

/**
 * 用户登入参数
 */
export class SignInParam {
    /** 登入方式 */
    public signInType: SignInType = SignInType.ANONYMOUS;
    /** 设备信息 */
    public ua?: string;
    /** 设备ID */
    public deviceId?: string;
    /** 自定义用户ID - 游戏内用户ID */
    public customUserId?: number;
    /** 额外参数 */
    public extra?: Map<string, any>;

    constructor(signInType: SignInType, ua?: string, deviceId?: string, customUserId?: number, extra?: Map<string, any>) {
        this.signInType = signInType;
        this.ua = ua;
        this.deviceId = deviceId;
        this.customUserId = customUserId;
        this.extra = extra;
    }
}

/**
 * 注册平台用户参数
 */
export class RegisterUserParam extends SignInParam {

    public triAccount?: AccountInfo;

    constructor(signInType: SignInType, ua?: string, deviceId?: string, customUserId?: number, extra?: Map<string, any>, triAccount?: AccountInfo) {
        super(signInType, ua, deviceId, customUserId, extra);
        this.triAccount = triAccount;
    }

}

/**
 * 内置UI配置参数
 */
export class SignInWithUIParam {
    /** 启用的登入方式 */
    public enabledSignInTypes?: SignInType[] = null;
    /** 自定义用户ID - 游戏内用户ID */
    public customUserId?: number = null;
    /** 隐私政策链接 */
    public privacyPolicyUrl?: string = null;
    /** 服务条款链接 */
    public termsOfServiceUrl?: string = null;

    /**
     * 构造函数
     * 
     * @param enabledSignInTypes 启用的登入方式，空数组或 null 表示启用所有支持的登入方式
     * @param customUserId 自定义用户ID - 游戏内用户ID
     * @param privacyPolicyUrl 隐私政策链接，设置 null 则不显示隐私政策跳转链接
     * @param termsOfServiceUrl 服务条款链接，设置 null 则不显示服务条款跳转链接
     */
    constructor(enabledSignInTypes?: SignInType[], customUserId?: number, privacyPolicyUrl?: string, termsOfServiceUrl?: string) {
        this.enabledSignInTypes = enabledSignInTypes;
        this.customUserId = customUserId;
        this.privacyPolicyUrl = privacyPolicyUrl;
        this.termsOfServiceUrl = termsOfServiceUrl;
    }
}

/**
 * 三方账号绑定/解绑参数
 */
export class AccountBindingParam {
    /** 登入方式 */
    public signInType: SignInType;
    /** 第三方账号 Open ID */
    public triOpenID?: string = null;
    /** 额外参数 */
    public extra?: Map<string, any> = null;

    /**
     * 构造函数
     * 
     * @param signInType 登入方式
     * @param triOpenID 三方账号 Open ID，解绑时必传
     * @param extra 额外参数
     */
    constructor(signInType: SignInType, triOpenID?: string, extra?: Map<string, any>) {
        this.signInType = signInType;
        this.triOpenID = triOpenID;
        this.extra = extra;
    }
}

/**
 * 第三方账号绑定信息映射
 */
export class TriAccountBindMap{

    /**
     * Facebook 账号绑定信息
     */
    public Facebook?: TriAccount = null;

    /**
     * Apple 账号绑定信息
     */
    public Apple?: TriAccount = null;

    /**
     * Google 账号绑定信息
     */
    public Google?: TriAccount = null;

    /**
     * Google Play Game 账号绑定信息
     */
    public GoogleGameV2?: TriAccount = null;

    /**
     * Firebase Auth 账号绑定信息
     */
    public Firebase?: TriAccount = null;

    constructor(facebook?: TriAccount, apple?: TriAccount, google?: TriAccount, googleGameV2?: TriAccount, firebase?: TriAccount) {
        this.Facebook = facebook;
        this.Apple = apple;
        this.Google = google;
        this.GoogleGameV2 = googleGameV2;
        this.Firebase = firebase;
    }
}

/**
 * 第三方账号信息
 */
export class TriAccount {

    /**
     * 昵称
     */
    public nick_name?: string = null;

    /**
     * Open ID
     */
    public open_id?: string = null;

    constructor(nick_name?: string, open_id?: string) {
        this.nick_name = nick_name;
        this.open_id = open_id;
    }
}

/**
 * 更新用户信息参数
 */
export class UpdateUserInfoParam {
    /** 自定义用户ID - 游戏内用户ID */
    public customUserId?: number = null;
    /** 额外参数 */
    public extra?: Map<string, any> = null;

    /**
     * 构造函数
     * 
     * @param customUserId 自定义用户ID - 游戏内用户ID
     * @param extra 额外参数
     */
    constructor(customUserId?: number, extra?: Map<string, any>) {
        this.customUserId = customUserId;
        this.extra = extra;
    }
}