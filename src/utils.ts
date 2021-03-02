import type { TFile } from 'obsidian';

/**
 * Return images in the specified directory
 * @param projectPath - path to project e.g. 'Test Project/First Sub Project'
 * @param vaultFiles - list of all TFiles of Obsidian vault
 */

export const getImgs = (projectPath: string, vaultFiles: TFile[]): string[] => {
    let imgList = [];
    let reg = new RegExp(`^${projectPath}\/.*\.[(png)(jpg)(jpeg)]$`)

    if (projectPath === '/') {
        reg = new RegExp(`^.*\.[(png)(jpg)(jpeg)]$`)
    }
    for (let file in vaultFiles) {
        if (vaultFiles[file].path.match(reg)) {
            imgList.push(vaultFiles[file]);
        }
    }
    return imgList;
}