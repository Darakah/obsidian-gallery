# Obsidian Gallery
![GitHub release)](https://img.shields.io/github/v/release/Darakah/obsidian-gallery)
![GitHub all releases](https://img.shields.io/github/downloads/Darakah/obsidian-gallery/total)

- Main Gallery to tag / filter / add notes to images.
- Display blocks to embed images inside notes
- Display block to an image information

#### Example:

##### Main Gallery
![](https://raw.githubusercontent.com/Darakah/obsidian-gallery/main/images/Example_main_gallery_1.gif)

##### Main Gallery Filtering

![](https://raw.githubusercontent.com/Darakah/obsidian-gallery/main/images/Example_main_gallery_2.gif)

##### Display blocks

![](https://raw.githubusercontent.com/Darakah/obsidian-gallery/main/images/Example_Display_Block.gif)

##### Display Image Info block

![](https://raw.githubusercontent.com/Darakah/obsidian-gallery/main/images/Example_Info_Block.gif)

##### Old example
![example_1](https://raw.githubusercontent.com/Darakah/obsidian-gallery/main/images/example_1.png) 

## Usage:

### Image display block Usage
e.g. Input:

```
path=Weekly
name=.*Calen
imgWidth=400
divWidth=70
divAlign=left
reverseOrder=false
customList=5 10 2 4
```

Argument Info:
- **type**: specify display type. Possible values grid, active-thumb
- **path**: vault path to display images from. Regex expression
- **imgWidth**: image width in pixels
- **divWidth**: div container in %
- **divAlign**: div alignment. Possible values left, right
- **reverseOrder**: reverse the display order of images. Possible values true, false
- **customList**: specify image indexes to display in the passed order

## Settings:

![](https://raw.githubusercontent.com/Darakah/obsidian-gallery/main/images/Gallery_Settings.png)

## Release Notes:

### v0.5.8
- Bug Fix: https://github.com/Darakah/obsidian-gallery/issues/12

### v0.5.7
- `gallery-info` block modified to take arguments `imgPath` and `ignoreInfo`
- `gallery-info` will show all default information + all YAML added to the info MD file. Can ignore any info field by specifying `ignoreInfo` separated by a `;`
- Right-clicking an info block will open the info side panel
- Button to open info file from image info side panel
- Changed info file naming to use same name as img (if already present will apend a counter)
- Comeback now opens the side panel activating the gallery as normal
- Renaming files bug fix
- Bug Fix: https://github.com/Darakah/obsidian-gallery/issues/8

### v0.5.3
- Support for mp4 videos
- Code cleanup

### v0.5.2
- Duplicate files hotfix (https://github.com/Darakah/obsidian-gallery/issues/6)

### v0.5.1
- Add reverse main gallery display option to Obsidian settings

### v0.5.0
- Initial release of updated plugin
- Added main gallery 
  - View all images in vault
  - Filter images by path / name (Regex)
  - Add info MD notes to images 
  - Edit info MD notes directly from gallery side panel
  - Focus on image click
  - Navigate through images using left / right arrow keys when focused
  - Right click image to jump to original file in obsidian vault
  - Change width of display images from Obsidian settings
- Modify input format for `image display` blocks
- Add new `grid` display type to `image display` block (supports most functionalities from main gallery display)
- Add options to align and specify div % of display block
- Add new `gallery-info` block to display image info

### v0.1.2
- changed block id to `gallery`
- added image name filtering to `/` vault search option
- removed meaningless confusing `column` parameter

## Support
[![Github Sponsorship](https://raw.githubusercontent.com/Darakah/Darakah/e0fe245eaef23cb4a5f19fe9a09a9df0c0cdc8e1/icons/github_sponsor_btn.svg)](https://github.com/sponsors/Darakah) [<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="BuyMeACoffee" width="100">](https://www.buymeacoffee.com/darakah)
