<script setup lang="ts">
import type { PostSummary } from '#shared/types/content'
import { isoDay, monthDay, year } from '#shared/utils/dates'

const props = defineProps<{
  posts: PostSummary[]
  byYear?: boolean
  showTags?: boolean
}>()

const groups = computed(() => {
  if (!props.byYear) return [{ year: '', posts: props.posts }]
  const byYear = new Map<string, PostSummary[]>()
  for (const post of props.posts) {
    const key = post.publishedAt ? year(post.publishedAt) : ''
    byYear.set(key, [...(byYear.get(key) ?? []), post])
  }
  return [...byYear].map(([year, posts]) => ({ year, posts }))
})

function date(post: PostSummary) {
  if (!post.publishedAt) return ''
  return props.byYear ? monthDay(post.publishedAt) : isoDay(post.publishedAt)
}
</script>

<template>
  <div class="post-list">
    <section v-for="group in groups" :key="group.year" :aria-label="group.year || undefined">
      <h2 v-if="group.year" class="year">
        {{ group.year }}
      </h2>
      <div class="rows">
        <article v-for="post in group.posts" :key="post.slug" class="row">
          <p class="when">
            <time v-if="post.publishedAt" :datetime="post.publishedAt">{{ date(post) }}</time>
            <template v-if="post.readingMinutes">
              <br>{{ post.readingMinutes }} min
            </template>
          </p>
          <div class="what">
            <h3 class="title">
              <NuxtLink :to="post.path">
                {{ post.title }}
              </NuxtLink>
            </h3>
            <p v-if="post.excerpt" class="excerpt">
              {{ post.excerpt }}
            </p>
            <p v-if="showTags && post.tags.length" class="tags">
              <NuxtLink v-for="tag in post.tags" :key="tag.slug" :to="`/tags/${tag.slug}`">
                #{{ tag.slug }}
              </NuxtLink>
            </p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.year {
  margin: 0 0 4px;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
}

.rows {
  border-top: 1px solid var(--border);
}

section + section {
  margin-top: 40px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  column-gap: 40px;
  row-gap: 8px;
  padding-block: 28px;
  border-bottom: 1px solid var(--border);
}

.when {
  flex: 0 0 120px;
  margin: 4px 0 0;
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--muted);
}

.what {
  flex: 999 1 400px;
  min-width: 0;
}

.title {
  margin: 0 0 8px;
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

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 10px 0 0;
  font-family: var(--font-mono);
  font-size: 13px;
}

.tags a {
  text-decoration: none;
}
</style>
