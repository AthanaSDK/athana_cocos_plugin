export class EnvConstants {

    static readonly NativePath = `${Editor.Project.path}/native/engine/android`;

    static readonly AppBuildGradle = `${EnvConstants.NativePath}/app/build.gradle`;

    static readonly AthanaTemplatePath = `${__dirname}/../../template/android`;

    static readonly AthanaTemplateGradlePath = `${EnvConstants.AthanaTemplatePath}/build.gradle`;

    static readonly AthanaLibName = "libAthana";

    static readonly AthanaLibSrcPath = `${EnvConstants.AthanaTemplatePath}/${EnvConstants.AthanaLibName}`;

    static readonly AthanaLibDestPath = `/proj/${EnvConstants.AthanaLibName}`;

    static readonly AthanaOptionsGradleName = "athana_options.gradle";

    static readonly AthanaOptionsGradleSrcPath = `${EnvConstants.AthanaTemplatePath}/${EnvConstants.AthanaOptionsGradleName}`;

    static readonly AthanaOptionsGradleDestPath = `${EnvConstants.NativePath}/app/${EnvConstants.AthanaOptionsGradleName}`;

    static readonly SettingGradle = "settings.gradle";
    
    static readonly AthanaTemplateSettingGradle = `${EnvConstants.AthanaTemplatePath}/${EnvConstants.SettingGradle}`;
}