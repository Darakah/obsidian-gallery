import { Plugin, WorkspaceLeaf, addIcon } from 'obsidian';
import { GallerySettings, SETTINGS, OB_GALLERY, OB_GALLERY_INFO, galleryIcon, gallerySearchIcon } from './utils';
import { GallerySettingTab } from './settings';
import { GalleryProcessor } from './block';
import { GalleryView, GalleryInfoView } from './view';

export default class GalleryPlugin extends Plugin {
	settings: GallerySettings;
	containerEl: HTMLElement;

	async onload() {
		// Load message
		await this.loadSettings();
		console.log('Loaded Gallery Plugin');

		// Register gallery display block renderer
		this.registerMarkdownCodeBlockProcessor('gallery', async (source, el, ctx) => {
			const proc = new GalleryProcessor();
			await proc.galleryDisplay(source, el, this.app.vault, this.app.metadataCache, this);
		});

		// Register image info block
		this.registerMarkdownCodeBlockProcessor('gallery-info', async (source, el, ctx) => {
			const proc = new GalleryProcessor();
			await proc.galleryImageInfo(source, el, this.app.vault, this.app.metadataCache, this);
		});

		// Add Gallery Icon
		addIcon('fa-Images', galleryIcon);
		addIcon('fa-search', gallerySearchIcon);

		// Register Main Gallery View
		this.registerView(OB_GALLERY, this.galleryViewCreator.bind(this));
		this.registerView(OB_GALLERY_INFO, this.galleryInfoCreator.bind(this));

		// Add Main Gallery Ribbon
		this.addRibbonIcon('fa-Images', "Gallery", (e) => this.showPanel());

		// Add Gallery Settings tab
		this.addSettingTab(new GallerySettingTab(this.app, this));

		// Save settings
		this.saveSettings();
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(OB_GALLERY_INFO);
		console.log('unloading Gallery Plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	galleryViewCreator(leaf: WorkspaceLeaf) {
		return new GalleryView(leaf, this);
	};

	galleryInfoCreator(leaf: WorkspaceLeaf) {
		return new GalleryInfoView(leaf, this);
	};

	showPanel = async function () {

		let workspace = this.app.workspace;
		workspace.getLeaf(false).setViewState({ type: OB_GALLERY });
		let leftCollapseButton = workspace.leftRibbon.collapseButtonEl;
		if (leftCollapseButton.ariaLabel === "Collapse") {
			leftCollapseButton.click();
		}

		workspace.detachLeavesOfType(OB_GALLERY_INFO);
		let infoView = workspace.getLeavesOfType(OB_GALLERY_INFO)[0];
		if (infoView) {
			workspace.revealLeaf(
				infoView,
			);
			return;
		}

		await workspace.getRightLeaf().setViewState({ type: OB_GALLERY_INFO });
		workspace.revealLeaf(
			await workspace.getLeavesOfType(OB_GALLERY_INFO)[0]
		);
	};
}