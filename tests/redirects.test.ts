import { describe, expect, it } from 'vitest'
import { toPostSummary } from '../server/utils/content'
import { buildRedirects } from '../server/utils/redirects'
import type { TamablePost } from '../shared/types/tamable'
import posts from './fixtures/tamable/posts.json'

const summaries = posts.data.map(post => toPostSummary(post as TamablePost))

describe('the redirect map', () => {
  it('sends Ghost post addresses to /blog', () => {
    const map = buildRedirects({ posts: summaries, renamed: [] })

    expect(map['/product-based-companies-vs-service-based-companies']).toBe('/blog/product-based-companies-vs-service-based-companies')
    expect(map['/the-current-state-of-the-developer-job-market-q4-2024']).toBe('/blog/the-current-state-of-the-developer-job-market-q4-2024')
  })

  it('sends Ghost tag, author and feed addresses to their new homes', () => {
    const map = buildRedirects({ posts: summaries, renamed: [] })

    expect(map['/tag/work']).toBe('/tags/work')
    expect(map['/tag/job-market']).toBe('/tags/job-market')
    expect(map['/rss']).toBe('/rss.xml')
    expect(map['/feed']).toBe('/rss.xml')
    expect(map['/author/mariobalca']).toBe('/about')
  })

  it('includes posts renamed in Tamable', () => {
    const map = buildRedirects({ posts: summaries, renamed: [{ from: '/blog/product-vs-service', to: '/blog/product-based-companies-vs-service-based-companies' }] })

    expect(map['/blog/product-vs-service']).toBe('/blog/product-based-companies-vs-service-based-companies')
  })

  it('resolves chains to one hop, so a post renamed twice still lands in one redirect', () => {
    const map = buildRedirects({
      posts: summaries,
      renamed: [
        { from: '/blog/first-name', to: '/blog/second-name' },
        { from: '/blog/second-name', to: '/blog/product-based-companies-vs-service-based-companies' },
      ],
    })

    expect(map['/blog/first-name']).toBe('/blog/product-based-companies-vs-service-based-companies')
    expect(map['/blog/second-name']).toBe('/blog/product-based-companies-vs-service-based-companies')
  })

  it('drops redirects that loop', () => {
    const map = buildRedirects({ posts: [], renamed: [{ from: '/blog/a', to: '/blog/b' }, { from: '/blog/b', to: '/blog/a' }] })

    expect(map).not.toHaveProperty('/blog/a')
    expect(map).not.toHaveProperty('/blog/b')
  })

  it('never takes over a live page, even when a post or an old slug shares its address', () => {
    const about = { ...summaries[0]!, slug: 'about', path: '/blog/about' }
    const map = buildRedirects({
      posts: [...summaries, about],
      renamed: [{ from: '/blog/product-based-companies-vs-service-based-companies', to: '/blog/about' }],
    })

    expect(map).not.toHaveProperty('/about')
    expect(map).not.toHaveProperty('/blog/product-based-companies-vs-service-based-companies')
    expect(Object.keys(map).every(from => !from.startsWith('/series') && !from.startsWith('/preview'))).toBe(true)
  })

  it('points every redirect at a page that exists, not at another redirect', () => {
    const map = buildRedirects({ posts: summaries, renamed: [{ from: '/blog/old', to: '/blog/product-based-companies-vs-service-based-companies' }] })

    for (const to of Object.values(map)) expect(map).not.toHaveProperty(to)
  })
})
