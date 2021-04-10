<script>
  import Grid from "svelte-grid";
  import gridHelp from "svelte-grid/build/helper/index.mjs";

  export let imgList;
  export let width = 5;
  export let fillFree = false;
  let columns = 25;

  function generateLayout(col) {
    return new Array(imgList.length).fill(null).map(function (item, i) {
      const y = Math.ceil(Math.random() * 4) + 1;
      return {
        [columns]: gridHelp.item({
          x: (i * 2) % col,
          y: Math.floor(i / 3) * y,
          w: width,
          h: y,
        }),
        id: imgList[i],
        //data: ,
      };
    });
  }

  let cols = [[1687, columns]];
  let items = gridHelp.adjust(generateLayout(columns), columns);
</script>

<div class="gallery-container">
  <Grid
    bind:items
    rowHeight={100}
    let:item
    let:dataItem
    {cols}
    fillSpace={fillFree}
  >
    <!-- svelte-ignore a11y-missing-attribute -->
    <div
      class="gallery-widget internal-link"
      style="background-image: url({dataItem.id});"
    />
  </Grid>
</div>
