<script setup lang="ts">
import { isoDay } from '#shared/utils/dates'

const route = useRoute()
const slug = String(route.params.slug)
const { data: post } = await usePost(slug)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const p = post.value
const siteUrl = useRuntimeConfig().public.siteUrl

useSeoMeta({
  title: p.seo.title,
  description: p.seo.description,
  ogType: 'article',
  ogTitle: p.seo.title,
  ogDescription: p.seo.description,
  ogUrl: p.seo.canonicalUrl,
  ogImage: p.cover?.url,
  ogImageAlt: p.cover?.alt,
  ogImageWidth: p.cover?.width ?? undefined,
  ogImageHeight: p.cover?.height ?? undefined,
  twitterCard: p.cover ? 'summary_large_image' : 'summary',
  articlePublishedTime: p.publishedAt,
  articleModifiedTime: p.updatedAt,
  articleTag: p.tags.map(tag => tag.name),
})

useHead({
  link: p.seo.canonicalUrl ? [{ rel: 'canonical', href: p.seo.canonicalUrl }] : [],
  script: [{
    type: 'application/ld+json',
    // `<` escaped so text from a post can never close the script tag.
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': p.title,
      'description': p.seo.description,
      'datePublished': p.publishedAt,
      'dateModified': p.updatedAt,
      'url': p.seo.canonicalUrl,
      'image': p.cover?.url,
      'keywords': p.tags.map(tag => tag.name).join(', ') || undefined,
      'author': { '@type': 'Person', 'name': 'Mário Balça', 'url': siteUrl },
    }).replace(/</g, '\\u003c'),
  }],
})

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
      <time v-if="p.publishedAt" :datetime="p.publishedAt">{{ isoDay(p.publishedAt) }}</time>
      <span> · {{ p.readingMinutes }} min</span>
      <template v-for="tag in p.tags" :key="tag.slug">
        <span> · </span><NuxtLink :to="`/tags/${tag.slug}`">#{{ tag.slug }}</NuxtLink>
      </template>
    </p>
    <h1 class="title">
      {{ p.title }}
    </h1>
    <p v-if="p.excerpt" class="lead">
      {{ p.excerpt }}
    </p>
    <figure v-if="p.cover" class="cover">
      <img :src="p.cover.url" :alt="p.cover.alt" :width="p.cover.width ?? undefined" :height="p.cover.height ?? undefined" fetchpriority="high">
    </figure>
    <!-- Tamable's HTML goes through its own schema and is served as published. -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div ref="content" class="prose" v-html="p.html" />
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
