<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'

import ddrgColor from './assets/ddrg-color.svg'
import tudBlack from './assets/tud-black.svg'

const { $nav } = useSlideContext()
const showChrome = computed(() => $nav.value?.currentLayout !== 'cover' &&  $nav.value?.currentLayout !== 'section-num')
</script>

<template>
  <div
    :class="{ 'opacity-0': !showChrome }"
    class="db-global-chrome absolute inset-0 z-100 pointer-events-none transition-opacity duration-500"
  >
    <img class="absolute top-[25px] right-[35px] h-[45px]" :src="ddrgColor" alt="Dresden Database Research Group" />

    <footer
      class="db-footer absolute inset-x-0 bottom-0 h-[40px] px-[30px] flex items-center justify-between bg-[var(--db-footer-bg)] pointer-events-auto"
    >
      <img class="h-[25px]" :src="tudBlack" alt="TU Dresden" />
      <span class="text-[12px] text-[var(--db-text)]">
        <span class="font-bold">{{ $nav.currentPage }}</span>
        <template v-if="$nav.clicksTotal > 0">
          <span class="text-[0.7em]">.{{ $nav.clicks + 1 }}</span>
        </template>
      </span>
    </footer>
  </div>
</template>
