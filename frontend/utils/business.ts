/**
 * Контактные и юридические данные организации.
 *
 * Единственный источник телефонов, адреса и реквизитов для шапки, подвала,
 * страницы контактов и микроразметки LocalBusiness в `nuxt.config.ts`.
 */
export const businessPhone = '8 921 984-91-01'

/** Основной телефон в международном формате для микроразметки. */
export const businessPhoneInternational = '+7 921 984-91-01'

/** Телефон для ссылки `tel:` — только цифры с кодом страны. */
export const businessPhoneHref = 'tel:+79219849101'

/** Публичная ссылка на профиль основного контакта в MAX. */
export const businessMaxUrl = 'https://web.max.ru/100742329'

/** Дополнительный телефон организации. */
export const businessSecondaryPhone = '+7 965 081-00-07'

/** Дополнительный телефон для ссылки `tel:`. */
export const businessSecondaryPhoneHref = 'tel:+79650810007'

/** Адрес производственной площадки. */
export const businessAddress = 'Ленинградская область, Ломоносовский район, Горбунковское сельское поселение, деревня Разбегаево, промзона Большевик, зона 2-й микрорайон'

/** Карточка производственной площадки в Яндекс Картах. */
export const businessMapsUrl = 'https://yandex.ru/maps/org/pilomaterialy_makoyev_r_a_/213229964032?si=d4wy1vbz26r7ax97ytxj2w38mr'

/** Встраиваемая карта производственной площадки. */
export const businessMapEmbedUrl = 'https://yandex.ru/map-widget/v1/?ll=29.963405%2C59.807923&mode=search&oid=213229964032&ol=biz&z=16'

/** Юридические реквизиты индивидуального предпринимателя. */
export const businessRequisites = {
  shortName: 'ИП Шидов Р.Х.',
  fullName: 'ИП Шидов Роман Хабасович',
  inn: '781000201830',
  ogrnip: '325784700214687',
}
