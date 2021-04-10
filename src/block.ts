import type { Vault, MetadataCache, WorkspaceLeaf } from 'obsidian';
import { MarkdownRenderer, TFile, getAllTags } from 'obsidian';
import type { GalleryBlockArgs } from './utils';
import { EXTENSIONS, GALLERY_DISPLAY_USAGE, GALLERY_INFO_USAGE, EXTRACT_COLORS_OPTIONS, getImageResources, getImgInfo } from './utils';
import { extractColors } from 'extract-colors';
import type GalleryPlugin from './main';
import ImageGrid from './svelte/ImageGrid.svelte';
import Gallery from './svelte/Gallery.svelte';
import GalleryInfo from './svelte/GalleryInfo.svelte';

export class GalleryProcessor {

	async galleryDisplay(source: string, el: HTMLElement, vault: Vault, metadata: MetadataCache, plugin: GalleryPlugin) {

		let args: GalleryBlockArgs = {
			type: 'grid',
			path: '',
			name: '',
			imgWidth: 200,
			divWidth: 100,
			divAlign: 'left',
			reverseOrder: 'false',
			customList: ''
		};

		source.split('\n').map(e => {
			if (e) {
				let param = e.trim().split('=');
				(args as any)[param[0]] = param[1]?.trim();
			}
		});

		let elCanvas = el.createDiv({
			cls: 'ob-gallery-display-block',
			attr: { 'style': `width: ${args.divWidth}%; height: auto; float: ${args.divAlign}` }
		});

		// Handle problematic arguments
		if (!args.path || !args.type) {
			MarkdownRenderer.renderMarkdown(GALLERY_DISPLAY_USAGE, elCanvas, '/', plugin);
			return;
		}

		let imgResources = getImageResources(args.path, args.name, vault.getFiles(), vault.adapter);
		let imgList = Object.keys(imgResources);

		if (args.reverseOrder === 'true') {
			imgList = imgList.reverse();
		}

		if (args.customList) {
			imgList = args.customList.split(" ").map(i => parseInt(i)).filter(value => !Number.isNaN(value)).map(i => imgList[i]);
		}

		if (args.type === "grid") {
			new ImageGrid({
				props: {
					imageList: imgList,
					maxColumnWidth: args.imgWidth
				},
				target: elCanvas
			});

			let imageFocusEl = elCanvas.createDiv({ cls: 'ob-gallery-image-focus' });
			let focusImage = imageFocusEl.createEl('img');
			let imgFocusIndex = 0;

			elCanvas.onClickEvent((event) => {
				event.stopPropagation();
				let currentMode = imageFocusEl.style.getPropertyValue('display');
				if (currentMode == "block") {
					imageFocusEl.style.setProperty('display', 'none');
					return;
				}
				imageFocusEl.style.setProperty('display', 'block');

				if (event.target instanceof HTMLImageElement) {
					// Read New image info
					let imgPath = event.target.src;
					imgFocusIndex = imgList.indexOf(imgPath);
					imageFocusEl.style.setProperty('display', 'block');
					focusImage.src = imgList[imgFocusIndex];
				}
			});

			elCanvas.addEventListener('contextmenu', async (e) => {
				if (e.target instanceof HTMLImageElement) {
					// Open image file
					let file = vault.getAbstractFileByPath(imgResources[e.target.src]);
					if (file instanceof TFile) {
						plugin.app.workspace.getUnpinnedLeaf().openFile(file);
					}
				}
			});

			document.addEventListener('keyup', (event) => {
				if (imageFocusEl.style.getPropertyValue('display') == "none") {
					return;
				}

				switch (event.key) {
					case "ArrowLeft":
						imgFocusIndex--;
						if (imgFocusIndex < 0) {
							imgFocusIndex = imgList.length - 1;
						}
						focusImage.src = imgList[imgFocusIndex];
						break;
					case "ArrowRight":
						imgFocusIndex++;
						if (imgFocusIndex >= imgList.length) {
							imgFocusIndex = 0;
						}
						focusImage.src = imgList[imgFocusIndex];
						break;
				}
			}, false);
		}

		if (args.type === "active-thumb") {
			new Gallery({
				props: {
					imgList: imgList,
					width: args.imgWidth / 50,
					fillFree: true,
				},
				target: elCanvas
			});

		}
	}

	async galleryImageInfo(source: string, el: HTMLElement, vault: Vault, metadata: MetadataCache, plugin: GalleryPlugin) {

		let imgPath = source.trim();
		let elCanvas = el.createDiv({
			cls: 'ob-gallery-info-block',
			attr: { 'style': `width: 100%; height: auto; float: left` }
		});

		let imgTFile = vault.getAbstractFileByPath(imgPath);
		let imgURL = vault.adapter.getResourcePath(imgPath);

		// Handle problematic arg
		if (!imgPath || !imgTFile) {
			MarkdownRenderer.renderMarkdown(GALLERY_INFO_USAGE, elCanvas, '/', plugin);
			return;
		}

		// Get image dimensions
		let imgEl = new Image();
		imgEl.src = imgURL;

		// Handle disabled img info functionality or missing info block
		let imgInfo = await getImgInfo(imgTFile.path, vault, metadata, plugin);
		let imgTags = null;
		if (imgInfo) {
			imgTags = getAllTags(metadata.getFileCache(imgInfo));
		}

		if (imgTFile instanceof TFile && EXTENSIONS.contains(imgTFile.extension)) {
			new GalleryInfo({
				props: {
					name: imgTFile.basename,
					path: imgTFile.path,
					extension: imgTFile.extension,
					date: new Date(imgTFile.stat.ctime),
					dimensions: imgEl,
					size: imgTFile.stat.size / 1000000,
					colorList: await extractColors(imgURL, EXTRACT_COLORS_OPTIONS),
					tagList: imgTags
				},
				target: elCanvas
			});
		}
	}
}