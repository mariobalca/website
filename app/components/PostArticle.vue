<script setup lang="ts">
import type { PostPage } from '#shared/types/content'
import { isoDay } from '#shared/utils/dates'

defineProps<{ post: PostPage, preview?: boolean }>()

const content = ref<HTMLElement>()

// X's script turns the fallback blockquotes into embeds; it only loads on posts that have one.
onMounted(() => {
  const quotes = content.value?.querySelectorAll<HTMLElement>('blockquote.twitter-tweet') ?? []
  if (!quotes.length) return
  const light = document.documentElement.dataset.theme === 'light'
    || (!document.documentElement.dataset.theme && window.matchMedia('(prefers-color-scheme: light)').matches)
  quotes.forEach((quote) => {
    quote.dataset.theme = light ? 'light' : 'dark'
    quote.dataset.dnt = 'true'
  })
  const script = document.createElement('script')
  script.src = 'https://platform.twitter.com/widgets.js'
  script.async = true
  document.body.appendChild(script)
})
</script>

<template>
  <article class="post container-reading">
    <p class="meta">
      <time v-if="post.publishedAt" :datetime="post.publishedAt">{{ isoDay(post.publishedAt) }}</time>
      <span v-else-if="preview">not published yet</span>
      <span> · {{ post.readingMinutes }} min</span>
      <template v-for="tag in post.tags" :key="tag.slug">
        <span> · </span><NuxtLink :to="`/tags/${tag.slug}`">#{{ tag.slug }}</NuxtLink>
      </template>
    </p>
    <h1 class="title">
      {{ post.title }}
    </h1>
    <p v-if="post.excerpt" class="lead">
      {{ post.excerpt }}
    </p>
    <figure v-if="post.cover" class="cover">
      <img :src="post.cover.url" :alt="post.cover.alt" :width="post.cover.width ?? undefined" :height="post.cover.height ?? undefined" fetchpriority="high">
    </figure>
    <!-- Tamable's HTML goes through its own schema and is served as published. -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div ref="content" class="prose" v-html="post.html" />
    <SeriesNav v-if="post.seriesNav" :nav="post.seriesNav" />
  </article>
</template>

<style scoped>
.post {
  padding-block: 80px 96px;
}

.meta {
  margin: 0 0 20px;
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--muted);
}

.meta a {
  text-decoration: none;
}

.title {
  margin: 0 0 20px;
  font-size: clamp(34px, 6vw, 46px);
  line-height: 1.1;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--text);
}

.lead {
  margin: 0 0 56px;
  font-size: 21px;
  line-height: 1.55;
  color: var(--text-soft);
}

.cover {
  margin: 0 0 48px;
}

.cover img {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
</style>
