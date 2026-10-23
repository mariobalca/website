import { describe, expect, it } from 'vitest'
import { toPost } from '../server/utils/content'
import { escapeXml, rssXml, sitemapEntries, sitemapXml } from '../server/utils/feeds'
import type { TamablePost } from '../shared/types/tamable'
import product from './fixtures/tamable/posts/product-based-companies-vs-service-based-companies.json'
import market from './fixtures/tamable/posts/the-current-state-of-the-developer-job-market-q4-2024.json'

const posts = [toPost(market.data as TamablePost), toPost(product.data as TamablePost)]
const site = 'https://mariobalca.com'

describe('the RSS feed', () => {
  const xml = rssXml(posts, site)

  it('lists posts newest first with their links, dates, tags and full body', () => {
    expect(xml.indexOf('the-current-state')).toBeLessThan(xml.indexOf('product-based'))
    expect(xml).toContain('<link>https://mariobalca.com/blog/product-based-companies-vs-service-based-companies</link>')
    expect(xml).toContain('<pubDate>Thu, 07 Mar 2024 09:00:00 GMT</pubDate>')
    expect(xml).toContain('<category>Job Market</category>')
    expect(xml).toContain('<content:encoded><![CDATA[<blockquote>')
    expect(xml).toContain('<atom:link href="https://mariobalca.com/rss.xml" rel="self" type="application/rss+xml"/>')
  })

  it('escapes titles and keeps a body holding "]]>" inside its CDATA', () => {
    const tricky = { ...posts[0]!, title: 'Q&A <live>', html: '<p>a ]]> b</p>' }
    const out = rssXml([tricky], site)

    expect(out).toContain('<title>Q&amp;A &lt;live&gt;</title>')
    expect(out).toContain('<![CDATA[<p>a ]]]]><![CDATA[> b</p>]]>')
  })

  it('escapes every XML special character', () => {
    expect(escapeXml(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&apos;&amp;&apos;&lt;/a&gt;')
  })
})

describe('the sitemap', () => {
  it('lists the pages, every post with its last update, tags and series', () => {
    const entries = sitemapEntries(['/', '/blog'], posts, [{ slug: 'building-tamable', title: 'Building Tamable', description: null, postCount: 1 }])
    const xml = sitemapXml(entries, site)

    expect(xml).toContain('<loc>https://mariobalca.com</loc>')
    expect(xml).toContain('<loc>https://mariobalca.com/blog/product-based-companies-vs-service-based-companies</loc>\n    <lastmod>2024-09-17T11:14:06+00:00</lastmod>')
    expect(xml).toContain('<loc>https://mariobalca.com/tags/job-market</loc>')
    expect(xml).toContain('<loc>https://mariobalca.com/series/building-tamable</loc>')
    expect(xml.match(/<url>/g)).toHaveLength(2 + 2 + 2 + 1)
  })
})
