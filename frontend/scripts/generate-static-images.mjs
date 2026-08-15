import { mkdir, readFile, readdir } from 'node:fs/promises'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const projectDir = fileURLToPath(new URL('..', import.meta.url))
const publicDir = join(projectDir, 'public')
const outputDir = join(projectDir, '.output', 'public')

const htmlFiles = await findHtmlFiles(outputDir)
const imageRoutes = new Set()

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8')
  const matches = html.matchAll(/\/_ipx\/[^"'<>\\\s]+/g)

  for (const match of matches) {
    imageRoutes.add(match[0].replaceAll('&amp;', '&'))
  }
}

const productsSource = await readFile(join(projectDir, 'utils', 'products.ts'), 'utf8')
const productImageMatches = productsSource.matchAll(/image:\s*['"](\/images\/[^'"]+)['"]/g)

for (const match of productImageMatches) {
  const source = match[1]
  imageRoutes.add(`/_ipx/f_webp&q_82&s_480x640${source}`)
  imageRoutes.add(`/_ipx/f_webp&q_82&s_720x960${source}`)
}

for (const route of imageRoutes) {
  const image = parseIpxRoute(route)

  if (!image) {
    continue
  }

  const sourcePath = join(publicDir, image.source)
  const outputPath = join(outputDir, route.slice(1))

  await mkdir(dirname(outputPath), { recursive: true })

  const pipeline = sharp(sourcePath)

  if (image.width && image.height) {
    // Срезет просит retina-ширины, которых нет у части исходников. Запрошенный
    // кадр ужимаем до размеров исходника, сохраняя пропорцию: `withoutEnlargement`
    // здесь не подходит — он ломает кроп и отдаёт почти полный портретный кадр.
    const { width: sourceWidth = 0, height: sourceHeight = 0 } = await sharp(sourcePath).metadata()
    const scale = Math.min(1, sourceWidth / image.width, sourceHeight / image.height)

    pipeline.resize(Math.round(image.width * scale), Math.round(image.height * scale))
  }

  switch (image.format || extname(image.source).slice(1).toLowerCase()) {
    case 'webp':
      pipeline.webp({ quality: image.quality })
      break
    case 'jpg':
    case 'jpeg':
      pipeline.jpeg({ quality: image.quality })
      break
    case 'png':
      pipeline.png()
      break
    default:
      throw new Error(`Unsupported image format for ${route}`)
  }

  await pipeline.toFile(outputPath)

  console.log(`Generated ${route.slice(1)}`)
}

async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const path = join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...await findHtmlFiles(path))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(path)
    }
  }

  return files
}

function parseIpxRoute(route) {
  const match = route.match(/^\/_ipx\/([^/]+)\/(.+)$/)

  if (!match) {
    return null
  }

  const [, operations, source] = match
  const image = {
    source,
    format: '',
    quality: 82,
    width: 0,
    height: 0,
  }

  for (const operation of operations.split('&')) {
    const [key, rawValue] = operation.split('_')

    if (!rawValue) {
      continue
    }

    if (key === 'f') {
      image.format = rawValue
    }

    if (key === 'q') {
      image.quality = Number(rawValue)
    }

    if (key === 's') {
      const [width, height] = rawValue.split('x').map(Number)
      image.width = width || 0
      image.height = height || 0
    }
  }

  return image
}
