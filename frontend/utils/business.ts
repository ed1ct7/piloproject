/**
 * Контактные и юридические данные организации.
 *
 * Единственный источник телефона, WhatsApp и реквизитов для шапки, подвала,
 * страницы контактов и микроразметки LocalBusiness в `nuxt.config.ts`.
 */
export const businessPhone = '+7 921 928-21-57'

/** Телефон для ссылки `tel:` — только цифры с кодом страны. */
export const businessPhoneHref = 'tel:+79219282157'

/** Ссылка на чат WhatsApp с номером организации. */
export const businessWhatsAppUrl = 'https://wa.me/79219282157'

/** Юридические реквизиты индивидуального предпринимателя. */
export const businessRequisites = {
  shortName: 'ИП Макоев Р.А.',
  fullName: 'ИП Макоев Резуан Алимович',
  inn: '072110304553',
  ogrnip: '323784700242521',
}
