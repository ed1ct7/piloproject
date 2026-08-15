<script setup lang="ts">
import type { PriceListProduct } from '~/utils/products'

definePageMeta({
  // Неизвестный слаг — 404 ещё до рендера страницы.
  validate: (route) => typeof route.params.landing === 'string'
    && getSeoLanding(route.params.landing) !== undefined,
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
    itemListElement: [
      { name: 'Главная', item: '/' },
      { name: 'Пиломатериалы', item: '/pilomaterialy' },
      { name: landing.h1, item: `/${landing.slug}` },
    ],
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
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: `${siteUrl}${product.image}`,
        offers: product.price === null
          ? undefined
          : {
              '@type': 'AggregateOffer',
              lowPrice: product.price,
              priceCurrency: 'RUB',
              offerCount: 1,
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
        <p class="mb-3 font-[Segoe_UI,Arial,sans-serif] text-[0.8125rem] font-[760] uppercase tracking-[0.04em] text-(--color-copper)">{{ landing.eyebrow }}</p>
        <h1 id="landing-title" class="mb-6">{{ landing.h1 }}</h1>
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
        <p class="mb-2 font-[Segoe_UI,Arial,sans-serif] text-[0.78rem] font-[760] uppercase tracking-[0.08em] text-(--color-ink)/70">Прайс-лист</p>
        <h2 id="landing-products-title" class="mb-0">Позиции и цены</h2>
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
              height="1200"
              sizes="xs:100vw sm:40vw md:34vw lg:26vw xl:24vw xxl:20vw"
              densities="1 2"
              format="webp"
              loading="lazy"
            />
          </figure>

          <div class="flex min-w-0 flex-col p-6 max-[560px]:p-5">
            <h3 class="mb-2">{{ product.displayTitle }}</h3>
            <p class="mb-3 max-w-[600px] leading-[1.55] text-(--color-ink)/85">{{ product.description }}</p>
            <p class="mb-5 font-[Segoe_UI,Arial,sans-serif] text-[0.9rem] text-(--color-ink)/70">{{ product.specs[0][0] }} — {{ product.specs[0][1] }}</p>

            <div class="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-(--color-line) pt-4">
              <div>
                <p class="mb-1 font-[Segoe_UI,Arial,sans-serif] text-[0.72rem] font-[760] uppercase tracking-[0.06em] text-(--color-ink)/70">Цена за 1 {{ product.unit }}</p>
                <p class="mb-0 whitespace-nowrap font-[Segoe_UI,Arial,sans-serif] text-[clamp(1.18rem,1.5vw,1.45rem)] font-extrabold leading-none text-(--color-copper)">{{ formatProductPrice(product) }}</p>
              </div>
              <NuxtLink
                class="inline-flex min-h-11 w-max items-center border-b-2 border-current px-1 font-[Segoe_UI,Arial,sans-serif] text-[0.88rem] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)"
                to="/pilomaterialy"
              >Выбрать в каталоге</NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section
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
      class="border-b border-(--color-ink) bg-(--color-paper) px-[max(24px,calc((100vw_-_1280px)/2))] py-16 max-[560px]:px-[18px] max-[560px]:py-12"
      aria-labelledby="landing-faq-title"
    >
      <h2 id="landing-faq-title" class="mb-8">Вопросы и ответы</h2>
      <div class="max-w-[860px] border-t border-(--color-line)">
        <div v-for="item in landing.faq" :key="item.question" class="border-b border-(--color-sand) py-6">
          <h3 class="mb-2 max-w-[720px]">{{ item.question }}</h3>
          <p class="mb-0 max-w-[720px] leading-[1.6] text-(--color-ink)/85">{{ item.answer }}</p>
        </div>
      </div>
    </section>

    <section
      class="border-b border-(--color-ink) bg-(--color-cream) px-[max(24px,calc((100vw_-_1280px)/2))] py-10 max-[560px]:px-[18px]"
      aria-label="Связанные страницы"
    >
      <p class="mb-4 font-[Segoe_UI,Arial,sans-serif] text-[0.78rem] font-[760] uppercase tracking-[0.08em] text-(--color-ink)/70">Смотрите также</p>
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
        <h2 id="landing-cta-title" class="mb-4 max-w-[720px]">Нужен расчёт по объёму?</h2>
        <p class="mb-0 max-w-[560px] leading-[1.55] text-(--color-ink)/85">
          Позвоните — менеджер сверит наличие сечений и рассчитает стоимость партии с доставкой. {{ businessWorkingHours }}.
        </p>
      </div>
      <a
        class="inline-flex min-h-[52px] items-center justify-center border border-(--color-copper) bg-(--color-copper) px-[1.3rem] py-[0.85rem] font-[Segoe_UI,Arial,sans-serif] text-[0.94rem] font-[760] text-(--color-paper) no-underline transition-colors duration-150 hover:border-(--color-copper-dark) hover:bg-(--color-copper-dark) max-[560px]:w-full"
        :href="businessPhoneHref"
      >{{ businessPhone }}</a>
    </section>
  </main>
</template>
