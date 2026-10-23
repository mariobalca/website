<template>
  <footer class="site-footer">
    <div class="container inner">
      <span>© {{ new Date().getFullYear() }} Mário Balça</span>
      <span class="links">
        <a href="/rss.xml">rss</a>
        <a href="https://x.com/mariobalca">x</a>
        <a href="mailto:hello@mariobalca.com">email</a>
      </span>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--border);
}

.inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  padding-block: 28px 40px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted);
}

.links {
  display: flex;
  gap: 20px;
}
</style>
