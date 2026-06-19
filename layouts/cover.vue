<script setup lang="ts">
// "Titelfolie" — navy band (top, with the DDRG mosaic + both logos) + white
// title area below. Reconstructed as pure vector: the navy is a CSS fill, the
// corner mosaic is `cover-mosaic.svg` (rebuilt from the original DB_template.potx
// title-slide tiles), and the logos are the theme's own white SVGs. No raster.
// Geometry (positions/sizes in pt == px on the 720-wide canvas) is taken from
// slideLayout1.xml ("Titelfolie") so it matches the source template.
import mosaic from '../assets/cover-mosaic.svg'
import tudWhite from '../assets/tud-white.svg'
import ddrgWhite from '../assets/ddrg-white.svg'
</script>

<template>
  <div class="slidev-layout db-cover">
    <!-- navy band: solid fill + vector mosaic + logos, all overlaid -->
    <div class="db-cover__band">
      <img class="db-cover__mosaic" :src="mosaic" alt="" />
      <img
        class="db-cover__logo"
        :src="tudWhite"
        alt="TU Dresden"
        style="left: 464.83px; top: 11.93px; width: 109.67px; height: 45.67px"
      />
      <img
        class="db-cover__logo"
        :src="ddrgWhite"
        alt="Dresden Database Research Group"
        style="left: 598.52px; top: 18.56px; width: 93.23px; height: 32.4px"
      />
    </div>

    <!-- white area: title (#) + subtitle (following text) -->
    <div class="db-cover__title">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* px == pt (canvas 720). The band is 720x258pt, matching the source template. */
.db-cover {
  position: relative;
  background: #fff;
  padding: 0;
}
.db-cover__band {
  position: absolute;
  top: 0;
  left: 0;
  width: 720px;
  height: 258px;
  background: var(--db-navy);
}
.db-cover__mosaic {
  position: absolute;
  top: 0;
  left: 0;
  width: 720px;
  height: 258px;
}
.db-cover__logo {
  position: absolute;
}

.db-cover__title {
  position: absolute;
  left: 36px;
  top: 270px;
  right: 36px;
}
.db-cover__title :deep(h1) {
  margin: 0;
  font-size: 27px;
  font-weight: 700;
  color: var(--db-navy);
  line-height: 1.2;
}
.db-cover__title :deep(p) {
  margin: 16px 0 0;
  font-size: 15px;
  color: var(--db-text-soft);
}
</style>
