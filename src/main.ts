import { Plugin } from 'obsidian';
import { getImgs, GallerySettings, SETTINGS } from './utils';
import { GallerySettingTab } from './settings';
import { GalleryProcessor } from './block';

export default class GalleryPlugin extends Plugin {
	settings: GallerySettings;
	containerEl: HTMLElement;

	async onload() {
		// Load message
		await this.loadSettings();
		console.log('Loaded Gallery Plugin');

		// Register activity history block renderer
		this.registerMarkdownCodeBlockProcessor('gallery', async (source, el, ctx) => {
			const proc = new GalleryProcessor();
			let args = source.split("\n");
			await proc.run(source, el, getImgs(args, this.app.vault.getFiles(), this.app.vault.adapter), this.settings, args);
		});

		this.addSettingTab(new GallerySettingTab(this.app, this));
	}

	onunload() {
		console.log('unloading Gallery Plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
