<script setup lang="ts">
definePageMeta({
  path: '/dostavka',
})

useSeoMeta({
  title: 'Доставка пиломатериалов – Разбегаево, Ломоносовский район, СПб',
  description: 'Самовывоз и согласование доставки пиломатериалов из Разбегаево по Ломоносовскому району, Ленинградской области и Санкт-Петербургу.',
  ogTitle: 'Доставка пиломатериалов из Разбегаево',
  ogDescription: 'Порядок самовывоза и согласования доставки доски, бруса и других пиломатериалов.',
  ogType: 'website',
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: `${siteUrl}/dostavka` }],
})
</script>

<template>
  <main>
    <section class="max-[1100px]:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)] max-[840px]:grid-cols-1 max-[840px]:min-h-0 mx-auto grid min-h-[440px] w-[min(1280px,100%)] grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)] border-b border-[#171916]">
      <div class="max-[840px]:min-h-[400px] max-[560px]:min-h-0 max-[560px]:px-[18px] max-[560px]:pb-10 max-[560px]:pt-[34px] flex min-w-0 flex-col justify-center p-10">
        <div class="max-[840px]:mb-8 max-[560px]:mb-7 font-[Segoe_UI,Arial,sans-serif] uppercase grid self-start gap-1.5 text-[0.8125rem] font-bold leading-[1.4] tracking-[0.035em]">
          <span>ЛОГИСТИКА / 01</span>
          <span>РАЗБЕГАЕВО</span>
        </div>
        <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Получение заказа</p>
        <h1>Самовывоз и доставка пиломатериалов</h1>
        <p>
          Заказ можно забрать в Разбегаево или оформить доставку. Оплата по факту отгрузки.
        </p>
      </div>

      <figure class="relative min-h-[440px] border-l border-[#171916] max-[840px]:min-h-[360px] max-[840px]:border-l-0 max-[840px]:border-t [&_figcaption]:absolute [&_figcaption]:inset-x-0 [&_figcaption]:bottom-0 [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
        <NuxtImg
          src="/images/dostavka-pilomaterialov.jpg"
          alt="Машина с пиломатериалами на доставке у участка заказчика"
          width="1200"
          height="1600"
          sizes="xs:100vw sm:50vw md:48vw"
          densities="1"
          format="webp"
          loading="eager"
          preload
        />
        <figcaption>Доставка заказа на участок покупателя</figcaption>
      </figure>
    </section>

    <section class="max-[840px]:grid-cols-2 max-[560px]:grid-cols-1 grid grid-cols-[0.85fr_1fr_1fr] border-b border-[#171916] [&>article]:border-l [&>article]:border-[#171916] [&>article]:p-9 [&>header]:p-[48px] max-[560px]:[&>article]:border-l-0 max-[560px]:[&>article]:border-t max-[560px]:[&>article]:p-[24px] max-[560px]:[&>header]:p-[24px] [&>article>span]:mb-8 [&>article>span]:block [&>article>span]:font-[Segoe_UI,Arial,sans-serif] [&>article>span]:text-[clamp(2.6rem,4.2vw,4.5rem)] [&>article>span]:font-bold [&>article>span]:leading-[0.9] [&>article>p]:mb-0 [&>article>p]:text-[#393d37] [&>article>p]:leading-[1.65]" aria-labelledby="options-title">
      <header>
        <span class="max-[560px]:mb-[26px] max-[560px]:text-[3.2rem] font-[Segoe_UI,Arial,sans-serif] uppercase mb-[22px] inline-block text-[clamp(2rem,3vw,3.3rem)] font-bold leading-[0.9]">01</span>
        <h2 id="options-title">Способы получения</h2>
      </header>

      <article>
        <span>А</span>
        <h3>Самовывоз</h3>
        <p>
          Самовывоз с производственной площадки в Разбегаево.
        </p>
      </article>

      <article>
        <span>Б</span>
        <h3>Доставка</h3>
        <p>
          Доставка по Санкт-Петербургу и Ленинградской области. Стоимость уточняйте при заказе.
        </p>
      </article>
    </section>

  </main>
</template>
