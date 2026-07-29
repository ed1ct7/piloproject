<script setup lang="ts">
const products = [
  {
    code: '01 / ДСК',
    title: 'Обрезная доска',
    size: '25–50 мм / длина 6 м',
    variants: 'Хвойные породы, наличие уточняется',
    use: 'Каркасы, перекрытия, черновые полы, кровля и хозяйственные постройки.',
    image: '/images/brushing-1.jpg',
    alt: 'Крупный план обработанной хвойной доски на производственной линии',
  },
  {
    code: '02 / БРС',
    title: 'Брус',
    size: '100×100 и 150×150 мм',
    variants: 'Доступность размеров уточняется по заказу',
    use: 'Опорные элементы, лаги, навесы, бани и другие несущие конструкции.',
    image: '/images/paint-shop-2.jpg',
    alt: 'Производственное оборудование в цехе обработки пиломатериалов',
  },
  {
    code: '03 / ЗБР',
    title: 'Заборная доска',
    size: 'Размер партии согласуется',
    variants: 'Распил и обработка обсуждаются отдельно',
    use: 'Ограждения, временные конструкции и практические работы на участке.',
    image: '/images/lumber-yard-2025-05-21.jpg',
    alt: 'Окрашенные доски серого цвета после обработки',
  },
  {
    code: '04 / РЕЙ',
    title: 'Брусок и рейка',
    size: 'Сечение уточняется по наличию',
    variants: 'Подбор под назначение покупателя',
    use: 'Обрешётка, подсистемы, упаковка, отделка и небольшие строительные работы.',
    image: '/images/timber-order-2025-05-16.jpg',
    alt: 'Образцы окрашенной древесины с различными вариантами покрытия',
  },
]

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

useSeoMeta({
  title: 'Пилорама Разбегаево – доска, брус и пиломатериалы с доставкой',
  description: 'Пиломатериалы от производителя в Разбегаево: обрезная доска, брус, заборная доска, брусок и рейка. Самовывоз и согласование доставки по Ленинградской области и Санкт-Петербургу.',
  ogTitle: 'Пилорама Разбегаево',
  ogDescription: 'Обрезная доска, брус и другие пиломатериалы с производственной площадки в Разбегаево.',
  ogType: 'website',
  robots: 'index, follow',
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: 'https://pilorama-razbegaevo.clients.site/' }],
})

useSchemaOrg([
  defineLocalBusiness({
    '@id': 'https://pilorama-razbegaevo.clients.site/#localbusiness',
    '@type': 'HomeAndConstructionBusiness',
    name: 'Пилорама Разбегаево',
    url: 'https://pilorama-razbegaevo.clients.site/',
    image: 'https://pilorama-razbegaevo.clients.site/images/paint-shop-4.jpg',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Разбегаево',
      addressRegion: 'Ленинградская область',
      addressCountry: 'RU',
    },
    makesOffer: products.map((product) =>
      defineOffer({
        itemOffered: defineProduct({
          name: product.title,
          description: product.use,
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
          На площадке подбирают пиломатериалы для каркасов, кровли, ограждений и хозяйственных
          построек. Покупатель заранее сообщает размеры и объём, после чего сотрудник проверяет
          наличие и рассчитывает заказ.
        </p>

        <div class="production-hero__actions">
          <NuxtLink class="button button--signal" to="/kontakty">Подготовить запрос</NuxtLink>
          <NuxtLink class="button button--outline" to="/pilomaterialy">Открыть каталог</NuxtLink>
        </div>

        <dl class="production-hero__facts">
          <div>
            <dt>Получение</dt>
            <dd>Самовывоз или согласованная доставка</dd>
          </div>
          <div>
            <dt>Ассортимент</dt>
            <dd>Доска, брус, брусок и рейка</dd>
          </div>
          <div>
            <dt>Расчёт</dt>
            <dd>После уточнения размеров и объёма</dd>
          </div>
        </dl>
      </div>

      <figure class="production-hero__media">
        <NuxtImg
          src="/images/paint-shop-4.jpg"
          alt="Цех обработки пиломатериалов с производственным оборудованием"
          width="1600"
          height="1200"
          sizes="xs:100vw sm:100vw md:55vw lg:55vw xl:55vw"
          densities="1"
          format="webp"
          loading="eager"
          preload
          fetchpriority="high"
        />
        <figcaption>
          <span>Цех обработки</span>
          <span>Разбегаево</span>
        </figcaption>
      </figure>
    </section>

    <section class="catalog-preview" aria-labelledby="catalog-title">
      <header class="editorial-head">
        <div>
          <span class="section-index">01</span>
          <p class="technical-label">Ассортимент</p>
        </div>
        <h2 id="catalog-title">Основные пиломатериалы для стройки и участка</h2>
        <p>
          Каталог собран как рабочая спецификация: рядом с названием указаны размеры, назначение
          и условия уточнения. Актуальное наличие проверяется перед расчётом каждой партии.
        </p>
      </header>

      <div class="product-ledger">
        <article v-for="product in products" :key="product.code" class="product-row">
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
          <span class="product-row__code">{{ product.code }}</span>
          <div class="product-row__title">
            <h3>{{ product.title }}</h3>
            <p>{{ product.use }}</p>
          </div>
          <dl>
            <div>
              <dt>Размер</dt>
              <dd>{{ product.size }}</dd>
            </div>
            <div>
              <dt>Условия</dt>
              <dd>{{ product.variants }}</dd>
            </div>
          </dl>
        </article>
      </div>

      <div class="section-action">
        <NuxtLink class="text-link" to="/pilomaterialy">Посмотреть полную спецификацию</NuxtLink>
      </div>
    </section>

    <section class="production-story" aria-labelledby="production-title">
      <div class="production-story__text">
        <span class="section-index">02</span>
        <p class="technical-label">Производственная площадка</p>
        <h2 id="production-title">Материал проходит обработку на реальном оборудовании</h2>
        <p>
          Фотографии показывают действующий цех, линию подачи и участок работы с покрытиями.
          Покупатель видит не декоративную древесную фактуру, а среду, где готовят материал.
        </p>
        <p>
          Вариант обработки и внешний вид поверхности зависят от конкретного заказа. Перед
          расчётом необходимо уточнить назначение материала и желаемый результат.
        </p>
      </div>

      <figure class="production-story__portrait">
        <NuxtImg
          src="/images/paint-shop-2.jpg"
          alt="Станок и линия подачи внутри производственного цеха"
          width="1200"
          height="1600"
          sizes="xs:100vw sm:48vw md:32vw"
          densities="1"
          format="webp"
          loading="lazy"
        />
        <figcaption>Оборудование участка обработки</figcaption>
      </figure>

      <figure class="production-story__detail">
        <NuxtImg
          src="/images/lumber-stack-2025-03-07.jpg"
          alt="Партия окрашенных рифлёных досок на производственной линии"
          width="1200"
          height="1600"
          sizes="xs:100vw sm:42vw md:28vw"
          densities="1"
          format="webp"
          loading="lazy"
        />
        <figcaption>Подготовленная поверхность доски</figcaption>
      </figure>
    </section>

    <section class="order-route" aria-labelledby="order-title">
      <header class="order-route__head">
        <div>
          <span class="section-index">03</span>
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

    <section class="work-video" aria-labelledby="video-title">
      <div class="work-video__heading">
        <span class="section-index">04</span>
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
        poster="/images/paint-shop-4.jpg"
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
