import { BuildPlugin } from '../../@types';
import packageJSON from '../../package.json';

export const load: BuildPlugin.load = function () {
    console.debug(`athana-cocos builder load`);
};
export const unload: BuildPlugin.load = function () {
    console.debug(`athana-cocos builder unload`);
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
        }
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
};

export const assetHandlers: BuildPlugin.AssetHandlers = './asset-handlers';
