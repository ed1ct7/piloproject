import { access, cp, mkdir, readdir, writeFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Достраивает статическую сборку, если Nitro завершился до копирования ассетов.
 *
 * На некоторых окружениях (наблюдалось на Windows с Node 25) `nuxt generate`
 * пререндерит страницы, но молча выходит до финальной фазы: клиентский бандл
 * `_nuxt` и содержимое `public/` не попадают в `.output/public`. Скрипт
 * докопирует недостающее; когда Nitro отработал полностью, копирование
 * ничего не перезаписывает и работает как проверка.
 */
const projectDir = fileURLToPath(new URL('..', import.meta.url))
const publicSourceDir = join(projectDir, 'public')
const clientBundleDir = join(projectDir, '.nuxt', 'dist', 'client', '_nuxt')
const manifestMetaDir = join(projectDir, '.nuxt', 'manifest', 'meta')
const outputDir = join(projectDir, '.output', 'public')

await access(outputDir)

await cp(publicSourceDir, outputDir, { recursive: true, force: false })
await cp(clientBundleDir, join(outputDir, '_nuxt'), { recursive: true, force: false })

// On the affected Windows/Node combination Nitro can exit before it copies the
// app manifest too. The client still requests it during hydration, so provide
// the same minimal manifest shape Nuxt expects instead of leaving a noisy 404.
const manifestFiles = (await readdir(manifestMetaDir)).filter(
  (file) => extname(file) === '.json' && file !== 'dev.json',
)

if (manifestFiles.length !== 1) {
  throw new Error(`Expected one Nuxt app manifest, found ${manifestFiles.length}`)
}

const buildId = basename(manifestFiles[0], '.json')
const buildTimestamp = Date.now()
const outputManifestDir = join(outputDir, '_nuxt', 'builds', 'meta')

await mkdir(outputManifestDir, { recursive: true })
await writeFile(
  join(outputManifestDir, `${buildId}.json`),
  JSON.stringify({ id: buildId, timestamp: buildTimestamp, prerendered: [] }),
)
await writeFile(
  join(outputDir, '_nuxt', 'builds', 'latest.json'),
  JSON.stringify({ id: buildId, timestamp: buildTimestamp }),
)

const bundleFiles = await readdir(join(outputDir, '_nuxt'))
const imageFiles = await readdir(join(outputDir, 'images'))
console.log(
  `Static output finalized: ${bundleFiles.length} bundle files, ${imageFiles.length} images, manifest ${buildId}`,
)
