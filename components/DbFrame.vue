<script setup lang="ts">
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
    <div class="db-default__body">
      <slot />
    </div>
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
</style>
