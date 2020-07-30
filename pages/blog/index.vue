<template>
  <div>
    <Hero
      copy="Some thoughts, code snippets and random stuff"
      :image="require('~/assets/img/blog.svg')"
      class="md:mb-20"
    />
    <div class="w-full md:w-8/12 mx-auto mt-8">
      <div v-for="post in posts" :key="post.slug" class="mb-8">
        <nuxt-link :to="`/blog/${post.slug}`" class="font-semibold text-xl">{{ post.title }}</nuxt-link>
        <div class="text-gray-600">
          {{ post.date }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    async asyncData({ $content, params }) {
      const posts = await $content("blog").sortBy('date', 'desc').fetch()
      return { posts }
    }
  }
</script>
