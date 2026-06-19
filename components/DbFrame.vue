<script setup lang="ts">
// Logos are imported so the theme bundles its own assets (no deck /public needed).
import ddrgColor from '../assets/ddrg-color.svg'
import tudBlack from '../assets/tud-black.svg'

// `codeSize` (from the slide's frontmatter, passed in by the layout) overrides
// the code font size for this slide. Inline style beats the theme's class rule.
const props = defineProps({
  codeSize: { type: String, default: '' },
})
</script>

<template>
  <div
    class="slidev-layout default db-default"
    :style="props.codeSize ? { '--slidev-code-font-size': props.codeSize } : undefined"
  >
    <!-- Shared DB chrome for every content layout: branding + footer + body padding.
         Single source of truth — edit logo size / footer / padding here once.
         Optional `codeSize` frontmatter overrides the code font size for the slide.
         NOTE: keep this component SINGLE-ROOT (this comment lives inside the root
         <div>, not before it). A comment before the root makes Vue treat the
         component as multi-root, so `proxy.$el` becomes a comment node — which
         breaks slide-scoped tools (e.g. the gsap addon's useSlide →
         element.querySelectorAll). -->

    <!-- Chair logo, top-right -->
    <img class="db-logo-ddrg" :src="ddrgColor" alt="Dresden Database Research Group" />

    <div class="db-default__body">
      <slot />
    </div>

    <!-- Footer band: TU Dresden logo (left) + page number (right) -->
    <footer class="db-footer">
      <img class="db-footer__tud" :src="tudBlack" alt="TU Dresden" />
      <span class="db-footer__page">{{ $slidev.nav.currentPage }}</span>
    </footer>
  </div>
</template>

<style scoped>
/* px == pt (canvas 720). Values measured from the template PDF. */
.db-default {
  position: relative;
}

.db-default__body {
  padding: 19px 28px 34px 22px; /* top / right / bottom(=clear footer) / left */
}
.db-default__body :deep(h1:first-child) {
  margin-top: 0;
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
}
.db-footer__tud {
  height: 25px;
}
.db-footer__page {
  font-size: 12px;
  color: var(--db-text);
}
</style>
