<script setup lang="ts">
const { data: posts } = await usePosts()
const tags = computed(() => tagCounts(posts.value))

useSeoMeta({
  title: 'Blog',
  description: 'Everything I have written, newest first.',
})
</script>

<template>
  <div class="container listing">
    <p class="prompt">
      $ ls posts
    </p>
    <h1 class="page-title">
      Blog
    </h1>
    <TagFilter :tags="tags" :total="posts.length" />
    <PostList :posts="posts" by-year show-tags />
  </div>
</template>

<style scoped>
.listing {
  padding-block: 72px 96px;
}

.page-title {
  margin-bottom: 28px;
}
</style>
