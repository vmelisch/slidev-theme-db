<script setup lang="ts">
// "Titelfolie" — navy band (top, with the DDRG mosaic + both logos) + white
// title area below. Reconstructed as pure vector: the navy is a CSS fill, the
// corner mosaic is `cover-mosaic.svg` (rebuilt from the original DB_template.potx
// title-slide tiles), and the logos are the theme's own white SVGs. No raster.
// Geometry (positions/sizes in pt == px on the 720-wide canvas) is taken from
// slideLayout1.xml ("Titelfolie") so it matches the source template.
import mosaic from '../assets/mosaic.svg'
import tudWhite from '../assets/tud-white.svg'
import ddrgWhite from '../assets/ddrg-white.svg'
</script>

<template>
  <div class="slidev-layout db-cover p-0">
    <!-- navy band: solid fill + vector mosaic + logos, all overlaid -->
    <div class="relative w-full h-[345px] bg-[var(--db-navy)] overflow-hidden">
      <img class="absolute h-full scale-[1.01]" :src="mosaic" alt="" />
      <div class="absolute flex gap-[45px] top-[25px] right-[35px]">
        <img
          class="h-[45px]"
          :src="tudWhite"
          alt="TU Dresden"
        />
        <img
          class="h-[45px]"
          :src="ddrgWhite"
          alt="Dresden Database Research Group"
        />
      </div>
    </div>

    <!-- white area: title (#) + subtitle (following text) -->
    <div class="db-cover__title relative m-[30px]">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.db-cover__title :deep(h1) {
  @apply text-4xl! font-700;
}
.db-cover__title :deep(p) {
  @apply absolute top-[95px] m-0 text-md;
  /* margin: 16px 0 0; */
  /* font-size: 15px; */
  color: var(--db-text-soft);
}
</style>
