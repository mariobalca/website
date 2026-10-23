<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const route = useRoute()
const expired = computed(() => props.error.statusCode === 404 && route.path.startsWith('/preview'))
const missing = computed(() => props.error.statusCode === 404 && !expired.value)

useSeoMeta({
  title: expired.value ? 'Preview expired' : missing.value ? 'Not found' : 'Something went wrong',
  robots: 'noindex',
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="container error">
      <section class="card">
        <p class="prompt">
          <template v-if="expired">
            $ open /preview/…<br><span class="code">404: link expired</span>
          </template>
          <template v-else-if="missing">
            $ cat {{ route.path }}<br><span class="code">404: no such page</span>
          </template>
          <template v-else>
            $ cat {{ route.path }}<br><span class="code">{{ error.statusCode }}: something broke</span>
          </template>
        </p>
        <h1 class="title">
          {{ expired ? 'This preview link has expired' : missing ? 'This page doesn\'t exist' : 'Something went wrong' }}
        </h1>
        <p class="text">
          {{ expired ? 'Preview links last 24 hours. Open Preview in Tamable again for a fresh one.'
            : missing ? 'It may have moved, or the link has a typo.'
              : 'Try again in a moment.' }}
        </p>
        <p class="links">
          <NuxtLink to="/">
            cd ~
          </NuxtLink>
          <NuxtLink v-if="!expired" to="/blog">
            ls posts
          </NuxtLink>
        </p>
      </section>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.error {
  padding-block: 88px 96px;
}

.card {
  max-width: 560px;
  padding: 32px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}

.prompt {
  margin-bottom: 16px;
  overflow-wrap: anywhere;
}

.code {
  color: var(--link);
}

.title {
  margin: 0 0 14px;
  font-size: 32px;
  line-height: 1.15;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.text {
  margin: 0 0 24px;
  font-size: 17px;
  line-height: 1.6;
  color: var(--text-soft);
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin: 0;
  font-family: var(--font-mono);
  font-size: 14px;
}

.links a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}
</style>
