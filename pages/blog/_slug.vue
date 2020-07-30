<template>
  <div class="post w-full md:w-8/12 mx-auto mt-8">
    <div class="post-title">
      <h1 class="text-4xl font-semibold">{{ post.title }}</h1>
      <div class="text-grey">{{ post.date }}</div>
      <nuxt-content :document="post" class="mt-8" />
    </div>
  </div>
</template>

<script>
  export default {
    async asyncData({ $content, params }) {
      const post = await $content(`/blog/${params.slug}` || 'index').fetch()
      return { post }
    }
  }
</script>
