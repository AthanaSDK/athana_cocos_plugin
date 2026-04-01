import { BuildPlugin, IBuildTaskOption } from '../../@types/packages/builder/@types';
import packageJSON from '../../package.json';
import { DepsManagers } from './ios/deps-manager-type';

export const load: BuildPlugin.load = function () {
    console.log(`athana-cocos builder load`);
};
export const unload: BuildPlugin.load = function () {
    console.log(`athana-cocos builder unload`);
};

const adProviders = {
    service: {
        label: `i18n:${packageJSON.name}.builder.service_enable`,
        description: `i18n:${packageJSON.name}.builder.service_enable_desc`,
        default: false,
        render: {
            ui: 'ui-checkbox',
        },
    },
    max: {
        label: `i18n:${packageJSON.name}.builder.ser_ad_max`,
        description: `i18n:${packageJSON.name}.builder.service_enable_desc`,
        default: false,
        render: {
            ui: 'ui-checkbox'
        },
    }
};

const accountProviders = {
    service: {
        label: `i18n:${packageJSON.name}.builder.service_enable`,
        description: `i18n:${packageJSON.name}.builder.service_enable_desc`,
        default: false,
        render: {
            ui: 'ui-checkbox'
        }
    },
    athana: {
        label: `i18n:${packageJSON.name}.builder.ser_acc_hc`,
        description: `i18n:${packageJSON.name}.builder.service_enable_desc`,
        default: false,
        render: {
            ui: 'ui-checkbox'
        }
    },
    gpgId: {
        label: `i18n:${packageJSON.name}.builder.ser_acc_gpg_id`,
        description: `i18n:${packageJSON.name}.builder.ser_acc_gpg_id_deesc`,
        default: "",
        render: {
            ui: 'ui-input',
        },
        // verifyRules: ['ruleTest'],
    }
};

const conversionProviders = {
    service: {
        label: `i18n:${packageJSON.name}.builder.service_enable`,
        description: `i18n:${packageJSON.name}.builder.service_enable_desc`,
        default: false,
        render: {
            ui: 'ui-checkbox',
        },
    },
    appsflyer: {
        label: `i18n:${packageJSON.name}.builder.ser_cvr_appsflyer`,
        description: `i18n:${packageJSON.name}.builder.service_enable_desc`,
        default: false,
        render: {
            ui: 'ui-checkbox',
        },
    },
    firebase: {
        label: `i18n:${packageJSON.name}.builder.ser_cvr_firebase`,
        description: `i18n:${packageJSON.name}.builder.service_enable_desc`,
        default: false,
        render: {
            ui: 'ui-checkbox',
        },
    },
    meta: {
        label: `i18n:${packageJSON.name}.builder.ser_cvr_meta`,
        description: `i18n:${packageJSON.name}.builder.service_enable_desc`,
        default: false,
        render: {
            ui: 'ui-checkbox',
        }
    }
};

const pushProviders = {
    service: {
        label: `i18n:${packageJSON.name}.builder.service_enable`,
        description: `i18n:${packageJSON.name}.builder.service_enable_desc`,
        default: false,
        render: {
            ui: 'ui-checkbox',
        },
    },
    firebase: {
        label: `i18n:${packageJSON.name}.builder.ser_push_firebase`,
        description: `i18n:${packageJSON.name}.builder.service_enable_desc`,
        default: false,
        render: {
            ui: 'ui-checkbox',
        }
    }
};

const triSdk = {
    facebookAppId: {
        label: `i18n:${packageJSON.name}.builder.tri_meta_app_id`,
        default: "",
        render: {
            ui: 'ui-input',
        },
        // verifyRules: ['ruleTest'],
    },
    facebookClientToken: {
        label: `i18n:${packageJSON.name}.builder.tri_meta_app_client_token`,
        default: "",
        render: {
            ui: 'ui-input',
        },
        // verifyRules: ['ruleTest'],
    }
};

const iOSTriSdk = {
    facebookAppId: {
        label: `i18n:${packageJSON.name}.builder.tri_meta_app_id`,
        default: "",
        render: {
            ui: 'ui-input',
        },
        // verifyRules: ['ruleTest'],
    },
    facebookClientToken: {
        label: `i18n:${packageJSON.name}.builder.tri_meta_app_client_token`,
        default: "",
        render: {
            ui: 'ui-input',
        },
        // verifyRules: ['ruleTest'],
    },
    googleWebClient: {
        label: `i18n:${packageJSON.name}.builder.tri_google_web_client_id`,
        default: "",
        render: {
            ui: 'ui-input',
        },
    },
    firebaseConfigPath: {
        label: `i18n:${packageJSON.name}.builder.tri_firebase_config_path`,
        default: "",
        render: {
            ui: 'ui-input',
        },
    }
};

const androidGamingProviders = {
    service: {
        label: `i18n:${packageJSON.name}.builder.service_enable`,
        description: `i18n:${packageJSON.name}.builder.service_enable_desc`,
        default: false,
        render: {
            ui: 'ui-checkbox',
        },
    },
    gpgs: {
        label: `i18n:${packageJSON.name}.builder.gaming_gpgs`,
        description: "",
        default: false,
        render: {
            ui: 'ui-checkbox',
        },
    },
}

const iosGamingProviders = {
    service: {
        label: `i18n:${packageJSON.name}.builder.service_enable`,
        description: `i18n:${packageJSON.name}.builder.service_enable_desc`,
        default: false,
        render: {
            ui: 'ui-checkbox',
        },
    },
    gameCenter: {
        label: `i18n:${packageJSON.name}.builder.gaming_game_center`,
        description: "",
        default: false,
        render: {
            ui: 'ui-checkbox',
        },
    },
}

export const configs: BuildPlugin.Configs = {
    'android': {
        hooks: './hooks',
        // doc: 'editor/publish/custom-build-plugin.html',
        options: {
            ad: {
                label: `i18n:${packageJSON.name}.builder.ser_ad`,
                type: 'object',
                default: {
                    service: adProviders.service.default,
                    max: adProviders.max.default,
                },
                itemConfigs: adProviders,
            },
            account: {
                label: `i18n:${packageJSON.name}.builder.ser_acc`,
                type: 'object',
                default: {
                    service: accountProviders.service.default,
                    athana: accountProviders.athana.default,
                    gpgId: accountProviders.gpgId.default,
                },
                itemConfigs: accountProviders,
            },
            conversion: {
                label: `i18n:${packageJSON.name}.builder.ser_cvr`,
                type: 'object',
                default: {
                    service: conversionProviders.service.default,
                    appsflyer: conversionProviders.appsflyer.default,
                    firebase: conversionProviders.firebase.default,
                    meta: conversionProviders.meta.default,
                },
                itemConfigs: conversionProviders,
            },
            push: {
                label: `i18n:${packageJSON.name}.builder.ser_push`,
                type: 'object',
                default: {
                    service: pushProviders.service.default,
                    firebase: pushProviders.firebase.default,
                },
                itemConfigs: pushProviders,
            },
            gaming: {
                label: `i18n:${packageJSON.name}.builder.ser_gaming`,
                type: 'object',
                default: {
                    service: androidGamingProviders.service.default,
                    gpgs: androidGamingProviders.gpgs.default,
                },
                itemConfigs: androidGamingProviders,
            },
            triSdk: {
                label: `i18n:${packageJSON.name}.builder.tri_sdk_config`,
                type: 'object',
                default: {
                    facebookAppId: triSdk.facebookAppId.default,
                    facebookClientToken: triSdk.facebookClientToken.default,
                },
                itemConfigs: triSdk,
            }
        },
        verifyRuleMap: {
            // ruleTest: {
            //     message: `i18n:${PACKAGE_NAME}.options.ruleTest_msg`,
            //     func(val, buildOptions) {
            //         if (val === 'cocos') {
            //             return true;
            //         }
            //         return false;
            //     },
            // },
        },
    },
    'ios': {
        hooks: './hooks',
        // doc: 'editor/publish/custom-build-plugin.html',
        options: {
            depsManager: {
                label: `i18n:${packageJSON.name}.builder.ser_deps_manager`,
                description: `i18n:${packageJSON.name}.builder.ser_deps_manager_desc`,
                default: "",
                render: {
                    ui: 'ui-select',
                    items: [
                        {
                            "value": DepsManagers.COCOA_PODS,
                            "label": "CocoaPods"
                        },
                        {
                            "value": DepsManagers.SWIFT_PM,
                            "label": "Swift Package Manager"
                        },
                    ]
                },
            },
            ad: {
                label: `i18n:${packageJSON.name}.builder.ser_ad`,
                type: 'object',
                default: {
                    service: adProviders.service.default,
                    max: adProviders.max.default,
                },
                itemConfigs: adProviders,
                passThrough: true,
            },
            account: {
                label: `i18n:${packageJSON.name}.builder.ser_acc`,
                type: 'object',
                default: {
                    service: accountProviders.service.default,
                    athana: accountProviders.athana.default,
                    gpgId: accountProviders.gpgId.default,
                },
                itemConfigs: accountProviders,
            },
            conversion: {
                label: `i18n:${packageJSON.name}.builder.ser_cvr`,
                type: 'object',
                default: {
                    service: conversionProviders.service.default,
                    appsflyer: conversionProviders.appsflyer.default,
                    firebase: conversionProviders.firebase.default,
                    meta: conversionProviders.meta.default,
                },
                itemConfigs: conversionProviders,
            },
            push: {
                label: `i18n:${packageJSON.name}.builder.ser_push`,
                type: 'object',
                default: {
                    service: pushProviders.service.default,
                    firebase: pushProviders.firebase.default,
                },
                itemConfigs: pushProviders,
            },
            gaming: {
                label: `i18n:${packageJSON.name}.builder.ser_gaming`,
                type: 'object',
                default: {
                    service: iosGamingProviders.service.default,
                    gameCenter: iosGamingProviders.gameCenter.default,
                },
                itemConfigs: iosGamingProviders,
            },
            triSdk: {
                label: `i18n:${packageJSON.name}.builder.tri_sdk_config`,
                type: 'object',
                default: {
                    facebookAppId: iOSTriSdk.facebookAppId.default,
                    facebookClientToken: iOSTriSdk.facebookClientToken.default,
                    googleWebClient: iOSTriSdk.googleWebClient.default,
                    firebaseConfigPath: iOSTriSdk.firebaseConfigPath.default,
                },
                itemConfigs: iOSTriSdk,
            }
        },
        verifyRuleMap: {
            // ruleTest: {
            //     message: `i18n:${PACKAGE_NAME}.options.ruleTest_msg`,
            //     func(val, buildOptions) {
            //         if (val === 'cocos') {
            //             return true;
            //         }
            //         return false;
            //     },
            // },
        },
    },
};

export const assetHandlers: BuildPlugin.AssetHandlers = './asset-handlers';
