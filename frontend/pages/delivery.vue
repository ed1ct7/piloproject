<script setup lang="ts">
definePageMeta({
  path: '/dostavka',
})

const deliverySteps = [
  ['01', 'Состав заказа', 'Для начала нужны материал, размеры, количество и предполагаемый объём партии.'],
  ['02', 'Адрес', 'Покупатель сообщает населённый пункт и точный адрес будущей разгрузки.'],
  ['03', 'Подъезд', 'Отдельно уточняются ограничения для машины и условия подъезда к объекту.'],
  ['04', 'Согласование', 'После проверки данных определяется подходящий способ получения готового заказа.'],
]

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
    <section class="max-[1100px]:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)] max-[840px]:grid-cols-1 max-[840px]:min-h-0 mx-auto grid min-h-[620px] w-[min(1280px,100%)] grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] border-b border-[#171916]">
      <div class="max-[840px]:min-h-[520px] max-[560px]:min-h-0 max-[560px]:px-[18px] max-[560px]:pb-12 max-[560px]:pt-[42px] flex min-w-0 flex-col justify-center p-[52px]">
        <div class="max-[840px]:mb-12 max-[560px]:mb-[38px] font-[Segoe_UI,Arial,sans-serif] uppercase grid self-start gap-1.5 text-[0.8125rem] font-bold leading-[1.4] tracking-[0.035em]">
          <span>ЛОГИСТИКА / 01</span>
          <span>РАЗБЕГАЕВО</span>
        </div>
        <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Получение заказа</p>
        <h1>Самовывоз и доставка пиломатериалов</h1>
        <p>
          Готовую партию можно забрать с производственной площадки или согласовать доставку.
          Возможность, стоимость и транспорт определяются после уточнения объёма и адреса.
        </p>
      </div>

      <figure class="relative min-h-[620px] border-l border-[#171916] max-[840px]:min-h-[460px] max-[840px]:border-l-0 max-[840px]:border-t [&_figcaption]:absolute [&_figcaption]:inset-x-0 [&_figcaption]:bottom-0 [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
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

    <section class="max-[840px]:grid-cols-2 max-[560px]:grid-cols-1 grid grid-cols-[1.1fr_0.75fr_0.75fr] border-b border-[#171916] [&>article]:border-l [&>article]:border-[#171916] [&>article]:p-[42px] [&>header]:p-[52px] max-[560px]:[&>article]:border-l-0 max-[560px]:[&>article]:border-t max-[560px]:[&>article]:p-[24px] max-[560px]:[&>header]:p-[24px] [&>article>span]:mb-9 [&>article>span]:block [&>article>span]:font-[Segoe_UI,Arial,sans-serif] [&>article>span]:text-[clamp(3rem,5vw,5.2rem)] [&>article>span]:font-bold [&>article>span]:leading-[0.85] [&>article>p]:mb-0 [&>article>p]:text-[#393d37] [&>article>p]:leading-[1.65]" aria-labelledby="options-title">
      <header>
        <span class="max-[560px]:mb-[26px] max-[560px]:text-[3.2rem] font-[Segoe_UI,Arial,sans-serif] uppercase mb-[22px] inline-block text-[clamp(2rem,3vw,3.3rem)] font-bold leading-[0.9]">01</span>
        <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Два способа получения</p>
        <h2 id="options-title">Выбор зависит от объёма и транспорта</h2>
      </header>

      <article>
        <span>А</span>
        <h3>Самовывоз</h3>
        <p>
          Этот вариант подходит покупателю с подходящим транспортом. Время приезда и готовность
          партии необходимо согласовать заранее, чтобы избежать ожидания на площадке.
        </p>
      </article>

      <article>
        <span>Б</span>
        <h3>Согласованная доставка</h3>
        <p>
          Для расчёта потребуется адрес, объём и сведения о подъезде. Условия подтверждаются
          отдельно для каждого заказа, поэтому универсальная стоимость не публикуется.
        </p>
      </article>
    </section>

    <section class="max-[840px]:grid-cols-1 max-[560px]:px-[18px] grid grid-cols-[minmax(300px,0.42fr)_minmax(0,0.58fr)] gap-[72px] bg-[#13251e] px-[max(24px,calc((100vw_-_1280px)/2))] py-[88px] text-[#fffdf7]" aria-labelledby="delivery-route-title">
      <div class="min-w-0">
        <span class="max-[560px]:mb-[26px] max-[560px]:text-[3.2rem] font-[Segoe_UI,Arial,sans-serif] uppercase mb-[22px] inline-block text-[clamp(2rem,3vw,3.3rem)] font-bold leading-[0.9]">02</span>
        <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Данные для логистики</p>
        <h2 id="delivery-route-title">Что потребуется сообщить перед расчётом</h2>
      </div>

      <ol class="m-0 list-none border-b border-[#738078] p-0 [&_li]:grid [&_li]:grid-cols-[72px_minmax(180px,0.4fr)_1fr] [&_li]:gap-5 [&_li]:border-t [&_li]:border-[#738078] [&_li]:py-6 max-[560px]:[&_li]:grid-cols-[54px_1fr] [&_span]:font-[Segoe_UI,Arial,sans-serif] [&_span]:text-[0.8125rem] [&_span]:font-bold [&_h3]:mb-0 [&_p]:mb-0 [&_p]:text-[#d8d2c6]">
        <li v-for="step in deliverySteps" :key="step[0]">
          <span>{{ step[0] }}</span>
          <h3>{{ step[1] }}</h3>
          <p>{{ step[2] }}</p>
        </li>
      </ol>
    </section>

    <section class="max-[840px]:grid-cols-1 max-[560px]:px-[18px] grid grid-cols-[minmax(300px,0.8fr)_minmax(320px,0.7fr)] gap-[72px] border-t border-[#171916] bg-[#d8d2c6] px-[max(24px,calc((100vw_-_1280px)/2))] py-[72px] bg-[#f5f2eb]">
      <div>
        <span class="max-[560px]:mb-[26px] max-[560px]:text-[3.2rem] font-[Segoe_UI,Arial,sans-serif] uppercase mb-[22px] inline-block text-[clamp(2rem,3vw,3.3rem)] font-bold leading-[0.9]">03</span>
        <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">География</p>
        <h2>Разбегаево, Ленинградская область и Санкт-Петербург</h2>
      </div>
      <div>
        <p>
          Основная площадка находится в Разбегаево Ломоносовского района. Доставка по ближайшим
          направлениям и Санкт-Петербургу рассматривается после проверки адреса и объёма.
        </p>
        <p>
          Мы не указываем фиксированные сроки для всей территории, потому что маршрут зависит
          от конкретного заказа и условий разгрузки.
        </p>
        <NuxtLink class="inline-flex min-h-12 cursor-pointer items-center justify-center border border-[#171916] px-[18px] py-3 text-center font-[Segoe_UI,Arial,sans-serif] font-[760] leading-[1.1] no-underline transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 border-[#1f3a2f] bg-[#1f3a2f] text-[#fffdf7] hover:border-[#13251e] hover:bg-[#13251e]" to="/kontakty">Подготовить адрес и заказ</NuxtLink>
      </div>
    </section>
  </main>
</template>
