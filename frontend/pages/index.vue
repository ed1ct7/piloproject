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

const galleryPreview = [
  {
    image: '/images/paint-shop-4.jpg',
    alt: 'Участок обработки древесины с оборудованием и подготовленными материалами',
    caption: 'Цех обработки',
    className: 'gallery-card--wide',
  },
  {
    image: '/images/vagonka-shtil-12-5x120x3000.png',
    alt: 'Аккуратно сложенная вагонка профиля Штиль из хвойной древесины',
    caption: 'Готовая продукция',
    className: 'gallery-card--product',
  },
  {
    image: '/images/lentochnaya-pilorama-raspil.jpg',
    alt: 'Ленточная пилорама с бревном на производственной площадке',
    caption: 'Распил бревна',
    className: 'gallery-card--tall',
  },
  {
    image: '/images/shtabel-suhoi-doski.jpg',
    alt: 'Высокие штабели сухой доски на крытом складе',
    caption: 'Крытый склад',
    className: 'gallery-card--tall',
  },
  {
    image: '/images/lumber-yard-2025-05-21.jpg',
    alt: 'Образцы обработанной древесины на производственной площадке',
    caption: 'Финишная обработка',
    className: 'gallery-card--finish',
  },
]

useSeoMeta({
  title: 'Пилорама Разбегаево – доска, вагонка и пиломатериалы',
  description:
    'Пиломатериалы от производителя в Разбегаево: доска естественной влажности, сухая и строганая доска, имитация бруса, вагонка и огнебиозащита.',
  ogTitle: 'Пилорама Разбегаево',
  ogDescription:
    'Доска, имитация бруса и вагонка с производственной площадки в Разбегаево. Актуальные минимальные цены и фото производства.',
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
    sameAs: [businessMapsUrl, businessMaxUrl],
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
      <div class="hero__content">
        <p class="eyebrow">Пиломатериалы из Ленинградской области</p>
        <h1 id="hero-title">Дерево, подготовленное для хорошей работы</h1>
        <p class="hero__lead">
          Производим доску, вагонку и имитацию бруса в Разбегаево. Отбираем материал,
          сушим, обрабатываем и доставляем по Санкт-Петербургу и области.
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

      <figure class="hero__media" data-parallax="18">
        <NuxtImg
          src="/images/brushing-1.jpg"
          alt="Крупный план обработанной доски с выраженной текстурой древесины"
          width="1536"
          height="2048"
          sizes="xs:100vw sm:100vw md:100vw 841:46vw lg:46vw xl:46vw"
          densities="1"
          format="webp"
          loading="eager"
          preload
          fetchpriority="high"
        />
        <figcaption>
          <span>Точная обработка древесины</span>
          <span>Разбегаево</span>
        </figcaption>
      </figure>
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
              sizes="xs:34vw sm:25vw md:18vw lg:16vw"
              densities="1"
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
    </section>

    <section class="production" aria-labelledby="production-title">
      <div class="production__heading">
        <p class="eyebrow eyebrow--light">Собственное производство</p>
        <h2 id="production-title">От бревна<br>до готового профиля</h2>
      </div>
      <div class="production__body">
        <p class="production__lead">
          Работаем с материалом на собственной площадке: распиливаем, сушим,
          строгаем и готовим партии к отгрузке.
        </p>
        <dl class="production__steps">
          <div><dt>01</dt><dd>Распил и сортировка древесины</dd></div>
          <div><dt>02</dt><dd>Камерная сушка материала</dd></div>
          <div><dt>03</dt><dd>Строгание и профилирование</dd></div>
          <div><dt>04</dt><dd>Комплектация и доставка партии</dd></div>
        </dl>
        <NuxtLink class="text-link text-link--light" to="/o-nas">
          Подробнее о производстве
        </NuxtLink>
      </div>
    </section>

    <section class="gallery" aria-labelledby="gallery-title">
      <header class="section-heading section-heading--gallery">
        <div>
          <p class="eyebrow">Без постановочных кадров</p>
          <h2 id="gallery-title">Производство в деталях</h2>
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
            sizes="xs:100vw sm:50vw md:50vw lg:34vw"
            densities="1"
            format="webp"
            loading="lazy"
          />
          <figcaption>{{ photo.caption }}</figcaption>
        </figure>
      </div>
    </section>

    <section class="video-story" aria-labelledby="video-title">
      <div class="video-story__copy">
        <p class="eyebrow">Рабочий процесс</p>
        <h2 id="video-title">Как начинается ваша доска</h2>
        <p class="video-story__description">
          Короткий фрагмент распила бревна на нашей производственной площадке
          в Разбегаево.
        </p>
        <p id="video-audio-description" class="video-story__audio-description">
          В ролике нет речи: звуковая дорожка передаёт шум работающей ленточной пилорамы.
        </p>
      </div>
      <video
        class="video-story__video"
        controls
        preload="none"
        playsinline
        poster="/images/pilorama-stanok-brevno.jpg"
        aria-label="Короткое видео с производственной площадки пилорамы"
        aria-describedby="video-audio-description"
      >
        <source src="/mp4/short-sawmill-video.mp4" type="video/mp4">
        <track
          default
          kind="captions"
          src="/captions/short-sawmill-video.ru.vtt"
          srclang="ru"
          label="Русские субтитры"
        >
        Ваш браузер не поддерживает воспроизведение видео.
      </video>
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

.eyebrow--light {
  color: #d5a184;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(430px, 0.85fr);
  min-height: 640px;
  max-width: 1320px;
  margin: 0 auto;
  border-bottom: 1px solid var(--color-line);
}

.hero__content {
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  padding: 64px clamp(32px, 4vw, 64px) 54px 24px;
}

.hero h1 {
  max-width: 720px;
  margin: 0 0 22px;
  overflow-wrap: normal;
  font-size: clamp(3.2rem, 4.8vw, 5rem);
  font-weight: 400;
  hyphens: none;
  line-height: 1;
  word-break: normal;
}

.hero__lead {
  max-width: 610px;
  margin-bottom: 26px;
  color: #50564f;
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
  color: #fffaf2;
}

.button--primary:hover {
  background: var(--color-copper-dark);
}

.button--secondary {
  border: 1px solid var(--color-forest);
  color: var(--color-forest);
}

.button--secondary:hover {
  background: var(--color-forest);
  color: #fffaf2;
}

.hero__facts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  max-width: 650px;
  margin: 44px 0 0;
  border-top: 1px solid var(--color-line);
}

.hero__facts div {
  padding: 19px 18px 0 0;
}

.hero__facts div + div {
  padding-left: 18px;
  border-left: 1px solid var(--color-line);
}

.hero__facts dt,
.product-row__details dt {
  margin-bottom: 4px;
  color: #555b54;
  font-size: 0.67rem;
  font-weight: 760;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.hero__facts dd {
  margin: 0;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1rem;
}

.hero__media {
  position: relative;
  min-width: 0;
  overflow: hidden;
  background: var(--color-forest);
}

.hero__media::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(180deg, transparent 64%, rgb(18 39 30 / 38%));
  pointer-events: none;
}

.hero__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 58%;
}

.hero__media figcaption {
  position: absolute;
  right: 24px;
  bottom: 22px;
  left: 24px;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  color: #fffaf2;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
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
.production h2,
.video-story h2 {
  max-width: 760px;
  margin: 0;
  font-size: clamp(2.7rem, 4.4vw, 5.1rem);
  font-weight: 400;
  line-height: 1;
}

.section-heading__aside p {
  max-width: 460px;
  margin-bottom: 24px;
  color: #555b54;
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
  color: #f5eee2;
}

.product-list {
  border-top: 1px solid var(--color-ink);
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
  color: #5f645e;
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
  color: #666b64;
  font-size: 0.9rem;
}

.product-row__details {
  margin: 0;
}

.product-row__details div {
  padding: 11px 0;
  border-top: 1px solid var(--color-line);
}

.product-row__details div:last-child {
  border-bottom: 1px solid var(--color-line);
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
  color: #f5eee2;
}

.production__lead {
  max-width: 610px;
  margin-bottom: 44px;
  color: #d8d8ce;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.35rem, 2vw, 1.8rem);
  line-height: 1.45;
}

.production__steps {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 36px;
  margin: 0 0 42px;
  border-top: 1px solid rgb(245 238 226 / 28%);
}

.production__steps div {
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 14px;
  padding: 18px 0;
  border-bottom: 1px solid rgb(245 238 226 / 22%);
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

.video-story {
  display: grid;
  grid-template-columns: minmax(280px, 0.7fr) minmax(420px, 1.3fr);
  align-items: center;
  gap: clamp(48px, 9vw, 140px);
  padding: 112px max(24px, calc((100vw - 1320px) / 2));
  background: #ded4c3;
}

.video-story__description {
  max-width: 420px;
  margin: 26px 0 0;
  color: #565b54;
  font-size: 1.05rem;
}

.video-story__copy .video-story__audio-description {
  margin-top: 12px;
  font-size: 0.9rem;
}

.video-story__video {
  width: 100%;
  aspect-ratio: 16 / 10;
  background: var(--color-ink);
  box-shadow: 0 30px 70px rgb(32 35 31 / 18%);
  object-fit: cover;
}

@media (max-width: 1100px) {
  .hero {
    grid-template-columns: minmax(0, 1.2fr) minmax(360px, 0.8fr);
  }

  .hero__content {
    padding-left: 32px;
  }

  .product-row {
    grid-template-columns: 32px 150px minmax(220px, 1fr) minmax(220px, 0.62fr);
  }
}

@media (max-width: 840px) {
  .hero,
  .production,
  .video-story {
    grid-template-columns: 1fr;
  }

  .hero__content {
    padding: 76px 28px 56px;
  }

  .hero h1 {
    font-size: clamp(3.2rem, 11vw, 5.6rem);
  }

  .hero__media {
    min-height: 600px;
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
  .hero__content {
    padding: 58px 18px 44px;
  }

  .hero h1 {
    margin-bottom: 22px;
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
    margin-top: 44px;
  }

  .hero__facts div,
  .hero__facts div + div {
    display: grid;
    grid-template-columns: 110px 1fr;
    padding: 13px 0;
    border-bottom: 1px solid var(--color-line);
    border-left: 0;
  }

  .hero__facts dt {
    margin: 0;
  }

  .hero__media {
    min-height: 450px;
  }

  .catalog-preview,
  .gallery,
  .production,
  .video-story {
    padding: 78px 18px;
  }

  .section-heading {
    margin-bottom: 42px;
  }

  .section-heading h2,
  .production h2,
  .video-story h2 {
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

  .video-story__video {
    aspect-ratio: 4 / 3;
  }
}

@media (prefers-reduced-motion: reduce) {
  .button,
  .product-row,
  .product-row__image img,
  .gallery-card img {
    transform: none;
    transition: none;
  }
}
</style>
