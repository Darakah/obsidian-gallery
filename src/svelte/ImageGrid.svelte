<script>
    import Gallery from "svelte-image-gallery";
    export let imageList;
    export let maxColumnWidth = 400;
</script>

<Gallery gap="5" {maxColumnWidth}>
    {#each imageList as img}
        <img src={img} class="gallery-grid-img" alt="" width={maxColumnWidth} />
    {/each}
</Gallery>

<style>
    /*:global(img) {
        opacity: 0.9;
        transition: 0.1;
    }
    :global(img):hover {
        opacity: 1;
        transform: scale(1.04);
    }*/
</style>
