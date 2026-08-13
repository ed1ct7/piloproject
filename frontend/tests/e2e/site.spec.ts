import AxeBuilder from '@axe-core/playwright'
import type { Locator, Page } from '@playwright/test'
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

async function expectVerticalGap(upper: Locator, lower: Locator, minimum: number) {
  const upperBox = await upper.boundingBox()
  const lowerBox = await lower.boundingBox()

  expect(upperBox).not.toBeNull()
  expect(lowerBox).not.toBeNull()

  if (!upperBox || !lowerBox) {
    return
  }

  const subpixelTolerance = 0.1
  expect(lowerBox.y - (upperBox.y + upperBox.height)).toBeGreaterThanOrEqual(minimum - subpixelTolerance)
}

async function expectMinimumTargetSize(target: Locator, minimum: number) {
  const targetBox = await target.boundingBox()

  expect(targetBox).not.toBeNull()
  if (!targetBox) {
    return
  }

  expect(targetBox.width).toBeGreaterThanOrEqual(minimum)
  expect(targetBox.height).toBeGreaterThanOrEqual(minimum)
}

async function waitForHydration(page: Page) {
  await expect(page.locator('.site-shell')).toHaveAttribute('data-hydrated', 'true')
}

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
    await waitForHydration(page)
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
  await waitForHydration(page)

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
  await waitForHydration(page)

  expect(await page.locator('h1').evaluate((heading) => getComputedStyle(heading).hyphens)).toBe('none')

  const skipLink = page.getByRole('link', { name: 'Перейти к основному содержимому' })
  await page.keyboard.press('Tab')
  await expect(skipLink).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main-content')).toBeFocused()

  const toggle = page.locator('button[aria-controls="main-navigation"]')
  await expect(toggle).toHaveAccessibleName('Открыть основную навигацию')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(toggle).toHaveAccessibleName('Закрыть основную навигацию')
  await expect(page.getByRole('navigation', { name: 'Основная навигация' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Пиломатериалы', exact: true })).toBeVisible()
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations).toEqual([])

  await page.keyboard.press('Escape')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(toggle).toBeFocused()
  await expect(page.getByRole('navigation', { name: 'Основная навигация' })).toBeHidden()
  expect((page as typeof page & { externalRequests: string[] }).externalRequests).toEqual([])
})

test('мобильные действия каталога имеют достаточную область касания', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/pilomaterialy')
  await waitForHydration(page)

  await expectMinimumTargetSize(page.getByRole('button', { name: 'Сухая', exact: true }), 44)
  await expectMinimumTargetSize(page.getByRole('button', { name: 'Подробнее' }).first(), 44)
  await expectMinimumTargetSize(page.getByRole('button', { name: /Добавить в заявку/ }).first(), 44)
})

test('текстовые блоки сохраняют вертикальный ритм', async ({ page }) => {
  await page.goto('/o-nas')

  const hero = page.locator('main > section').first()
  await expectVerticalGap(hero.locator('h1'), hero.locator('p').last(), 20)

  const production = page.locator('section[aria-labelledby="production-title"]')
  const productionParagraphs = production.locator('p').filter({ hasNotText: 'Чем занимаемся' })
  await expectVerticalGap(production.locator('h2'), productionParagraphs.nth(0), 20)
  await expectVerticalGap(productionParagraphs.nth(0), productionParagraphs.nth(1), 12)

  const nextStep = page.locator('section[aria-labelledby="next-step-title"] > div').nth(1)
  await expectVerticalGap(nextStep.locator('p'), nextStep.locator('a').first(), 20)

  await page.goto('/kontakty')
  const map = page.locator('section[aria-labelledby="map-title"] > div').first()
  await expectVerticalGap(map.locator('h2'), map.locator(':scope > p'), 20)
  await expectVerticalGap(map.locator(':scope > p'), map.locator(':scope > a'), 20)

  await page.goto('/cart')
  const emptyCart = page.getByText('Заявка пуста').locator('..')
  await expectVerticalGap(emptyCart.locator('h2'), emptyCart.locator('p'), 16)
  await expectVerticalGap(emptyCart.locator('p'), emptyCart.locator('a'), 16)

  await page.goto('/politika-konfidencialnosti')
  const policyParagraphs = page.locator('article > p')
  await expectVerticalGap(policyParagraphs.nth(1), policyParagraphs.nth(2), 12)

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/o-nas')
  const mobileProduction = page.locator('section[aria-labelledby="production-title"]')
  const mobileParagraphs = mobileProduction.locator('p').filter({ hasNotText: 'Чем занимаемся' })
  await expectVerticalGap(mobileProduction.locator('h2'), mobileParagraphs.nth(0), 20)
  await expectVerticalGap(mobileParagraphs.nth(0), mobileParagraphs.nth(1), 12)
})

test('корзина хранится только локально и переживает перезагрузку', async ({ page }) => {
  await page.goto('/pilomaterialy')
  await waitForHydration(page)
  await page.getByRole('button', { name: /Добавить в заявку/ }).first().click()
  await expect(page.getByRole('link', { name: /Заявка \(1\)/ })).toBeVisible()
  await page.goto('/cart')
  await expect(page.getByText('Предварительная сумма', { exact: true })).toBeVisible()

  await page.reload()
  await waitForHydration(page)
  await expect(page.getByRole('button', { name: /Увеличить количество/ })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Скопировать заявку' })).toBeVisible()

  await page.getByRole('button', { name: /Увеличить количество/ }).click()
  await expect(page.getByRole('status').filter({ hasText: 'количество увеличено до 2' })).toBeVisible()

  const orderSummary = page.getByText('Предварительная сумма', { exact: true }).locator('..')
  const summaryParagraphs = orderSummary.locator(':scope > p')
  await expectVerticalGap(summaryParagraphs.nth(1), summaryParagraphs.nth(2), 20)
  await expectVerticalGap(summaryParagraphs.nth(2), orderSummary.locator(':scope > div').first(), 20)

  await page.setViewportSize({ width: 390, height: 844 })
  const secondaryPhone = orderSummary.getByText('+7 965 081-00-07', { exact: true })
  await expect(secondaryPhone).toBeVisible()
  expect(await secondaryPhone.evaluate((element) => getComputedStyle(element).whiteSpace)).toBe('nowrap')
  expect((page as typeof page & { externalRequests: string[] }).externalRequests).toEqual([])
})

test('ошибка буфера обмена объясняется без потери заявки', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new DOMException('Clipboard is unavailable', 'NotAllowedError')
        },
      },
    })
  })

  await page.goto('/pilomaterialy')
  await waitForHydration(page)
  await page.getByRole('button', { name: /Добавить в заявку/ }).first().click()
  await page.goto('/cart')
  await page.getByRole('button', { name: 'Скопировать заявку' }).click()

  await expect(page.getByRole('status').filter({ hasText: 'Не удалось скопировать автоматически' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Увеличить количество/ })).toBeVisible()
})

test('reduced motion убирает позиционное движение', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const secondSection = page.locator('main > section').nth(1)
  await expect(secondSection).toBeVisible()
  const motion = await secondSection.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      scale: style.scale,
      transform: style.transform,
      translate: style.translate,
    }
  })

  expect(motion.translate).toBe('none')
  expect(motion.scale).toBe('none')
  expect(motion.transform).toBe('none')
})

test('главные страницы сохраняют reflow на узком CSS viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })

  for (const route of ['/', '/pilomaterialy', '/cart']) {
    await page.goto(route)
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
  }
})

test('видео имеет русскую текстовую альтернативу звуковой дорожке', async ({ page }) => {
  await page.goto('/')

  const video = page.locator('video[aria-describedby="video-audio-description"]')
  await expect(video).toHaveCount(1)
  await expect(page.locator('#video-audio-description')).toContainText('В ролике нет речи')
  await expect(video.locator('track[kind="captions"][srclang="ru"]')).toHaveAttribute('src', '/captions/short-sawmill-video.ru.vtt')
})
