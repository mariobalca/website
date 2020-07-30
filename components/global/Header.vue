<template>
  <div class="flex justify-between h-16 md:h-24 items-center">
    <nuxt-link to="/" class="text-2xl font-semibold">mariobalca</nuxt-link>
    <div>
      <div class="hidden md:block">
        <Nav />
      </div>
      <div class="md:hidden">
        <button class="p-2 bg-transparent border-none outline-none" @click="mobileMenuVisible = true">
          <i class="ri-menu-line ri-xl flex"></i>
        </button>
        <div class="fixed inset-0 bg-white flex flex-col items-center justify-center" v-if="mobileMenuVisible">
          <Nav @linkClick="mobileMenuVisible = false"/>
          <button class="p-2 bg-transparent fixed top-0 right-0 mt-4 mr-4 border-none outline-none" @click="mobileMenuVisible = false">
            <i class="ri-close-line ri-xl flex"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        mobileMenuVisible: false
      }
    }
  }
</script>
