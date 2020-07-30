<template>
  <div class="flex flex-wrap items-center justify-between md:flex-row-reverse">
    <div class="w-full md:w-5/12 my-4" v-if="image">
      <img :src="image" alt="illustration">
    </div>
    <div class="w-full md:w-1/2 my-4">
      <h1 class="text-3xl md:text-4xl">{{ copy }}</h1>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      copy: {
        type: String,
        default: 'Lorem ipsum'
      },
      image: {
        type: String,
        default: null
      }
    }
  }
</script>
