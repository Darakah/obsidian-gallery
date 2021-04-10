import type { DataAdapter, Vault, MetadataCache } from 'obsidian';
import { TFolder, TFile } from 'obsidian';
import type GalleryPlugin from './main';

export interface GallerySettings {
    imgDataFolder: string,
    galleryLoadPath: string,
    imgPrefix: number,
    width: number,
    fillFree: boolean,
}

export interface ImageResources {
    [key: string]: string;
}

export interface ImageDimensions {
    width: number,
    height: number;
}

export interface GalleryBlockArgs {
    type: string,
    path: string,
    name: string,
    imgWidth: number,
    divWidth: number,
    divAlign: string,
    reverseOrder: string,
    customList: string;
}

export const SETTINGS: GallerySettings = {
    imgDataFolder: null,
    galleryLoadPath: "/",
    imgPrefix: 0,
    width: 400,
    fillFree: true
};

export const EXTRACT_COLORS_OPTIONS = {
    pixels: 20000,
    distance: 0.2,
    saturationImportance: 0.2,
    splitPower: 10,
    colorValidator: (red, green, blue, alpha = 255) => alpha > 250
};

export const EXTENSIONS = ['png', 'jpg', 'jpeg'];

export const OB_GALLERY = "ob-gallery";

export const OB_GALLERY_INFO = "ob-gallery-info";

export const galleryIcon = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="images" class="svg-inline--fa fa-images fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M480 416v16c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V176c0-26.51 21.49-48 48-48h16v208c0 44.112 35.888 80 80 80h336zm96-80V80c0-26.51-21.49-48-48-48H144c-26.51 0-48 21.49-48 48v256c0 26.51 21.49 48 48 48h384c26.51 0 48-21.49 48-48zM256 128c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-96 144l55.515-55.515c4.686-4.686 12.284-4.686 16.971 0L272 256l135.515-135.515c4.686-4.686 12.284-4.686 16.971 0L512 208v112H160v-48z"></path></svg>`;

export const gallerySearchIcon = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" class="svg-inline--fa fa-search fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>`;

export const GALLERY_DISPLAY_USAGE = `
e.g. Input:

\`\`\`type=active-thumb
path=Weekly
name=.*Calen
imgWidth=400
divWidth=70
divAlign=left
reverseOrder=false
customList=5 10 2 4
\`\`\`

----

- **Argument Info:**<br>
- **type:** specify display type. Possible values \`grid\`, \`active-thumb\`<br>
- **path:** vault path to display images from. Regex expression<br>
- **imgWidth**: image width in pixels<br>
- **divWidth**: div container in %<br>
- **divAlign**: div alignment. Possible values \`left\`, \`right\`<br>
- **reverseOrder**: reverse the display order of images. Possible values \`true\`, \`false\`<br>
- **customList**: specify image indexes to display in the passed order<br>

----

Please Check Release Notes for plugin changes:<br>
https://github.com/Darakah/obsidian-gallery#release-notes
`;

export const GALLERY_INFO_USAGE = `
e.g. Input:

\`\`\`
Resources/Images/Image_example_1.png
\`\`\`

----

- Block takes a single argument which is the \`PATH\` of the image.
- Path is the relative path of the file withing the obsidian vault.
- Make sure the image exists!!
- It is case sensitive!

----

Please Check Release Notes for plugin changes:<br>
https://github.com/Darakah/obsidian-gallery#release-notes
`;


/**
 * Return initial img info file content
 * @param imgPath - Relative vault path of related image
 */
const initializeInfo = (imgPath: string): string => {
    return `<span class='gallery-span-info'> [[${imgPath}]] </span>\n
%% Place Tags Here %%
\`\`\`gallery-info
${imgPath}
\`\`\`
`;
};

/**
 * Return Image Info File, if not present create it
 * @param imgPath - Obsidian Vault Image relative path
 * @param vault - Vault handler
 * @param metadata - Vaulat metadata handler
 * @param plugin - Gallery plugin handler
 */

export const getImgInfo = async (imgPath: string, vault: Vault, metadata: MetadataCache, plugin: GalleryPlugin): Promise<TFile> => {

    let infoFile = null;
    let infoFolder = vault.getAbstractFileByPath(plugin.settings.imgDataFolder);
    if (infoFolder instanceof TFolder) {
        infoFolder.children?.forEach(info => {
            if (info instanceof TFile) {
                metadata.getFileCache(info)?.links?.forEach(link => {
                    if (link.link === imgPath) {
                        infoFile = info;
                    }
                });
            }
        });

        if (!infoFile) {
            // Info File does not exist, Create it
            plugin.settings.imgPrefix++;
            await plugin.saveSettings();
            let fileName = `${plugin.settings.imgDataFolder}/Img_${plugin.settings.imgPrefix}.md`;
            await vault.adapter.write(fileName, initializeInfo(imgPath));
            infoFile = (vault.getAbstractFileByPath(fileName) as TFile);
        }
        return infoFile;
    }

    // Specified Resources folder does not exist
    return null;
};

/**
 * Return images in the specified directory
 * @param path - path to project e.g. 'Test Project/First Sub Project'
 * @param name - image name to filter by
 * @param vaultFiles - list of all TFiles of Obsidian vault
 * @param handler - Obsidian vault handler
 */

export const getImageResources = (path: string, name: string, vaultFiles: TFile[], handler: DataAdapter): ImageResources => {
    let imgList: ImageResources = {};

    let reg;
    try {
        reg = new RegExp(`^${path}.*${name}.*$`);
        if (path === '/') {
            reg = new RegExp(`^.*${name}.*$`);
        }
    } catch (error) {
        console.log('Gallery Search - BAD REGEX! regex set to `.*` as default!!');
        reg = ".*";
    }

    for (let file of vaultFiles) {
        if (EXTENSIONS.contains(file.extension.toLowerCase()) && file.path.match(reg)) {
            imgList[handler.getResourcePath(file.path)] = file.path;
        }
    }
    return imgList;
};