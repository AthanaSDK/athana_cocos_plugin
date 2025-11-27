"use strict";
module.exports = {
    title: "Athana SDK", 
    description: "Athana SDK for Cocos Creator", 
    menu_main: "Athana", 
    menu_sdk_config: "SDK 配置",
    
    builder: {
        ser_acc: "三方登录服务",
        ser_ad: "广告服务",
        ser_cvr: "归因服务",
        ser_push: "推送服务",
        
        service_enable: "启用",
        service_enable_desc: "启用该服务，关闭则不会引入相关组件",

        ser_acc_hc: "聚合三方登录",
        ser_acc_gpg_id: "Google Play Games ProjectID",
        ser_acc_gpg_id_deesc: "Google Play Games ProjectID",
        ser_ad_max: "AppLovin MAX",
        ser_cvr_appsflyer: "AppsFlyer",
        ser_cvr_firebase: "Firebase",
        ser_cvr_meta: "Facebook",
        ser_push_firebase: "Firebase",

        tri_sdk_config: "三方SDK配置",
        tri_meta_app_id: "Facebook AppID",
        tri_meta_app_client_token: "Facebook ClientToken"
    },

    panels: {
        config_sdk_android_version: "SDK Android 版本",
        config_enable: "开启自定义构建配置",
        config_save: "保存"
    }
};