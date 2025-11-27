import { IBuildResult } from "../../../@types";
import packageJSON from '../../../package.json';
import * as fse from 'fs-extra';
import { ITaskOptions } from "../hooks";
import { SdkBuildTaskConfig } from "../../data/sdk-build-task-config";
import { SdkConfig } from "../../data/sdk-config";
import { EnvConstants } from "../env-constants";
import { appendDestContentToSrcFileIfNo, deleteDestContentInSrcFile } from "../utils";


export class HooksHandlerAndroid {

    private copyLib(dest: string, projectConfig: SdkConfig, taskConfig: SdkBuildTaskConfig) {
        // 拷贝 template/android/libAthana 到构建输出目录 $dest/proj/libAthana
        const extLibPath = EnvConstants.AthanaLibSrcPath;
        const destLibPath = `${dest}${EnvConstants.AthanaLibDestPath}`;
        fse.copySync(extLibPath, destLibPath, { recursive: true, overwrite: true });

        // 拷贝 athana_options.gradle
        const gradleExtLibPath = EnvConstants.AthanaOptionsGradleSrcPath;
        const gradleDestLibPath = EnvConstants.AthanaOptionsGradleDestPath;
        fse.copySync(gradleExtLibPath, gradleDestLibPath, { recursive: true, overwrite: true });
    }

    private updateGradle(dest: string, projectConfig: SdkConfig, taskConfig: SdkBuildTaskConfig) {
        EnvConstants.AppBuildGradle
        const srcGradle = EnvConstants.AppBuildGradle;
        const destGradle = EnvConstants.AthanaTemplateGradlePath;

        const srcSetting = `${dest}/proj/${EnvConstants.SettingGradle}`;
        const destSetting = EnvConstants.AthanaTemplateSettingGradle;

        // 修改 app/build.gradle
        // 修改 proj/settings.gradle
        if (projectConfig.enable) {
            appendDestContentToSrcFileIfNo(srcGradle, destGradle);
            appendDestContentToSrcFileIfNo(srcSetting, destSetting);
        } else {
            deleteDestContentInSrcFile(srcGradle, destGradle);
            deleteDestContentInSrcFile(srcSetting, destSetting);
        }
    }

    private updateProperty(dest: string, projectConfig: SdkConfig, taskConfig: SdkBuildTaskConfig) {
        // 修改 athana.properties
        const propertiesPath = `${dest}/proj/athana.properties`;
        if (!fse.existsSync(propertiesPath)) {
            fse.createFileSync(propertiesPath);
        }
        fse.writeFileSync(
            propertiesPath,
            `SDK_VERSION=${projectConfig.version || "1.3.2"}\n` +
            `SRV_ACC_ENABLE=${projectConfig.enable && taskConfig.account?.service == true ? "true" : "false"}\n` +
            `IMPORT_ACC_HC=${taskConfig.account?.athana == true ? "true" : "false"}\n` +
            `SRV_AD_ENABLE=${projectConfig.enable && taskConfig.ad?.service == true ? "true" : "false"}\n` +
            `IMPORT_AD_MAX=${taskConfig.ad?.max == true ? "true" : "false"}\n` +
            `SRV_CVR_ENABLE=${projectConfig.enable && taskConfig.conversion?.service == true ? "true" : "false"}\n` +
            `IMPORT_CVR_APPSFLYRE=${taskConfig.conversion?.appsflyer == true ? "true" : "false"}\n` +
            `IMPORT_CVR_FIREBASE=${taskConfig.conversion?.firebase == true ? "true" : "false"}\n` +
            `IMPORT_CVR_META=${taskConfig.conversion?.meta == true ? "true" : "false"}\n` +
            `SRV_PUSH_ENABLE=${projectConfig.enable && taskConfig.push?.service == true ? "true" : "false"}\n` +
            `IMPORT_PUSH_FIREBASE=${taskConfig.push?.firebase == true ? "true" : "false"}\n` +
            `GPG_ID=${taskConfig.account?.gpgId || ""}\n` +
            `FB_APP_ID=${taskConfig.triSdk?.facebookAppId || ""}\n` +
            `FB_CLIENT_TOKEN=${taskConfig.triSdk?.facebookClientToken || ""}\n`
        );
    }

    async onBuild(options: ITaskOptions, buildResult: IBuildResult) {
        // 读取项目配置
        const projectConfig = await SdkConfig.read();
        console.log(packageJSON.name, '[onBuild] projectConfig -> ', projectConfig);

        // 读取任务配置
        const taskConfig = options.packages[packageJSON.name] as SdkBuildTaskConfig;
        console.log(packageJSON.name, '[onBuild] taskConfig -> ', taskConfig);

        // 构建输出目录
        const dest = buildResult.dest;
        console.log(packageJSON.name, '[onBuild] dest -> ', dest);

        this.copyLib(dest, projectConfig, taskConfig);
        this.updateGradle(dest, projectConfig, taskConfig);
        this.updateProperty(dest, projectConfig, taskConfig);
    }

}

export const hooksHandlerAndroid = {
    android: new HooksHandlerAndroid(),
}