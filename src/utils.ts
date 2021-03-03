import type { TFile, DataAdapter } from 'obsidian';

/**
 * Return images in the specified directory
 * @param projectPath - path to project e.g. 'Test Project/First Sub Project'
 * @param vaultFiles - list of all TFiles of Obsidian vault
 */

export const getImgs = (args: string[], vaultFiles: TFile[], handler: DataAdapter): string[] => {
    let imgList = [];

    let reg = new RegExp(`^${args[0]}\/.*${args[1]}.*\.[(png)(jpg)(jpeg)]$`)
    if (args[0] === '/') {
        reg = new RegExp(`^.*${args[1]}.*\.[(png)(jpg)(jpeg)]$`)
    }

    for (let file in vaultFiles) {
        if (vaultFiles[file].path.match(reg)) {
            imgList.push(handler.getResourcePath(vaultFiles[file].path));
        }
    }

    if (args[2] && args[2] === "+") {
        imgList = imgList.reverse()
    }

    if (args[3] && args[3] != "") {
        imgList = args[3].split(" ").map(i => parseInt(i)).filter(value => !Number.isNaN(value)).map(i => imgList[i])
    }

    return imgList;
}