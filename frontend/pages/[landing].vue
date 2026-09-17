<script setup lang="ts">
import type { PriceListProduct } from '~/utils/products'
import { landingSlugs } from '~/utils/seo-routes'

definePageMeta({
  // Список слагов, а не `getSeoLanding`: `validate` уходит в общий бандл всех
  // страниц, и импорт полноценного `seo-landings.ts` (~50 КБ текстов посадочных)
  // тянул его за собой на каждую страницу сайта, а не только на сами посадочные.
  validate: (route) => typeof route.params.landing === 'string'
    && (landingSlugs as readonly string[]).includes(route.params.landing),
})

const route = useRoute()
const landing = getSeoLanding(route.params.landing as string)

// После validate посадочная существует; проверка нужна для строгого TypeScript.
if (!landing) {
  throw createError({ statusCode: 404, statusMessage: 'Страница не найдена' })
}

/** Позиции прайса в порядке, заданном посадочной; неизвестные id пропускаются. */
const products = landing.productIds
  .map((id) => priceListProducts.find((product) => product.id === id))
  .filter((product): product is PriceListProduct => product !== undefined)

/** Размерные таблицы позиций посадочной; пусто у вагонки — она уже за штуку. */
const sizeTables = getSizeTablesForProducts(landing.productIds)

/** Хлебные крошки: тот же порядок и текст, что в разметке BreadcrumbList ниже. */
const breadcrumbItems = [
  { name: 'Главная', item: '/' },
  { name: 'Пиломатериалы', item: '/pilomaterialy' },
  { name: landing.h1, item: `/${landing.slug}` },
]

/** Товарные H2 из посадочной с дефолтами шаблона (контракт п.2). */
const sectionHeadings = {
  prices: landing.headings?.prices ?? 'Позиции и цены',
  sizes: landing.headings?.sizes ?? 'Цена за куб и за штуку',
  order: landing.headings?.order ?? 'Как заказать',
  whyUs: landing.headings?.whyUs ?? 'Почему у нас',
  faq: landing.headings?.faq ?? 'Вопросы и ответы',
  cta: landing.headings?.cta ?? 'Нужен расчёт по объёму?',
}

/** Дефолт абзаца CTA — режим работы шаблон дописывает сам после этого текста. */
const defaultCtaText = 'Позвоните — менеджер сверит наличие сечений и рассчитает стоимость партии с доставкой.'

useSeoMeta({
  title: landing.title,
  description: landing.metaDescription,
  ogTitle: landing.ogTitle,
  ogDescription: landing.ogDescription,
  ogImage: `${siteUrl}${landing.ogImage}`,
  ogType: 'website',
  ogUrl: `${siteUrl}/${landing.slug}`,
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: `${siteUrl}/${landing.slug}` }],
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: breadcrumbItems,
  }),
  defineWebPage({
    '@type': ['WebPage', 'FAQPage'],
    name: landing.h1,
    description: landing.metaDescription,
  }),
  ...landing.faq.map((item) => defineQuestion({
    name: item.question,
    acceptedAnswer: item.answer,
  })),
  defineItemList({
    name: landing.h1,
    // Позиции с ценой «по запросу» (price: null) исключены: Product без offers —
    // ошибка структурированных данных в Google, а не просто пустое поле.
    itemListElement: products
      .filter((product): product is PriceListProduct & { price: number } => product.price !== null)
      .map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.title,
          description: product.description,
          image: `${siteUrl}${product.image}`,
          offers: {
            // AggregateOffer с lowPrice — это цена «от …» из прайса.
            '@type': 'AggregateOffer',
            lowPrice: product.price,
            priceCurrency: 'RUB',
            availability: 'https://schema.org/InStock',
            url: `${siteUrl}/${landing.slug}`,
          },
        },
      })),
  }),
])
</script>

<template>
  <main>
    <section
      class="max-[840px]:min-h-0 max-[560px]:px-[18px] max-[560px]:pb-9 max-[560px]:pt-8 grid min-h-[280px] items-end border-b border-(--color-ink) bg-(--color-sand) px-[max(24px,calc((100vw_-_1280px)/2))] pb-12 pt-14 max-[560px]:[&_h1]:!text-[2.75rem] max-[390px]:[&_h1]:!text-[2.55rem]"
      aria-labelledby="landing-title"
    >
      <div class="max-w-[840px]">
        <nav class="mb-4 font-[Segoe_UI,Arial,sans-serif] text-[0.8rem] text-(--color-ink)/70" aria-label="Хлебные крошки">
          <ol class="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0">
            <li v-for="(crumb, index) in breadcrumbItems" :key="crumb.item" class="flex items-center gap-x-2">
              <NuxtLink v-if="index < breadcrumbItems.length - 1" :to="crumb.item" class="text-(--color-forest) no-underline hover:text-(--color-copper)">{{ crumb.name }}</NuxtLink>
              <span v-else aria-current="page">{{ crumb.name }}</span>
              <span v-if="index < breadcrumbItems.length - 1" aria-hidden="true">/</span>
            </li>
          </ol>
        </nav>
        <p class="eyebrow">{{ landing.eyebrow }}</p>
        <h1 id="landing-title" class="mb-6">{{ landing.h1 }}</h1>
        <p
          v-if="landing.introLead"
          class="mb-4 max-w-[680px] text-[clamp(1.04rem,1.35vw,1.25rem)] leading-[1.55] text-(--color-ink)/85 last:mb-0"
        >{{ landing.introLead }}</p>
        <p
          v-for="(paragraph, index) in landing.intro"
          :key="index"
          class="mb-4 max-w-[680px] text-[clamp(1.04rem,1.35vw,1.25rem)] leading-[1.55] text-(--color-ink)/85 last:mb-0"
        >{{ paragraph }}</p>
      </div>
    </section>

    <section
      class="border-b border-(--color-ink) bg-(--color-cream) px-[max(24px,calc((100vw_-_1280px)/2))] py-16 max-[560px]:px-[18px] max-[560px]:py-12"
      aria-labelledby="landing-products-title"
    >
      <header class="mb-8">
        <p class="eyebrow">Прайс-лист</p>
        <h2 id="landing-products-title" class="mb-4">{{ sectionHeadings.prices }}</h2>
        <p class="mb-0 max-w-[680px] leading-[1.6] text-(--color-ink)/85">{{ landing.priceIntro }}</p>
      </header>

      <div class="grid gap-5">
        <article
          v-for="product in products"
          :key="product.id"
          class="grid grid-cols-[minmax(220px,0.34fr)_minmax(0,1fr)] border border-(--color-line) bg-(--color-paper) max-[720px]:grid-cols-1"
        >
          <figure
            data-parallax="6"
            class="min-h-[220px] overflow-hidden border-r border-(--color-line) bg-(--color-sand) max-[720px]:h-[190px] max-[720px]:min-h-0 max-[720px]:border-r-0 max-[720px]:border-b [&_img]:h-full [&_img]:w-full [&_img]:object-cover"
          >
            <NuxtImg
              :src="product.image"
              :alt="product.alt"
              width="900"
              height="600"
              sizes="xs:100vw sm:40vw md:34vw lg:26vw xl:24vw xxl:20vw"
              densities="1 2"
              format="webp"
              loading="lazy"
            />
          </figure>

          <div class="flex min-w-0 flex-col p-6 max-[560px]:p-5">
            <h3 class="mb-3">{{ product.displayTitle }}</h3>
            <p class="mb-3 max-w-[600px] leading-[1.55] text-(--color-ink)/85">{{ product.description }}</p>
            <p class="mb-5 font-[Segoe_UI,Arial,sans-serif] text-[0.9rem] text-(--color-ink)/70">{{ product.specs[0][0] }} — {{ product.specs[0][1] }}</p>

            <div class="mt-auto border-t border-(--color-line) pt-4">
              <p class="mb-1 font-[Segoe_UI,Arial,sans-serif] text-[0.72rem] font-[760] uppercase tracking-[0.06em] text-(--color-ink)/70">Цена за 1 {{ product.unit }}</p>
              <p class="mb-0 whitespace-nowrap font-[Segoe_UI,Arial,sans-serif] text-[clamp(1.18rem,1.5vw,1.45rem)] font-extrabold leading-none text-(--color-copper)">{{ formatProductPrice(product) }}</p>
            </div>
          </div>
        </article>
      </div>

      <p class="mt-8">
        <NuxtLink
          class="inline-flex min-h-11 w-max items-center border-b-2 border-current px-0 font-[Segoe_UI,Arial,sans-serif] text-[0.9rem] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)"
          to="/pilomaterialy"
        >Все 14 позиций и цены в каталоге</NuxtLink>
      </p>
    </section>

    <section
      v-if="sizeTables.length || landing.coverage || landing.comparison"
      id="sizes"
      class="border-b border-(--color-ink) bg-(--color-paper) px-[max(24px,calc((100vw_-_1280px)/2))] py-16 max-[560px]:px-[18px] max-[560px]:py-12"
      aria-labelledby="landing-sizes-title"
    >
      <header class="mb-8 max-w-[760px]">
        <p class="eyebrow">Сечения и расчёт</p>
        <h2 id="landing-sizes-title" class="mb-4">{{ sectionHeadings.sizes }}</h2>
        <!-- Пояснение про цену за кубометр — только там, где есть размерные
             таблицы: у вагонки цена сразу за штуку, кубометра в прайсе нет. -->
        <p v-if="sizeTables.length" class="mb-0 leading-[1.6] text-(--color-ink)/85">
          Цена за кубометр одна для всех сечений позиции. Объём штуки — толщина × ширина × длина в метрах,
          цена за штуку — объём × цена м³, округлённая вверх до рубля. Все цены «от».
        </p>
      </header>

      <div v-if="sizeTables.length" class="grid gap-10">
        <ProductSizeTable v-for="table in sizeTables" :key="table.id" :table="table" />
      </div>

      <p v-if="landing.sizeNote" :id="landing.sizeNoteId" class="mb-0 mt-6 max-w-[760px] leading-[1.6] text-(--color-ink)/85">{{ landing.sizeNote }}</p>

      <!-- Таблица расхода материала на площадь: та же вёрстка, что у ProductSizeTable
           (граница, прокручиваемый контейнер, аптеркейс-шапка), но без scoped-стилей
           компонента — здесь два новых типа таблиц, а не переиспользование позиций прайса -->
      <div v-if="landing.coverage" class="mt-10 max-w-full min-w-0">
        <h3 class="mb-3">{{ landing.coverage.heading }}</h3>
        <p class="mb-4 max-w-[760px] leading-[1.6] text-(--color-ink)/85">{{ landing.coverage.intro }}</p>
        <div class="max-w-full overflow-x-auto border border-(--color-line) bg-(--color-paper)" tabindex="0" role="region" :aria-label="landing.coverage.heading">
          <table class="w-full border-collapse font-[Segoe_UI,Arial,sans-serif] text-[0.94rem] leading-[1.4] [font-variant-numeric:tabular-nums]">
            <caption class="sr-only">{{ landing.coverage.heading }}: площадь обшивки и количество досок по профилям</caption>
            <thead>
              <tr>
                <th scope="col" class="whitespace-nowrap border-b border-(--color-ink) px-4 py-3 text-left align-top text-[0.72rem] font-[760] uppercase tracking-[0.06em] text-(--color-ink)">Площадь, м²</th>
                <th v-for="column in landing.coverage.columns" :key="column" scope="col" class="whitespace-nowrap border-b border-(--color-ink) px-4 py-3 text-left align-top text-[0.72rem] font-[760] uppercase tracking-[0.06em] text-(--color-ink)">{{ column }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in landing.coverage.rows" :key="row.area" :class="rowIndex % 2 === 1 ? 'bg-(--color-cream)' : ''">
                <th scope="row" class="border-b border-(--color-line) px-4 py-3 text-left align-top font-bold">{{ row.area }}</th>
                <td v-for="(value, valueIndex) in row.values" :key="valueIndex" class="whitespace-nowrap border-b border-(--color-line) px-4 py-3 text-left align-top">{{ value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="landing.coverage.note" class="mb-0 mt-3 max-w-[760px] text-[0.9rem] leading-[1.55] text-(--color-ink)/70">{{ landing.coverage.note }}</p>
      </div>

      <!-- Сравнение профилей или вариантов материала -->
      <div v-if="landing.comparison" class="mt-10 max-w-full min-w-0">
        <h3 class="mb-3">{{ landing.comparison.heading }}</h3>
        <div class="max-w-full overflow-x-auto border border-(--color-line) bg-(--color-paper)" tabindex="0" role="region" :aria-label="landing.comparison.heading">
          <table class="w-full border-collapse font-[Segoe_UI,Arial,sans-serif] text-[0.94rem] leading-[1.4] [font-variant-numeric:tabular-nums]">
            <caption class="sr-only">{{ landing.comparison.heading }}: параметры и значения по профилям</caption>
            <thead>
              <tr>
                <th v-for="column in landing.comparison.columns" :key="column" scope="col" class="whitespace-nowrap border-b border-(--color-ink) px-4 py-3 text-left align-top text-[0.72rem] font-[760] uppercase tracking-[0.06em] text-(--color-ink)">{{ column }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in landing.comparison.rows" :key="row[0]" :class="rowIndex % 2 === 1 ? 'bg-(--color-cream)' : ''">
                <th scope="row" class="border-b border-(--color-line) px-4 py-3 text-left align-top font-bold">{{ row[0] }}</th>
                <td v-for="(cell, cellIndex) in row.slice(1)" :key="cellIndex" class="border-b border-(--color-line) px-4 py-3 text-left align-top">{{ cell }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="landing.comparison.note" class="mb-0 mt-3 max-w-[760px] text-[0.9rem] leading-[1.55] text-(--color-ink)/70">{{ landing.comparison.note }}</p>
      </div>

      <div v-if="sizeTables.length" class="mt-12 border-t border-(--color-line) pt-10">
        <ProductCalculator :tables="sizeTables" />
      </div>
    </section>

    <section
      :id="landing.details.id"
      class="grid grid-cols-[minmax(360px,0.82fr)_minmax(0,1.18fr)] bg-(--color-forest) text-(--color-paper) max-[840px]:grid-cols-1"
      aria-labelledby="landing-details-title"
    >
      <div class="py-16 pl-[max(24px,calc((100vw_-_1280px)/2))] pr-[clamp(32px,4vw,64px)] max-[840px]:px-6 max-[840px]:pb-10 max-[560px]:px-[18px]">
        <h2 id="landing-details-title" class="mb-0 max-w-[430px] text-(--color-paper)">{{ landing.details.heading }}</h2>
      </div>
      <div class="border-l border-(--color-line-light) py-16 pl-[clamp(28px,4vw,64px)] pr-[max(24px,calc((100vw_-_1280px)/2))] max-[840px]:border-l-0 max-[840px]:border-t max-[840px]:px-6 max-[840px]:pt-10 max-[560px]:px-[18px]">
        <p
          v-for="(paragraph, index) in landing.details.paragraphs"
          :key="index"
          class="mb-5 max-w-[640px] leading-[1.6] text-(--color-cream) last:mb-0"
        >{{ paragraph }}</p>
      </div>
    </section>

    <section
      class="border-b border-(--color-ink) bg-(--color-cream) px-[max(24px,calc((100vw_-_1280px)/2))] py-16 max-[560px]:px-[18px] max-[560px]:py-12"
      aria-labelledby="landing-practice-title"
    >
      <header class="mb-7 max-w-[760px]">
        <p class="eyebrow">Практика</p>
        <h2 id="landing-practice-title" class="mb-0">{{ landing.practice.heading }}</h2>
      </header>
      <p
        v-for="(paragraph, index) in landing.practice.paragraphs"
        :key="index"
        class="mb-5 max-w-[760px] leading-[1.6] text-(--color-ink)/85 last:mb-0"
      >{{ paragraph }}</p>
    </section>

    <section
      v-if="landing.scenarios"
      class="border-b border-(--color-ink) bg-(--color-sand) px-[max(24px,calc((100vw_-_1280px)/2))] py-16 max-[560px]:px-[18px] max-[560px]:py-12"
      aria-labelledby="landing-scenarios-title"
    >
      <header class="mb-8 max-w-[760px]">
        <p class="eyebrow">Применение</p>
        <h2 id="landing-scenarios-title" class="mb-0">{{ landing.scenarios.heading }}</h2>
      </header>
      <div class="grid gap-8 max-[840px]:gap-6">
        <div v-for="item in landing.scenarios.items" :key="item.title" class="max-w-[760px]">
          <h3 class="mb-2">{{ item.title }}</h3>
          <p class="mb-0 leading-[1.6] text-(--color-ink)/85">{{ item.text }}</p>
        </div>
      </div>
    </section>

    <section
      class="border-b border-(--color-ink) bg-(--color-paper) px-[max(24px,calc((100vw_-_1280px)/2))] py-16 max-[560px]:px-[18px] max-[560px]:py-12"
      aria-labelledby="landing-order-title"
    >
      <header class="mb-8 max-w-[680px]">
        <p class="eyebrow">Порядок работы</p>
        <h2 id="landing-order-title" class="mb-0">{{ sectionHeadings.order }}</h2>
      </header>

      <ol class="max-w-[980px] border-t border-(--color-line)">
        <li
          v-for="step in landingOrderSteps"
          :key="step.number"
          class="grid grid-cols-[clamp(56px,6vw,88px)_minmax(0,1fr)] gap-x-[clamp(20px,3vw,48px)] border-b border-(--color-line) py-7 max-[560px]:grid-cols-[48px_minmax(0,1fr)] max-[560px]:gap-x-4 max-[560px]:py-6"
        >
          <span
            class="font-[Georgia,Times_New_Roman,serif] text-[clamp(1.9rem,2.6vw,2.6rem)] leading-none tracking-[-0.025em] text-(--color-copper-dark)"
            aria-hidden="true"
          >{{ step.number }}</span>
          <div>
            <h3 class="mb-2">{{ step.title }}</h3>
            <p class="mb-0 max-w-[640px] leading-[1.6] text-(--color-ink)/85">{{ step.text }}</p>
            <p v-if="step.number === '01' && landing.orderHint" class="mt-3 max-w-[640px] leading-[1.6] text-(--color-ink)/85">{{ landing.orderHint }}</p>
          </div>
        </li>
      </ol>
    </section>

    <section
      class="border-b border-(--color-ink) bg-(--color-sand) px-[max(24px,calc((100vw_-_1280px)/2))] py-16 max-[560px]:px-[18px] max-[560px]:py-12"
      aria-labelledby="landing-why-title"
    >
      <header class="mb-8 max-w-[680px]">
        <p class="eyebrow">Производство</p>
        <h2 id="landing-why-title" class="mb-0">{{ sectionHeadings.whyUs }}</h2>
      </header>

      <ul class="grid grid-cols-2 gap-x-[clamp(32px,4vw,72px)] border-t border-(--color-line) max-[840px]:grid-cols-1">
        <li
          v-for="item in landing.whyUs"
          :key="item.title"
          class="border-b border-(--color-line) py-6 max-[560px]:py-5"
        >
          <h3 class="mb-2 max-w-[420px]">{{ item.title }}</h3>
          <p class="mb-0 max-w-[520px] leading-[1.6] text-(--color-ink)/85">{{ item.text }}</p>
        </li>
      </ul>

      <p class="mb-0 mt-8 max-w-[760px] leading-[1.6] text-(--color-ink)/85">{{ landing.geoParagraph }}</p>
    </section>

    <section
      class="border-b border-(--color-ink) bg-(--color-paper) px-[max(24px,calc((100vw_-_1280px)/2))] py-16 max-[560px]:px-[18px] max-[560px]:py-12"
      aria-labelledby="landing-faq-title"
    >
      <h2 id="landing-faq-title" class="mb-8">{{ sectionHeadings.faq }}</h2>
      <div class="max-w-[860px] border-t border-(--color-line)">
        <div v-for="item in landing.faq" :key="item.question" class="border-b border-(--color-sand) py-6">
          <h3 class="mb-3 max-w-[720px]">{{ item.question }}</h3>
          <p class="mb-0 max-w-[720px] leading-[1.6] text-(--color-ink)/85">{{ item.answer }}</p>
          <p v-if="item.links" class="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            <NuxtLink
              v-for="link in item.links"
              :key="link.to"
              :to="link.to"
              class="inline-flex items-center border-b border-current font-[Segoe_UI,Arial,sans-serif] text-[0.9rem] font-[740] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)"
            >{{ link.label }}</NuxtLink>
          </p>
        </div>
      </div>
    </section>

    <section
      class="border-b border-(--color-ink) bg-(--color-cream) px-[max(24px,calc((100vw_-_1280px)/2))] py-10 max-[560px]:px-[18px]"
      aria-label="Связанные страницы"
    >
      <p class="eyebrow mb-4">Смотрите также</p>
      <nav class="flex flex-wrap gap-x-8 gap-y-3">
        <NuxtLink
          v-for="link in landing.related"
          :key="link.to"
          :to="link.to"
          class="inline-flex min-h-11 w-max items-center border-b-2 border-current px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)"
        >{{ link.label }}</NuxtLink>
      </nav>
    </section>

    <section
      class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-[clamp(40px,6vw,88px)] border-b border-(--color-ink) bg-(--color-sand) px-[max(24px,calc((100vw_-_1280px)/2))] py-[72px] shadow-[inset_0_18px_42px_rgb(32_35_31_/_8%)] max-[840px]:grid-cols-1 max-[840px]:gap-8 max-[560px]:px-[18px] max-[560px]:py-14"
      aria-labelledby="landing-cta-title"
    >
      <div>
        <h2 id="landing-cta-title" class="mb-4 max-w-[720px]">{{ sectionHeadings.cta }}</h2>
        <p class="mb-0 max-w-[560px] leading-[1.55] text-(--color-ink)/85">
          {{ landing.ctaText ?? defaultCtaText }} {{ businessWorkingHours }}.
        </p>
      </div>
      <a
        class="inline-flex min-h-[52px] items-center justify-center border border-(--color-copper) bg-(--color-copper) px-[1.3rem] py-[0.85rem] font-[Segoe_UI,Arial,sans-serif] text-[0.94rem] font-[760] text-(--color-paper) no-underline transition-colors duration-150 hover:border-(--color-copper-dark) hover:bg-(--color-copper-dark) max-[560px]:w-full"
        :href="businessPhoneHref"
      >{{ businessPhone }}</a>
    </section>
  </main>
</template>
