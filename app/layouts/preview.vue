<template>
  <div class="layout">
    <div role="status" class="banner">
      <div class="container inner">
        <span>PREVIEW · draft, not published · not indexed</span>
        <span>Edits in Tamable show on reload</span>
      </div>
    </div>
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

.banner {
  background: var(--accent-fill);
  color: var(--on-accent);
}

.inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 24px;
  padding-block: 12px;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
}
</style>
