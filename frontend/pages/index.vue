<script setup lang="ts">
// Первые четыре позиции прайса показываются в витрине на главной.
const featuredProducts = priceListProducts.slice(0, 4);

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
    <section class="max-[1100px]:min-h-0 max-[840px]:grid-cols-1 mx-auto grid min-h-[560px] w-[min(1280px,100%)] grid-cols-12 border-b border-[#171916]">
      <div class="max-[840px]:col-span-full max-[840px]:min-h-[440px] max-[560px]:min-h-0 max-[560px]:px-[18px] max-[560px]:pb-9 max-[560px]:pt-8 col-span-7 flex min-w-0 flex-col justify-center bg-[#e9e5dc] p-10">
        <h1 class="mb-5 max-w-[720px] text-[clamp(2.5rem,3.35vw,4.1rem)] leading-[1.06] max-[560px]:mb-4 max-[560px]:text-[clamp(2rem,8vw,2.65rem)] max-[560px]:leading-[1.08]">Пиломатериалы в Разбегаево: доска, брусок, рейка</h1>
        <p class="mb-7 max-w-[640px] text-[clamp(1rem,1.25vw,1.18rem)] leading-[1.55] text-[#393d37] max-[560px]:mb-6 max-[560px]:text-base max-[560px]:leading-[1.5]">
          Пиломатериалы от производителя оптом и в розницу. Доставка по Санкт-Петербургу
          и Ленинградской области. Оплата по факту отгрузки.
        </p>

        <div class="flex flex-wrap gap-3 max-[560px]:grid max-[560px]:grid-cols-2 max-[420px]:grid-cols-1">
          <NuxtLink class="inline-flex min-h-[50px] cursor-pointer items-center justify-center border border-[#171916] px-5 py-3 text-center font-[Segoe_UI,Arial,sans-serif] text-[0.95rem] font-[760] leading-[1.2] no-underline transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 border-[#d65a1f] bg-[#d65a1f] text-[#fffdf7] hover:border-[#a53e10] hover:bg-[#a53e10]" to="/pilomaterialy"
            >Каталог и цены</NuxtLink
          >
          <a
            class="inline-flex min-h-[50px] cursor-pointer items-center justify-center border border-[#171916] px-5 py-3 text-center font-[Segoe_UI,Arial,sans-serif] text-[0.95rem] font-[760] leading-[1.2] no-underline transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent text-[#171916] hover:bg-[#171916] hover:text-[#fffdf7]"
            :href="businessWhatsAppUrl"
            target="_blank"
            rel="noopener"
          >Написать в WhatsApp</a>
        </div>
      </div>

      <figure class="max-[840px]:col-span-full max-[840px]:min-h-[420px] max-[840px]:border-l-0 max-[840px]:border-t max-[840px]:border-[#171916] max-[560px]:min-h-[380px] relative col-span-5 min-w-0 overflow-hidden border-l border-[#171916] bg-[#13251e] [&_figcaption]:absolute [&_figcaption]:inset-x-0 [&_figcaption]:bottom-0 [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
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

    <section class="bg-[#f5f2eb] px-[max(24px,calc((100vw_-_1280px)/2))] py-[72px] max-[560px]:px-[18px] max-[560px]:py-14" aria-labelledby="catalog-title">
      <header class="mb-12 grid grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)] items-start gap-[clamp(40px,7vw,104px)] max-[840px]:grid-cols-1 max-[840px]:gap-5 max-[560px]:mb-9">
        <h2 id="catalog-title" class="mb-0 max-w-[650px]">Основные позиции с ценами за кубометр</h2>
        <p class="mb-0 max-w-[430px] text-[1.02rem] leading-[1.55] text-[#393d37]">
          Сухой строганый материал, доска камерной сушки, имитация бруса и доска
          с огнебиозащитной обработкой.
        </p>
      </header>

      <div class="border-b border-[#171916]">
        <article
          v-for="product in featuredProducts"
          :key="product.number"
          class="max-[1100px]:grid-cols-[150px_minmax(220px,1fr)_minmax(230px,0.8fr)] max-[840px]:grid-cols-[140px_minmax(0,1fr)] max-[560px]:grid-cols-[86px_1fr] max-[560px]:items-start max-[560px]:gap-[18px] max-[560px]:py-6 grid grid-cols-[minmax(130px,190px)_minmax(260px,1fr)_minmax(270px,0.7fr)] items-center gap-[clamp(20px,3vw,48px)] border-t border-[#171916] py-[22px] [&_figure]:aspect-[4/3] [&_figure]:overflow-hidden [&_figure]:bg-[#d8d2c6] [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:transition-transform [&:hover_img]:scale-[1.018] [&_h3]:mb-0 [&_dl]:m-0 max-[840px]:[&_dl]:col-start-2 max-[560px]:[&_dl]:col-span-full [&_dl_div]:grid [&_dl_div]:grid-cols-[74px_1fr] [&_dl_div]:gap-4 [&_dl_div]:border-t [&_dl_div]:border-[#aaa69b] [&_dl_div]:py-[9px] [&_dl_div:last-child]:border-b [&_dl_div:last-child]:border-[#aaa69b] [&_dt]:mb-2 [&_dt]:font-[Segoe_UI,Arial,sans-serif] [&_dt]:text-[0.8125rem] [&_dt]:font-[760] [&_dt]:uppercase [&_dd]:m-0 [&_dd]:text-[0.94rem]"
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
          <div class="max-[560px]:col-start-2">
            <h3>{{ product.displayTitle }}</h3>
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

    <section class="max-[840px]:grid-cols-1 max-[560px]:px-[18px] grid grid-cols-[minmax(320px,0.78fr)_minmax(340px,1.22fr)] border-b border-[#171916] bg-[#e9e5dc] px-[max(24px,calc((100vw_-_1280px)/2))] max-[560px]:py-14" aria-labelledby="about-title">
      <div class="max-[840px]:border-r-0 max-[840px]:border-b max-[840px]:py-12 max-[560px]:py-0 max-[560px]:pb-10 flex min-w-0 flex-col justify-center border-r border-[#171916] py-20 pr-[clamp(32px,6vw,88px)]">
        <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Собственное производство</p>
        <h2 id="about-title">О производстве</h2>
      </div>

      <div class="max-[840px]:py-12 max-[840px]:pl-0 max-[560px]:pb-0 max-[560px]:pt-10 flex min-w-0 flex-col justify-center py-20 pl-[clamp(32px,6vw,88px)]">
        <p class="mb-7 max-w-[650px] text-[1.05rem] leading-[1.6] text-[#393d37]">
          Производим пиломатериалы естественной влажности и камерной сушки, строганую доску, брус и имитацию бруса. Работаем с частными заказчиками и организациями, организуем доставку по Санкт-Петербургу и Ленинградской области.
        </p>
        <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#1f3a2f] no-underline transition-colors duration-150 hover:text-[#d65a1f] disabled:cursor-not-allowed disabled:opacity-50" to="/o-nas"
          >Подробнее о производстве</NuxtLink
        >
      </div>
    </section>

    <section class="max-[560px]:px-[18px] border-b border-[#171916] bg-[#f5f2eb] px-[max(24px,calc((100vw_-_1280px)/2))] py-20 max-[560px]:py-14" aria-labelledby="photo-band-title">
      <header class="max-[840px]:grid-cols-[90px_minmax(0,1fr)] max-[840px]:items-start max-[560px]:block mb-10 grid grid-cols-[56px_minmax(0,1fr)_auto] items-end gap-8">
        <div aria-hidden="true" />
        <h2 id="photo-band-title" class="scroll-mt-28">Производство, склад и отгрузка</h2>
        <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#1f3a2f] no-underline transition-colors duration-150 hover:text-[#d65a1f] disabled:cursor-not-allowed disabled:opacity-50" to="/foto"
          >Смотреть все фотографии</NuxtLink
        >
      </header>

      <div class="grid grid-cols-4 gap-5 max-[1100px]:gap-4 max-[840px]:grid-cols-2 max-[560px]:grid-cols-1 max-[560px]:gap-4">
        <figure v-for="photo in galleryPreview" :key="photo.image" class="border border-[#171916] bg-[#d8d2c6] shadow-[0_14px_30px_rgba(23,25,22,0.08)] [&_img]:aspect-[4/3] [&_img]:w-full [&_img]:object-cover">
          <NuxtImg
            :src="photo.image"
            :alt="photo.alt"
            width="720"
            height="900"
            sizes="xs:100vw sm:50vw md:25vw lg:25vw"
            densities="1"
            format="webp"
            loading="eager"
          />
          <figcaption>{{ photo.caption }}</figcaption>
        </figure>
      </div>
    </section>

    <section class="grid grid-cols-[minmax(280px,420px)_minmax(360px,620px)] items-start justify-center gap-[clamp(48px,7vw,112px)] border-b border-[#171916] bg-[#d8d2c6] px-[max(24px,calc((100vw_-_1280px)/2))] py-[72px] max-[840px]:grid-cols-1 max-[840px]:gap-9 max-[560px]:px-[18px] max-[560px]:py-14" aria-labelledby="video-title">
      <div class="min-w-0 max-w-[420px] max-[840px]:max-w-[620px]">
        <h2 id="video-title" class="mb-4 text-[clamp(2rem,2.6vw,2.8rem)] leading-[1.08] max-[560px]:mb-3">Работа пилорамы в Разбегаево</h2>
        <p class="mb-0 max-w-[390px] text-[1.05rem] leading-[1.55] text-[#393d37]">
          Короткое видео распила бревна на производственной площадке.
        </p>
      </div>

      <video
        class="aspect-[4/3] w-full max-w-[620px] justify-self-end bg-[#171916] object-cover max-[840px]:justify-self-start"
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

  </main>
</template>
