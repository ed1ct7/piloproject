<script setup lang="ts">
const products = [
  {
    title: 'Обрезная доска',
    tags: ['25-50 мм', '6 метров', 'хвоя'],
    text: 'Для каркасов, перекрытий, черновых полов, кровли, заборов и хозяйственных построек.',
  },
  {
    title: 'Брус',
    tags: ['100x100', '150x150', 'под заказ'],
    text: 'Для бань, навесов, опорных элементов, лаг и других задач, где важна геометрия.',
  },
  {
    title: 'Заборная доска',
    tags: ['в наличии', 'быстрый распил'],
    text: 'Практичный материал для ограждений, временных конструкций и дачных работ.',
  },
  {
    title: 'Брусок и рейка',
    tags: ['обрешетка', 'отделка'],
    text: 'Подходит для кровельных работ, подсистем, упаковки, отделки и небольших строек.',
  },
]

const steps = [
  ['Заявка', 'Уточняем размеры, объем, сортность и адрес доставки.'],
  ['Подбор', 'Собираем материал из наличия или ставим распил в производство.'],
  ['Проверка', 'Сверяем геометрию, объем и комплектацию перед отгрузкой.'],
  ['Доставка', 'Отгружаем самовывозом или помогаем с машиной под ваш объем.'],
]

const serviceAreas = [
  'Разбегаево',
  'Ломоносовский район',
  'Красное Село',
  'Ропша',
  'Горелово',
  'Петергоф',
  'Стрельна',
  'Гатчина',
  'Санкт-Петербург',
]

const reviewSignals = [
  {
    title: 'Качество материала',
    text: 'Покупатели чаще всего отмечают ровную доску, хороший распил и стабильное качество.',
  },
  {
    title: 'Адекватные цены',
    text: 'В отзывах отдельно выделяют понятную стоимость и возможность выбрать материал на месте.',
  },
  {
    title: 'Быстрая отгрузка',
    text: 'Клиенты пишут, что заказы готовят быстро, а с доставкой помогают без лишней волокиты.',
  },
]

useSeoMeta({
  title: 'Пилорама Разбегаево — доска, брус и пиломатериалы с доставкой',
  description: 'Пиломатериалы от местной пилорамы в Разбегаево: обрезная доска, брус, заборная доска, распил под размер, самовывоз и доставка по Ломоносовскому району и СПб.',
  ogTitle: 'Пилорама Разбегаево',
  ogDescription: 'Доска, брус и распил под задачи стройки. Быстрая отгрузка, понятные цены, доставка.',
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
    image: 'https://pilorama-razbegaevo.clients.site/images/sawmill-hero.webp',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Разбегаево',
      addressRegion: 'Ленинградская область',
      addressCountry: 'RU',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '11',
    },
    makesOffer: products.map((product) =>
      defineOffer({
        itemOffered: defineProduct({
          name: product.title,
          description: product.text,
        }),
      }),
    ),
  }),
])
</script>

<template>
  <main>
    <section class="hero">
      <NuxtImg
        class="hero__image"
        src="/images/sawmill-hero.webp"
        alt="Штабели доски и бруса на территории пилорамы"
        width="1755"
        height="896"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
        densities="1"
        format="webp"
        loading="eager"
        preload
        fetchpriority="high"
      />
      <div class="hero__shade" aria-hidden="true" />

      <div class="hero__content">
        <div class="hero__copy">
          <p class="eyebrow">Пиломатериалы в Разбегаево</p>
          <h1>Доска и брус для стройки без лишних посредников</h1>
          <p class="hero__lead">
            Подберем пиломатериалы под каркас, кровлю, забор, баню или хозяйственную постройку.
            Можно забрать самовывозом или оформить доставку по району и Санкт-Петербургу.
          </p>
          <div class="hero__actions">
            <NuxtLink class="button button--primary" to="/kontakty">Рассчитать заказ</NuxtLink>
            <NuxtLink class="button button--ghost" to="/pilomaterialy">Смотреть ассортимент</NuxtLink>
          </div>
        </div>

        <dl class="hero__facts" aria-label="Ключевые преимущества">
          <div>
            <dt>5,0</dt>
            <dd>рейтинг по отзывам покупателей</dd>
          </div>
          <div>
            <dt>11</dt>
            <dd>оценок на Яндекс Отзывах</dd>
          </div>
          <div>
            <dt>1 день</dt>
            <dd>быстрая отгрузка при наличии материала</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="section" id="assortiment">
      <div class="section__inner">
        <div class="section__head">
          <div>
            <p class="eyebrow">Ассортимент</p>
            <h2>Основные позиции для частной и профессиональной стройки</h2>
          </div>
          <p>
            На главной оставляем самые востребованные категории, а под SEO развиваем отдельные
            страницы под доску, брус, заборную доску, доставку и районы работ.
          </p>
        </div>

        <div class="grid grid--4">
          <article v-for="product in products" :key="product.title" class="card product-card">
            <div class="product-card__meta">
              <span v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <h3>{{ product.title }}</h3>
            <p>{{ product.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--soft">
      <div class="section__inner">
        <div class="section__head">
          <div>
            <p class="eyebrow">Как работаем</p>
            <h2>Понятный путь от заявки до отгрузки</h2>
          </div>
          <p>
            Покупателю важно быстро понять стоимость, сроки и качество. Поэтому главная страница
            сразу показывает процесс без длинных пояснений и лишних экранов.
          </p>
        </div>

        <div class="grid grid--4">
          <article v-for="(step, index) in steps" :key="step[0]" class="card step-card">
            <span class="step-card__number">{{ index + 1 }}</span>
            <h3>{{ step[0] }}</h3>
            <p>{{ step[1] }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section__inner quality">
        <div>
          <p class="eyebrow">Почему выбирают</p>
          <h2>Главные сильные стороны текущего сайта превращаем в доверие</h2>
          <p class="page-text">
            По отзывам покупатели ценят качество, быстрый распил, честное общение и помощь с
            доставкой. На новой главной эти сигналы вынесены выше, чтобы Яндекс и посетители
            сразу видели реальную пользу.
          </p>
        </div>

        <div class="metric-panel">
          <strong>5+</strong>
          <p>акцентов на качество, сроки, выбор материала, цены и доставку прямо в первом экране и ключевых секциях.</p>
        </div>
      </div>
    </section>

    <section class="section section--dark">
      <div class="section__inner">
        <div class="section__head">
          <div>
            <p class="eyebrow">Доставка и самовывоз</p>
            <h2>Работаем вокруг Разбегаево и по ближайшим направлениям</h2>
          </div>
          <p>
            Для роста в Яндексе важны страницы под географию спроса. Главная задает общий охват,
            а внутренние страницы можно расширять под районы, размеры и типы пиломатериалов.
          </p>
        </div>

        <div class="area-list" aria-label="География доставки">
          <span v-for="area in serviceAreas" :key="area">{{ area }}</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section__inner">
        <div class="section__head">
          <div>
            <p class="eyebrow">Отзывы</p>
            <h2>Покупатели уже называют причины вернуться</h2>
          </div>
          <NuxtLink class="button button--dark" to="/otzyvy">Все отзывы и репутация</NuxtLink>
        </div>

        <div class="grid grid--3">
          <article v-for="signal in reviewSignals" :key="signal.title" class="card review-card">
            <div class="review-card__rating">5,0 на Яндекс Отзывах</div>
            <h3>{{ signal.title }}</h3>
            <p>{{ signal.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section__inner cta">
        <div>
          <h2>Нужна доска или брус под конкретный объем?</h2>
          <p>
            Подготовьте размеры, количество и адрес доставки. Мы соберем заявку так, чтобы ее
            было удобно быстро посчитать и отгрузить.
          </p>
        </div>
        <NuxtLink class="button" to="/kontakty">Перейти к контактам</NuxtLink>
      </div>
    </section>
  </main>
</template>
