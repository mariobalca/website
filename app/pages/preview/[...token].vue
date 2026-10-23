<script setup lang="ts">
import type { PostPage } from '#shared/types/content'

definePageMeta({ layout: 'preview' })

// Read from the raw path: a token can hold an encoded "/", which route params would split on.
const raw = useRequestURL().pathname.replace(/^\/preview\/?/, '')
const token = raw ? decodeURIComponent(raw) : String(useRoute().query.token ?? '')

const { data: post } = await useFetch<PostPage>('/api/preview', {
  query: { token },
  key: `preview:${token}`,
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'This preview link has expired', fatal: true })
}

useSeoMeta({
  title: `Preview: ${post.value.title}`,
  robots: 'noindex, nofollow',
})
</script>

<template>
  <PostArticle v-if="post" :post="post" preview />
</template>
