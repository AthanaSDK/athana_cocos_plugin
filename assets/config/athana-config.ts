import { AccountServiceConfig, AdServiceConfigs, ConversionServiceConfigs } from "./athana-service-configs";

export { 
    AccountServiceConfig, 
    AdServiceConfigs, 
    MaxAdServiceConfig, 
    ConversionServiceConfigs, 
    AppsFlyerServiceConfig 
} from "./athana-service-configs";

/**
 * Athana Cocos SDK 配置参数
 */
export class AthanaConfig {

    /** 应用唯一标识 ID */
    public readonly appId: String;

    /** 应用密钥 Key */
    public readonly appKey: String;

    /** 应用密钥 Secret */
    public readonly appSecret: String;

    /** 三方登录服务配置 */
    public readonly accountConfigs: AccountServiceConfig | null = null;

    /** 广告服务配置 */
    public readonly adConfigs: AdServiceConfigs | null = null;

    /** 归因服务配置 */
    public readonly conversionConfigs: ConversionServiceConfigs | null = null;

    /** 内购服务测试模式，默认为 false，只在测试环境下生效 */
    public readonly testMode: Boolean = false;

    /** 调试模式，默认为 false。开启后SDK将输出调试日志 */
    public readonly debug: Boolean = false

    /**
     * 构建 Athana Cocos SDK 配置参数实例
     * 
     * @param appId 应用唯一标识 ID
     * @param appKey 应用密钥 Key
     * @param appSecret 应用密钥 Secret
     * @param accountConfigs 三方登录服务配置
     * @param adConfigs 广告服务配置
     * @param conversionConfigs 归因服务配置
     * @param testMode 内购服务测试模式，默认为 false，只在测试环境下生效
     * @param debug 调试模式，默认为 false。开启后SDK将输出调试日志
     */
    constructor (
        appId: String,
        appKey: String,
        appSecret: String,
        accountConfigs: AccountServiceConfig = null,
        adConfigs: AdServiceConfigs = null,
        conversionConfigs: ConversionServiceConfigs = null,
        testMode?: Boolean,
        debug?: Boolean
    ) {
        this.appId = appId;
        this.appKey = appKey;
        this.appSecret = appSecret;
        this.accountConfigs = accountConfigs;
        this.adConfigs = adConfigs;
        this.conversionConfigs = conversionConfigs;
        this.testMode = testMode ?? false;
        this.debug = debug ?? false;
    }
}