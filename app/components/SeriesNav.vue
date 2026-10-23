<script setup lang="ts">
import type { SeriesNav } from '#shared/types/content'

defineProps<{ nav: SeriesNav }>()
</script>

<template>
  <nav aria-label="Series" class="series-nav">
    <p class="where">
      <NuxtLink :to="`/series/${nav.slug}`">{{ nav.title }}</NuxtLink> · part {{ nav.number }} · {{ nav.total }} published
    </p>
    <p v-if="nav.previous || nav.next" class="links">
      <NuxtLink v-if="nav.previous" :to="nav.previous.path" rel="prev">← {{ nav.previous.title }}</NuxtLink>
      <span v-else />
      <NuxtLink v-if="nav.next" :to="nav.next.path" rel="next" class="next">{{ nav.next.title }} →</NuxtLink>
    </p>
  </nav>
</template>

<style scoped>
.series-nav {
  margin-top: 56px;
  padding: 20px 24px;
  border: 1px solid var(--accent-border);
  border-radius: var(--radius);
  background: var(--accent-soft);
  font-size: 15px;
  line-height: 1.5;
}

.where {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text-soft);
}

.links {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  margin: 8px 0 0;
}

.next {
  margin-left: auto;
  text-align: right;
}
</style>
