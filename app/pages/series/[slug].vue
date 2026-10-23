<script setup lang="ts">
import { isoDay } from '#shared/utils/dates'

const route = useRoute()
const slug = String(route.params.slug)
const { data: series } = await useSeries(slug)

if (!series.value) {
  throw createError({ statusCode: 404, statusMessage: 'Series not found', fatal: true })
}

const s = series.value
const dates = s.posts.map(post => post.publishedAt).filter((date): date is string => Boolean(date)).sort()

useSeoMeta({
  title: s.title,
  description: s.description ?? `${s.posts.length} posts in order.`,
})
</script>

<template>
  <div class="container listing">
    <p class="prompt">
      <NuxtLink to="/series" class="crumb">series</NuxtLink> / {{ s.slug }}
    </p>
    <h1 class="page-title">
      {{ s.title }}
    </h1>
    <p v-if="s.description" class="description">
      {{ s.description }}
    </p>
    <p class="facts">
      {{ s.posts.length }} {{ s.posts.length === 1 ? 'part' : 'parts' }}<template v-if="dates.length">
        · started {{ isoDay(dates[0]!) }}<template v-if="dates.length > 1">
          · latest {{ isoDay(dates[dates.length - 1]!) }}
        </template>
      </template>
    </p>

    <ol class="parts">
      <li v-for="post in s.posts" :key="post.slug" class="part">
        <span class="dot" aria-hidden="true" />
        <p class="when">
          #{{ post.series?.number }}<template v-if="post.publishedAt">
            · {{ isoDay(post.publishedAt) }}
          </template><template v-if="post.readingMinutes">
            · {{ post.readingMinutes }} min
          </template>
        </p>
        <h2 class="title">
          <NuxtLink :to="post.path">
            {{ post.title }}
          </NuxtLink>
        </h2>
        <p v-if="post.excerpt" class="excerpt">
          {{ post.excerpt }}
        </p>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.listing {
  padding-block: 72px 96px;
}

.crumb {
  color: var(--muted);
}

.description {
  margin: 0 0 16px;
  max-width: 640px;
  font-size: 20px;
  line-height: 1.55;
  color: var(--text-soft);
}

.facts {
  margin: 0 0 48px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted);
}

.parts {
  margin: 0;
  padding: 0;
  list-style: none;
  border-left: 1px solid var(--border-strong);
}

.part {
  position: relative;
  padding: 0 0 32px 36px;
}

.part:last-child {
  padding-bottom: 0;
}

.dot {
  position: absolute;
  left: -6px;
  top: 6px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--accent-fill);
}

.when {
  margin: 0 0 6px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted);
}

.title {
  margin: 0 0 6px;
  font-size: 22px;
  line-height: 1.3;
  font-weight: 600;
}

.title a {
  color: var(--text);
  text-decoration: none;
}

.title a:hover {
  color: var(--link);
}

.excerpt {
  margin: 0;
  font-size: 17px;
  line-height: 1.55;
  color: var(--text-soft);
}
</style>
