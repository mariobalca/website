<script setup lang="ts">
const { data: posts } = await usePosts()
const { data: series } = await useSeriesList()
const latest = computed(() => posts.value.slice(0, 5))

useSeoMeta({
  title: null,
  description: 'Thoughts and experiences about being a first-time dad, and building my own startup at the same time.',
})
</script>

<template>
  <div class="container">
    <section class="hero">
      <p class="prompt">
        Mário Balça · developer, founder, first-time dad
      </p>
      <h1 class="hello">
        Hello, I'm Mário.
      </h1>
      <p class="intro">
        This is where I share my thoughts and experiences about being a first-time dad, and building my own startup at the same time.
      </p>
    </section>

    <section aria-labelledby="latest" class="latest">
      <h2 id="latest" class="prompt">
        $ ls posts --latest
      </h2>
      <PostList :posts="latest" />
      <NuxtLink to="/blog" class="all">
        all posts →
      </NuxtLink>
    </section>

    <section v-if="series.length" aria-labelledby="series" class="series">
      <h2 id="series" class="prompt">
        $ ls series
      </h2>
      <div class="cards">
        <SeriesCard v-for="item in series" :key="item.slug" :series="item" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  padding-block: 96px 80px;
}

.prompt {
  margin-bottom: 20px;
}

.hello {
  margin: 0 0 24px;
  font-size: clamp(40px, 8vw, 56px);
  line-height: 1.05;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.intro {
  margin: 0;
  max-width: 640px;
  font-size: 22px;
  line-height: 1.55;
  color: var(--text-soft);
}

.latest {
  padding-bottom: 96px;
}

.latest .prompt {
  margin-bottom: 8px;
  font-weight: 500;
}

.series {
  padding-bottom: 96px;
}

.series .prompt {
  margin-bottom: 20px;
  font-weight: 500;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.all {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  margin-top: 16px;
  font-family: var(--font-mono);
  font-size: 14px;
}
</style>
