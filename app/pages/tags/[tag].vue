<script setup lang="ts">
const route = useRoute()
const slug = String(route.params.tag)
const { data: posts } = await usePosts()

const tags = computed(() => tagCounts(posts.value))
const tag = computed(() => tags.value.find(t => t.slug === slug))
const tagged = computed(() => posts.value.filter(post => post.tags.some(t => t.slug === slug)))

if (!tag.value) {
  throw createError({ statusCode: 404, statusMessage: 'Tag not found', fatal: true })
}

useSeoMeta({
  title: `#${slug}`,
  description: `Posts tagged ${tag.value.name}.`,
})
</script>

<template>
  <div class="container listing">
    <p class="prompt">
      $ ls posts --tag {{ slug }}
    </p>
    <h1 class="page-title">
      <span class="hash">#</span>{{ slug }}
    </h1>
    <p class="count">
      {{ tagged.length }} {{ tagged.length === 1 ? 'post' : 'posts' }} tagged {{ tag?.name }}.
    </p>
    <TagFilter :tags="tags" :total="posts.length" :current="slug" />
    <PostList :posts="tagged" by-year show-tags />
  </div>
</template>

<style scoped>
.listing {
  padding-block: 72px 96px;
}

.page-title {
  margin-bottom: 12px;
}

.hash {
  color: var(--link);
}

.count {
  margin: 0 0 28px;
  font-size: 18px;
  color: var(--text-soft);
}
</style>
