<script setup lang="ts">
// Первые четыре позиции прайса показываются в витрине на главной.
const featuredProducts = priceListProducts.slice(0, 4)

const galleryPreview = [
  {
    image: '/images/pilorama-stanok-brevno.jpg',
    alt: 'Пилорамный станок с бревном на подаче под навесом производства',
    caption: 'Распил бревна',
  },
  {
    image: '/images/sklad-obrabotannoi-doski.jpg',
    alt: 'Штабели обработанной доски на крытом складе пилорамы',
    caption: 'Крытый склад',
  },
  {
    image: '/images/ploshchadka-otgruzka-pilomaterialov.jpg',
    alt: 'Производственная площадка с партией доски и машиной на отгрузке',
    caption: 'Отгрузка партии',
  },
  {
    image: '/images/doska-s-ognebiozashchitoi.jpg',
    alt: 'Штабель доски, обработанной огнебиозащитным составом',
    caption: 'Огнебиозащита',
  },
]

useSeoMeta({
  title: 'Пилорама Разбегаево – доска, брус и пиломатериалы с доставкой',
  description: 'Пиломатериалы от производителя в Разбегаево: сухая строганая доска, брусок, рейка, имитация бруса, огнебиозащитная обработка. Цены за м³, доставка по Санкт-Петербургу и Ленинградской области.',
  ogTitle: 'Пилорама Разбегаево',
  ogDescription: 'Доска, брусок, рейка и имитация бруса с производственной площадки в Разбегаево. Цены и фото производства.',
  ogImage: `${siteUrl}/images/lentochnaya-pilorama-raspil.jpg`,
  ogType: 'website',
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
    telephone: businessPhone,
    image: `${siteUrl}/images/lentochnaya-pilorama-raspil.jpg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Разбегаево',
      addressRegion: 'Ленинградская область',
      addressCountry: 'RU',
    },
    makesOffer: priceListProducts.map((product) =>
      defineOffer({
        price: product.price,
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
  <main>
    <section class="production-hero">
      <div class="production-hero__copy">
        <h1>Пиломатериалы в Разбегаево: доска, брусок, рейка</h1>
        <p class="production-hero__lead">
          Пиломатериалы от производителя оптом и в розницу. Доставка по Санкт-Петербургу
          и Ленинградской области. Оплата по факту отгрузки.
        </p>

        <div class="production-hero__actions">
          <NuxtLink class="button button--signal" to="/pilomaterialy">Каталог и цены</NuxtLink>
          <a
            class="button button--outline"
            :href="businessWhatsAppUrl"
            target="_blank"
            rel="noopener"
          >Написать в WhatsApp</a>
        </div>

        <dl class="production-hero__facts">
          <div>
            <dt>Телефон</dt>
            <dd><a :href="businessPhoneHref">{{ businessPhone }}</a></dd>
          </div>
          <div>
            <dt>Цены</dt>
            <dd>Указаны за кубометр</dd>
          </div>
          <div>
            <dt>Каталог</dt>
            <dd>8 позиций с ценами</dd>
          </div>
        </dl>
      </div>

      <figure class="production-hero__media">
        <NuxtImg
          src="/images/lentochnaya-pilorama-raspil.jpg"
          alt="Ленточная пилорама с бревном на рельсах производственной площадки"
          width="1200"
          height="1600"
          sizes="xs:100vw sm:100vw md:55vw lg:55vw xl:55vw"
          densities="1"
          format="webp"
          loading="eager"
          preload
          fetchpriority="high"
        />
        <figcaption>
          <span>Ленточная пилорама</span>
          <span>Разбегаево</span>
        </figcaption>
      </figure>
    </section>

    <section class="catalog-preview" aria-labelledby="catalog-title">
      <header class="editorial-head">
        <div aria-hidden="true" />
        <h2 id="catalog-title">Основные позиции с ценами за кубометр</h2>
        <p>
          Сухой строганый материал, доска камерной сушки, имитация бруса и доска
          с огнебиозащитной обработкой.
        </p>
      </header>

      <div class="product-ledger">
        <article v-for="product in featuredProducts" :key="product.number" class="product-row">
          <figure>
            <NuxtImg
              :src="product.image"
              :alt="product.alt"
              width="720"
              height="520"
              sizes="xs:100vw sm:42vw md:28vw lg:24vw"
              densities="1"
              format="webp"
              loading="lazy"
            />
          </figure>
          <span class="product-row__code" aria-hidden="true" />
          <div class="product-row__title">
            <h3>{{ product.title }}</h3>
            <p>{{ product.description }}</p>
          </div>
          <dl>
            <div>
              <dt>Сечение</dt>
              <dd>{{ product.specs[0][1] }}</dd>
            </div>
            <div>
              <dt>Цена</dt>
              <dd class="product-row__price">{{ formatPricePerCubicMeter(product.price) }}</dd>
            </div>
          </dl>
        </article>
      </div>

      <div class="section-action">
        <NuxtLink class="text-link" to="/pilomaterialy">Все позиции и цены каталога</NuxtLink>
      </div>
    </section>

    <section class="photo-band" aria-labelledby="photo-band-title">
      <header class="photo-band__head">
        <div aria-hidden="true" />
        <h2 id="photo-band-title">Производство, склад и отгрузка</h2>
        <NuxtLink class="text-link" to="/foto">Смотреть все фотографии</NuxtLink>
      </header>

      <div class="photo-band__grid">
        <figure v-for="photo in galleryPreview" :key="photo.image">
          <NuxtImg
            :src="photo.image"
            :alt="photo.alt"
            width="720"
            height="900"
            sizes="xs:50vw sm:25vw md:24vw"
            densities="1"
            format="webp"
            loading="lazy"
          />
          <figcaption>{{ photo.caption }}</figcaption>
        </figure>
      </div>
    </section>

    <section class="about-strip" aria-labelledby="about-title">
      <div class="about-strip__text">
        <h2 id="about-title">О пилораме</h2>
        <p>
          Доступна обработка доски огнебиозащитным составом. Вся продукция регистрируется
          в ЛесЕГАИС.
        </p>
      </div>

      <dl class="about-strip__facts">
        <div>
          <dt>Организация</dt>
          <dd>{{ businessRequisites.fullName }}</dd>
        </div>
        <div>
          <dt>ИНН</dt>
          <dd>{{ businessRequisites.inn }}</dd>
        </div>
        <div>
          <dt>ОГРНИП</dt>
          <dd>{{ businessRequisites.ogrnip }}</dd>
        </div>
      </dl>
    </section>

    <section class="work-video" aria-labelledby="video-title">
      <div class="work-video__heading">
        <h2 id="video-title">Работа пилорамы в Разбегаево</h2>
        <p>
          Короткое видео распила бревна на производственной площадке.
        </p>
      </div>

      <video
        controls
        preload="metadata"
        playsinline
        poster="/images/pilorama-stanok-brevno.jpg"
        aria-label="Короткое видео с производственной площадки пилорамы"
      >
        <source src="/mp4/short-sawmill-video.mp4" type="video/mp4">
        Ваш браузер не поддерживает воспроизведение видео.
      </video>
    </section>

  </main>
</template>
