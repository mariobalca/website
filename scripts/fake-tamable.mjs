// Serves tests/fixtures/tamable as Tamable's read API, for CI builds and local work without a key.
// NUXT_TAMABLE_API_URL=http://localhost:4010/api/v1 NUXT_TAMABLE_READ_KEY=fixture
import { existsSync, readFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'

const fixtures = fileURLToPath(new URL('../tests/fixtures/tamable/', import.meta.url))
const port = Number(process.env.PORT ?? 4010)

function send(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(body))
}

function fixture(name) {
  const file = `${fixtures}${name}.json`
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null
}

createServer((request, response) => {
  const url = new URL(request.url, `http://localhost:${port}`)
  const path = url.pathname.replace(/^\/api\/v1/, '')

  if (request.headers.authorization !== 'Bearer fixture') {
    return send(response, 401, { message: 'A valid site key is required.' })
  }

  const post = path.match(/^\/posts\/([^/]+)$/)
  const series = path.match(/^\/series\/([^/]+)$/)
  const preview = path.match(/^\/preview\/(.+)$/)
  const body
    = path === '/posts' ? fixture('posts')
      : path === '/redirects' ? fixture('redirects')
        : path === '/series' ? fixture('series')
          : post ? fixture(`posts/${decodeURIComponent(post[1])}`)
            : series ? fixture(`series/${decodeURIComponent(series[1])}`)
              : preview ? fixture(`preview/${decodeURIComponent(preview[1]).replace(/[^a-z0-9-]/gi, '_')}`)
              : null

  return body ? send(response, 200, body) : send(response, 404, { message: 'Not found.' })
}).listen(port, () => console.log(`Fake Tamable on http://localhost:${port}/api/v1`))
