# Obsidian Gallery
![GitHub release)](https://img.shields.io/github/v/release/Darakah/obsidian-gallery)
![GitHub all releases](https://img.shields.io/github/downloads/Darakah/obsidian-gallery/total)

Simple plugin to create an interactive gallery of images in the specified location of the vault

- Images can be resized 
- Images can be dragged and rearranged
(made changes will be removed when the note is re-opened as the object will be recreated and automatically updated)

#### Example:
![example_1](https://raw.githubusercontent.com/Darakah/obsidian-gallery/main/images/example_1.png) 

## Usage:

Write the render block example shown below in edit mode in the note in which you want to add the render block.
![example_2](https://raw.githubusercontent.com/Darakah/obsidian-gallery/main/images/example_2.png) 

It must contain a single line corresponding to the path of the project, for example:
- `/` for the whole vault
- `Project Example Test` for the project located at `/Project Example Test` 
- `Project Root/Project Second Example/Test Project` for the project located at `/Project Root/Project Second Example/Test Project`

## Special Options:

the query block can take more parameters then just the folder path from which to get the images to display. 

![example_2](https://raw.githubusercontent.com/Darakah/obsidian-gallery/main/images/example_4.png) 

The option is specified based on the **LINE**!! So if you want to specify width and not use the previous options YOU MUST KEEP AN EMPTY LINE in its place!
the options are as follows based on the line number:
- **Folder Path:** As specified above, this specifies the folder inside which to get the images to display (MUST NOT HAVE A `/` AT THE BEGINNING OR THE END!! check syntax above!)
- **Image Name:** Specifies a regex to further filter images based on their name. in the above example only images starting with `TS_test_` will be displayed
- **Sort Order:** `+` the images will be displayed in the same order as the file explorer while `-` will be displayed in the reverse order. default is `-`
- **Custom Index:** custom order for the images (after you show all you can count starting from 0 the index of the position) specifying these, it will show ONLY the ones corresponding to these indexes and in that specific order.
- **Width:** Width which applies only to this block (this way can customize for each note)
- **Columns:** Applies only to this block


## Settings:
![example_3](https://raw.githubusercontent.com/Darakah/obsidian-gallery/main/images/example_3.png) 
