<script setup lang="ts">
import type { TagCount } from '~/composables/useContent'

defineProps<{
  tags: TagCount[]
  total: number
  current?: string
}>()
</script>

<template>
  <nav aria-label="Tags" class="tag-filter">
    <NuxtLink to="/blog" class="chip" :class="{ on: !current }" :aria-current="!current ? 'page' : undefined">
      all · {{ total }}
    </NuxtLink>
    <NuxtLink
      v-for="tag in tags"
      :key="tag.slug"
      :to="`/tags/${tag.slug}`"
      class="chip"
      :class="{ on: current === tag.slug }"
      :aria-current="current === tag.slug ? 'page' : undefined"
    >
      #{{ tag.slug }} · {{ tag.count }}
    </NuxtLink>
  </nav>
</template>

<style scoped>
.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 40px;
  font-family: var(--font-mono);
  font-size: 13px;
}

.chip {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  color: var(--text-soft);
  text-decoration: none;
}

.chip:hover {
  color: var(--text);
}

.chip.on {
  border-color: var(--accent-fill);
  background: var(--accent-fill);
  color: var(--on-accent);
}
</style>
