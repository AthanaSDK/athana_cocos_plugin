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
        enableCheckBox: '#enableCheckBox',
        saveBtn: '#saveBtn'
    },
    methods: {
        save(config?: SdkConfig) {
            if (config != null) {
                const newConfig = new SdkConfig(config.version, config.enable);
                console.debug('to save:', newConfig);
                newConfig.save();
            }
        },
    },
    ready() {
        // 加载完成
        const versionInput = this.$.versionInput;
        const enableCheckBox = this.$.enableCheckBox;
        const saveBtn = this.$.saveBtn;

        // 读取数据，初始化控件
        SdkConfig.read().then((config?: SdkConfig) => {
            console.debug('load config data:', config);
            if (versionInput) {
                versionInput.value = config.version;
            }
            if (enableCheckBox) {
                enableCheckBox.checked = config.enable;
            }
            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    Editor.Message.request(
                        packageJSON.name, 
                        'sdk-config-save', 
                        new SdkConfig(versionInput.value, enableCheckBox.checked)
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
