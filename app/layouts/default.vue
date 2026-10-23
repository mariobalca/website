<template>
  <div class="layout">
    <a href="#main" class="skip-link">Skip to content</a>
    <SiteHeader />
    <main id="main" class="main">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
}
</style>
