import packageJSON from '../../package.json';

const PROFILE_KEY = 'athana-sdk-config';

/**
 * 版本号验证结果
 */
export interface VersionValidationResult {
    valid: boolean;
    message?: string;
}

/**
 * Athana SDK 总配置
 */
export class SdkConfig {
    /**
     * Android SDK最低版本
     */
    public static readonly MIN_ANDROID_VERSION = '1.5.1';
    /**
     * iOS SDK最低版本
     */
    public static readonly MIN_IOS_VERSION = '1.1.0';
    
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

    constructor(version: string = '1.5.1', iosVersion: string = '1.1.0', enable: boolean = true) {
        this.version = version;
        this.iosVersion = iosVersion;
        this.enable = enable;
    }

    /**
     * 验证Android SDK版本
     */
    public static validateAndroidVersion(version: string): VersionValidationResult {
        if (!version || version.trim() === '') {
            return { valid: false, message: 'Android SDK版本号不能为空' };
        }
        
        if (!this.compareVersions(version, this.MIN_ANDROID_VERSION)) {
            return { 
                valid: false, 
                message: `Android SDK版本不能低于 ${this.MIN_ANDROID_VERSION}` 
            };
        }
        
        return { valid: true };
    }

    /**
     * 验证iOS SDK版本
     */
    public static validateIosVersion(version: string): VersionValidationResult {
        if (!version || version.trim() === '') {
            return { valid: false, message: 'iOS SDK版本号不能为空' };
        }
        
        if (!this.compareVersions(version, this.MIN_IOS_VERSION)) {
            return { 
                valid: false, 
                message: `iOS SDK版本不能低于 ${this.MIN_IOS_VERSION}` 
            };
        }
        
        return { valid: true };
    }

    /**
     * 验证所有版本
     */
    public validate(): VersionValidationResult {
        const androidResult = SdkConfig.validateAndroidVersion(this.version);
        if (!androidResult.valid) {
            return androidResult;
        }
        
        const iosResult = SdkConfig.validateIosVersion(this.iosVersion);
        if (!iosResult.valid) {
            return iosResult;
        }
        
        return { valid: true };
    }

    public save() {
        console.log('save config!');
        Editor.Profile.setProject(packageJSON.name, PROFILE_KEY, this);
    }

    public static read(): Promise<SdkConfig> {
        return Editor.Profile.getProject(packageJSON.name, PROFILE_KEY);
    }

    /**
     * 比较两个版本号
     * @param v1 版本号1
     * @param v2 版本号2
     * @returns 如果v1 >= v2返回true，否则返回false
     */
    private static compareVersions(v1: string, v2: string): boolean {
        const normalizeVersion = (version: string): string => {
            return version.split('-')[0].trim();
        };
        
        const normalV1 = normalizeVersion(v1);
        const normalV2 = normalizeVersion(v2);
        
        const parts1 = normalV1.split('.').map(Number);
        const parts2 = normalV2.split('.').map(Number);
        
        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const num1 = parts1[i] || 0;
            const num2 = parts2[i] || 0;
            
            if (num1 > num2) return true;
            if (num1 < num2) return false;
        }
        
        return true;
    }
}