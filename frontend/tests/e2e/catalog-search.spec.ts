import { expect, test } from '@playwright/test'

test.use({ javaScriptEnabled: false })

test('каталог содержит предложение, характеристики и условия покупки без JavaScript', async ({ page }) => {
  await page.goto('/pilomaterialy')
  await expect(page).toHaveTitle('Купить пиломатериалы в Ленобласти — цены · Пилорама Разбегаево')
  await expect(page.locator('h1')).toHaveText('Купить пиломатериалы в Ленинградской области')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://pilorama-razbegaevo.ru/pilomaterialy')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /^index, follow/)

  const lining = page.locator('.product-card').filter({ has: page.getByRole('heading', { name: 'Евровагонка', exact: true }) })
  await expect(lining.locator('.product-card__specs')).toContainText('12,5×95×3000 мм')
  await expect(lining).toContainText('125')
  const dryBoard = page.locator('.product-card').filter({ has: page.getByRole('heading', { name: 'Доска сухая', exact: true }) })
  await expect(dryBoard.locator('.product-card__specs')).toContainText('25×100/125/150')

  const purchase = page.locator('#purchase-conditions')
  await expect(purchase).toContainText('Оплата — по факту отгрузки')
  await expect(purchase.getByRole('link', { name: 'предварительную заявку', exact: true })).toHaveAttribute('href', '/cart')
  await expect(purchase.getByRole('link', { name: 'Условия доставки' })).toHaveAttribute('href', '/dostavka')
  await expect(purchase.getByRole('link', { name: 'Адрес и самовывоз' })).toHaveAttribute('href', '/kontakty')
})
