import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, relative, resolve } from 'node:path'

const contentTypes: Record<string, string> = {
  '.avif': 'image/avif',
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
}

export default async function startStaticServer(): Promise<() => Promise<void>> {
  const outputRoot = resolve('.output/public')
  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url ?? '/', 'http://127.0.0.1:4173')
      const requestedPath = resolve(outputRoot, `.${decodeURIComponent(requestUrl.pathname)}`)
      const relativePath = relative(outputRoot, requestedPath)

      if (relativePath.startsWith('..') || resolve(outputRoot, relativePath) !== requestedPath) {
        response.writeHead(403).end()
        return
      }

      const requestedStats = await stat(requestedPath)
      const filePath = requestedStats.isDirectory() ? join(requestedPath, 'index.html') : requestedPath
      const content = await readFile(filePath)
      response.writeHead(200, {
        'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
      })
      response.end(content)
    }
    catch {
      // Имитирует `error_page 404 /not-found/index.html;` из nginx: сначала
      // отдаём тело SSR-страницы `pages/not-found.vue`, при её отсутствии —
      // старый `404.html` из `nuxt generate`, и только потом — текстовую
      // заглушку. Статус во всех трёх случаях остаётся 404.
      try {
        const notFoundBody = await readFile(join(outputRoot, 'not-found', 'index.html'))
        response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
        response.end(notFoundBody)
        return
      }
      catch {
        // Страницы `/not-found` ещё нет в сборке — пробуем следующий вариант.
      }

      try {
        const legacyBody = await readFile(join(outputRoot, '404.html'))
        response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
        response.end(legacyBody)
        return
      }
      catch {
        // Ни SSR-страницы, ни стандартного `404.html` нет — прежний текстовый ответ.
      }

      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('Not found')
    }
  })

  await new Promise<void>((resolveListening, rejectListening) => {
    server.once('error', rejectListening)
    server.listen(4173, '127.0.0.1', resolveListening)
  })

  return async () => {
    await new Promise<void>((resolveClosed, rejectClosed) => {
      server.close((error) => error ? rejectClosed(error) : resolveClosed())
    })
  }
}
