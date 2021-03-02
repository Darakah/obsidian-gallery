import { Plugin, Vault, DataAdapter } from 'obsidian';
import { getImgs } from './utils'
import { GallerySettingTab } from './settings'
import { GalleryProcessor } from './block'
import type { GallerySettings } from './types';
import { DEFAULT_SETTINGS } from './constants';

export default class GalleryPlugin extends Plugin {
	settings: GallerySettings;
	containerEl: HTMLElement;

	async onload() {
		// Load message
		await this.loadSettings();
		console.log('Loaded Gallery Plugin');

		// Register activity history block renderer
		this.registerMarkdownCodeBlockProcessor('Gallery', async (source, el, ctx) => {
			const proc = new GalleryProcessor();
			await proc.run(source, el, getImgs(source.trim(), this.app.vault.getFiles()),this.app.vault.adapter.basePath, this.settings);
		});

		this.addSettingTab(new GallerySettingTab(this.app, this));
	}

	onunload() {
		console.log('unloading Gallery Plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
