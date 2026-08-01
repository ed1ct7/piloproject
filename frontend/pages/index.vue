<script setup lang="ts">
// Первые четыре позиции прайса показываются в витрине на главной.
const featuredProducts = priceListProducts.slice(0, 4)

const orderSteps = [
  {
    number: '01',
    title: 'Параметры',
    text: 'Покупатель сообщает материал, размеры, количество и назначение будущей конструкции.',
  },
  {
    number: '02',
    title: 'Наличие',
    text: 'Сотрудник сверяет доступные позиции и уточняет возможность распила для заказа.',
  },
  {
    number: '03',
    title: 'Расчёт',
    text: 'Стоимость определяется после согласования объёма, обработки и способа получения.',
  },
  {
    number: '04',
    title: 'Отгрузка',
    text: 'Готовую партию забирают самостоятельно или согласуют подходящий вариант доставки.',
  },
]

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
        <div class="production-stamp">
          <span>59°45′ с. ш.</span>
          <span>РАЗБЕГАЕВО / ЛО</span>
          <span>ПИЛОМАТЕРИАЛЫ</span>
        </div>

        <p class="technical-label">Производство и продажа</p>
        <h1>Доска и брус напрямую с пилорамы в Разбегаево</h1>
        <p class="production-hero__lead">
          Собственное производство: распил, камерная сушка, строжка и обработка
          огнебиозащитным составом. Цены указаны за кубометр, наличие подтверждается
          перед расчётом, доставка по Санкт-Петербургу и Ленинградской области.
        </p>

        <div class="production-hero__actions">
          <NuxtLink class="button button--signal" to="/pilomaterialy">Каталог и цены</NuxtLink>
          <NuxtLink class="button button--outline" to="/kontakty">Подготовить запрос</NuxtLink>
        </div>

        <dl class="production-hero__facts">
          <div>
            <dt>Телефон</dt>
            <dd><a :href="businessPhoneHref">{{ businessPhone }}</a></dd>
          </div>
          <div>
            <dt>Ассортимент</dt>
            <dd>Доска, брусок, рейка, имитация бруса</dd>
          </div>
          <div>
            <dt>Получение</dt>
            <dd>Самовывоз или согласованная доставка</dd>
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
        <div>
          <span class="section-index">01</span>
          <p class="technical-label">Прайс-лист</p>
        </div>
        <h2 id="catalog-title">Основные позиции с ценами за кубометр</h2>
        <p>
          В каталоге указаны реальные цены производства: сухой строганый материал,
          доска камерной сушки, имитация бруса и позиции с огнебиозащитной обработкой.
          Наличие подтверждается перед расчётом партии.
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
          <span class="product-row__code">{{ product.number }} / М³</span>
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

    <section class="production-story" aria-labelledby="production-title">
      <div class="production-story__text">
        <span class="section-index">02</span>
        <p class="technical-label">Производственная площадка</p>
        <h2 id="production-title">Материал проходит полный цикл на месте</h2>
        <p>
          Бревно поступает на ленточную пилораму, дальше материал сушится, строгается и
          при необходимости обрабатывается огнебиозащитным составом. Фотографии сделаны
          на действующей площадке, а не в шоуруме.
        </p>
        <p>
          Вся продукция регистрируется в ЛесЕГАИС. Перед расчётом достаточно назвать
          назначение материала — сотрудник подберёт сечение и вариант обработки.
        </p>
      </div>

      <figure class="production-story__portrait">
        <NuxtImg
          src="/images/pilorama-stanok-brevno.jpg"
          alt="Пилорамный станок с бревном на подаче под навесом"
          width="1200"
          height="900"
          sizes="xs:100vw sm:48vw md:32vw"
          densities="1"
          format="webp"
          loading="lazy"
        />
        <figcaption>Распил бревна на станке</figcaption>
      </figure>

      <figure class="production-story__detail">
        <NuxtImg
          src="/images/sklad-obrabotannoi-doski.jpg"
          alt="Штабели обработанной доски на крытом складе"
          width="960"
          height="720"
          sizes="xs:100vw sm:42vw md:28vw"
          densities="1"
          format="webp"
          loading="lazy"
        />
        <figcaption>Крытый склад готовой доски</figcaption>
      </figure>
    </section>

    <section class="photo-band" aria-labelledby="photo-band-title">
      <header class="photo-band__head">
        <div>
          <span class="section-index">03</span>
          <p class="technical-label">Фото с производства</p>
        </div>
        <h2 id="photo-band-title">Площадка, склад и отгрузка без постановки</h2>
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

    <section class="order-route" aria-labelledby="order-title">
      <header class="order-route__head">
        <div>
          <span class="section-index">04</span>
          <p class="technical-label">Порядок заказа</p>
        </div>
        <h2 id="order-title">От параметров материала до готовой отгрузки</h2>
        <p>
          Расчёт начинается с конкретных данных, поэтому заранее подготовленный список сокращает
          количество уточнений и помогает быстрее проверить подходящий материал.
        </p>
      </header>

      <ol class="order-route__steps">
        <li v-for="step in orderSteps" :key="step.number">
          <span>{{ step.number }}</span>
          <div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </div>
        </li>
      </ol>

      <div class="order-route__actions">
        <NuxtLink class="button button--dark" to="/kontakty">Собрать данные для расчёта</NuxtLink>
        <NuxtLink class="text-link" to="/dostavka">Узнать порядок получения</NuxtLink>
      </div>
    </section>

    <section class="about-strip" aria-labelledby="about-title">
      <div class="about-strip__text">
        <span class="section-index">05</span>
        <p class="technical-label">О производстве</p>
        <h2 id="about-title">Официальный производитель, а не перекупщик</h2>
        <p>
          Пилораму ведёт {{ businessRequisites.fullName }}. Продукция регистрируется
          в системе ЛесЕГАИС, покупатель получает документы на партию. Оценка
          покупателей на Яндекс Картах — 4,6.
        </p>
        <div class="section-actions">
          <a class="button button--signal" :href="businessWhatsAppUrl" target="_blank" rel="noopener">
            Написать в WhatsApp
          </a>
          <a class="button button--outline" :href="businessPhoneHref">{{ businessPhone }}</a>
        </div>
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
        <div>
          <dt>Учёт продукции</dt>
          <dd>ЛесЕГАИС</dd>
        </div>
      </dl>
    </section>

    <section class="work-video" aria-labelledby="video-title">
      <div class="work-video__heading">
        <span class="section-index">06</span>
        <p class="technical-label">Видео с площадки</p>
        <h2 id="video-title">Производственный процесс без декоративной постановки</h2>
        <p>
          Короткая запись помогает оценить рабочую обстановку и характер производства. Видео
          запускается только по команде пользователя и не расходует трафик автоматически.
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

    <section class="closing-band">
      <div>
        <p class="technical-label">Самовывоз и доставка</p>
        <h2>Способ получения согласуется под объём материала</h2>
      </div>
      <p>
        Производственная площадка находится в Разбегаево Ломоносовского района. Для расчёта
        доставки необходимо сообщить адрес, состав заказа и доступные условия подъезда к месту
        разгрузки.
      </p>
      <NuxtLink class="button button--paper" to="/dostavka">Проверить условия</NuxtLink>
    </section>
  </main>
</template>
