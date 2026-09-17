import { expect, test } from '@playwright/test'

/** Таблицы сечений — статический HTML: должны читаться без JavaScript. */
test.describe('размерные таблицы без JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('посадочная /doska отдаёт таблицу сечений и строку о брусе в HTML', async ({ page }) => {
    await page.goto('/doska')

    const sizes = page.locator('#sizes')
    await expect(sizes).toHaveCount(1)
    await expect(sizes.getByRole('heading', { level: 2 })).toHaveText('Сечения доски и цена за штуку')

    const table = sizes.locator('table').first()
    await expect(table.locator('thead')).toContainText('I сорт')
    await expect(table.locator('thead')).toContainText('III сорт')
    await expect(table.locator('tbody tr')).toHaveCount(9)

    const row = sizes.locator('tr#size-50x150x6000')
    await expect(row).toContainText('6000')
    await expect(row).toContainText('0,0450')
    await expect(row.locator('td').nth(2)).toHaveText(/от 810 ₽/)

    await expect(sizes).toContainText('Другие сечения и длины — под заказ')
    await expect(page.locator('#brus')).toContainText('Брус естественной влажности I сорта — от 18 000 ₽/м³')
  })

  test('каталог, сухая доска, огнебиозащита и имитация бруса содержат таблицы', async ({ page }) => {
    await page.goto('/pilomaterialy')
    // Пять полных таблиц каталога заменены компактным блоком ссылок на разделы
    // размеров посадочных — дубли с /doska и другими страницами убраны.
    const catalogSizes = page.locator('#sizes')
    await expect(catalogSizes.locator('table')).toHaveCount(0)
    await expect(catalogSizes.getByRole('link', { name: /Доска обрезная/ })).toHaveAttribute('href', '/doska#sizes')
    await expect(catalogSizes.getByRole('link', { name: /Сухая и строганая доска/ })).toHaveAttribute('href', '/suhaya-doska#sizes')
    await expect(catalogSizes.getByRole('link', { name: /огнебиозащит/i })).toHaveAttribute('href', '/ognebiozashchita#sizes')
    await expect(catalogSizes.getByRole('link', { name: /Имитация бруса/ })).toHaveAttribute('href', '/imitatsiya-brusa#sizes')
    await expect(catalogSizes).toContainText('Брус естественной влажности I сорта')

    await page.goto('/suhaya-doska')
    const drySizes = page.locator('section[aria-labelledby="landing-sizes-title"]')
    await expect(drySizes.getByRole('heading', { level: 2 })).toHaveText('Сечения сухой и строганой доски')
    await expect(drySizes.locator('table')).toHaveCount(2)
    await expect(drySizes.locator('table').nth(1).locator('tbody tr')).toHaveCount(12)
    await expect(drySizes).not.toContainText('огнебиозащит')
    // Брусок и рейка — новые позиции посадочной, таблицы сечений у них нет,
    // но в блоке позиций они должны быть видны.
    await expect(page.getByRole('heading', { name: 'Брусок 45×45' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Рейка 20×45' })).toBeVisible()

    await page.goto('/ognebiozashchita')
    const fireSizes = page.locator('section[aria-labelledby="landing-sizes-title"]')
    await expect(fireSizes.locator('table')).toHaveCount(1)
    await expect(fireSizes.locator('thead')).toContainText('20 000')

    await page.goto('/imitatsiya-brusa')
    const claddingSizes = page.locator('section[aria-labelledby="landing-sizes-title"]')
    await expect(claddingSizes.locator('tbody tr')).toHaveCount(2)
    await expect(claddingSizes).toContainText('нижняя оценка')

    await page.goto('/vagonka')
    // У вагонки нет таблицы сечений (цена сразу за штуку), но появились расход
    // материала на площадь и сравнение профилей — секция размеров есть.
    const vagonkaSizes = page.locator('section[aria-labelledby="landing-sizes-title"]')
    await expect(vagonkaSizes).toHaveCount(1)
    await expect(vagonkaSizes.locator('table')).toHaveCount(2)
    await expect(vagonkaSizes).toContainText('Сколько вагонки уйдёт на 10, 20 и 30 м²')
    await expect(vagonkaSizes).toContainText('Евровагонка или «Штиль»: что выбрать')
    await expect(vagonkaSizes).toContainText('нижняя оценка')
  })
})

test('калькулятор считает 50×150×6000 I сорта как 0,045 м³ и 810 ₽ без внешних запросов', async ({ page }) => {
  const externalRequests: string[] = []
  await page.route('**/*', async (route) => {
    const requestUrl = new URL(route.request().url())
    if (requestUrl.origin !== 'http://127.0.0.1:4173') {
      externalRequests.push(requestUrl.href)
      await route.abort()
      return
    }
    await route.continue()
  })

  await page.goto('/doska')
  await expect(page.locator('.site-shell')).toHaveAttribute('data-hydrated', 'true')

  const calculator = page.getByRole('group', { name: 'Калькулятор объёма и стоимости' })
  await calculator.getByLabel('Позиция и сорт').selectOption({ label: 'Доска естественной влажности, I сорт' })
  await calculator.getByLabel('Сечение, мм').selectOption({ label: '50×150' })
  await expect(calculator.getByLabel('Длина, мм')).toHaveValue('0')
  await calculator.getByLabel('Количество').fill('1')

  await expect(calculator).toContainText(/0,0450\s?м³/)
  await expect(calculator).toContainText(/от 810 ₽/)

  await calculator.getByLabel('Количество').fill('10')
  await expect(calculator).toContainText(/0,4500\s?м³/)
  await expect(calculator).toContainText(/от 8\s?100 ₽/)

  await calculator.getByLabel('Единица количества').selectOption('м³')
  await calculator.getByLabel('Количество').fill('1')
  await expect(calculator).toContainText('23 шт.')
  await expect(calculator).toContainText(/от 18\s?630 ₽/)

  await calculator.getByLabel('Количество').fill('0')
  await expect(calculator).toContainText('Проверьте количество')
  await expect(calculator.getByLabel('Количество')).toHaveAttribute('aria-invalid', 'true')

  expect(externalRequests).toEqual([])
  // Калькулятор ничего не сохраняет: в localStorage может быть только ключ корзины.
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key !== 'pilorama-cart-v1'))).toEqual([])
})
