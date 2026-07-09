<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'

import ddrgColor from './assets/ddrg-color.svg'
import tudBlack from './assets/tud-black.svg'

const { $nav } = useSlideContext()
const showChrome = computed(() => $nav.value?.currentLayout !== 'cover')
</script>

<template>
  <!-- Global chrome that sits outside the slide transition layer -->
  <div :class="{'opacity-0': !showChrome}" class="db-global-chrome transition-opacity duration-500">
    <!-- Chair logo, top-right -->
    <img class="db-logo-ddrg" :src="ddrgColor" alt="Dresden Database Research Group" />

    <!-- Footer band: TU Dresden logo (left) + page number (right) -->
    <footer class="db-footer">
      <img class="db-footer__tud" :src="tudBlack" alt="TU Dresden" />
      <span class="db-footer__page">
        <span class="font-bold">{{ $nav.currentPage }}</span>
        <template v-if="$nav.clicksTotal > 0">
          <span style="font-size: 0.7em">.{{ $nav.clicks + 1 }}</span>
        </template>
      </span>
    </footer>
  </div>
</template>

<style scoped>
/* px == pt (canvas 720). Values match the template PDF. */
.db-global-chrome {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 100;
}

.db-logo-ddrg {
  position: absolute;
  top: 18px;
  right: 28px;
  height: 33px;
}

.db-footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 29px;
  background: var(--db-footer-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  /* Re-enable pointer events for footer if there are links (optional) */
  pointer-events: auto; 
}

.db-footer__tud {
  height: 25px;
}

.db-footer__page {
  font-size: 12px;
  color: var(--db-text);
}
</style>
