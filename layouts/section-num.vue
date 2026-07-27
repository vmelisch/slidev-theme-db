<script setup lang="ts">
import mosaic from '../assets/section-mosaic.svg'
import tudWhite from '../assets/tud-white.svg'
import ddrgWhite from '../assets/ddrg-white.svg'
</script>

<template>
  <div class="slidev-layout db-cover p-0">
    <div class="relative w-full h-[345px] bg-[#2f57b2]">
      <!-- glyph is painted using bg-clip to circumvent firefox' font scaling limit -->
      <!-- See https://bugzilla.mozilla.org/show_bug.cgi?id=1677551 -->
      <div class="absolute font-700 text-[24rem]/[24rem] pt-8 px-4 bg-white bg-clip-text text-transparent">3</div>
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
  @apply text-4xl! font-700 text-[var(--db-heading-blue)];
}
.db-cover__title :deep(p) {
  @apply absolute top-[95px] m-0 text-md;
  color: var(--db-text-soft);
}
</style>
