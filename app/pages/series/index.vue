<script setup lang="ts">
const { data: series } = await useSeriesList()

useSeoMeta({
  title: 'Series',
  description: 'Posts that belong together, in order.',
})
</script>

<template>
  <div class="container listing">
    <p class="prompt">
      $ ls series
    </p>
    <h1 class="page-title">
      Series
    </h1>
    <p class="intro">
      Posts that belong together, in order.
    </p>
    <div v-if="series.length" class="cards">
      <SeriesCard v-for="item in series" :key="item.slug" :series="item" />
    </div>
    <p v-else class="empty">
      No series yet.
    </p>
  </div>
</template>

<style scoped>
.listing {
  padding-block: 72px 96px;
}

.page-title {
  margin-bottom: 12px;
}

.intro {
  margin: 0 0 40px;
  font-size: 18px;
  line-height: 1.55;
  color: var(--text-soft);
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.empty {
  font-family: var(--font-mono);
  color: var(--muted);
}
</style>
