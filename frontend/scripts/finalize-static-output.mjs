import { access, cp, readdir } from 'node:fs/promises'
import { join } from 'node:path'
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
const outputDir = join(projectDir, '.output', 'public')

await access(outputDir)

await cp(publicSourceDir, outputDir, { recursive: true, force: false })
await cp(clientBundleDir, join(outputDir, '_nuxt'), { recursive: true, force: false })

const bundleFiles = await readdir(join(outputDir, '_nuxt'))
const imageFiles = await readdir(join(outputDir, 'images'))
console.log(
  `Static output finalized: ${bundleFiles.length} bundle files, ${imageFiles.length} images`,
)
