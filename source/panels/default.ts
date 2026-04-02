import { readFileSync } from 'fs-extra';
import { join } from 'path';
import { SdkConfig } from '../data/sdk-config';
import packageJSON from '../../package.json';

// 总的开关，关闭后，所有构建配置的自定义构建面板将全部关闭
module.exports = Editor.Panel.define({
    listeners: {
        show() {
            // 面板展示
            console.log('show');
        },
        hide() {
            // 面板隐藏
            console.log('hide');
        },
    },
    template: readFileSync(join(__dirname, '../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: '#app',
        versionInput: '#versionInput',
        iOSVersionInput: '#iOSVersionInput',
        enableCheckBox: '#enableCheckBox',
        saveBtn: '#saveBtn',
        errorDisplay: '#errorDisplay'
    },
    methods: {
        save(config?: SdkConfig) {
            if (config != null) {
                const newConfig = new SdkConfig(config.version, config.iosVersion, config.enable);
                console.debug('to save:', newConfig);
                newConfig.save();
            }
        },
        showError(message: string) {
            const errorDisplay = this.$.errorDisplay;
            if (errorDisplay) {
                errorDisplay.textContent = message;
                errorDisplay.style.display = 'block';
            }
        },
        hideError() {
            const errorDisplay = this.$.errorDisplay;
            if (errorDisplay) {
                errorDisplay.style.display = 'none';
            }
        },
        validateVersion(versionInput: HTMLInputElement, iOSVersionInput: HTMLInputElement): boolean {
            this.hideError();
            
            const androidValidation = SdkConfig.validateAndroidVersion(versionInput.value);
            if (!androidValidation.valid) {
                this.showError(androidValidation.message || 'Android SDK版本无效');
                versionInput.focus();
                return false;
            }
            
            const iosValidation = SdkConfig.validateIosVersion(iOSVersionInput.value);
            if (!iosValidation.valid) {
                this.showError(iosValidation.message || 'iOS SDK版本无效');
                iOSVersionInput.focus();
                return false;
            }
            
            return true;
        }
    },
    ready() {
        // 加载完成
        const versionInput = this.$.versionInput;
        const iOSVersionInput = this.$.iOSVersionInput;
        const enableCheckBox = this.$.enableCheckBox;
        const saveBtn = this.$.saveBtn;

        // 读取数据，初始化控件
        SdkConfig.read().then((config?: SdkConfig) => {
            console.debug('load config data:', config);
            if (versionInput) {
                versionInput.value = config?.version || SdkConfig.MIN_ANDROID_VERSION;
            }
            if (iOSVersionInput) {
                iOSVersionInput.value = config?.iosVersion || SdkConfig.MIN_IOS_VERSION;
            }
            if (enableCheckBox) {
                enableCheckBox.checked = config?.enable ?? true;
            }
            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    // 验证版本
                    if (!this.validateVersion(versionInput, iOSVersionInput)) {
                        return;
                    }
                    
                    Editor.Message.request(
                        packageJSON.name, 
                        'sdk-config-save', 
                        new SdkConfig(versionInput.value, iOSVersionInput.value, enableCheckBox.checked)
                    );
                });
            }
        });
    },
    beforeClose() {
        // 关闭前
    },
    close() {
        // 关闭后
    },
});