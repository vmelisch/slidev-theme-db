<script setup lang="ts">
import { useLogo } from '../scripts/logo'
import mosaic from '../assets/mosaic.svg'

useLogo({ ddrg: 'white', tud: true })
</script>

<template>
  <div class="slidev-layout db-cover p-0">
    <!-- navy band: solid fill + vector mosaic, logos handled by global-bottom -->
    <div class="relative w-full h-[345px] bg-[var(--db-navy)] overflow-hidden">
      <img class="absolute h-full scale-[1.01]" :src="mosaic" alt="" />
    </div>

    <!-- white area: title (#) + subtitle (following text) -->
    <div class="db-cover__title relative m-[30px]">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.db-cover__title :deep(h1) {
  @apply font-700 leading-10;
  font-size: var(--db-fs-cover-title) !important;
}
.db-cover__title :deep(p) {
  @apply absolute top-[95px] m-0;
  font-size: var(--db-fs-subtitle);
  color: var(--db-text-soft);
}
</style>
