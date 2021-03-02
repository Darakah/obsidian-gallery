import { App, PluginSettingTab, Setting } from 'obsidian'
import type { GalleryPlugin } from 'main'

export class GallerySettingTab extends PluginSettingTab {
    plugin: GalleryPlugin;

    constructor(app: App, plugin: GalleryPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();
        containerEl.createEl('h2', { text: 'Gallery Settings' });

        new Setting(containerEl)
            .setName('Width:')
            .setDesc('Panel width. integer, placeholder shows current value.')
            .addText(text => text
                .setPlaceholder(this.plugin.settings.width)
                .onChange(async (value) => {
                    let numValue = parseInt(value)
                    // check if valid hex
                    if (isNaN(numValue)) {
                        return
                    }

                    this.plugin.settings.width = Math.abs(numValue);
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Columns:')
            .setDesc(`Columns of the gallery grid. integer, larger number -> more columns (default = 25 which corresponds to 5 columns). 
            Placeholder shows current value.`)
            .addText(text => text
                .setPlaceholder(this.plugin.settings.columns)
                .onChange(async (value) => {
                    let numValue = parseInt(value)
                    // check if valid hex
                    if (isNaN(numValue)) {
                        return
                    }

                    this.plugin.settings.columns = Math.abs(numValue);
                    await this.plugin.saveSettings();
                }));


        new Setting(containerEl)
            .setName('Fill free')
            .setDesc('Automatically reorganizes panels to fill free areas when a panel is moved. On = true.')
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.fillFree);
                toggle.onChange(async (value) => {
                    this.plugin.settings.fillFree = value;
                    await this.plugin.saveSettings();
                });
            })
    }
}