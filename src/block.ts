import Gallery from './svelte/Gallery.svelte'
import type { GallerySettings } from './types';

export class GalleryProcessor {

	async run(source: string, el: HTMLElement, imgs: string[], settings: GallerySettings, args: string[]) {

		source = source.trim()
		let elCanvas = el.createDiv({ cls: 'ObsidianHistoryBlock' });
		let widthPar = parseInt(args[4]) ? parseInt(args[4]) : settings.width

		new Gallery({
			props: {
				imgList: imgs,
				width: widthPar,
				fillFree: settings.fillFree,
			},
			target: elCanvas
		})

		el.appendChild(elCanvas);
	}
}