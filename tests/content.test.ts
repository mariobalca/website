import { describe, expect, it } from 'vitest'
import { readingMinutes, redirectPaths, toPost, toPostSummary, toSeriesSummary } from '../server/utils/content'
import { slugify } from '../shared/utils/slug'
import type { TamablePost } from '../shared/types/tamable'
import posts from './fixtures/tamable/posts.json'
import post from './fixtures/tamable/post.json'
import series from './fixtures/tamable/series.json'

describe('mapping Tamable to the site', () => {
  it('gives a post its site path, tags with slugs and its SEO fields', () => {
    const mapped = toPost(post.data as TamablePost)

    expect(mapped.path).toBe('/blog/product-based-companies-vs-service-based-companies')
    expect(mapped.tags).toEqual([{ name: 'Work', slug: 'work' }])
    expect(mapped.seo).toEqual({
      title: 'Product-based companies vs service-based companies',
      description: 'My thoughts and experiences about working for both types of companies and why I prefer one compared to another.',
      canonicalUrl: 'https://mariobalca.com/blog/product-based-companies-vs-service-based-companies',
    })
    expect(mapped.html).toContain('<figcaption>Hours per project</figcaption>')
  })

  it('falls back to the title and excerpt when SEO fields are empty, and to the title for cover alt text', () => {
    const bare = { ...post.data, seo: { title: null, description: null, canonical_url: null }, cover: { url: 'https://cdn/x.png', description: null, width: 1600, height: 900 } } as TamablePost

    const mapped = toPost(bare)

    expect(mapped.seo.title).toBe(bare.title)
    expect(mapped.seo.description).toBe(bare.excerpt)
    expect(mapped.cover).toEqual({ url: 'https://cdn/x.png', alt: bare.title, width: 1600, height: 900 })
  })

  it('maps a draft with no title or slug yet, as a preview serves it', () => {
    const draft = { ...post.data, title: null, slug: null, url: null, published_at: null } as TamablePost

    expect(toPostSummary(draft)).toMatchObject({ title: 'Untitled draft', slug: '', path: '', publishedAt: null })
  })

  it('slugs tag names the way the tag pages are addressed', () => {
    expect(toPostSummary(posts.data[0] as TamablePost).tags).toEqual([
      { name: 'Job Market', slug: 'job-market' },
      { name: 'Work', slug: 'work' },
    ])
    expect(slugify('Ação & Reação: 2024!')).toBe('acao-reacao-2024')
  })

  it('counts reading time from the text, at least a minute', () => {
    expect(readingMinutes('<p>short</p>')).toBe(1)
    expect(readingMinutes(`<p>${'word '.repeat(1100)}</p>`)).toBe(5)
  })

  it('maps series summaries', () => {
    expect(toSeriesSummary(series.data[0]!)).toEqual({ slug: 'building-tamable', title: 'Building Tamable', description: 'Notes from building Tamable.', postCount: 2 })
  })
})

describe('Tamable redirects as site paths', () => {
  it('turns full URLs into paths on the site, with or without www', () => {
    expect(redirectPaths([
      { from: 'https://mariobalca.com/blog/old/', to: 'https://www.mariobalca.com/blog/new' },
    ], 'https://mariobalca.com')).toEqual([{ from: '/blog/old', to: '/blog/new' }])
  })

  it('drops redirects to another host and ones that point at themselves', () => {
    expect(redirectPaths([
      { from: 'https://mariobalca.com/blog/a', to: 'https://elsewhere.com/blog/a' },
      { from: 'https://mariobalca.com/blog/same/', to: 'https://mariobalca.com/blog/same' },
    ], 'https://mariobalca.com')).toEqual([])
  })
})
