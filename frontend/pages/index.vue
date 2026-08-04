<script setup lang="ts">
// Первые четыре позиции прайса показываются в витрине на главной.
const featuredProducts = priceListProducts.slice(0, 4);

const orderSteps = [
  {
    number: "01",
    title: "Параметры",
    text: "Покупатель сообщает материал, размеры, количество и назначение будущей конструкции.",
  },
  {
    number: "02",
    title: "Наличие",
    text: "Сотрудник сверяет доступные позиции и уточняет возможность распила для заказа.",
  },
  {
    number: "03",
    title: "Расчёт",
    text: "Стоимость определяется после согласования объёма, обработки и способа получения.",
  },
  {
    number: "04",
    title: "Отгрузка",
    text: "Готовую партию забирают самостоятельно или согласуют подходящий вариант доставки.",
  },
];

const galleryPreview = [
  {
    image: "/images/pilorama-stanok-brevno.jpg",
    alt: "Пилорамный станок с бревном на подаче под навесом производства",
    caption: "Распил бревна",
  },
  {
    image: "/images/sklad-obrabotannoi-doski.jpg",
    alt: "Штабели обработанной доски на крытом складе пилорамы",
    caption: "Крытый склад",
  },
  {
    image: "/images/ploshchadka-otgruzka-pilomaterialov.jpg",
    alt: "Производственная площадка с партией доски и машиной на отгрузке",
    caption: "Отгрузка партии",
  },
  {
    image: "/images/doska-s-ognebiozashchitoi.jpg",
    alt: "Штабель доски, обработанной огнебиозащитным составом",
    caption: "Огнебиозащита",
  },
];

useSeoMeta({
  title: "Пилорама Разбегаево – доска, брус и пиломатериалы с доставкой",
  description:
    "Пиломатериалы от производителя в Разбегаево: сухая строганая доска, брусок, рейка, имитация бруса, огнебиозащитная обработка. Цены за м³, доставка по Санкт-Петербургу и Ленинградской области.",
  ogTitle: "Пилорама Разбегаево",
  ogDescription:
    "Доска, брусок, рейка и имитация бруса с производственной площадки в Разбегаево. Цены и фото производства.",
  ogImage: `${siteUrl}/images/lentochnaya-pilorama-raspil.jpg`,
  ogType: "website",
});

useHead({
  htmlAttrs: { lang: "ru" },
  link: [{ rel: "canonical", href: `${siteUrl}/` }],
});

useSchemaOrg([
  defineLocalBusiness({
    "@id": `${siteUrl}/#localbusiness`,
    "@type": "HomeAndConstructionBusiness",
    name: "Пилорама Разбегаево",
    url: `${siteUrl}/`,
    telephone: businessPhone,
    image: `${siteUrl}/images/lentochnaya-pilorama-raspil.jpg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Разбегаево",
      addressRegion: "Ленинградская область",
      addressCountry: "RU",
    },
    makesOffer: priceListProducts.map((product) =>
      defineOffer({
        price: product.price,
        priceCurrency: "RUB",
        itemOffered: defineProduct({
          name: product.title,
          description: product.description,
          image: `${siteUrl}${product.image}`,
        }),
      }),
    ),
  }),
]);
</script>

<template>
  <main>
    <section class="max-[1100px]:min-h-0 max-[840px]:grid-cols-1 mx-auto grid min-h-[680px] w-[min(1280px,100%)] grid-cols-12 border-b border-[#171916]">
      <div class="max-[840px]:col-span-full max-[840px]:min-h-[560px] max-[560px]:min-h-[520px] max-[560px]:px-[18px] max-[560px]:pb-[34px] max-[560px]:pt-[30px] col-span-7 flex min-w-0 flex-col justify-center bg-[#e9e5dc] p-[52px]">
        <div class="max-[1100px]:mb-[54px] max-[560px]:mb-9 max-[560px]:grid-cols-2 max-[560px]:gap-[7px] font-[Segoe_UI,Arial,sans-serif] uppercase mb-11 grid grid-cols-[repeat(3,max-content)] gap-3 text-[0.8125rem] font-semibold leading-[1.4]">
          <span>59°45′ с. ш.</span>
          <span>РАЗБЕГАЕВО / ЛО</span>
          <span>ПИЛОМАТЕРИАЛЫ</span>
        </div>

        <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Производство и продажа</p>
        <h1>Доска и брус напрямую с пилорамы в Разбегаево</h1>
        <p class="max-[560px]:text-base max-[560px]:leading-normal mb-[30px] max-w-[660px] text-[clamp(1.05rem,1.55vw,1.32rem)] leading-[1.55] text-[#393d37]">
          Собственное производство: распил, камерная сушка, строжка и обработка
          огнебиозащитным составом. Цены указаны за кубометр, наличие
          подтверждается перед расчётом, доставка по Санкт-Петербургу и
          Ленинградской области.
        </p>

        <div class="max-[560px]:grid max-[560px]:grid-cols-2 flex flex-wrap gap-2.5">
          <NuxtLink class="inline-flex min-h-12 cursor-pointer items-center justify-center border border-[#171916] px-[18px] py-3 text-center font-[Segoe_UI,Arial,sans-serif] font-[760] leading-[1.1] no-underline transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 border-[#d65a1f] bg-[#d65a1f] text-[#fffdf7] hover:border-[#a53e10] hover:bg-[#a53e10]" to="/pilomaterialy"
            >Каталог и цены</NuxtLink
          >
          <NuxtLink class="inline-flex min-h-12 cursor-pointer items-center justify-center border border-[#171916] px-[18px] py-3 text-center font-[Segoe_UI,Arial,sans-serif] font-[760] leading-[1.1] no-underline transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent text-[#171916] hover:bg-[#171916] hover:text-[#fffdf7]" to="/kontakty"
            >Подготовить запрос</NuxtLink
          >
        </div>

        <dl class="max-[1100px]:grid-cols-1 max-[560px]:hidden mt-[42px] grid grid-cols-3 border-y border-[#aaa69b] [&>div]:border-r [&>div]:border-[#aaa69b] [&>div]:p-4 [&>div:last-child]:border-r-0 [&_dd]:m-0 [&_dd]:text-[0.9rem] [&_dd]:leading-[1.35] [&_dt]:mb-2 [&_dt]:font-[Segoe_UI,Arial,sans-serif] [&_dt]:text-[0.8125rem] [&_dt]:font-[760] [&_dt]:uppercase">
          <div>
            <dt>Телефон</dt>
            <dd>
              <a :href="businessPhoneHref">{{ businessPhone }}</a>
            </dd>
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

      <figure class="max-[840px]:col-span-full max-[840px]:min-h-[500px] max-[840px]:border-l-0 max-[840px]:border-t max-[840px]:border-[#171916] max-[560px]:min-h-[470px] relative col-span-5 min-w-0 overflow-hidden border-l border-[#171916] bg-[#13251e] [&_figcaption]:absolute [&_figcaption]:inset-x-0 [&_figcaption]:bottom-0 [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
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

    <section class="max-[560px]:px-[18px] bg-[#f5f2eb] px-[max(24px,calc((100vw_-_1280px)/2))] py-[88px]" aria-labelledby="catalog-title">
      <header class="max-[840px]:grid-cols-[110px_1fr] max-[560px]:block mb-14 grid grid-cols-[72px_minmax(380px,1.45fr)_minmax(280px,0.75fr)] items-start gap-11">
        <div>
          <span class="max-[560px]:mb-[26px] max-[560px]:text-[3.2rem] font-[Segoe_UI,Arial,sans-serif] uppercase mb-[22px] inline-block text-[clamp(2rem,3vw,3.3rem)] font-bold leading-[0.9]">01</span>
          <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Прайс-лист</p>
        </div>
        <h2 id="catalog-title">Основные позиции с ценами за кубометр</h2>
        <p>
          В каталоге указаны реальные цены производства: сухой строганый
          материал, доска камерной сушки, имитация бруса и позиции с
          огнебиозащитной обработкой. Наличие подтверждается перед расчётом
          партии.
        </p>
      </header>

      <div class="border-b border-[#171916]">
        <article
          v-for="product in featuredProducts"
          :key="product.number"
          class="max-[1100px]:grid-cols-[150px_64px_minmax(220px,1fr)_minmax(230px,0.8fr)] max-[840px]:grid-cols-[140px_58px_minmax(0,1fr)] max-[560px]:grid-cols-[86px_1fr] max-[560px]:items-start max-[560px]:gap-[18px] max-[560px]:py-6 grid grid-cols-[minmax(130px,190px)_80px_minmax(260px,1fr)_minmax(270px,0.7fr)] items-center gap-[clamp(20px,3vw,48px)] border-t border-[#171916] py-[22px] [&_figure]:aspect-[4/3] [&_figure]:overflow-hidden [&_figure]:bg-[#d8d2c6] [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:transition-transform [&:hover_img]:scale-[1.018] [&_h3]:mb-3 [&_p]:mb-0 [&_p]:max-w-[600px] [&_p]:text-[#393d37] [&_p]:leading-[1.55] max-[560px]:[&_p]:hidden [&_dl]:m-0 max-[840px]:[&_dl]:col-start-3 max-[560px]:[&_dl]:col-span-full [&_dl_div]:grid [&_dl_div]:grid-cols-[74px_1fr] [&_dl_div]:gap-4 [&_dl_div]:border-t [&_dl_div]:border-[#aaa69b] [&_dl_div]:py-[9px] [&_dl_div:last-child]:border-b [&_dl_div:last-child]:border-[#aaa69b] [&_dt]:mb-2 [&_dt]:font-[Segoe_UI,Arial,sans-serif] [&_dt]:text-[0.8125rem] [&_dt]:font-[760] [&_dt]:uppercase [&_dd]:m-0 [&_dd]:text-[0.94rem]"
        >
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
          <span class="max-[560px]:col-start-2 font-[Segoe_UI,Arial,sans-serif] uppercase self-start pt-1.5 text-[0.8125rem] font-bold leading-[1.4]">{{ product.number }} / М³</span>
          <div class="max-[560px]:col-start-2">
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
              <dd class="whitespace-nowrap font-[Segoe_UI,Arial,sans-serif] font-extrabold text-[#a53e10] text-[1.05rem]">
                {{ formatPricePerCubicMeter(product.price) }}
              </dd>
            </div>
          </dl>
        </article>
      </div>

      <div class="max-[560px]:justify-start mt-7 flex justify-end">
        <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#1f3a2f] no-underline transition-colors duration-150 hover:text-[#d65a1f] disabled:cursor-not-allowed disabled:opacity-50" to="/pilomaterialy"
          >Все позиции и цены каталога</NuxtLink
        >
      </div>
    </section>

    <section class="max-[840px]:grid-cols-2 max-[840px]:gap-6 max-[560px]:px-[18px] max-[560px]:grid max-[560px]:grid-cols-2 max-[560px]:gap-[18px] grid grid-cols-12 gap-7 border-y border-[#171916] bg-[#e9e5dc] px-[max(24px,calc((100vw_-_1280px)/2))] py-[88px]" aria-labelledby="production-title">
      <div class="max-[840px]:col-span-full max-[840px]:pr-0 max-[560px]:col-span-full max-[560px]:p-0 col-span-5 min-w-0 self-center pr-7">
        <span class="max-[560px]:mb-[26px] max-[560px]:text-[3.2rem] font-[Segoe_UI,Arial,sans-serif] uppercase mb-[22px] inline-block text-[clamp(2rem,3vw,3.3rem)] font-bold leading-[0.9]">02</span>
        <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Производственная площадка</p>
        <h2 id="production-title">Материал проходит полный цикл на месте</h2>
        <p>
          Бревно поступает на ленточную пилораму, дальше материал сушится,
          строгается и при необходимости обрабатывается огнебиозащитным
          составом. Фотографии сделаны на действующей площадке, а не в шоуруме.
        </p>
        <p>
          Вся продукция регистрируется в ЛесЕГАИС. Перед расчётом достаточно
          назвать назначение материала — сотрудник подберёт сечение и вариант
          обработки.
        </p>
      </div>

      <figure class="max-[840px]:col-auto max-[840px]:row-auto col-span-4 self-center overflow-hidden border border-[#171916] [&_img]:aspect-[4/3] [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
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

      <figure class="max-[840px]:col-auto max-[840px]:row-auto col-span-3 self-center overflow-hidden border border-[#171916] [&_img]:aspect-[4/3] [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
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

    <section class="max-[560px]:px-[18px] border-b border-[#171916] bg-[#f5f2eb] px-[max(24px,calc((100vw_-_1280px)/2))] py-[88px]" aria-labelledby="photo-band-title">
      <header class="max-[840px]:grid-cols-[110px_1fr] max-[560px]:block mb-11 grid grid-cols-[72px_minmax(320px,1fr)_auto] items-end gap-11">
        <div>
          <span class="max-[560px]:mb-[26px] max-[560px]:text-[3.2rem] font-[Segoe_UI,Arial,sans-serif] uppercase mb-[22px] inline-block text-[clamp(2rem,3vw,3.3rem)] font-bold leading-[0.9]">03</span>
          <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Фото с производства</p>
        </div>
        <h2 id="photo-band-title">Площадка, склад и отгрузка без постановки</h2>
        <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#1f3a2f] no-underline transition-colors duration-150 hover:text-[#d65a1f] disabled:cursor-not-allowed disabled:opacity-50" to="/foto"
          >Смотреть все фотографии</NuxtLink
        >
      </header>

      <div class="max-[1100px]:gap-3.5 max-[840px]:grid-cols-2 max-[560px]:grid-cols-2 max-[560px]:gap-2.5 grid grid-cols-4 gap-5">
        <figure v-for="photo in galleryPreview" :key="photo.image" class="overflow-hidden bg-[#d8d2c6] [&_img]:aspect-[4/5] [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
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

    <section class="max-[560px]:px-[18px] bg-[#13251e] px-[max(24px,calc((100vw_-_1280px)/2))] py-[88px] text-[#fffdf7]" aria-labelledby="order-title">
      <header class="max-[840px]:grid-cols-[110px_1fr] max-[560px]:block mb-14 grid grid-cols-[72px_minmax(380px,1.45fr)_minmax(280px,0.75fr)] items-start gap-11 mb-[58px]">
        <div>
          <span class="max-[560px]:mb-[26px] max-[560px]:text-[3.2rem] font-[Segoe_UI,Arial,sans-serif] uppercase mb-[22px] inline-block text-[clamp(2rem,3vw,3.3rem)] font-bold leading-[0.9]">04</span>
          <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Порядок заказа</p>
        </div>
        <h2 id="order-title">От параметров материала до готовой отгрузки</h2>
        <p>
          Расчёт начинается с конкретных данных, поэтому заранее подготовленный
          список сокращает количество уточнений и помогает быстрее проверить
          подходящий материал.
        </p>
      </header>

      <ol class="m-0 list-none border-b border-[#738078] p-0 [&_li]:grid [&_li]:grid-cols-[72px_1fr] [&_li]:gap-5 [&_li]:border-t [&_li]:border-[#738078] [&_li]:py-6 max-[560px]:[&_li]:grid-cols-[54px_1fr] [&_li>span]:font-[Segoe_UI,Arial,sans-serif] [&_li>span]:text-[0.8125rem] [&_li>span]:font-bold [&_h3]:mb-0 [&_p]:mb-0 [&_p]:text-[#d8d2c6]">
        <li v-for="step in orderSteps" :key="step.number">
          <span>{{ step.number }}</span>
          <div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </div>
        </li>
      </ol>

      <div class="max-[560px]:grid mt-[34px] flex items-center gap-6">
        <NuxtLink class="inline-flex min-h-12 cursor-pointer items-center justify-center border border-[#171916] px-[18px] py-3 text-center font-[Segoe_UI,Arial,sans-serif] font-[760] leading-[1.1] no-underline transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 border-[#1f3a2f] bg-[#1f3a2f] text-[#fffdf7] hover:border-[#13251e] hover:bg-[#13251e]" to="/kontakty"
          >Собрать данные для расчёта</NuxtLink
        >
        <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#1f3a2f] no-underline transition-colors duration-150 hover:text-[#d65a1f] disabled:cursor-not-allowed disabled:opacity-50" to="/dostavka"
          >Узнать порядок получения</NuxtLink
        >
      </div>
    </section>

    <section class="max-[840px]:grid-cols-1 max-[840px]:gap-11 max-[560px]:px-[18px] grid grid-cols-[minmax(320px,1fr)_minmax(300px,0.62fr)] gap-[72px] border-b border-[#171916] bg-[#e9e5dc] px-[max(24px,calc((100vw_-_1280px)/2))] py-[88px]" aria-labelledby="about-title">
      <div class="min-w-0">
        <span class="max-[560px]:mb-[26px] max-[560px]:text-[3.2rem] font-[Segoe_UI,Arial,sans-serif] uppercase mb-[22px] inline-block text-[clamp(2rem,3vw,3.3rem)] font-bold leading-[0.9]">05</span>
        <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">О производстве</p>
        <h2 id="about-title">Официальный производитель, а не перекупщик</h2>
        <p>
          Пилораму ведёт {{ businessRequisites.fullName }}. Продукция
          регистрируется в системе ЛесЕГАИС, покупатель получает документы на
          партию. Оценка покупателей на Яндекс Картах — 4,6.
        </p>
        <div class="flex flex-wrap gap-2.5">
          <a
            class="inline-flex min-h-12 cursor-pointer items-center justify-center border border-[#171916] px-[18px] py-3 text-center font-[Segoe_UI,Arial,sans-serif] font-[760] leading-[1.1] no-underline transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 border-[#d65a1f] bg-[#d65a1f] text-[#fffdf7] hover:border-[#a53e10] hover:bg-[#a53e10]"
            :href="businessWhatsAppUrl"
            target="_blank"
            rel="noopener"
          >
            Написать в WhatsApp
          </a>
          <a class="inline-flex min-h-12 cursor-pointer items-center justify-center border border-[#171916] px-[18px] py-3 text-center font-[Segoe_UI,Arial,sans-serif] font-[760] leading-[1.1] no-underline transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent text-[#171916] hover:bg-[#171916] hover:text-[#fffdf7]" :href="businessPhoneHref">{{
            businessPhone
          }}</a>
        </div>
      </div>

      <dl class="m-0 self-center border-b border-[#171916] [&_div]:grid [&_div]:grid-cols-[150px_1fr] [&_div]:gap-4 [&_div]:border-t [&_div]:border-[#aaa69b] [&_div]:py-[12px] [&_dd]:m-0 [&_dd]:font-[Segoe_UI,Arial,sans-serif] [&_dd]:text-[0.95rem] [&_dd]:font-semibold [&_dd]:[overflow-wrap:anywhere] [&_dt]:font-[Segoe_UI,Arial,sans-serif] [&_dt]:text-[0.8125rem] [&_dt]:font-[760] [&_dt]:uppercase">
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

    <section class="max-[840px]:grid-cols-1 max-[560px]:px-[18px] max-[560px]:gap-[34px] grid grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] items-center gap-[52px] border-b border-[#171916] bg-[#d8d2c6] px-[max(24px,calc((100vw_-_1280px)/2))] py-[88px]" aria-labelledby="video-title">
      <div class="min-w-0">
        <span class="max-[560px]:mb-[26px] max-[560px]:text-[3.2rem] font-[Segoe_UI,Arial,sans-serif] uppercase mb-[22px] inline-block text-[clamp(2rem,3vw,3.3rem)] font-bold leading-[0.9]">06</span>
        <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Видео с площадки</p>
        <h2 id="video-title">Работа пилорамы в Разбегаево</h2>
        <p>
          На видео — работа производственной площадки в Разбегаево: распил
          бревна и подготовка пиломатериалов. Здесь изготавливаем доску, брус и
          другие материалы для строительства.
        </p>
      </div>

      <video
        controls
        preload="metadata"
        playsinline
        poster="/images/pilorama-stanok-brevno.jpg"
        aria-label="Короткое видео с производственной площадки пилорамы"
      >
        <source src="/mp4/short-sawmill-video.mp4" type="video/mp4" />
        Ваш браузер не поддерживает воспроизведение видео.
      </video>
    </section>

    <section class="max-[840px]:grid-cols-1 max-[560px]:px-[18px] max-[560px]:gap-6 grid grid-cols-[minmax(300px,0.8fr)_minmax(280px,0.5fr)_auto] items-center gap-12 bg-[#d65a1f] px-[max(24px,calc((100vw_-_1280px)/2))] py-16 text-[#fffdf7]">
      <div>
        <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Самовывоз и доставка</p>
        <h2>Способ получения согласуется под объём материала</h2>
      </div>
      <p>
        Производственная площадка находится в Разбегаево Ломоносовского района.
        Для расчёта доставки необходимо сообщить адрес, состав заказа и
        доступные условия подъезда к месту разгрузки.
      </p>
      <NuxtLink class="inline-flex min-h-12 cursor-pointer items-center justify-center border border-[#171916] px-[18px] py-3 text-center font-[Segoe_UI,Arial,sans-serif] font-[760] leading-[1.1] no-underline transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 border-[#f5f2eb] bg-[#f5f2eb] text-[#171916] hover:border-[#d65a1f] hover:bg-[#d65a1f] hover:text-[#fffdf7]" to="/dostavka"
        >Проверить условия</NuxtLink
      >
    </section>
  </main>
</template>
