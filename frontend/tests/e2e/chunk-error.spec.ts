import { expect, test } from '@playwright/test'

/**
 * Сбой загрузки JS-чанка при старте приложения (обрыв сети у посетителя,
 * лимиты JS-рендера поискового робота, чанк удалён деплоем) не должен
 * превращать пререндеренную страницу в «Страницу не найдена» с `noindex`.
 * С 17.09.2026 именно так выпадали из поиска Яндекса главная и разделы,
 * см. `docs/seo-plan-2026-09.md`, §11.
 */
const routes = [
  { path: '/', title: 'Пиломатериалы от производителя: Ленобласть и СПб · Пилорама Разбегаево' },
  { path: '/dostavka', title: 'Доставка пиломатериалов по СПб и Ленобласти · Пилорама Разбегаево' },
]

for (const { path, title } of routes) {
  test(`${path}: сбой загрузки чанка не ставит noindex и не меняет title`, async ({ page }) => {
    const response = await page.goto(path)
    const html = (await response?.text()) ?? ''
    const entry = html.match(/<script type="module" src="(\/_nuxt\/[^"]+\.js)"/)?.[1]
    expect(entry, 'entry-скрипт в HTML').toBeTruthy()

    // Загружается только entry, все динамические чанки обрываются — как у
    // робота, которому не удалось скачать часть ресурсов.
    await page.route('**/_nuxt/*.js', (route) => {
      return new URL(route.request().url()).pathname === entry ? route.continue() : route.abort()
    })
    await page.goto(path, { waitUntil: 'networkidle' })

    const robots = await page.locator('meta[name="robots"]').evaluateAll((elements) => {
      return elements.map((element) => element.getAttribute('content') ?? '')
    })
    expect(robots.join(' | '), 'meta robots').not.toContain('noindex')
    await expect(page).toHaveTitle(title)
  })
}

/**
 * Роботу Nuxt страницу ошибки не показывает (проверка User-Agent на бота):
 * при сбое чанка лейаута SSR-разметка остаётся, но `useSeoMeta` страницы не
 * регистрируется. До фикса в `app.vue` title падал до «Пилорама Разбегаево» —
 * с таким title `/doska` и `/imitatsiya-brusa` попали в поиск Яндекса
 * 21.09.2026. Обрываем по очереди каждый чанк, кроме entry.
 */
test.describe('робот: сбой любого чанка не меняет title', () => {
  test.use({ userAgent: 'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)' })

  for (const path of ['/', '/doska', '/pilomaterialy']) {
    test(`${path}: title и robots как в пререндере`, async ({ page, context }) => {
      test.setTimeout(90_000)
      const chunks = new Set<string>()
      page.on('request', (request) => {
        const { pathname } = new URL(request.url())
        if (pathname.startsWith('/_nuxt/') && pathname.endsWith('.js')) {
          chunks.add(pathname)
        }
      })
      const response = await page.goto(path, { waitUntil: 'networkidle' })
      const entry = ((await response?.text()) ?? '').match(/<script type="module" src="(\/_nuxt\/[^"]+\.js)"/)?.[1]
      const title = await page.title()
      expect(entry, 'entry-скрипт в HTML').toBeTruthy()
      expect(chunks.size, 'динамические чанки').toBeGreaterThan(1)

      for (const chunk of chunks) {
        if (chunk === entry) {
          continue
        }
        const broken = await context.newPage()
        await broken.route('**/_nuxt/*.js', (route) => {
          return new URL(route.request().url()).pathname === chunk ? route.abort() : route.continue()
        })
        await broken.goto(path, { waitUntil: 'networkidle' })
        await expect(broken, `title при сбое ${chunk}`).toHaveTitle(title)
        const robots = await broken.locator('meta[name="robots"]').evaluateAll((elements) => {
          return elements.map((element) => element.getAttribute('content') ?? '')
        })
        expect(robots.join(' | '), `meta robots при сбое ${chunk}`).not.toContain('noindex')
        await broken.close()
      }
    })
  }
})

test('несуществующая посадочная при клиентском переходе — 404 с noindex', async ({ page }) => {
  await page.goto('/')
  await page.waitForFunction(() => Boolean((document.querySelector('#__nuxt') as { __vue_app__?: unknown } | null)?.__vue_app__))
  await page.evaluate(() => {
    const root = document.querySelector('#__nuxt') as unknown as { __vue_app__: { config: { globalProperties: { $router: { push: (to: string) => Promise<unknown> } } } } }
    // Навигация отклоняется ошибкой 404 — это и есть ожидаемый исход.
    return root.__vue_app__.config.globalProperties.$router.push('/net-takoi-stranicy').catch(() => undefined)
  })
  await expect(page).toHaveTitle('Страница не найдена · Пилорама Разбегаево')
  await expect(page.locator('meta[name="robots"]').last()).toHaveAttribute('content', 'noindex, nofollow')
})
