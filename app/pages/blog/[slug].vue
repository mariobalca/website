<script setup lang="ts">
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
</script>

<template>
  <PostArticle :post="p" />
</template>
