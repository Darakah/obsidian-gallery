<script>
    export let name;
    export let path;
    export let extension;
    export let size;
    export let dimensions;
    export let date;
    export let tagList;
    export let colorList;
    export let isVideo;
    export let imgLinks;
    export let frontmatter;
    export let infoList;

    let width, height;

    dimensions.addEventListener(
        "loadedmetadata",
        function (e) {
            width = this.videoWidth;
            height = this.videoHeight;
        },
        false
    );
</script>

<div class="gallery-info-container">
    {#if !infoList.contains("name")}
        <div class="gallery-info-section">
            <span class="gallery-info-section-label">Name</span>
            <div class="gallery-info-section-value">{name}</div>
        </div>
    {/if}
    {#if !infoList.contains("path")}
        <div class="gallery-info-section">
            <span class="gallery-info-section-label">Path</span>
            <div class="gallery-info-section-value">
                {path}
            </div>
        </div>
    {/if}
    {#if !infoList.contains("extension")}
        <div class="gallery-info-section">
            <span class="gallery-info-section-label">Extension</span>
            <div class="gallery-info-section-value">{extension}</div>
        </div>
    {/if}
    {#if !infoList.contains("size")}
        <div class="gallery-info-section">
            <span class="gallery-info-section-label">Size</span>
            <div class="gallery-info-section-value">{size} Mb</div>
        </div>
    {/if}
    {#if !infoList.contains("dimension")}
        <div class="gallery-info-section">
            <span class="gallery-info-section-label">Dimensions</span>
            <div class="gallery-info-section-value">
                {#if isVideo}
                    {width} x {height} px
                {:else}
                    {dimensions?.naturalWidth} x {dimensions?.naturalHeight} px
                {/if}
            </div>
        </div>
    {/if}
    {#if !infoList.contains("date")}
        <div class="gallery-info-section">
            <span class="gallery-info-section-label">Date</span>
            <div class="gallery-info-section-value">{date}</div>
        </div>
    {/if}
    {#if !infoList.contains("tags")}
        <div class="gallery-info-section mod-tags">
            <span class="gallery-info-section-label">Tags</span>
            <div class="gallery-info-section-tags">
                {#if tagList}
                    {#each tagList as tag}
                        <a class="tag" target="_blank" rel="noopener" href={tag}
                            >{tag}</a
                        >
                    {/each}
                {/if}
            </div>
        </div>
    {/if}
    {#if !infoList.contains("backlinks")}
        <div class="gallery-info-section">
            <span class="gallery-info-section-label">Backlinks</span>
            <div class="gallery-info-section-value">
                {#each imgLinks as link}
                    <li class="img-info-link">
                        <a class="internal-link" href={link.path}>{link.name}</a>
                    </li>
                {/each}
            </div>
        </div>
    {/if}
    {#each Object.keys(frontmatter) as yaml}
        {#if yaml != "position" && !infoList.contains(yaml)}
            <div class="gallery-info-section">
                <span class="gallery-info-section-label">{yaml}</span>
                <div class="gallery-info-section-value">
                    {frontmatter[yaml]}
                </div>
            </div>
        {/if}
    {/each}
    {#if !infoList.contains("palette")}
        <div class="gallery-info-section mod-tags">
            <span class="gallery-info-section-label">Palette</span>
            <div class="gallery-info-section-value">
                <div width="max-content">
                    {#if colorList}
                        {#each colorList as color}
                            <div
                                class="gallery-info-color"
                                aria-label={color.hex}
                                style="background-color:{color.hex}"
                            />
                        {/each}
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .gallery-info-container {
        border: 1px solid var(--background-modifier-border);
        font-size: 14px;
        color: var(--text-muted);
        padding: 6px 14px;
        border-radius: 4px;
        background-color: var(--background-primary-alt);
        position: inherit;
        margin-bottom: 30px;
    }

    .gallery-info-container .gallery-info-section {
        margin: 6px 0;
        display: flex;
    }

    .gallery-info-section-label {
        margin-right: 20px;
    }

    .gallery-info-section-value {
        color: var(--text-a);
        overflow-wrap: anywhere;
    }

    .gallery-info-color {
        width: 30px;
        height: 10px;
        margin-top: 6px;
        background-color: aqua;
        float: left;
    }

    .gallery-info-container .gallery-info-section-tags {
        display: inline-flex;
        flex-wrap: wrap;
        align-items: center;
    }

    .gallery-info-section-tags > .tag {
        background-color: #333333;
        border: none;
        color: black;
        --text-a: var(--bright-orange);
        --text-a-hover: var(--bright-blue);
        font-size: 11px;
        padding: 1px 8px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        margin: 0px 0px;
        cursor: pointer;
        border-radius: 14px;
    }

    .img-info-link {
        color: var(--text-muted);
    }
</style>
