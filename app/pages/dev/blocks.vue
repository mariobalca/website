<script setup lang="ts">
// Every block Tamable can serve, for checking the post styles. Left out of production builds.
import fixture from '../../../tests/fixtures/tamable/posts/product-based-companies-vs-service-based-companies.json'

useSeoMeta({ title: 'Blocks', robots: 'noindex' })
const html = `<p>Inline: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike</s>, <mark>highlight</mark>, <code>inline code</code>.</p><ul><li><p>One</p></li><li><p>Two</p></li></ul><ol start="3"><li><p>Three</p></li></ol><hr>${fixture.data.html}`
</script>

<template>
  <article class="container-reading" style="padding-block: 64px">
    <h1 class="page-title">
      Blocks
    </h1>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="prose" v-html="html" />
  </article>
</template>
