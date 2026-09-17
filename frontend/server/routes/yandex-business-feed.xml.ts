import { renderBusinessFeedXml } from '../../utils/business-feed'

/**
 * Отдаёт статический YML-фид товаров для источника «YML-фид» в блоке
 * «Товары и услуги» рекламных материалов рекламной подписки Яндекс Бизнеса.
 * Маршрут пререндерится в статический файл (см. `nitro.prerender.routes`
 * в `nuxt.config.ts`), поэтому на проде отдаётся как обычная статика nginx.
 * @param event событие Nitro-запроса
 * @returns тело ответа — XML-документ фида в кодировке UTF-8
 */
export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return renderBusinessFeedXml()
})
