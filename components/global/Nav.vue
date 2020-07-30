<template>
  <div class="nav">
    <nuxt-link @click="$emit('linkClick')" to="/" class="my-4 text-center md:my-0 md:text-left">Home</nuxt-link>
    <nuxt-link @click="$emit('linkClick')" to="/about" class="my-4 text-center md:my-0 md:text-left md:ml-4">About</nuxt-link>
    <nuxt-link @click="$emit('linkClick')" to="/work" class="my-4 text-center md:my-0 md:text-left md:ml-4">Work</nuxt-link>
    <nuxt-link @click="$emit('linkClick')" to="/blog" class="my-4 text-center md:my-0 md:text-left md:ml-4">Blog</nuxt-link>
  </div>
</template>

<style lang="scss">
  .nav {
    @apply flex flex-col text-lg;
    .nuxt-link-active.nuxt-link-exact-active {
      @apply font-bold;
    }
    @screen md {
      @apply flex-row;
    }
  }
</style>
