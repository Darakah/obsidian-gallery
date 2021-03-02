import Gallery from './svelte/Gallery.svelte'
import type { GallerySettings } from './types';

export class GalleryProcessor {

	async run(source: string, el: HTMLElement, imgs: string[], basePath: string, settings: GallerySettings) {

		source = source.trim()
		let elCanvas = el.createDiv({ cls: 'ObsidianHistoryBlock' });

		new Gallery({
			props: {
				imgList: imgs,
				width: settings.width,
				column: settings.columns,
				basePath: basePath,
				fillFree: settings.fillFree,
			},
			target: elCanvas
		})

		el.appendChild(elCanvas);
	}
}