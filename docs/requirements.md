# mariobalca.com requirements

What the new site does, how it is built and deployed, and how it replaces the Ghost site. Decisions marked open are still to settle.

## Goal

A fast personal site and blog whose posts come from Tamable. I write, review and publish in Tamable. The site only renders what Tamable's read API serves, and rebuilds when Tamable says published content changed. Existing post URLs keep working.

## Decisions

| Topic | Decision |
|---|---|
| Framework | Nuxt, current stable release, TypeScript |
| Content | Posts and series from the Tamable read API. About and mentorship pages as Markdown in this repo |
| Hosting | A new Laravel Forge server, shared with the Sparkling Opinions site. This site is a Forge Nuxt site with zero-downtime deploys |
| Domain | `https://mariobalca.com` is canonical. `www.mariobalca.com` answers with a 301 to it |
| Post URLs | `/blog/{slug}`. Old Ghost URLs `/{slug}/` answer with a 301 |
| Newsletter | Dropped for now. Ghost subscribers are exported before cutover so the list is kept |
| Rendering | Every public page is prerendered at build. Only the preview route and the deploy webhook run on the server |

## Architecture

```
                 publish in Tamable
                        |
                        v
  Tamable --(POST, signed, 60s after the last change)--> mariobalca.com/api/deploy
                                                              | checks X-Tamable-Signature
                                                              v
                                                     Forge deploy hook
                                                              |
                                                              v
                 Forge: npm ci, tests, nuxt build (reads /api/v1), activate release
```

- The build reads everything from `https://api.tamable.app/api/v1` with the read key and prerenders it. Visitors never reach Tamable, so the site stays up when Tamable is down.
- Forge builds each release in its own folder and switches to it only when every step passed. A failed build leaves the live site as it was.
- The preview route fetches the draft at request time, server side.
- The read key lives only in server-side code and in the Forge environment, never in browser code or in the repo. The repo is public.

### Environment

| Variable | Used by |
|---|---|
| `TAMABLE_API_URL` | Build and preview route (`https://api.tamable.app/api/v1`) |
| `TAMABLE_READ_KEY` | Build and preview route. Created in Tamable's Settings › Sites |
| `TAMABLE_WEBHOOK_SECRET` | `/api/deploy`, to check the signature. Tamable's "Signing secret" |
| `FORGE_DEPLOY_HOOK_URL` | `/api/deploy` and the nightly rebuild |

They live in the Forge site's `.env`, which Forge shares across releases. CI never gets the read key. It builds against recorded fixtures.

## Routes

| Route | Source | Notes |
|---|---|---|
| `/` | Intro and latest posts | |
| `/blog` | `GET /posts`, every page | Paginated if it grows past one page |
| `/blog/{slug}` | `GET /posts/{slug}` | Prerendered for every post |
| `/series` | `GET /series` | Only series with published posts |
| `/series/{slug}` | `GET /series/{slug}` | Posts in order, with their numbers |
| `/about`, `/mentorship` | Markdown in `content/` | Moved from Ghost |
| `/preview/{token}` | `GET /preview/{token}` | Server-rendered on each request, see Preview |
| `/rss.xml` | Same data as `/blog` | Full content, newest 20 |
| `/sitemap.xml` | Same data | Pages, posts and series, with `lastmod` from `updated_at` |
| `/robots.txt` | Static | Disallows `/preview/` and `/api/` |
| `/api/deploy` | Tamable webhook | `POST` only |
| Anything else | | Custom 404 page with a 404 status |

## Redirects

All are permanent (301). They are generated at build time, so a build is the only thing that changes them.

| From | To | Why |
|---|---|---|
| `https://www.mariobalca.com/*` | `https://mariobalca.com/*` | Canonical host, in nginx |
| `/{slug}/` for each post | `/blog/{slug}` | Ghost's post URLs |
| `/rss/` | `/rss.xml` | Ghost's feed URL, so feed readers follow |
| `/tag/{tag}/` | `/blog` | Ghost tag archives (see Open questions) |
| `/author/mariobalca/` | `/about` | Ghost author page |
| Every `{from, to}` in `GET /redirects` | its `to` | Posts renamed in Tamable |
| An old slug the API answers with a `301` | the new `/blog/{slug}` | Safety net for a rename between two builds |

Trailing slashes are normalised to no slash. The read API's `301` also sends a `Location` header, so the client requests with redirects off and reads the body, rather than following it silently.

## Posts

- **Body**: the API's `html`, rendered as it comes, inside one prose component styled to the design:
  - figures with captions
  - YouTube iframes and `<video>`
  - X posts (`blockquote.twitter-tweet`; X's widgets script loads only on posts that have one)
  - link cards (`a.link-card`), tables and code blocks
- **Headings** carry ids from Tamable, so posts get anchor links and, optionally, a table of contents.
- **Links**: Tamable already serves own-site links without `target` or `rel`, and other sites with `target="_blank" rel="noopener"`.
- **Cover image**: shown when set, with its `width` and `height` to avoid layout shift and its `description` as alt text.
- **Meta**: date, reading time (computed from the HTML), tags, and the series with its number and links to the previous and next parts.

## SEO

From each post's fields:

- `<title>` and `<meta name="description">` from `seo.title` and `seo.description`
- `<link rel="canonical">` from `seo.canonical_url`
- Open Graph and Twitter cards:
  - `og:type` is `article`, with `article:published_time`, `article:modified_time` and `article:tag`
  - the image is `cover.url`, falling back to a site-wide card
  - `twitter:card` is `summary_large_image` when there is a cover, and `twitter:site` and `twitter:creator` are `@mariobalca`
- JSON-LD `BlogPosting` with the author, dates, image and URL
- RSS autodiscovery `<link>` on every page

## Preview

`/preview/{token}` is set in Tamable as `https://mariobalca.com/preview/{token}`.

- It is server-rendered on every request and never prerendered.
- It sends `Cache-Control: private, no-store`, `X-Robots-Tag: noindex, nofollow` and a `noindex` meta tag.
- The route accepts slashes in the token and sends it to the API URL-encoded.
- It renders exactly like a post page, with a banner saying it is a preview.
- An expired link shows a friendly "this preview link has expired" page with a 404 status.
- A draft with no title yet still renders, without a canonical URL.

## Deploys

### Content changes

Tamable's deploy webhook points at `https://mariobalca.com/api/deploy`. The endpoint:

1. Reads the raw body and checks `X-Tamable-Signature` against `TAMABLE_WEBHOOK_SECRET` in constant time. A missing or wrong signature answers 401 and does nothing.
2. On `"event": "test"`, answers 200 without deploying, so "Send test" checks the wiring.
3. On `content.changed`, calls `FORGE_DEPLOY_HOOK_URL` and answers 202. A Forge failure answers 502, so Tamable retries it.

Tamable already waits until changes settle (60 seconds after the last one, at most 5 minutes), so every publish makes one build.

### Code changes

- **On every pull request**, GitHub Actions runs lint, type check, unit tests, and a full build against recorded API fixtures, then crawls the built site for broken links and redirects.
- **On `main`**, once those pass, the workflow calls the Forge deploy hook. Forge's push to deploy stays off, so untested code never deploys.

### Forge deploy script

`npm ci`, then the unit tests, then `nuxt build` against the live API, then activate. The build fails, and so never goes live, when:

- the read API errors or times out
- it returns no posts while the live release has some, so a bad response can't publish an empty blog

### Nightly rebuild

A Forge scheduled job calls the deploy hook every night. It catches anything a webhook missed.

### Monitoring

- Forge emails on a failed deploy.
- Tamable's recent deliveries show each webhook call.
- A Forge health check pings `/` after each deploy.

## Server

- A new Forge server shared with the Sparkling Opinions site. Each site is isolated under its own Linux user.
- At least 2 GB of RAM, since Nuxt builds are memory hungry and two sites may build at once.
- Current Node LTS.
- This site is a Forge Nuxt site. Its Let's Encrypt certificate covers `mariobalca.com` and `www.mariobalca.com`, and `www` is an alias that nginx redirects to the apex.

## Moving off Ghost

Each step that changes production waits for my OK.

1. Export a Ghost backup (content JSON and members CSV) and keep it.
2. Import the two posts into Tamable with `ghost:import`, which keeps their slugs, dates, tags and images:
   - `product-based-companies-vs-service-based-companies` (7 March 2024)
   - `the-current-state-of-the-developer-job-market-q4-2024` (8 October 2024)

   Then review them in Tamable. The signup card inside the first one is dropped.
3. Copy `/about` and `/mentorship` into `content/` as Markdown. Mentorship keeps its Calendly link and email.
4. In Tamable's Settings › Sites, set:
   - the blog URL pattern to `/blog/{slug}`
   - the preview URL pattern to `https://mariobalca.com/preview/{token}`
   - the deploy webhook to `https://mariobalca.com/api/deploy`

   Then create the read key.
5. Deploy to the new server and check every page on the server's own address before any DNS change.
6. Lower the DNS TTL a day ahead. Then, on DigitalOcean DNS:
   - point `A @` at the new server
   - point `CNAME www` at `mariobalca.com.`
7. Check certificates, redirects (both old URL shapes, `www`, `/rss/`), the sitemap and the feed, then submit the sitemap in Google Search Console.
8. After a quiet couple of weeks, cancel Ghost(Pro) and retire the droplet that only redirects the apex today.

## Tests

- **Data layer** (Vitest, against fixtures):
  - the API client, including pagination and `per_page` limits, the `data` envelope, errors and timeouts
  - the old-slug `301` read with redirects off
  - the mapping from the API's post and series shapes to the site's
- **Redirects**:
  - the map built from the static list, `GET /redirects` and the posts' old Ghost URLs
  - no chains, no loops, and no redirect shadowing a live page
- **Webhook**: valid, missing, wrong and wrong-length signatures, the test event, a Forge failure.
- **Preview**:
  - it sends no-store and noindex
  - an expired token gives a 404
  - a token with slashes and `+` works
- **Built site**:
  - every route answers
  - every internal link resolves
  - every redirect lands on a 200
  - every page has a canonical URL, title and description
- **Before cutover**: a build against the live read API with the real key, and the same checks over the result.

## Design

Before building pages, explore two or three visual directions with Claude Design, using real content:

- the two existing posts
- the about page
- a test post with every block Tamable can produce (figure with caption, YouTube, X post, link card, table, code, quote)

The chosen direction becomes the site's tokens and components: type, colour, spacing, the prose styles and the embeds. Light and dark themes are part of that exploration.

## Changes made in Tamable for this site

| PR | Change | State |
|---|---|---|
| tamable-app/tamable#72 | Preview URL patterns save with their placeholders, and the blog URL pattern must be a path | Merged |
| tamable-app/tamable#73 | Links to the site itself have no `target` or `nofollow` | Merged |
| tamable-app/tamable#74 | Rebuilds on deletes, series, tags and URL pattern changes, with a sliding debounce | Merged |
| tamable-app/tamable#75 | Ghost imports are live as published, keep their dates and SEO title, and rebuild the site | Open |
| tamable-app/tamable#76 | Headings carry ids | Open |
| tamable-app/tamable#77 | The read API guide matches the code | Open |

## Open questions

- **Tag pages**: `/tags/{tag}` from `GET /posts?tag=`, or no tag pages and Ghost's tag URLs redirect to `/blog`? With two posts and two tags, I'd leave them out for now.
- **Search**: Ghost had search. Leave it out at launch?
- **Analytics**: none, or a privacy-friendly one such as Plausible or Umami?
- **Images**: serve Tamable's images as they are, or resize them on our server (Nuxt Image with IPX)?

## Out of scope for now

Newsletter and members, comments, search, multiple authors, and other languages.
