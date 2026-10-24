<script setup lang="ts">
type Theme = 'light' | 'dark'

const theme = ref<Theme>('dark')

function current(): Theme {
  const chosen = document.documentElement.dataset.theme
  if (chosen === 'light' || chosen === 'dark') return chosen
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

onMounted(() => {
  theme.value = current()
})

function toggle() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = theme.value
  try {
    localStorage.setItem('theme', theme.value)
  }
  catch {
    // Private windows may refuse storage; the choice still holds until reload.
  }
}
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggle"
  >
    <svg class="sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
    <svg class="moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text-soft);
  cursor: pointer;
}

.theme-toggle:hover {
  color: var(--text);
  border-color: var(--border-strong);
}

/* The icon shows the theme a click switches to, decided by CSS so it is right before hydration.
   Whole selectors go in :global(), since Vue drops whatever follows a :global() part. */
.moon {
  display: none;
}

:global(:root[data-theme='light'] .theme-toggle .sun) {
  display: none;
}

:global(:root[data-theme='light'] .theme-toggle .moon) {
  display: block;
}

@media (prefers-color-scheme: light) {
  :global(:root:not([data-theme='dark']) .theme-toggle .sun) {
    display: none;
  }

  :global(:root:not([data-theme='dark']) .theme-toggle .moon) {
    display: block;
  }
}
</style>
