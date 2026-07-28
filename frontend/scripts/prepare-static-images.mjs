import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const projectDir = fileURLToPath(new URL('..', import.meta.url))
const publicDir = join(projectDir, 'public')

const sources = [
  {
    input: 'images/sawmill-hero.png',
    output: 'images/sawmill-hero.webp',
  },
  {
    input: 'images/paint-shop-4.jpg',
    output: 'images/paint-shop-4.webp',
  },
]

for (const image of sources) {
  const inputPath = join(publicDir, image.input)
  const outputPath = join(publicDir, image.output)

  await mkdir(dirname(outputPath), { recursive: true })

  await sharp(inputPath)
    .webp({ quality: 82 })
    .toFile(outputPath)

  console.log(`Prepared ${image.output}`)
}
