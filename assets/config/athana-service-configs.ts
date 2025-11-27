import { SignInType } from "../account/account-models";
import { AdType } from "../ad/ad-models";

export class AccountServiceConfig {
    public readonly googleWebClientId: string;
    public readonly enabledSignInTypes: Array<SignInType> | null = null;

    constructor(googleWebClientId: string, enabledSignInTypes: Array<SignInType> = null) {
        this.googleWebClientId = googleWebClientId;
        this.enabledSignInTypes = enabledSignInTypes;
    }
}


export class AdServiceConfigs {
    public readonly max: MaxAdServiceConfig | null = null;

    constructor(max: MaxAdServiceConfig) {
        this.max = max;
    }
}


export class MaxAdServiceConfig {
    public readonly sdkKey: string;
    public readonly privacyPolicyUrl?: string | null = null;
    public readonly termsOfServiceUrl?: string | null = null;
    public readonly preloadAds?: Map<AdType, string> | null = null;
    public readonly debug: boolean = false;
    public readonly preload: boolean = true;

    constructor(sdkKey: string, privacyPolicyUrl?: string, termsOfServiceUrl?: string, preloadAds?: Map<AdType, string>, debug?: boolean, preload?: boolean) {
        this.sdkKey = sdkKey;
        this.privacyPolicyUrl = privacyPolicyUrl;
        this.termsOfServiceUrl = termsOfServiceUrl;
        this.preloadAds = preloadAds;
        this.debug = debug ?? false;
        this.preload = preload ?? true;
    }
}

export class ConversionServiceConfigs {
    public readonly appsflyer: AppsFlyerServiceConfig;

    constructor(appsflyer: AppsFlyerServiceConfig) {
        this.appsflyer = appsflyer;
    }
}


export class AppsFlyerServiceConfig {
    public readonly sdkKey: string;
    public readonly manualStart: boolean = false;

    constructor(sdkKey: string, manualStart?: boolean) {
        this.sdkKey = sdkKey;
        this.manualStart = manualStart ?? false;
    }
}
