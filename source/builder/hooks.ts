import { BuildHook, IBuildResult, IBuildTaskOption } from '../../@types';
import packageJSON from '../../package.json';
import { SdkBuildTaskConfig } from '../data/sdk-build-task-config';
import { hooksHandlerAndroid } from './android/hooks';

export const throwError: BuildHook.throwError = true;

export interface ITaskOptions extends IBuildTaskOption {
    packages: {
        packageJSON: SdkBuildTaskConfig;
    };
}

export const load: BuildHook.load = async function() {
    console.log(packageJSON.name, 'load');
};

export const onBeforeBuild: BuildHook.onBeforeBuild = async function(options: ITaskOptions) {
    // 构建开始之前调用
    console.log(packageJSON.name,'onBeforeBuild');
};

export const onBeforeCompressSettings: BuildHook.onBeforeCompressSettings = async function(options: ITaskOptions, result: IBuildResult) {
    // 开始压缩相关的 JSON 文件前调用
    console.log(packageJSON.name,'onBeforeCompressSettings');
};

export const onAfterCompressSettings: BuildHook.onAfterCompressSettings = async function(options: ITaskOptions, result: IBuildResult) {
    // 压缩完设置文件后调用
    console.log(packageJSON.name, 'onAfterCompressSettings');
    if(options.platform === "ios") {
        // 处理参数
    }
};

export const onAfterBuild: BuildHook.onAfterBuild = async function(options: ITaskOptions, result: IBuildResult) {
    // 构建完成之后调用
    console.log(packageJSON.name, 'onAfterBuild');
    if(options.platform === "android") {
        // 处理参数
        await hooksHandlerAndroid.android.onBuild(options, result);
    }
};

export const unload: BuildHook.unload = async function() {
    console.log(packageJSON.name, 'unload');
};