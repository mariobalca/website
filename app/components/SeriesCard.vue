<script setup lang="ts">
import type { SeriesSummary } from '#shared/types/content'

defineProps<{ series: SeriesSummary }>()
</script>

<template>
  <NuxtLink :to="`/series/${series.slug}`" class="series-card">
    <span class="slug">{{ series.slug }}</span>
    <span class="title">{{ series.title }}</span>
    <span v-if="series.description" class="description">{{ series.description }}</span>
    <span class="count">{{ series.postCount }} {{ series.postCount === 1 ? 'part' : 'parts' }}</span>
  </NuxtLink>
</template>

<style scoped>
.series-card {
  flex: 1 1 320px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--text);
  text-decoration: none;
}

.series-card:hover {
  border-color: var(--border-strong);
}

.slug,
.count {
  font-family: var(--font-mono);
  font-size: 13px;
}

.slug {
  color: var(--link);
}

.count {
  color: var(--muted);
}

.title {
  font-size: 22px;
  line-height: 1.3;
  font-weight: 600;
}

.description {
  font-size: 16px;
  line-height: 1.55;
  color: var(--text-soft);
}
</style>
