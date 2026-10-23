<script setup lang="ts">
const siteUrl = useRuntimeConfig().public.siteUrl
const route = useRoute()

useHead({
  titleTemplate: title => (title ? `${title} · Mário Balça` : 'Mário Balça'),
  link: [
    { rel: 'alternate', type: 'application/rss+xml', title: 'Mário Balça', href: `${siteUrl}/rss.xml` },
    { rel: 'canonical', href: () => `${siteUrl}${route.path === '/' ? '' : route.path}` },
  ],
})

useSeoMeta({
  ogSiteName: 'Mário Balça',
  ogType: 'website',
  ogUrl: () => `${siteUrl}${route.path === '/' ? '' : route.path}`,
  twitterSite: '@mariobalca',
  twitterCreator: '@mariobalca',
  twitterCard: 'summary',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
