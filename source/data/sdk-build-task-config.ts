/**
 * SDK 构建任务配置
 */
export interface SdkBuildTaskConfig {

    /**
     * 广告服务配置
     */
    ad?: {
        /**
         * 是否开启服务
         */
        service: boolean;
        /**
         * 是否导入 AdMax
         */
        max: boolean;
    };

    /**
     * 账号服务配置
     */
    account?: {
        /**
         * 是否开启服务
         */
        service: boolean;
        /**
         * 是否导入 HC 账号服务
         */
        athana: boolean;
        /**
         * Google Play 游戏服务 ID
         */
        gpgId: string;
    }

    /**
     * 归因服务配置
     */
    conversion?: {
        /**
         * 是否开启服务
         */
        service: boolean;
        /**
         * 是否导入 AppsFlyer
         */
        appsflyer: boolean;
        /**
         * 是否导入 Firebase 归因
         */
        firebase: boolean;
        /**
         * 是否导入 Meta 归因
         */
        meta: boolean;
    };

    /**
     * 推送服务配置
     */
    push?: {
        /**
         * 是否开启服务
         */
        service: boolean;
        /**     
         * 是否导入 Firebase 推送
         */
        firebase: boolean;
    };

    /**
     * 三方 SDK 配置
     */
    triSdk?: {
        /**
         * Facebook 应用 ID
         */
        facebookAppId: string;
        /**
         * Facebook 客户端令牌
         */
        facebookClientToken: string;
    };

}