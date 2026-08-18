<script setup lang="ts">
const featuredProductIds = new Set([
  'doska-ev-sort-2',
  'doska-suhaya-kamernoi-sushki',
  'doska-suhaya-stroganaya',
  'imitatsiya-brusa-20x145',
])
const featuredProducts = priceListProducts.filter((product) =>
  featuredProductIds.has(product.id),
)

/**
 * `sizes` считается от реальной ширины карточки в сетке `.gallery__grid`:
 * при контенте 1320px колонка равна 93px, поэтому широкий кадр занимает ~874px,
 * а обычный — ~428px. Без `xl`/`xxl` браузер брал бы самый крупный кандидат
 * срезета (348px) и растягивал его на всю карточку.
 */
const galleryCardSizes = 'xs:50vw sm:50vw md:50vw lg:31vw xl:31vw xxl:28vw'
const galleryWideCardSizes = 'xs:100vw sm:100vw md:100vw lg:64vw xl:64vw xxl:58vw'

const galleryPreview = [
  {
    image: '/images/paint-shop-4.jpg',
    alt: 'Участок обработки древесины с оборудованием и подготовленными материалами',
    caption: 'Цех обработки',
    className: 'gallery-card--wide',
    sizes: galleryWideCardSizes,
  },
  {
    image: '/images/vagonka-shtil-12-5x120x3000.png',
    alt: 'Аккуратно сложенная вагонка профиля Штиль из хвойной древесины',
    caption: 'Готовая продукция',
    className: 'gallery-card--product',
    sizes: galleryCardSizes,
  },
  {
    image: '/images/lentochnaya-pilorama-raspil.jpg',
    alt: 'Ленточная пилорама с бревном на производственной площадке',
    caption: 'Распил бревна',
    className: 'gallery-card--tall',
    sizes: galleryCardSizes,
  },
  {
    image: '/images/shtabel-suhoi-doski.jpg',
    alt: 'Высокие штабели сухой доски на крытом складе',
    caption: 'Крытый склад',
    className: 'gallery-card--tall',
    sizes: galleryCardSizes,
  },
  {
    image: '/images/lumber-yard-2025-05-21.jpg',
    alt: 'Образцы обработанной древесины на производственной площадке',
    caption: 'Финишная обработка',
    className: 'gallery-card--finish',
    sizes: galleryCardSizes,
  },
]

/**
 * Документ с вендорным префиксом WebKit.
 * @note Safari до 16.4 знает только `webkit*`-версии Fullscreen API,
 *       поля объявлены необязательными, чтобы обойтись без `any`
 */
interface VendorFullscreenDocument extends Document {
  webkitFullscreenEnabled?: boolean
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
}

/** Элемент с вендорным запросом полноэкранного режима (Safari до 16.4). */
interface VendorFullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void
}

/** Шаг перемотки стрелками, в секундах. */
const SEEK_STEP_SECONDS = 5

/** Через столько миллисекунд без движения курсора панель уходит с кадра. */
const CONTROLS_IDLE_MS = 2200

const videoBand = ref<HTMLElement | null>(null)
const videoFrame = ref<HTMLElement | null>(null)
const videoEl = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const isMuted = ref(true)
const isFullscreen = ref(false)
const isFullscreenSupported = ref(false)
/** Пользователь тянет бегунок: пока это так, `timeupdate` не перебивает позицию. */
const isScrubbing = ref(false)
const currentTime = ref(0)
const duration = ref(0)
/** Конец буферизованного отрезка, содержащего текущую позицию, в секундах. */
const bufferedTime = ref(0)
const volumePercent = ref(100)
/** Курсор недавно двигался над кадром — панель держим на виду. */
const isPointerActive = ref(false)
/** Фокус внутри кадра: панель нужна клавиатуре, даже если курсор давно замер. */
const isFocusInFrame = ref(false)
/** Курсор стоит на самой панели — не гасим её под занесённой рукой. */
const isPointerOverControls = ref(false)

let userPaused = false
let pointerIdleTimer: ReturnType<typeof setTimeout> | null = null
/** Последняя ненулевая громкость: к ней возвращаемся при снятии mute. */
let lastVolumePercent = 100
let bandObserver: IntersectionObserver | null = null
/** Отписки от событий видео и документа, выполняются в `onBeforeUnmount`. */
let detachListeners: Array<() => void> = []

const isSeekable = computed(() => duration.value > 0)
const playedPercent = computed(() =>
  isSeekable.value ? Math.min(100, (currentTime.value / duration.value) * 100) : 0,
)
const bufferedPercent = computed(() =>
  isSeekable.value ? Math.min(100, (bufferedTime.value / duration.value) * 100) : 0,
)

/**
 * Держать панель поверх кадра постоянно незачем — она закрывает картинку.
 * На паузе и при любом обращении к ролику панель на виду, во время
 * воспроизведения уходит через `CONTROLS_IDLE_MS` после последнего движения.
 */
const areControlsVisible = computed(() =>
  !isPlaying.value
  || isScrubbing.value
  || isFocusInFrame.value
  || isPointerOverControls.value
  || isPointerActive.value,
)

/** Отмечает обращение к кадру и заводит таймер ухода панели. */
function markPointerActive() {
  isPointerActive.value = true
  if (pointerIdleTimer) clearTimeout(pointerIdleTimer)
  pointerIdleTimer = setTimeout(() => {
    isPointerActive.value = false
    pointerIdleTimer = null
  }, CONTROLS_IDLE_MS)
}

/** Курсор ушёл с кадра — прячем панель, не дожидаясь таймера. */
function forgetPointerActivity() {
  if (pointerIdleTimer) {
    clearTimeout(pointerIdleTimer)
    pointerIdleTimer = null
  }
  isPointerActive.value = false
}

/**
 * Отпускает панель, когда фокус ушёл за пределы кадра.
 * @param event событие `focusout` на кадре
 */
function handleFrameFocusOut(event: FocusEvent) {
  const frame = videoFrame.value
  const nextTarget = event.relatedTarget

  if (!frame || (nextTarget instanceof Node && frame.contains(nextTarget))) return

  isFocusInFrame.value = false
}

/**
 * Подбирает форму русского существительного для числа.
 * @param value количество
 * @param forms формы для 1, 2 и 5 — например `['минута', 'минуты', 'минут']`
 * @returns подходящую форму слова
 */
function pluralizeRu(value: number, forms: readonly [string, string, string]): string {
  const withinHundred = value % 100
  const withinTen = value % 10
  if (withinHundred >= 11 && withinHundred <= 14) return forms[2]
  if (withinTen === 1) return forms[0]
  if (withinTen >= 2 && withinTen <= 4) return forms[1]
  return forms[2]
}

/**
 * Приводит секунды к целому неотрицательному значению.
 * @note `duration` до загрузки метаданных равна `NaN`, у потоков — `Infinity`
 * @param seconds исходное значение в секундах
 * @returns целое число секунд, не меньше нуля
 */
function toWholeSeconds(seconds: number): number {
  return Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0
}

/**
 * Форматирует секунды в таймкод для показа в панели.
 * @param seconds позиция в секундах
 * @returns строку вида `1:07`
 */
function formatClock(seconds: number): string {
  const total = toWholeSeconds(seconds)
  return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, '0')}`
}

/**
 * Проговаривает позицию словами для скринридера.
 * @note таймкод `1:07` читается вслух как «один двоеточие ноль семь»,
 *       поэтому для `aria-valuetext` нужна отдельная словесная форма
 * @param seconds позиция в секундах
 * @returns строку вида «1 минута 7 секунд»
 */
function formatSpokenTime(seconds: number): string {
  const total = toWholeSeconds(seconds)
  const minutes = Math.floor(total / 60)
  const rest = total % 60
  const parts: string[] = []
  if (minutes > 0) parts.push(`${minutes} ${pluralizeRu(minutes, ['минута', 'минуты', 'минут'])}`)
  if (rest > 0 || minutes === 0) {
    parts.push(`${rest} ${pluralizeRu(rest, ['секунда', 'секунды', 'секунд'])}`)
  }
  return parts.join(' ')
}

const currentTimeLabel = computed(() => formatClock(currentTime.value))
const durationLabel = computed(() => formatClock(duration.value))
const seekValueText = computed(() =>
  isSeekable.value
    ? `${formatSpokenTime(currentTime.value)} из ${formatSpokenTime(duration.value)}`
    : 'Видео ещё не загружено',
)
const volumeValueText = computed(() =>
  isMuted.value ? 'Звук выключен' : `${volumePercent.value} процентов`,
)

/**
 * Гасит все текстовые дорожки ролика.
 * @note дорожка `captions` остаётся в разметке как текстовая альтернатива,
 *       но в кадре не должно быть подписей вроде «[Музыка]»; браузер может
 *       поднять дорожку заново после загрузки метаданных, поэтому вызываем
 *       и при монтировании, и на `loadedmetadata`
 * @param video элемент ролика
 */
function disableTextTracks(video: HTMLVideoElement) {
  for (let i = 0; i < video.textTracks.length; i += 1) video.textTracks[i]!.mode = 'disabled'
}

/**
 * Подписывается на событие и запоминает отписку.
 * @param target  элемент или документ
 * @param type    имя события
 * @param handler обработчик
 */
function bindEvent(target: EventTarget, type: string, handler: EventListener) {
  target.addEventListener(type, handler)
  detachListeners.push(() => target.removeEventListener(type, handler))
}

/**
 * Переключает воспроизведение по кнопке.
 *
 * Ручная пауза запоминается в `userPaused`, чтобы наблюдатель не запускал
 * ролик заново при следующем появлении полосы в кадре.
 */
function togglePlayback() {
  const video = videoEl.value
  if (!video) return

  if (video.paused) {
    userPaused = false
    void video.play().catch(() => {})
  }
  else {
    userPaused = true
    video.pause()
  }
}

/**
 * Сверяет состояние звука в панели с состоянием элемента.
 */
function syncVolume() {
  const video = videoEl.value
  if (!video) return

  isMuted.value = video.muted
  volumePercent.value = Math.round(video.volume * 100)
}

/**
 * Включает и выключает музыку ролика.
 *
 * Уровень громкости переживает переключение: если ползунок увели в ноль,
 * при снятии mute возвращаем последнее ненулевое значение.
 * Со звуком ролик всегда играет: если он стоял на паузе, запускаем его.
 */
function toggleSound() {
  const video = videoEl.value
  if (!video) return

  const nextMuted = !video.muted
  video.muted = nextMuted
  if (!nextMuted && video.volume === 0) video.volume = lastVolumePercent / 100
  syncVolume()

  if (!video.muted && video.paused) {
    userPaused = false
    void video.play().catch(() => {})
  }
}

/**
 * Применяет громкость с ползунка.
 * @note ноль на ползунке равносилен mute, чтобы кнопка и ползунок
 *       не рассказывали о звуке разное
 * @param event событие `input` ползунка громкости
 */
function onVolumeInput(event: Event) {
  const video = videoEl.value
  const next = Number((event.target as HTMLInputElement).value)
  if (!video || !Number.isFinite(next)) return

  const clamped = Math.min(Math.max(Math.round(next), 0), 100)
  video.volume = clamped / 100
  video.muted = clamped === 0
  if (clamped > 0) lastVolumePercent = clamped
  syncVolume()
}

/**
 * Переводит ролик на выбранную позицию.
 * @param seconds позиция в секундах, обрезается по длительности
 */
function seekTo(seconds: number) {
  const video = videoEl.value
  if (!video || !isSeekable.value) return

  const clamped = Math.min(Math.max(seconds, 0), duration.value)
  currentTime.value = clamped
  video.currentTime = clamped
}

/**
 * Перематывает ролик перетаскиванием и кликом по полосе.
 * @param event событие `input` полосы прогресса
 */
function onSeekInput(event: Event) {
  const next = Number((event.target as HTMLInputElement).value)
  if (!Number.isFinite(next)) return
  seekTo(next)
}

/**
 * Перематывает ролик с клавиатуры.
 * @note нативный шаг полосы задан как `any` ради плавного перетаскивания,
 *       поэтому стрелки, Home и End обрабатываем сами — иначе одно нажатие
 *       двигало бы позицию на неразличимую долю секунды
 * @param event событие клавиатуры на полосе прогресса
 */
function onSeekKeydown(event: KeyboardEvent) {
  if (!isSeekable.value) return

  let next: number | null = null
  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
    next = currentTime.value + SEEK_STEP_SECONDS
  }
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
    next = currentTime.value - SEEK_STEP_SECONDS
  }
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = duration.value

  if (next === null) return
  event.preventDefault()
  seekTo(next)
}

/**
 * Возвращает элемент, раскрытый на весь экран.
 * @returns элемент в полноэкранном режиме или `null`
 */
function readFullscreenElement(): Element | null {
  const doc: VendorFullscreenDocument = document
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null
}

/**
 * Сверяет состояние кнопки с реальным полноэкранным режимом.
 */
function syncFullscreen() {
  isFullscreen.value = readFullscreenElement() === videoFrame.value
}

/**
 * Раскрывает кадр на весь экран и возвращает обратно.
 * @note раскрываем именно `.video-band__frame`, а не `<video>`, — тогда
 *       панель управления остаётся видимой поверх кадра
 */
async function toggleFullscreen() {
  const frame: VendorFullscreenElement | null = videoFrame.value
  const doc: VendorFullscreenDocument = document
  if (!frame) return

  try {
    if (readFullscreenElement()) {
      if (typeof doc.exitFullscreen === 'function') await doc.exitFullscreen()
      else if (typeof doc.webkitExitFullscreen === 'function') await doc.webkitExitFullscreen()
    }
    else if (typeof frame.requestFullscreen === 'function') await frame.requestFullscreen()
    else if (typeof frame.webkitRequestFullscreen === 'function') {
      await frame.webkitRequestFullscreen()
    }
  }
  catch {
    // Браузер отказал в переходе — актуальное состояние вернёт `fullscreenchange`
  }
  syncFullscreen()
}

/**
 * Считывает длительность ролика после загрузки метаданных.
 */
function syncDuration() {
  const video = videoEl.value
  if (!video) return

  duration.value = Number.isFinite(video.duration) ? video.duration : 0
}

/**
 * Считывает конец буферизованного отрезка вокруг текущей позиции.
 * @note `buffered` может содержать несколько разрывных отрезков после перемоток,
 *       для полосы нужен только тот, в котором сейчас находится воспроизведение
 */
function syncBuffered() {
  const video = videoEl.value
  if (!video) return

  const ranges = video.buffered
  let end = 0
  for (let i = 0; i < ranges.length; i += 1) {
    if (ranges.start(i) <= video.currentTime && ranges.end(i) > end) end = ranges.end(i)
  }
  bufferedTime.value = end
}

/**
 * Стартует ролик только когда полоса попала в кадр, и заводит панель управления.
 *
 * `preload="none"` плюс наблюдатель держат 5,8 МБ вне первой загрузки.
 * При `prefers-reduced-motion` и включённой экономии трафика автозапуска нет —
 * остаётся постер и кнопки; сама панель при этом работает, ролик подгрузится
 * по нажатию.
 */
onMounted(() => {
  const video = videoEl.value
  const band = videoBand.value
  if (!video || !band) return

  video.muted = true
  disableTextTracks(video)
  syncVolume()

  bindEvent(video, 'loadedmetadata', () => {
    disableTextTracks(video)
    syncDuration()
    syncBuffered()
  })
  bindEvent(video, 'durationchange', syncDuration)
  bindEvent(video, 'timeupdate', () => {
    if (!isScrubbing.value) currentTime.value = video.currentTime
    syncBuffered()
  })
  bindEvent(video, 'progress', syncBuffered)
  bindEvent(video, 'volumechange', syncVolume)
  bindEvent(video, 'ended', () => {
    // При `loop` событие приходит редко, но если браузер его выдал —
    // возвращаем панель в исходное состояние
    isPlaying.value = false
    currentTime.value = 0
  })

  const doc: VendorFullscreenDocument = document
  isFullscreenSupported.value = Boolean(doc.fullscreenEnabled || doc.webkitFullscreenEnabled)
  if (isFullscreenSupported.value) {
    bindEvent(document, 'fullscreenchange', syncFullscreen)
    bindEvent(document, 'webkitfullscreenchange', syncFullscreen)
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } })
    .connection?.saveData === true
  if (reduceMotion || saveData) return

  bandObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && !userPaused) void video.play().catch(() => {})
      else if (!entry.isIntersecting && !video.paused) video.pause()
    }
  }, { threshold: 0.35 })
  bandObserver.observe(band)
})

onBeforeUnmount(() => {
  bandObserver?.disconnect()
  bandObserver = null
  if (pointerIdleTimer) {
    clearTimeout(pointerIdleTimer)
    pointerIdleTimer = null
  }
  for (const detach of detachListeners) detach()
  detachListeners = []
})

useSeoMeta({
  title: 'Пилорама в Ленинградской области – доска, вагонка, имитация бруса',
  description:
    'Пилорама в Разбегаево, Ломоносовский район: доска обрезная и сухая, строганая доска, имитация бруса, вагонка, огнебиозащита. Цены производителя, доставка по СПб и Ленинградской области.',
  ogTitle: 'Пилорама в Ленинградской области — Разбегаево',
  ogDescription:
    'Доска, имитация бруса и вагонка с собственного производства. Цены за м³, доставка по Санкт-Петербургу и Ленинградской области.',
  ogImage: `${siteUrl}/images/og/glavnaya.jpg`,
  ogType: 'website',
  ogUrl: `${siteUrl}/`,
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: `${siteUrl}/` }],
})

useSchemaOrg([
  defineLocalBusiness({
    '@id': `${siteUrl}/#localbusiness`,
    '@type': 'HomeAndConstructionBusiness',
    name: 'Пилорама Разбегаево',
    url: `${siteUrl}/`,
    telephone: businessPhoneInternational,
    image: `${siteUrl}/images/brushing-1.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessAddress,
      addressLocality: 'деревня Разбегаево',
      addressRegion: 'Ленинградская область',
      addressCountry: 'RU',
    },
    makesOffer: priceListProducts.filter((product) => product.price !== null).map((product) =>
      defineOffer({
        price: product.price ?? undefined,
        priceCurrency: 'RUB',
        itemOffered: defineProduct({
          name: product.title,
          description: product.description,
          image: `${siteUrl}${product.image}`,
        }),
      }),
    ),
  }),
])
</script>

<template>
  <main class="home-page">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__inner">
        <p class="eyebrow eyebrow--hero">Собственное производство · Разбегаево</p>
        <h1 id="hero-title">Пилорама<br>в Ленинградской области</h1>

        <div class="hero__copy">
          <p class="hero__lead">
            Производим доску, вагонку и имитацию бруса в Разбегаево под Санкт-Петербургом.
            Пилим, сушим, строгаем и красим на своей площадке, доставляем
            по СПб и Ленинградской области.
          </p>

          <div class="hero__actions">
            <NuxtLink class="button button--primary" to="/pilomaterialy">
              Смотреть каталог
            </NuxtLink>
            <a
              class="button button--secondary"
              :href="businessMaxUrl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Обсудить заказ в MAX, откроется новая вкладка"
            >Обсудить заказ в MAX</a>
          </div>
        </div>

        <dl class="hero__facts" aria-label="Преимущества производства">
          <div>
            <dt>Производство</dt>
            <dd>в Разбегаево</dd>
          </div>
          <div>
            <dt>Продажа</dt>
            <dd>оптом и в розницу</dd>
          </div>
          <div>
            <dt>Оплата</dt>
            <dd>по факту отгрузки</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="catalog-preview" aria-labelledby="catalog-title">
      <header class="section-heading">
        <div>
          <p class="eyebrow">Каталог</p>
          <h2 id="catalog-title">Основные позиции</h2>
        </div>
        <div class="section-heading__aside">
          <p>
            Четыре востребованных материала с актуальными минимальными ценами.
            Сечения и наличие конкретной партии подтвердит менеджер.
          </p>
          <NuxtLink class="text-link" to="/pilomaterialy">Весь каталог и цены</NuxtLink>
        </div>
      </header>

      <div class="product-list">
        <article
          v-for="product in featuredProducts"
          :key="product.number"
          class="product-row"
        >
          <span class="product-row__number" aria-hidden="true">{{ product.number }}</span>
          <figure class="product-row__image">
            <NuxtImg
              :src="product.image"
              :alt="product.alt"
              width="720"
              height="520"
              sizes="xs:44vw sm:22vw md:20vw lg:18vw xl:14vw xxl:12vw"
              densities="1 2"
              format="webp"
              loading="lazy"
            />
          </figure>
          <div class="product-row__copy">
            <h3>{{ product.displayTitle }}</h3>
            <p>{{ product.description }}</p>
          </div>
          <dl class="product-row__details">
            <div>
              <dt>{{ product.specs[0][0] }}</dt>
              <dd>{{ product.specs[0][1] }}</dd>
            </div>
            <div>
              <dt>Цена</dt>
              <dd class="product-row__price">{{ formatProductPrice(product) }}</dd>
            </div>
          </dl>
        </article>
      </div>

      <nav class="catalog-preview__topics" aria-label="Разделы каталога">
        <NuxtLink class="text-link" to="/doska">Доска обрезная</NuxtLink>
        <NuxtLink class="text-link" to="/suhaya-doska">Сухая и строганая доска</NuxtLink>
        <NuxtLink class="text-link" to="/vagonka">Вагонка</NuxtLink>
        <NuxtLink class="text-link" to="/imitatsiya-brusa">Имитация бруса</NuxtLink>
        <NuxtLink class="text-link" to="/ognebiozashchita">Огнебиозащита</NuxtLink>
        <NuxtLink class="text-link" to="/dostavka">Доставка по СПб и области</NuxtLink>
      </nav>
    </section>

    <section class="production" aria-labelledby="production-title">
      <div class="production__heading">
        <p class="eyebrow eyebrow--light">Собственное производство</p>
        <h2 id="production-title">Распил, сушка,<br>строжка, покраска</h2>
      </div>
      <div class="production__body">
        <p class="production__lead">
          Полный цикл на собственной площадке в Разбегаево.
        </p>
        <dl class="production__steps">
          <div><dt>01</dt><dd>Распил и сортировка древесины</dd></div>
          <div><dt>02</dt><dd>Камерная сушка материала</dd></div>
          <div><dt>03</dt><dd>Строгание и профилирование</dd></div>
          <div><dt>04</dt><dd>Покраска и огнебиозащита</dd></div>
        </dl>
        <NuxtLink class="text-link text-link--light" to="/o-nas">
          Подробнее о производстве
        </NuxtLink>
      </div>
    </section>

    <section
      ref="videoBand"
      class="video-band"
      aria-label="Видео с производства"
    >
      <div
        ref="videoFrame"
        class="video-band__frame"
        @pointermove="markPointerActive"
        @pointerdown="markPointerActive"
        @pointerleave="forgetPointerActivity"
        @focusin="isFocusInFrame = true"
        @focusout="handleFrameFocusOut"
      >
        <video
          ref="videoEl"
          class="video-band__video"
          muted
          loop
          playsinline
          preload="none"
          poster="/images/video-poster.jpg"
          aria-label="Видео о производстве и готовой продукции"
          aria-describedby="video-audio-description"
          @play="isPlaying = true"
          @pause="isPlaying = false"
        >
          <source src="/mp4/short-sawmill-video.mp4" type="video/mp4">
          <!-- Дорожка остаётся как текстовая альтернатива, но не включена:
               в кадре не должно быть подписей вроде «[Музыка]» -->
          <track
            kind="captions"
            src="/captions/short-sawmill-video.ru.vtt"
            srclang="ru"
            label="Русские субтитры"
          >
          Ваш браузер не поддерживает воспроизведение видео.
        </video>

        <!-- Во время воспроизведения панель уходит с кадра; `data-hidden`
             гасит её прозрачностью и снимает клики, но фокус с клавиатуры
             по-прежнему проходит и возвращает панель через `focusin` -->
        <div
          class="video-band__controls"
          :data-hidden="!areControlsVisible"
          @pointerenter="isPointerOverControls = true"
          @pointerleave="isPointerOverControls = false"
        >
          <div class="video-band__scrub">
            <span class="video-band__track" aria-hidden="true">
              <span
                class="video-band__track-buffer"
                :style="{ width: `${bufferedPercent}%` }"
              ></span>
              <span
                class="video-band__track-played"
                :style="{ width: `${playedPercent}%` }"
              ></span>
            </span>
            <!-- Нативный range даёт перетаскивание, клик по полосе и роль slider
                 с валидными aria-valuemin/max/now; шаг `any` держит перетаскивание
                 плавным, стрелки и Home/End перехватывает `onSeekKeydown` -->
            <input
              class="video-band__slider"
              type="range"
              min="0"
              :max="duration || 1"
              step="any"
              :value="currentTime"
              :disabled="!isSeekable"
              aria-label="Перемотка видео"
              :aria-valuetext="seekValueText"
              @input="onSeekInput"
              @keydown="onSeekKeydown"
              @pointerdown="isScrubbing = true"
              @pointerup="isScrubbing = false"
              @pointercancel="isScrubbing = false"
              @change="isScrubbing = false"
            >
          </div>

          <div class="video-band__bar">
            <button
              type="button"
              class="video-band__button"
              :aria-label="isPlaying ? 'Поставить видео на паузу' : 'Запустить видео'"
              @click="togglePlayback"
            >
              <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" focusable="false">
                <path v-if="isPlaying" fill="currentColor" d="M3.5 2h3.2v12H3.5zm5.8 0h3.2v12H9.3z" />
                <path v-else fill="currentColor" d="M4 2.2 13.4 8 4 13.8z" />
              </svg>
            </button>
            <button
              type="button"
              class="video-band__button"
              :aria-pressed="!isMuted"
              aria-label="Звук в видео"
              @click="toggleSound"
            >
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
                <path fill="currentColor" d="M1.6 5.8h2.6L7.9 2.6v10.8L4.2 10.2H1.6z" />
                <g fill="none" stroke="currentColor" stroke-width="1.3">
                  <template v-if="!isMuted">
                    <path d="M10.2 5.6a3.4 3.4 0 0 1 0 4.8" />
                    <path d="M12.3 3.6a6.2 6.2 0 0 1 0 8.8" />
                  </template>
                  <template v-else>
                    <path d="m10.6 5.9 4 4.2m0-4.2-4 4.2" />
                  </template>
                </g>
              </svg>
            </button>
            <div class="video-band__volume">
              <span class="video-band__track" aria-hidden="true">
                <span
                  class="video-band__track-played"
                  :style="{ width: `${isMuted ? 0 : volumePercent}%` }"
                ></span>
              </span>
              <input
                class="video-band__slider"
                type="range"
                min="0"
                max="100"
                step="5"
                :value="isMuted ? 0 : volumePercent"
                aria-label="Громкость видео"
                :aria-valuetext="volumeValueText"
                @input="onVolumeInput"
              >
            </div>

            <!-- Таймкод скрыт от скринридера: позицию и длительность
                 проговаривает `aria-valuetext` полосы перемотки -->
            <p class="video-band__time" aria-hidden="true">
              <span>{{ currentTimeLabel }}</span>
              <span class="video-band__time-divider">/</span>
              <span>{{ durationLabel }}</span>
            </p>

            <button
              v-if="isFullscreenSupported"
              type="button"
              class="video-band__button"
              :aria-pressed="isFullscreen"
              aria-label="Полноэкранный режим"
              @click="toggleFullscreen"
            >
              <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" focusable="false">
                <path
                  v-if="isFullscreen"
                  fill="currentColor"
                  d="M5.1 2h1.5v4.6H2V5.1h3.1zm5.8 0h-1.5v4.6H14V5.1h-3.1zM5.1 14h1.5V9.4H2v1.5h3.1zm5.8 0h-1.5V9.4H14v1.5h-3.1z"
                />
                <path
                  v-else
                  fill="currentColor"
                  d="M2 2h4.6v1.5H3.5v3.1H2zm12 0v4.6h-1.5V3.5H9.4V2zM2 14V9.4h1.5v3.1h3.1V14zm12 0H9.4v-1.5h3.1V9.4H14z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <p id="video-audio-description" class="sr-only">
        В ролике нет речи — только музыка.
      </p>
    </section>

    <section class="gallery" aria-labelledby="gallery-title">
      <header class="section-heading section-heading--gallery">
        <div>
          <h2 id="gallery-title">Фото производства</h2>
        </div>
        <NuxtLink class="text-link" to="/foto">Все фотографии</NuxtLink>
      </header>

      <div class="gallery__grid">
        <figure
          v-for="photo in galleryPreview"
          :key="photo.image"
          class="gallery-card"
          :class="photo.className"
          data-parallax="8"
        >
          <NuxtImg
            :src="photo.image"
            :alt="photo.alt"
            width="1200"
            height="900"
            :sizes="photo.sizes"
            densities="1 2"
            format="webp"
            loading="lazy"
          />
          <figcaption>{{ photo.caption }}</figcaption>
        </figure>
      </div>
    </section>

  </main>
</template>

<style scoped>
.home-page {
  background: var(--color-cream);
}

.eyebrow {
  margin-bottom: 18px;
  color: var(--color-copper);
  font-size: 0.72rem;
  font-weight: 760;
  letter-spacing: 0.15em;
  line-height: 1.4;
  text-transform: uppercase;
}

.eyebrow--light,
.eyebrow--hero {
  color: #d5a184;
}

/* Поле героя — тёмно-зелёная крашеная доска, текст лежит прямо на ней.
   Скрим forest-deep слева держит контраст, сверху — стык с шапкой */
.hero {
  overflow: hidden;
  background-color: var(--color-forest-deep);
  background-image:
    linear-gradient(
      104deg,
      rgb(18 39 30 / 74%) 0%,
      rgb(18 39 30 / 46%) 46%,
      rgb(18 39 30 / 18%) 100%
    ),
    linear-gradient(rgb(18 39 30 / 62%) 0, rgb(18 39 30 / 0%) 16%),
    url('/images/bg-wood-forest.webp');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  color: var(--color-cream);
}

.hero__inner {
  padding: clamp(44px, 6vh, 72px) max(24px, calc((100vw - 1320px) / 2)) 0;
}

.hero h1 {
  position: relative;
  z-index: 1;
  margin: 0;
  overflow-wrap: normal;
  color: var(--color-paper);
  font-size: clamp(3.1rem, 6.2vw, 6.1rem);
  font-weight: 400;
  hyphens: none;
  line-height: 1.02;
  word-break: normal;
}

.hero__copy {
  padding-top: clamp(26px, 3.4vw, 46px);
  padding-bottom: clamp(40px, 6vw, 92px);
}

.hero__lead {
  max-width: 560px;
  margin-bottom: 26px;
  color: rgb(243 239 230 / 85%);
  font-size: clamp(1rem, 1.3vw, 1.18rem);
  line-height: 1.65;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.button {
  display: inline-flex;
  min-height: 52px;
  align-items: center;
  justify-content: center;
  padding: 13px 22px;
  font-size: 0.92rem;
  font-weight: 740;
  line-height: 1.2;
  text-align: center;
  text-decoration: none;
  transition: background-color 180ms ease, color 180ms ease, transform 180ms ease;
}

.button--primary {
  background: var(--color-copper);
  color: var(--color-paper);
}

.button--primary:hover {
  background: var(--color-copper-dark);
}

.button--secondary {
  border: 1px solid rgb(243 239 230 / 55%);
  color: var(--color-cream);
}

.button--secondary:hover {
  background: var(--color-cream);
  border-color: var(--color-cream);
  color: var(--color-forest);
}

.hero__facts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  max-width: 650px;
  margin: clamp(6px, 1vw, 14px) 0 0;
  padding-bottom: clamp(36px, 5vh, 56px);
  border-top: 1px solid var(--color-line-light);
}

.hero__facts div {
  padding: 19px 18px 0 0;
}

.hero__facts div + div {
  padding-left: 18px;
  border-left: 1px solid var(--color-line-light);
}

.hero__facts dt {
  margin-bottom: 4px;
  color: rgb(243 239 230 / 75%);
  font-size: 0.67rem;
  font-weight: 760;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.product-row__details dt {
  margin-bottom: 4px;
  color: rgb(32 35 31 / 70%);
  font-size: 0.67rem;
  font-weight: 760;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.hero__facts dd {
  margin: 0;
  color: var(--color-paper);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1rem;
}

.catalog-preview,
.gallery {
  padding: 112px max(24px, calc((100vw - 1320px) / 2));
  background: var(--color-paper);
}

.section-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 0.55fr);
  align-items: end;
  gap: clamp(48px, 9vw, 140px);
  margin-bottom: 60px;
}

.section-heading h2,
.production h2 {
  max-width: 760px;
  margin: 0;
  font-size: clamp(2.7rem, 4.4vw, 5.1rem);
  font-weight: 400;
  line-height: 1;
}

.section-heading__aside p {
  max-width: 460px;
  margin-bottom: 24px;
  color: rgb(32 35 31 / 85%);
}

.text-link {
  display: inline-block;
  width: max-content;
  border-bottom: 1px solid currentcolor;
  color: var(--color-forest);
  font-size: 0.9rem;
  font-weight: 740;
  text-decoration: none;
  transition: color 180ms ease;
}

.text-link:hover {
  color: var(--color-copper);
}

.text-link--light {
  color: var(--color-cream);
}

.product-list {
  border-top: 1px solid var(--color-ink);
}

.catalog-preview__topics {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 28px;
  margin-top: 40px;
}

.product-row {
  display: grid;
  grid-template-columns: 40px minmax(145px, 180px) minmax(260px, 1fr) minmax(260px, 0.55fr);
  align-items: center;
  gap: clamp(20px, 3vw, 46px);
  min-height: 180px;
  padding: 24px 0;
  border-bottom: 1px solid var(--color-line);
}

.product-row__number {
  align-self: start;
  padding-top: 5px;
  color: rgb(32 35 31 / 70%);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 0.86rem;
}

.product-row__image {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--color-sand);
}

.product-row__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-row h3 {
  margin: 0 0 10px;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.5rem, 2vw, 2.15rem);
  font-weight: 400;
  line-height: 1.1;
}

.product-row__copy > p:last-child {
  max-width: 520px;
  margin-bottom: 0;
  color: rgb(32 35 31 / 85%);
  font-size: 0.9rem;
}

.product-row__details {
  margin: 0;
}

.product-row__details div {
  padding: 11px 0;
}

.product-row__details dd {
  margin: 0;
  font-size: 0.9rem;
}

.product-row__price {
  color: var(--color-copper-dark);
  font-size: 1.04rem !important;
  font-weight: 800;
}

.production {
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(380px, 1.1fr);
  gap: clamp(56px, 10vw, 160px);
  padding: 118px max(24px, calc((100vw - 1320px) / 2));
  background: var(--color-forest);
  color: var(--color-cream);
}

.production__lead {
  max-width: 610px;
  margin-bottom: 44px;
  color: rgb(243 239 230 / 75%);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.35rem, 2vw, 1.8rem);
  line-height: 1.45;
}

.production__steps {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 36px;
  margin: 0 0 42px;
  border-top: 1px solid rgb(243 239 230 / 28%);
}

.production__steps div {
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 14px;
  padding: 18px 0;
  border-bottom: 1px solid rgb(243 239 230 / 22%);
}

.production__steps dt {
  color: #d5a184;
  font-family: Georgia, 'Times New Roman', serif;
}

.production__steps dd {
  margin: 0;
}

.section-heading--gallery {
  grid-template-columns: 1fr auto;
}

.gallery__grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-auto-rows: 165px;
  gap: 18px;
}

.gallery-card {
  position: relative;
  grid-column: span 4;
  grid-row: span 2;
  overflow: hidden;
  background: var(--color-sand);
}

.gallery-card--wide {
  grid-column: span 8;
  grid-row: span 3;
}

.gallery-card--product {
  grid-row: span 3;
}

.gallery-card--tall {
  grid-row: span 3;
}

.gallery-card--finish {
  grid-column: span 4;
}

.gallery-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-card--wide img {
  object-position: 50% 58%;
}

.gallery-card--tall img {
  object-position: 50% 57%;
}

.gallery-card--finish img {
  object-position: 38% 58%;
}

.gallery-card figcaption {
  position: absolute;
  right: 14px;
  bottom: 14px;
  left: 14px;
  padding: 10px 12px;
  background: rgb(250 247 240 / 92%);
  color: var(--color-ink);
  font-size: 0.7rem;
  font-weight: 760;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  backdrop-filter: blur(8px);
}

@media (hover: hover) and (pointer: fine) {
  .button:hover {
    transform: translateY(-2px);
  }
}

/* Видео продолжает тёмную полосу производства: во всю ширину, без рамки,
   заголовка и подписи. Тихий луп, звук — по кнопке */
.video-band {
  display: flex;
  justify-content: center;
  overflow: hidden;
  background: var(--color-forest-deep);
}

/* Исходник 848×480: шире ~1180px картинка расползается в апскейл.
   Кадр упирается в этот предел, по бокам остаётся тёмная полоса */
.video-band__frame {
  position: relative;
  width: min(1180px, 100%);
  max-height: 68vh;
  overflow: hidden;
  aspect-ratio: 16 / 9;
}

.video-band__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Когда кадр перестал быть во всю ширину, тёмное поле идёт и сверху-снизу —
   иначе рамка по бокам читается как недотянутое видео, а не как оправа */
@media (min-width: 1180px) {
  .video-band {
    padding-block: clamp(30px, 3.4vw, 64px);
  }
}

/* Панель управления набрана теми же плотными тёмными плитками, что и кнопки:
   полоса перемотки — отдельная плитка над рядом, иначе на узком кадре
   всё теснится в одну строку. Кадр панель не перекрывает: две плитки
   у нижней кромки */
.video-band__controls {
  position: absolute;
  right: clamp(16px, 2.2vw, 24px);
  bottom: clamp(16px, 2.2vw, 24px);
  left: clamp(16px, 2.2vw, 24px);
  display: flex;
  flex-direction: column;
  gap: 1px;
  transition:
    opacity var(--motion-duration-ui) var(--motion-ease-out),
    translate var(--motion-duration-ui) var(--motion-ease-out);
}

/* Панель убрана с кадра: клики сквозь неё уходят на видео, а таб-порядок
   сохраняется — попавший на кнопку фокус вернёт панель обработчиком focusin */
.video-band__controls[data-hidden='true'] {
  translate: 0 8px;
  opacity: 0;
  pointer-events: none;
}

.video-band__bar {
  display: flex;
  align-items: stretch;
  gap: 1px;
}

.video-band__button {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  padding: 0;
  border: 0;
  background: rgb(18 39 30 / 84%);
  color: var(--color-cream);
  cursor: pointer;
  transition:
    background-color var(--motion-duration-ui) var(--motion-ease-out),
    color var(--motion-duration-ui) var(--motion-ease-out);
}

.video-band__button:active {
  background: var(--color-copper-dark);
  color: var(--color-paper);
}

@media (hover: hover) and (pointer: fine) {
  .video-band__button:hover {
    background: var(--color-copper);
    color: var(--color-paper);
  }
}

.video-band__scrub,
.video-band__volume {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 14px;
  background: rgb(18 39 30 / 84%);
}

.video-band__scrub {
  height: 34px;
}

.video-band__volume {
  flex: none;
  width: 116px;
  height: 46px;
}

/* Три ступени кремового вместо цвета: непройденное — фон дорожки,
   буферизованное — полутон, пройденное — сплошной кремовый.
   Медь на этой подложке провалила бы контраст.
   Отступ 19px = 14px внутреннего поля плитки плюс половина бегунка:
   так конец заливки совпадает с его центром на всём ходу */
.video-band__track {
  position: absolute;
  top: 50%;
  right: 19px;
  left: 19px;
  height: 4px;
  margin-top: -2px;
  background: rgb(243 239 230 / 22%);
}

.video-band__track-buffer,
.video-band__track-played {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
}

.video-band__track-buffer {
  background: rgb(243 239 230 / 42%);
}

.video-band__track-played {
  background: var(--color-cream);
}

/* Высота фиксированная, а не 100%: в плитке громкости ползунок центрируется
   флексом, и бегунок с дорожкой остаются на одной оси в обеих плитках */
.video-band__slider {
  position: relative;
  width: 100%;
  height: 34px;
  margin: 0;
  padding: 0;
  border: 0;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.video-band__slider:disabled {
  cursor: default;
}

/* Глобальное правило focus-visible в app.vue ловит только a, button и [tabindex],
   поэтому ползункам кольцо рисуем отдельно теми же токенами.
   Подложка всегда тёмная — светлого кольца внутри плитки достаточно */
.video-band__slider:focus-visible {
  outline: 2px solid var(--color-focus-inner);
  outline-offset: -2px;
}

.video-band__slider::-webkit-slider-runnable-track {
  height: 34px;
  background: transparent;
}

.video-band__slider::-moz-range-track {
  height: 34px;
  background: transparent;
}

/* Бегунок выше дорожки: его края выходят на тёмную плитку и остаются
   различимыми даже там, где он стоит поверх пройденного отрезка */
.video-band__slider::-webkit-slider-thumb {
  width: 10px;
  height: 16px;
  margin-top: 9px;
  border: 0;
  appearance: none;
  background: var(--color-cream);
  transition: width var(--motion-duration-ui) var(--motion-ease-out);
}

.video-band__slider::-moz-range-thumb {
  width: 10px;
  height: 16px;

  /* Firefox скругляет бегунок по умолчанию, а углы в системе острые */
  border: 0;
  border-radius: 0;
  background: var(--color-cream);
  transition: width var(--motion-duration-ui) var(--motion-ease-out);
}

.video-band__slider:disabled::-webkit-slider-thumb {
  background: rgb(243 239 230 / 45%);
}

.video-band__slider:disabled::-moz-range-thumb {
  background: rgb(243 239 230 / 45%);
}

@media (hover: hover) and (pointer: fine) {
  .video-band__slider:hover:not(:disabled)::-webkit-slider-thumb {
    width: 14px;
  }

  .video-band__slider:hover:not(:disabled)::-moz-range-thumb {
    width: 14px;
  }
}

/* Таймкод отбит в отдельную плитку у правого края: цифры моноширинные,
   чтобы плитка не дёргалась при смене разрядов */
.video-band__time {
  display: flex;
  flex: none;
  align-items: center;
  height: 46px;
  margin: 0 0 0 auto;
  padding: 0 13px;
  gap: 6px;
  background: rgb(18 39 30 / 84%);
  color: var(--color-cream);
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 0.72rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
  line-height: 1;
  white-space: nowrap;
}

.video-band__time-divider {
  color: rgb(243 239 230 / 70%);
}

/* В полноэкранном режиме кадр перестаёт быть врезкой: снимаем пропорции
   и потолок высоты, ролик вписываем целиком, панель остаётся поверх */
.video-band__frame:fullscreen {
  width: 100%;
  height: 100%;
  max-height: none;
  aspect-ratio: auto;
  background: var(--color-forest-deep);
}

.video-band__frame:fullscreen .video-band__video {
  object-fit: contain;
}

.video-band__frame:-webkit-full-screen {
  width: 100%;
  height: 100%;
  max-height: none;
  aspect-ratio: auto;
  background: var(--color-forest-deep);
}

.video-band__frame:-webkit-full-screen .video-band__video {
  object-fit: contain;
}


@media (max-width: 1100px) {
  .product-row {
    grid-template-columns: 32px 150px minmax(220px, 1fr) minmax(220px, 0.62fr);
  }
}

@media (max-width: 840px) {
  .production {
    grid-template-columns: 1fr;
  }

  .hero__inner {
    padding-top: 40px;
  }

  .hero h1 {
    font-size: clamp(3rem, 10.5vw, 5.4rem);
  }

  .hero__copy {
    padding-top: 22px;
    padding-bottom: 34px;
  }

  .section-heading {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .product-row {
    grid-template-columns: 30px 140px minmax(0, 1fr);
  }

  .product-row__details {
    grid-column: 3;
  }

  .production__heading h2 br {
    display: none;
  }

  .gallery-card,
  .gallery-card--finish {
    grid-column: span 6;
  }

  .gallery-card--wide {
    grid-column: span 12;
  }
}

@media (max-width: 560px) {
  .hero__inner {
    padding: 34px 18px 0;
  }

  .hero h1 {
    overflow-wrap: normal;
    font-size: clamp(2.45rem, 11.8vw, 3.4rem);
    hyphens: none;
    word-break: normal;
  }

  .hero__lead {
    font-size: 0.98rem;
  }

  .hero__actions {
    display: grid;
  }

  .hero__facts {
    grid-template-columns: 1fr;
    margin-top: 20px;
    padding-bottom: 34px;
  }

  .hero__facts div,
  .hero__facts div + div {
    display: grid;
    grid-template-columns: 110px 1fr;
    padding: 13px 0;
    border-bottom: 1px solid var(--color-line-light);
    border-left: 0;
  }

  .hero__facts dt {
    margin: 0;
  }

  .catalog-preview,
  .gallery,
  .production {
    padding: 78px 18px;
  }

  /* На узком экране 16:9 схлопывается в тонкую ленту — берём кадр выше */
  .video-band__frame {
    aspect-ratio: 4 / 3;
  }

  /* Ползунок громкости не помещается в ряд — остаётся кнопка mute */
  .video-band__volume {
    display: none;
  }

  .video-band__time {
    padding: 0 10px;
    letter-spacing: 0.04em;
  }

  .section-heading {
    margin-bottom: 42px;
  }

  .section-heading h2,
  .production h2 {
    font-size: clamp(2.5rem, 13vw, 3.7rem);
  }

  .product-row {
    grid-template-columns: 78px minmax(0, 1fr);
    gap: 16px;
    padding: 22px 0;
  }

  .product-row:hover {
    padding-right: 0;
    padding-left: 0;
  }

  .product-row__number {
    display: none;
  }

  .product-row__image {
    align-self: start;
  }

  .product-row__copy {
    grid-column: 2;
  }

  .product-row__copy > p:last-child {
    display: none;
  }

  .product-row h3 {
    font-size: 1.35rem;
  }

  .product-row__details {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }

  .production__steps {
    grid-template-columns: 1fr;
  }

  .section-heading--gallery {
    grid-template-columns: 1fr;
  }

  .gallery__grid {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
  }

  .gallery-card,
  .gallery-card--wide,
  .gallery-card--product,
  .gallery-card--tall,
  .gallery-card--finish {
    grid-column: auto;
    grid-row: auto;
    aspect-ratio: 4 / 3;
  }

  .gallery-card--tall {
    aspect-ratio: 3 / 4;
  }
}

@media (prefers-reduced-motion: reduce) {
  .button,
  .product-row,
  .product-row__image img,
  .gallery-card img,
  .video-band__button {
    transform: none;
    transition: none;
  }

  /* Панель по-прежнему уходит с кадра, но без сдвига и плавности */
  .video-band__controls,
  .video-band__controls[data-hidden='true'] {
    translate: none;
    transition: none;
  }

  /* Вендорные псевдоэлементы нельзя перечислять в одном списке:
     непонятный селектор обнуляет всё правило целиком */
  .video-band__slider::-webkit-slider-thumb {
    transition: none;
  }

  .video-band__slider::-moz-range-thumb {
    transition: none;
  }
}
</style>
