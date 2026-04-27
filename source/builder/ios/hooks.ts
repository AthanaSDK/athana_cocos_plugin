import { IBuildResult } from "../../../@types";
import packageJSON from '../../../package.json';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as plist from 'plist';
import { $ } from 'zx';
import { exec } from 'child_process';
import { ITaskOptions } from "../hooks";
import { SdkBuildTaskConfig } from "../../data/sdk-build-task-config";
import { SdkConfig } from "../../data/sdk-config";
import { DepsManagers } from "./deps-manager-type";

export class HooksHandlerIOS {

    static readonly TemplatePath = `${__dirname}/../../../template/ios`;
    static readonly NativePath = `${Editor.Project.path}/native/engine/ios`

    private copyLib(dest: string, projectConfig: SdkConfig, taskConfig: SdkBuildTaskConfig) {
        console.log(packageJSON.name + ' copyLib start');

        if (projectConfig.enable) {
            // 拷贝代码
            fse.copySync(
                `${HooksHandlerIOS.TemplatePath}/libAthana`,
                `${HooksHandlerIOS.NativePath}/libAthana`,
                { recursive: true, overwrite: true }
            );
        } else {
            // 删除代码
            fse.removeSync(`${HooksHandlerIOS.NativePath}/libAthana`);
        }

        console.log(packageJSON.name + ' copyLib end');
    }

    private updateProperties(
        taskName: string, 
        dest: string, 
        projectConfig: SdkConfig, 
        taskConfig: SdkBuildTaskConfig,
        executableName?: string
    ) {
        console.log(packageJSON.name + ' updateProperty start');
        console.log(packageJSON.name + ' taskName: ' + taskName);
        console.log(packageJSON.name + ' executableName: ' + executableName);

        if (!projectConfig.enable) {
            console.log(packageJSON.name + ' plugin is disable');
            return;
        }

        let sdkVersion = projectConfig.iosVersion;

        let deps: string[] = [
            `  pod 'AthanaSDK', '${sdkVersion}'`
        ];

        var configs = new Map<string, any>();

        var facebookAppId = taskConfig.triSdk?.facebookAppId ?? '';
        var facebookClientToken = taskConfig.triSdk?.facebookClientToken ?? '';

        var includeFacebook = false;
        var includeFirebase = false;
        var includeGoogle = false;

        var firebaseConfigPath = taskConfig.triSdk?.firebaseConfigPath;
        var googleServicesPlist = null;
        if (firebaseConfigPath != null && firebaseConfigPath.length > 0 && fse.existsSync(firebaseConfigPath)) {
            console.log(packageJSON.name + ' read firebaseConfig in: ' + firebaseConfigPath);
            const content = fs.readFileSync(firebaseConfigPath, 'utf-8');
            console.log(packageJSON.name + ' firebaseConfig content:', content);
            googleServicesPlist = plist.parse(content);
        }

        if (taskConfig.account != null && taskConfig.account?.service == true) {
            if (taskConfig.account?.athana == true) {
                // Google \ Facebook
                includeGoogle = true;
                includeFacebook = true;

                deps.push(`  pod 'AthanaAdapterApple', '${sdkVersion}'`);
            }
        }

        if (taskConfig.ad != null && taskConfig.ad?.service == true) {
            if (taskConfig.ad?.max == true) {
                deps.push(`  pod 'AthanaAdapterAppLovin', '${sdkVersion}'`);
            }
        }

        if (taskConfig.conversion != null && taskConfig.conversion?.service == true) {
            if (taskConfig.conversion?.appsflyer == true) {
                deps.push(`  pod 'AthanaAdapterAppsFlyer', '${sdkVersion}'`);
            }
            if (taskConfig.conversion?.firebase == true) {
                includeFirebase = true;
            }
            if (taskConfig.conversion?.meta == true) {
                includeFacebook = true;
            }
        }

        if (taskConfig.push != null && taskConfig.push?.service == true) {
            if (taskConfig.push?.firebase == true) {
                includeFirebase = true
            }
        }

        if (includeFacebook) {
            deps.push(`  pod 'AthanaAdapterMeta', '${sdkVersion}'`);
        }
        if (includeFirebase) {
            deps.push(`  pod 'AthanaAdapterFirebase', '${sdkVersion}'`);
        }
        if (includeGoogle) {
            deps.push(`  pod 'AthanaAdapterGoogle', '${sdkVersion}'`);
        }
        if (taskConfig.gaming != null && taskConfig.gaming?.service == true) {
            if (taskConfig.gaming?.gameCenter == true) {
                deps.push(`  pod 'AthanaAdapterGameCenter', '${sdkVersion}'`);
            }
        }
        const athanaOptionsPath = `${dest}/proj/athana_options.rb`;

        var depsContent = "def athana_pods";
        for (const dep of deps) {
            depsContent += `\n${dep}`;
        };
        depsContent += "\nend";

        if (!fse.existsSync(athanaOptionsPath)) {
            fse.createFileSync(athanaOptionsPath);
        }
        fs.writeFileSync(athanaOptionsPath, depsContent, 'utf-8');

        let exeName = executableName ?? (taskName + '-mobile');
        console.log(packageJSON.name + ' exeName: ' + exeName);

        if (includeFacebook || includeGoogle) {
            configs.set('CFBundleURLTypes', new Array<Object>());
        }

        if (includeFacebook) {
            var array = configs.get('CFBundleURLTypes') as Array<Object>;
            var shceme = new Map<string, string[]>([
                ["CFBundleURLSchemes", [`fb${facebookAppId}`]]
            ]);
            array.push(Object.fromEntries(shceme));

            configs.set('FacebookAdvertiserIDCollectionEnabled', true);
            configs.set('FacebookAppID', facebookAppId);
            configs.set('FacebookClientToken', facebookClientToken);
            configs.set('FacebookDisplayName', exeName);
            configs.set('LSApplicationQueriesSchemes', ['fbapi', 'fb-messenger-share-api']);
        }
        if (includeFirebase) {

        }
        if (includeGoogle) {
            var array = configs.get('CFBundleURLTypes') as Array<Object>;
            var shceme = new Map<string, string[]>([
                ["CFBundleURLSchemes", [googleServicesPlist?.REVERSED_CLIENT_ID ?? '']]
            ]);
            array.push(Object.fromEntries(shceme));

            configs.set('GIDClientID', googleServicesPlist?.CLIENT_ID ?? '');
            configs.set('GIDServerClientID', taskConfig.triSdk?.googleWebClient ?? '');
        }

        var configObj = Object.fromEntries(configs);
        console.log(packageJSON.name + ' configs:', configObj);

        const infoPlistPath = `${dest}/proj/CMakeFiles/${exeName}.dir/Info.plist`;
        var infoPlist = null;
        if (fse.existsSync(infoPlistPath)) {
            console.log(packageJSON.name + ' read infoPlistPath in: ' + infoPlistPath);
            const content = fs.readFileSync(infoPlistPath, 'utf-8');
            console.log(packageJSON.name + ' infoPlistPath content:', content);
            infoPlist = plist.parse(content);
            console.log(packageJSON.name + ' infoPlistPath: ', infoPlist);
        }

        var mergedPlist = null;
        if (infoPlist != null) {
            mergedPlist = Object.assign(infoPlist, configObj);
            console.log(packageJSON.name + ' mergedPlist: ', mergedPlist);
        }

        if (mergedPlist != null) {
            const infoPlistXML = plist.build(mergedPlist);
            console.log(packageJSON.name + ' infoPlist: ', infoPlistXML);
            fs.writeFileSync(infoPlistPath, infoPlistXML, 'utf8');
        }

        console.log(packageJSON.name + ' updateProperty end');
    }

    private async initDeps(
        taskName: string, 
        dest: string, 
        projectConfig: SdkConfig, 
        taskConfig: SdkBuildTaskConfig,
        executableName?: string
    ) {
        // 判断当前配置的依赖管理方案
        console.log(packageJSON.name + ` deps manager: ${taskConfig.depsManager}`);
        let projPath = `${dest}/proj`;
        if (taskConfig.depsManager === DepsManagers.COCOA_PODS) {
            // CocoaPods
            console.log(packageJSON.name + ' Start CocoaPods');

            let podfilePath = `${projPath}/Podfile`;

            // 识别是否存在 Podfile 文件
            if (fse.existsSync(podfilePath)) {
                // 存在则不变动
                console.log(packageJSON.name + ' Found Podfile');
                return
            }

            console.log(packageJSON.name + ' pod init');
            const initResult = await $`(cd ${projPath} && pod init)`;

            if (!fse.existsSync(podfilePath)) {
                // 存在则不变动
                console.log(packageJSON.name + ' Not found Podfile!');
                return
            }

            // 依赖规则写入到 AthanaOptions.rb

            // 引入 athana_options
            // sed -i '' -E "s/^# (platform :ios, ')[0-9.]+'/\113.0'/" Podfile
            console.log(packageJSON.name + ' modify platform version');
            const pattern1 = "s/^# (platform :ios, ')(.*)/\\113.0'/";
            await $`sed -i '' -E ${pattern1} ${podfilePath}`;

            // sed -i '' "/platform :ios, '13.0'/a\\"$'\n'"require_relative 'athana_options'" Podfile
            console.log(packageJSON.name + ' insert athana_options');
            const lineToAppend = "require_relative 'athana_options'";
            const sed2 = `/platform :ios, '13.0'/a\\${'\n'}${lineToAppend}`;
            // 使用数组形式，zx 会自动处理引号和转义
            await $`sed -i '' ${sed2} ${podfilePath}`;

            let exeName = executableName ?? (taskName + '-mobile');
            
            // 插入依赖项: athana_pods
            // sed -i '' "/# Pods for athana-demo/a\\"$'\n'"  athana_pods" Podfile
            console.log(packageJSON.name + ' insert athana_pods to: ' + exeName);
            const insertion = "  athana_pods";
            const sed3 = `/# Pods for ${exeName}/a\\${'\n'}${insertion}`;
            await $`sed -i '' ${sed3} ${podfilePath}`;

            console.log(packageJSON.name + ' pod install');
            const installResult = await $`(export LANG=en_US.UTF-8 && cd ${projPath} && pod repo update && pod install)`;

        } else if (taskConfig.depsManager === DepsManagers.SWIFT_PM) {
            // SwiftPM
            console.log(packageJSON.name, 'Start SwiftPM');
            const workspaceDir = `${projPath}/${taskName}.xcworkspace`;
            try {
                // 创建或更新 workspace
                if (!fse.existsSync(workspaceDir)) {
                    // 创建 workspace
                    fse.ensureDirSync(workspaceDir);

                    const wsData = `<?xml version="1.0" encoding="UTF-8"?>\n<Workspace version="1.0">\n  <FileRef location="group:${taskName}.xcodeproj"></FileRef>\n</Workspace>`;
                    fs.writeFileSync(`${workspaceDir}/contents.xcworkspacedata`, wsData, 'utf8');
                    console.log(packageJSON.name + ' created workspace and content.xcmeta');
                }
            } catch (e) {
                console.log(packageJSON.name + ' create workspace error', e);
            }
        } else {
            // 无
            console.log(packageJSON.name, 'Not match deps manager');

        }
    }

    async onBuild(options: ITaskOptions, buildResult: IBuildResult) {
        // 读取项目配置
        const projectConfig = await SdkConfig.read();
        console.log(packageJSON.name + ' [onBuild] projectConfig -> ' + projectConfig);

        // 读取任务配置
        const taskConfig = options.packages[packageJSON.name] as SdkBuildTaskConfig;
        console.log(packageJSON.name + ' [onBuild] taskConfig -> ' + taskConfig);

        // 构建输出目录
        const dest = buildResult.dest;
        console.log(packageJSON.name + ' [onBuild] dest -> ' + dest);

        const taskName = options.packages?.ios?.taskName ?? options.name;
        var executableName = options.packages?.ios?.executableName;
        if (executableName.length == 0) {
            executableName = null;
        }

        // 拷贝库文件
        this.copyLib(dest, projectConfig, taskConfig);
        // 更新配置文件
        this.updateProperties(taskName, dest, projectConfig, taskConfig, executableName);
        // 更新依赖
        await this.initDeps(taskName, dest, projectConfig, taskConfig, executableName)
    }
}

export const hooksHandlerIOS = {
    ios: new HooksHandlerIOS(),
}