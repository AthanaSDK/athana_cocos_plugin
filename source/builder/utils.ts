import * as fs from 'fs';

const TAG = "[athana-builder-utils]";

export function deleteDestContentInSrcFile(srcPath: string, destPath: string) {
    let userGradle = fs.readFileSync(srcPath, { encoding: 'binary' });
    let template = fs.readFileSync(destPath, { encoding: 'binary' });

    const pos = userGradle.indexOf(template);
    if (pos >= 0) {
        userGradle = userGradle.replace(template, "");
        fs.writeFileSync(srcPath, userGradle);
    }
}

export function appendDestContentToSrcFileIfNo(srcPath: string, destPath: string) {
    let userGradle = fs.readFileSync(srcPath, { encoding: 'binary' });
    let template = fs.readFileSync(destPath, { encoding: 'binary' });

    const pos = userGradle.indexOf(template);
    if (pos < 0) {
        fs.writeFileSync(srcPath, userGradle + template);
    }
}
