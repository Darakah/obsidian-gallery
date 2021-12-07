import { App, PluginSettingTab, Setting, TFolder } from 'obsidian';
import type GalleryPlugin from './main';

export class GallerySettingTab extends PluginSettingTab {
    plugin: GalleryPlugin;

    constructor(app: App, plugin: GalleryPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;
        let resourcesPathInput = '';
        let onOpenPathInput = '';

        containerEl.empty();
        containerEl.createEl('h2', { text: 'Gallery Settings' });

        let infoPathSetting = new Setting(containerEl)
            .setName('Gallery Info Folder')
            .setDesc("")
            .addButton(text => text
                .setButtonText('Save')
                .onClick(() => {
                    if (resourcesPathInput === '/' || !(this.plugin.app.vault.getAbstractFileByPath(resourcesPathInput) instanceof TFolder)) {
                        return;
                    }

                    this.plugin.settings.imgDataFolder = resourcesPathInput;
                    resourcesPathInput = '';
                    this.plugin.saveSettings();
                }))
            .addText(text => text
                .setPlaceholder(this.plugin.settings.imgDataFolder)
                .onChange(async (value) => {
                    resourcesPathInput = value.trim();
                }));

        infoPathSetting.descEl.createDiv({ text: 'Specify an existing vault folder for the gallery plugin to store image information/notes as markdown files.' });
        infoPathSetting.descEl.createDiv({ text: 'E.g. \`Resources/Gallery\`.', attr: { 'style': 'color: indianred;' } });
        infoPathSetting.descEl.createDiv({ text: 'On first activation the default is unspecified. Thus the info functionality of the Main gallery is diabled.' });
        infoPathSetting.descEl.createDiv({ text: 'Folder must already exist (plugin will not create it).', attr: { 'style': 'font-weight: 900;' } });
        infoPathSetting.descEl.createDiv({ text: 'If a folder is not specified no Image Information notes are created (to be used in the main gallery).' });

        new Setting(containerEl)
            .setName('Default Image Width')
            .setDesc('Display default image width in `pixels`. integer, placeholder shows current value. (change this value to change the display in the main gallery')
            .addText(text => text
                .setPlaceholder(`${this.plugin.settings.width}`)
                .onChange(async (value) => {
                    let numValue = parseInt(value);
                    if (isNaN(numValue)) {
                        return;
                    }

                    this.plugin.settings.width = Math.abs(numValue);
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Main Gallery Display Order')
            .setDesc('Toggle this option to reverse the order in which the main gallery displays images.')
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.reverseDisplay);
                toggle.onChange(async (value) => {
                    this.plugin.settings.reverseDisplay = value;
                    await this.plugin.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName('Gallery On Open Path Search')
            .setDesc(`The path from which to show images when the main gallery is opened. 
            Setting it to \`/\` will show all images in the vault. 
            Can be used to avoid the loading all images and affecting on open performance 
            (especially if vault has a huge amount of high quality images). 
            Setting it to an invalid path to have no images shown when gallery is opened.`)
            .addButton(text => text
                .setButtonText('Save')
                .onClick(() => {
                    this.plugin.settings.galleryLoadPath = onOpenPathInput;
                    onOpenPathInput = '';
                    this.plugin.saveSettings();
                }))
            .addText(text => text
                .setPlaceholder(this.plugin.settings.galleryLoadPath)
                .onChange(async (value) => {
                    onOpenPathInput = value.trim();
                }));
    }
}