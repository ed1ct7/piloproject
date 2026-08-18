/**
 * Контактные и юридические данные организации.
 *
 * Единственный источник телефонов, адреса и реквизитов для шапки, подвала,
 * страницы контактов и микроразметки LocalBusiness в `nuxt.config.ts`.
 */
export const businessPhone = '+7 921 984-91-01'

/** Основной телефон в международном формате для микроразметки. */
export const businessPhoneInternational = businessPhone

/** Телефон для ссылки `tel:` — только цифры с кодом страны. */
export const businessPhoneHref = 'tel:+79219849101'

/** Публичный адрес электронной почты. */
export const businessEmail = 'shidov_roman@mail.ru'

/** Адрес электронной почты для ссылки `mailto:`. */
export const businessEmailHref = `mailto:${businessEmail}`

/** Публичная ссылка на профиль основного контакта в MAX. */
export const businessMaxUrl = 'https://max.ru/u/f9LHodD0cOIR2ygEUT07fCLsK9bi_Ta9vKxYpaBfpMsXgwxHXtB4b25AQUE'

/** Дополнительный телефон организации. */
export const businessSecondaryPhone = '+7 965 081-00-07'

/** Дополнительный телефон для ссылки `tel:`. */
export const businessSecondaryPhoneHref = 'tel:+79650810007'

/** Адрес производственной площадки. */
export const businessAddress = 'Ленинградская область, Ломоносовский район, Горбунковское сельское поселение, деревня Разбегаево, промзона Большевик, зона 2-й микрорайон'

/** Карточка производственной площадки в Яндекс Картах (переоформлена 18.08.2026). */
export const businessMapsUrl = 'https://yandex.ru/maps/org/213229964032/'

/** Режим работы производственной площадки — человекочитаемый текст. */
export const businessWorkingHours = 'Ежедневно с 9:00 до 19:00'

/**
 * Режим работы в формате schema.org для микроразметки LocalBusiness.
 * @note дни недели указываются полными английскими названиями schema.org
 */
export const businessOpeningHoursSpecification = {
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  opens: '09:00',
  closes: '19:00',
}

/** Юридические реквизиты индивидуального предпринимателя. */
export const businessRequisites = {
  shortName: 'ИП Шидов Р.Х.',
  fullName: 'ИП Шидов Роман Хабасович',
  inn: '781000201830',
  ogrnip: '325784700214687',
  registrationAuthority: 'Межрайонная инспекция Федеральной налоговой службы № 15 по Санкт-Петербургу',
  registrationDate: '03.07.2025',
}
