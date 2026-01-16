import packageJSON from '../../package.json';

const PROFILE_KEY = 'athana-sdk-config';

/**
 * Athana SDK 总配置
 */
export class SdkConfig {
    /**
     * 构建任务集成的Android SDK版本
     */
    public version: string;
    /**
     * 构建任务集成的iOS SDK版本
     */
    public iosVersion: string;
    /**
     * 是否启用自动构建配置插件，对整个工程生效
     */
    public enable: boolean;

    constructor(version: string = '1.3.4', iosVersion: string = '1.0.0', enable: boolean = true) {
        this.version = version;
        this.iosVersion = iosVersion;
        this.enable = enable;
    }

    public save() {
        console.log('save config!');
        Editor.Profile.setProject(packageJSON.name, PROFILE_KEY, this);
    }

    public static read(): Promise<SdkConfig> {
        return Editor.Profile.getProject(packageJSON.name, PROFILE_KEY);
    }
}