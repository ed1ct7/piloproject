import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const publicRoutes = [
  '/',
  '/pilomaterialy',
  '/o-nas',
  '/foto',
  '/dostavka',
  '/kontakty',
  '/politika-konfidencialnosti',
  '/cart',
]

test.beforeEach(async ({ page }) => {
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
  ;(page as typeof page & { externalRequests: string[] }).externalRequests = externalRequests
})

for (const route of publicRoutes) {
  test(`${route} открывается без внешних запросов и критических a11y-ошибок`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    await page.goto(route)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page).toHaveTitle(/Пилорама Разбегаево/)

    const accessibilityScan = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScan.violations).toEqual([])
    expect(errors).toEqual([])
    expect((page as typeof page & { externalRequests: string[] }).externalRequests).toEqual([])
  })
}

test('каталог фильтруется, открывает доступный диалог и добавляет товар', async ({ page }) => {
  await page.goto('/pilomaterialy')

  await page.getByRole('button', { name: 'Сухая', exact: true }).click()
  await expect(page.locator('article')).toHaveCount(1)

  const detailsButton = page.getByRole('button', { name: 'Подробнее' })
  await detailsButton.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Закрыть подробности' })).toBeFocused()
  const dialogImage = dialog.locator('img')
  await expect.poll(() => dialogImage.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
  expect(await dialogImage.evaluate((image: HTMLImageElement) => image.currentSrc)).toContain('/_ipx/')
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations).toEqual([])

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(detailsButton).toBeFocused()

  await page.getByRole('button', { name: /Добавить в заявку/ }).click()
  await expect(page.getByRole('status').filter({ hasText: 'добавлено в заявку' })).toBeVisible()
  await expect(page.getByRole('link', { name: /Заявка \(1\)/ })).toBeVisible()
  expect((page as typeof page & { externalRequests: string[] }).externalRequests).toEqual([])
})

test('мобильное меню сообщает состояние и закрывается по Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const toggle = page.locator('button[aria-controls="main-navigation"]')
  await expect(toggle).toHaveAccessibleName('Открыть основную навигацию')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(toggle).toHaveAccessibleName('Закрыть основную навигацию')
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations).toEqual([])

  await page.keyboard.press('Escape')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(toggle).toBeFocused()
  expect((page as typeof page & { externalRequests: string[] }).externalRequests).toEqual([])
})

test('корзина хранится только локально и переживает перезагрузку', async ({ page }) => {
  await page.goto('/pilomaterialy')
  await page.getByRole('button', { name: /Добавить в заявку/ }).first().click()
  await page.goto('/cart')
  await expect(page.getByText('Предварительная сумма', { exact: true })).toBeVisible()

  await page.reload()
  await expect(page.getByRole('button', { name: /Увеличить количество/ })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Скопировать заявку' })).toBeVisible()
  expect((page as typeof page & { externalRequests: string[] }).externalRequests).toEqual([])
})
