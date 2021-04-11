import { ItemView, WorkspaceLeaf, setIcon, MarkdownRenderer, TFile, debounce } from 'obsidian';
import type { ImageResources } from './utils';
import { OB_GALLERY, OB_GALLERY_INFO, GALLERY_RESOURCES_MISSING, gallerySearchIcon, getImageResources, getImgInfo } from './utils';
import * as CodeMirror from 'codemirror';
import ImageGrid from './svelte/ImageGrid.svelte';
import type GalleryPlugin from './main';

export class GalleryView extends ItemView {
    plugin: GalleryPlugin;
    headerEl: HTMLElement;
    viewEl: HTMLElement;
    controlEl: HTMLElement;
    displayEl: HTMLElement;
    filterEl: HTMLElement;
    imageFocusEl: HTMLElement;
    focusImage: HTMLImageElement;
    imagesContainer: HTMLUListElement;
    imgList: string[];
    imgResources: ImageResources;
    imgFocusIndex: number;

    constructor(leaf: WorkspaceLeaf, plugin: GalleryPlugin) {
        super(leaf);
        this.plugin = plugin;

        this.updateDisplay = this.updateDisplay.bind(this);
        // Get View Container Element
        this.headerEl = this.containerEl.querySelector('.view-header');
        // Get View Container Element
        this.viewEl = this.containerEl.querySelector('.view-content');
        this.viewEl.style.setProperty('padding', '0px');
        this.viewEl.style.setProperty('overflow', 'hidden');
        // Add action button to hide / show filter panel
        let searchPanel = this.containerEl.querySelector('.view-actions').createEl('a', { cls: 'view-action', attr: { 'aria-label': 'Search' } });
        setIcon(searchPanel, 'fa-search', 17);
        // Create Search Control Element
        this.filterEl = this.viewEl.createDiv({ cls: 'ob-gallery-filter', attr: { 'style': 'display: none;' } });
        searchPanel.onClickEvent(() => {
            let currentMode = this.filterEl.style.getPropertyValue('display');
            if (currentMode == "block") {
                this.filterEl.style.setProperty('display', 'none');
                return;
            }
            this.filterEl.style.setProperty('display', 'block');
        });

        // Create gallery display Element
        this.displayEl = this.viewEl.createDiv({ cls: 'ob-gallery-display' });
        this.imagesContainer = this.displayEl.createEl('ul');
        this.updateDisplay(this.plugin.settings.galleryLoadPath, '');
        this.imageFocusEl = this.displayEl.createDiv({ cls: 'ob-gallery-image-focus', attr: { 'style': 'display: none;' } });
        this.focusImage = this.imageFocusEl.createEl('img');

        // Filter by path
        let pathFilterEl = this.filterEl.createEl('input', {
            cls: 'ob-gallery-filter-input',
            type: 'text',
            attr: { spellcheck: false, placeholder: 'Path' }
        });

        pathFilterEl.addEventListener('input', () => {
            this.updateDisplay(pathFilterEl.value.trim(), nameFilterEl.value.trim());
        });

        // Filter by Name
        let nameFilterEl = this.filterEl.createEl('input', {
            cls: 'ob-gallery-filter-input',
            type: 'text',
            attr: { spellcheck: false, placeholder: 'Name' }
        });

        nameFilterEl.addEventListener('input', () => {
            this.updateDisplay(pathFilterEl.value.trim(), nameFilterEl.value.trim());
        });
    }

    updateDisplay(path: string, name: string) {
        this.imagesContainer.empty();
        this.imgResources = getImageResources(path,
            name,
            this.app.vault.getFiles(),
            this.app.vault.adapter);

        this.imgList = Object.keys(this.imgResources);

        if(this.plugin.settings.reverseDisplay){
            this.imgList = this.imgList.reverse();
        }
        
        new ImageGrid({
            props: {
                imageList: this.imgList,
                maxColumnWidth: this.plugin.settings.width
            },
            target: this.imagesContainer
        });
    }

    getViewType(): string {
        return OB_GALLERY;
    }

    getDisplayText(): string {
        return "Gallery";
    }

    getIcon(): string {
        return "lines-of-text";
    }

    onClose(): Promise<void> {
        this.app.workspace.detachLeavesOfType(OB_GALLERY_INFO);
        return Promise.resolve();
    }

    async onOpen(): Promise<void> {
        // Set Header Title
        this.headerEl.querySelector('.view-header-title').setText('Obsidian Gallery');
        // Set Header Icon
        this.headerEl.querySelector('svg').outerHTML = gallerySearchIcon;
    }
}

export class GalleryInfoView extends ItemView {
    viewEl: HTMLElement;
    contentEl: HTMLElement;
    previewEl: HTMLElement;
    sourceEl: HTMLElement;
    editorEl: HTMLTextAreaElement;
    infoFile: TFile;
    imgPath: string;
    galleryView: GalleryView;
    plugin: GalleryPlugin;
    editor: CodeMirror.Editor;

    constructor(leaf: WorkspaceLeaf, plugin: GalleryPlugin) {
        super(leaf);
        this.plugin = plugin;

        // Get View Container Element
        this.viewEl = this.containerEl.getElementsByClassName('view-content')[0] as HTMLElement;
        // Add Preview Mode Container
        this.previewEl = this.viewEl.createDiv({
            cls: 'markdown-preview-view',
            attr: { 'style': 'display: block' }
        });
        this.contentEl = this.previewEl.createDiv({
            cls: 'markdown-preview-sizer markdown-preview-section'
        });
        // Add Source Mode Container
        this.sourceEl = this.viewEl.createDiv({ cls: 'CodeMirror cm-s-obsidian CodeMirror-wrap', attr: { 'style': 'display: none' } });
        // Add code mirro editor
        this.editorEl = this.sourceEl.createEl('textarea', { cls: 'image-info-cm-editor' });
        // Create Code Mirror Editor with specific config
        this.editor = CodeMirror.fromTextArea(this.editorEl, {
            lineNumbers: false,
            lineWrapping: true,
            scrollbarStyle: null,
            keyMap: "default"
        });
        this.render = this.render.bind(this);
        this.saveFile = this.saveFile.bind(this);
        this.clear = this.clear.bind(this);
        this.updateInfoDisplay = this.updateInfoDisplay.bind(this);
    }

    onClose(): Promise<void> {
        // Save file content
        this.saveFile();
        // Clear the preview and editor history
        this.clear();
        return Promise.resolve();
    }

    onload(): void {
        // Add listener to change active file
        let gallery = this.app.workspace.getLeavesOfType(OB_GALLERY)[0];
        if (gallery.view instanceof GalleryView) {
            this.galleryView = gallery.view;
            let displayEl = this.galleryView.displayEl;

            displayEl.onclick = async (evt) => {
                if (evt.target instanceof HTMLImageElement) {
                    // Save file content
                    await this.saveFile();

                    // Read New image info
                    this.imgPath = evt.target.src;
                    await this.updateInfoDisplay();
                }
            };

            displayEl.addEventListener('contextmenu', async (e) => {
                if (e.target instanceof HTMLImageElement) {
                    // Save file content
                    this.saveFile();

                    // Clear the preview and editor history
                    this.clear();

                    // Open image file
                    let file = this.app.vault.getAbstractFileByPath(this.galleryView.imgResources[e.target.src]);
                    if (file instanceof TFile) {
                        this.app.workspace.getUnpinnedLeaf().openFile(file);
                    }
                }
            });

            this.galleryView.imageFocusEl.onClickEvent(async (event) => {
                event.stopPropagation();
                if (event.target instanceof HTMLImageElement) {
                    let currentMode = this.galleryView.imageFocusEl.style.getPropertyValue('display');
                    if (currentMode == "block") {
                        // save file
                        await this.saveFile();

                        this.galleryView.imageFocusEl.style.setProperty('display', 'none');
                        return;
                    }
                    this.galleryView.imageFocusEl.style.setProperty('display', 'block');
                }
            });

            document.addEventListener('keyup', async (event) => {
                if (this.galleryView.imageFocusEl.style.getPropertyValue('display') == "none") {
                    return;
                }

                if (this.sourceEl.style.getPropertyValue('display') == "block") {
                    return;
                }

                switch (event.key) {
                    case "ArrowLeft":
                        this.galleryView.imgFocusIndex--;
                        if (this.galleryView.imgFocusIndex < 0) {
                            this.galleryView.imgFocusIndex = this.galleryView.imgList.length - 1;
                        }
                        break;
                    case "ArrowRight":
                        this.galleryView.imgFocusIndex++;
                        if (this.galleryView.imgFocusIndex >= this.galleryView.imgList.length) {
                            this.galleryView.imgFocusIndex = 0;
                        }
                        break;
                }

                // Save file content
                await this.saveFile();

                // Read New image info
                this.imgPath = this.galleryView.imgList[this.galleryView.imgFocusIndex];
                await this.updateInfoDisplay();
            }, false);
        }
    }

    async onOpen(): Promise<void> {
        // Control to change between preview / source modes
        let changeMode = this.viewEl.createEl('a',
            {
                cls: 'view-action image-info-edit',
                attr: { 'aria-label': 'Edit' }
            });
        setIcon(changeMode, 'pencil', 17);

        changeMode.onClickEvent(() => {
            let currentMode = this.previewEl.style.getPropertyValue('display');
            if (currentMode == "block") {
                this.previewEl.style.setProperty('display', 'none');
                this.sourceEl.style.setProperty('display', 'block');
                this.editor.refresh();
                return;
            }

            this.render();
            this.previewEl.style.setProperty('display', 'block');
            this.sourceEl.style.setProperty('display', 'none');
        });

        // Save file on change
        this.editor.on('change', () => {
            this.requestSave();
        });
    }

    async updateInfoDisplay() {
        this.galleryView.imgFocusIndex = this.galleryView.imgList.indexOf(this.imgPath);
        this.galleryView.imageFocusEl.style.setProperty('display', 'block');
        this.galleryView.focusImage.src = this.galleryView.imgList[this.galleryView.imgFocusIndex];

        this.infoFile = await getImgInfo(this.galleryView.imgResources[this.imgPath],
            this.app.vault,
            this.app.metadataCache,
            this.plugin,
            true);

        // Handle disabled img info functionality or missing info block
        let infoText = GALLERY_RESOURCES_MISSING;
        if (this.infoFile) {
            infoText = await this.app.vault.cachedRead(this.infoFile);
        }

        // Clear the preview and editor history
        this.clear();

        // Set Editor to new file content
        this.editor.setValue(infoText);
        this.render();
    }

    async render(): Promise<void> {
        this.saveFile();
        this.contentEl.empty();
        MarkdownRenderer.renderMarkdown(this.editor.getValue(), this.contentEl, '/', this);
    }

    // Debounced save function
    requestSave = debounce(this.saveFile, 2500, false);

    async saveFile(): Promise<void> {
        // Save file content
        if (this.infoFile) {
            await this.app.vault.adapter.write(this.infoFile.path, this.editor.getValue());
        }
    }

    clear() {
        this.contentEl.empty();
        this.editor.setValue('');
        this.editor.clearHistory();
    }

    getViewType(): string {
        return OB_GALLERY_INFO;
    }

    getDisplayText(): string {
        return "Image Info";
    }

    getIcon(): string {
        return "fa-Images";
    }
}