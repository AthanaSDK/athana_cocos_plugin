"use strict";
module.exports = {
    title: "Athana SDK", 
    description: "Athana SDK for Cocos Creator", 
    menu_main: "Athana", 
    menu_sdk_config: "SDK Configuration",
    
    builder: {
        ser_acc: "Account Service",
        ser_ad: "Advertising Service",
        ser_cvr: "Conversion Service",
        ser_push: "Push Service",

        service_enable: "Enable",
        service_enable_desc: "Enable this service, if disabled, the related components will not be imported",

        ser_acc_hc: "Athana",
        ser_acc_gpg_id: "Google Play Games ProjectID",
        ser_acc_gpg_id_deesc: "Google Play Games ProjectID",
        ser_ad_max: "AppLovin MAX",
        ser_cvr_appsflyer: "AppsFlyer",
        ser_cvr_firebase: "Firebase",
        ser_cvr_meta: "Facebook",
        ser_push_firebase: "Firebase",

        tri_sdk_config: "Third-Party SDK Configuration",
        tri_meta_app_id: "Facebook AppID",
        tri_meta_app_client_token: "Facebook ClientToken"
    },

    panels: {
        config_sdk_android_version: "SDK Android Veersion",
        config_enable: "Enable Custom Build Configuration",
        config_save: "Save"
    }
};