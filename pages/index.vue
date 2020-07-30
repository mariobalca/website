<template>
  <div>
    <Hero
      copy="Full stack web developer, passionate about front-end web development, music and entrepreneurship"
      :image="require('~/assets/img/home.svg')"
      class="md:mt-16 md:mb-24"
    />
    <div class="mt-8">
      <h6 class="section-header">Latest Posts</h6>
      <div class="flex flex-wrap -mx-2">
        <div v-for="post in posts" :key="post.slug" class="w-full md:w-1/3 mx-2 mb-4">
          <nuxt-link :to="`/blog/${post.slug}`" class="font-semibold block">
            {{ post.title }}
          </nuxt-link>
          <span class="text-sm text-gray-600">{{ moment(post.date) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    async asyncData({ $content, params }) {
      const posts = await $content("blog").sortBy('date', 'desc').fetch()
      return { posts }
    },
    methods: {
      moment(date) {
        return moment(date).format("MMM Do, YYYY");
      }
    }
  }
</script>

