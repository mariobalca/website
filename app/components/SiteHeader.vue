<script setup lang="ts">
const route = useRoute()

const links = [
  { label: 'blog', to: '/blog', sections: ['/blog', '/tags'] },
  { label: 'series', to: '/series', sections: ['/series'] },
  { label: 'about', to: '/about', sections: ['/about'] },
  { label: 'mentorship', to: '/mentorship', sections: ['/mentorship'] },
]

function isCurrent(sections: string[]) {
  return sections.some(section => route.path === section || route.path.startsWith(`${section}/`))
}
</script>

<template>
  <header class="site-header container">
    <NuxtLink to="/" class="home">
      <span class="tilde">~/</span>mariobalca
    </NuxtLink>
    <nav aria-label="Main" class="nav">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="nav-link"
        :class="{ current: isCurrent(link.sections) }"
        :aria-current="isCurrent(link.sections) ? 'page' : undefined"
      >
        {{ link.label }}
      </NuxtLink>
      <ThemeToggle />
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-block: 32px;
  border-bottom: 1px solid var(--border);
}

.home {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 500;
  color: var(--text);
  text-decoration: none;
}

.tilde {
  color: var(--link);
}

.nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 14px;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 12px;
  color: var(--text-soft);
  text-decoration: none;
}

.nav-link:hover {
  color: var(--text);
}

.nav-link.current {
  color: var(--link);
}
</style>
