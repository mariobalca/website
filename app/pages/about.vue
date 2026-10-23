<script setup lang="ts">
useSeoMeta({
  title: 'About me',
  description: 'I\'m Mário Balça, a Full Stack Developer passionate about music, entrepreneurship, and building great products.',
})
</script>

<template>
  <div class="container about">
    <div class="main">
      <p class="prompt">
        $ whoami
      </p>
      <h1 class="page-title">
        About me
      </h1>
      <div class="prose">
        <p class="lead">
          Hey there 👋 I'm Mário Balça, a Full Stack Developer passionate about music, entrepreneurship, and building great products.
        </p>
        <p>I believe that people and human beings should always come first, and I tend to work with companies that feel the same way.</p>
        <p>Throughout my career, I've been mostly working with startups, and I was lucky enough to be part of amazing teams with really talented people who taught me a lot about Software Development and how to build SaaS businesses in general.</p>
        <p>In March 2024 I decided to start my own product (for the 4th time) called <a href="https://tamable.app">Tamable</a>.</p>
        <h2>What can you expect from this blog?</h2>
        <p>That's actually a great question! I <em>think</em> it will be mostly my thoughts and experiences about being a Full Stack Developer and building <a href="https://tamable.app">Tamable</a>, but there's a chance there will be a bit more than that.</p>
        <p>Maybe I'll share some Laravel/Vue.js tips &amp; tricks along the way, or even proper courses/tutorials to help others build their own products from scratch... Either way, stay tuned and let's discover together where this adventure will lead us!</p>
      </div>
    </div>

    <aside aria-label="Elsewhere" class="elsewhere">
      <p class="label">
        // elsewhere
      </p>
      <ul>
        <li><a href="https://x.com/mariobalca">x.com/mariobalca</a></li>
        <li><a href="https://github.com/mariobalca">github.com/mariobalca</a></li>
        <li><a href="mailto:hello@mariobalca.com">hello@mariobalca.com</a></li>
        <li><a href="/rss.xml">/rss.xml</a></li>
      </ul>
    </aside>
  </div>
</template>

<style scoped>
.about {
  display: flex;
  flex-wrap: wrap;
  gap: 48px 64px;
  padding-block: 72px 96px;
}

.main {
  flex: 999 1 480px;
  min-width: 0;
}

.page-title {
  margin-bottom: 32px;
}

.lead {
  font-size: 22px;
  line-height: 1.6;
  color: var(--text);
}

.elsewhere {
  flex: 1 1 220px;
  align-self: flex-start;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  font-family: var(--font-mono);
  font-size: 14px;
}

.label {
  margin: 0 0 12px;
  color: var(--muted);
}

ul {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

li a {
  display: flex;
  align-items: center;
  min-height: 40px;
  overflow-wrap: anywhere;
  text-decoration: none;
}
</style>
