import { access } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectDir = fileURLToPath(new URL('..', import.meta.url))
const publicDir = join(projectDir, 'public')

const requiredSources = [
  'images/brushing-1.jpg',
  'images/lumber-stack-2025-03-07.jpg',
  'images/lumber-yard-2025-05-21.jpg',
  'images/paint-shop-1.jpg',
  'images/paint-shop-2.jpg',
  'images/paint-shop-4.jpg',
  'images/sawmill-yard-1.jpg',
  'images/timber-order-2025-05-16.jpg',
  'mp4/short-sawmill-video.mp4',
]

for (const source of requiredSources) {
  await access(join(publicDir, source))
}

console.log(`Verified ${requiredSources.length} production media sources`)
