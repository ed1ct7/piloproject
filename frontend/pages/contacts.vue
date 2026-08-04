<script setup lang="ts">
definePageMeta({
  path: '/kontakty',
})

useSeoMeta({
  title: 'Контакты пилорамы в Разбегаево – телефон, WhatsApp, адрес',
  description: 'Телефон и WhatsApp пилорамы в Разбегаево, адрес производственной площадки, реквизиты и список данных для расчёта доски, бруса, самовывоза и доставки.',
  ogTitle: 'Контакты пилорамы в Разбегаево',
  ogDescription: 'Телефон, WhatsApp и адрес производства. Подготовка запроса на расчёт пиломатериалов.',
  ogImage: `${siteUrl}/images/ploshchadka-otgruzka-pilomaterialov.jpg`,
  ogType: 'website',
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: `${siteUrl}/kontakty` }],
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Главная', item: '/' },
      { name: 'Контакты', item: '/kontakty' },
    ],
  }),
])
</script>

<template>
  <main>
    <section class="max-[840px]:grid-cols-[1fr_0.42fr] max-[560px]:grid-cols-1 max-[560px]:min-h-0 mx-auto grid min-h-[460px] w-[min(1280px,100%)] grid-cols-[minmax(0,0.72fr)_minmax(300px,0.28fr)] border-b border-[#171916]">
      <div class="max-[560px]:min-h-0 max-[560px]:px-[18px] max-[560px]:pb-12 max-[560px]:pt-[42px] flex flex-col justify-end p-[52px]">
        <div class="max-[840px]:mb-12 max-[560px]:mb-[38px] font-[Segoe_UI,Arial,sans-serif] uppercase grid self-start gap-1.5 text-[0.8125rem] font-bold leading-[1.4] tracking-[0.035em]">
          <span>КОНТАКТ / 01</span>
          <span>ЛОМОНОСОВСКИЙ РАЙОН</span>
        </div>
        <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Производственная площадка</p>
        <h1>Контакты пилорамы в Разбегаево</h1>
      </div>

      <address class="max-[560px]:min-h-0 max-[560px]:border-l-0 max-[560px]:border-t max-[560px]:border-[#171916] max-[560px]:px-[18px] max-[560px]:py-[42px] flex flex-col justify-end border-l border-[#171916] bg-[#d65a1f] px-[42px] py-[52px] text-[#fffdf7]">
        <span class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Адрес</span>
        <strong>Разбегаево</strong>
        <span>Ломоносовский район</span>
        <span>Ленинградская область</span>
      </address>
    </section>

    <section class="max-[840px]:grid-cols-[0.42fr_0.58fr] max-[560px]:grid-cols-1 mx-auto grid w-[min(1280px,100%)] grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)] border-b border-[#171916]" aria-labelledby="contact-data-title">
      <figure class="relative min-h-[620px] border-r border-[#171916] max-[560px]:min-h-[420px] max-[560px]:border-r-0 max-[560px]:border-b [&_figcaption]:absolute [&_figcaption]:inset-x-0 [&_figcaption]:bottom-0 [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
        <NuxtImg
          src="/images/ploshchadka-otgruzka-pilomaterialov.jpg"
          alt="Производственная площадка пилорамы с партией доски на отгрузке"
          width="900"
          height="1600"
          sizes="xs:100vw sm:48vw md:42vw"
          densities="1"
          format="webp"
          loading="eager"
          preload
        />
        <figcaption>Комплектование партии на площадке</figcaption>
      </figure>

      <div class="max-[560px]:px-[18px] max-[560px]:py-[52px] p-16">
        <span class="max-[560px]:mb-[26px] max-[560px]:text-[3.2rem] font-[Segoe_UI,Arial,sans-serif] uppercase mb-[22px] inline-block text-[clamp(2rem,3vw,3.3rem)] font-bold leading-[0.9]">01</span>
        <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Связь с производством</p>
        <h2 id="contact-data-title">Позвоните или напишите в WhatsApp</h2>

        <div class="mb-[34px] mt-1.5 border border-l-[5px] border-[#171916] border-l-[#d65a1f] bg-[#f5f2eb] px-6 py-[26px]">
          <a class="mb-2.5 inline-block font-[Segoe_UI,Arial,sans-serif] text-[clamp(1.7rem,2.6vw,2.4rem)] font-[780] tracking-[-0.01em] no-underline hover:text-[#d65a1f]" :href="businessPhoneHref">{{ businessPhone }}</a>
          <p>Звонки и сообщения принимаются в рабочее время площадки.</p>
          <div class="flex flex-wrap gap-2.5">
            <a
              class="inline-flex min-h-12 cursor-pointer items-center justify-center border border-[#171916] px-[18px] py-3 text-center font-[Segoe_UI,Arial,sans-serif] font-[760] leading-[1.1] no-underline transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 border-[#d65a1f] bg-[#d65a1f] text-[#fffdf7] hover:border-[#a53e10] hover:bg-[#a53e10]"
              :href="businessWhatsAppUrl"
              target="_blank"
              rel="noopener"
            >Написать в WhatsApp</a>
            <a class="inline-flex min-h-12 cursor-pointer items-center justify-center border border-[#171916] px-[18px] py-3 text-center font-[Segoe_UI,Arial,sans-serif] font-[760] leading-[1.1] no-underline transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent text-[#171916] hover:bg-[#171916] hover:text-[#fffdf7]" :href="businessPhoneHref">Позвонить</a>
          </div>
        </div>

        <p>
          Чтобы расчёт занял один разговор, подготовьте параметры заказа по списку.
          Если нужна помощь с выбором позиции, назовите назначение конструкции.
        </p>

        <ol class="m-0 mt-7 list-none border-b border-[#aaa69b] p-0 [&_li]:grid [&_li]:grid-cols-[48px_1fr] [&_li]:gap-4 [&_li]:border-t [&_li]:border-[#aaa69b] [&_li]:py-3 [&_span]:font-[Segoe_UI,Arial,sans-serif] [&_span]:text-[0.8125rem] [&_span]:font-bold">
          <li><span>01</span>Материал и требуемые размеры</li>
          <li><span>02</span>Количество штук или общий объём</li>
          <li><span>03</span>Необходимость распила и обработки</li>
          <li><span>04</span>Самовывоз или адрес доставки</li>
        </ol>

        <dl class="mt-9 border-b border-[#171916] [&_div]:grid [&_div]:grid-cols-[120px_1fr] [&_div]:gap-4 [&_div]:border-t [&_div]:border-[#aaa69b] [&_div]:py-[11px] [&_dd]:m-0 [&_dd]:font-[Segoe_UI,Arial,sans-serif] [&_dd]:text-[0.95rem] [&_dd]:font-semibold [&_dd]:[overflow-wrap:anywhere] [&_dt]:font-[Segoe_UI,Arial,sans-serif] [&_dt]:text-[0.8125rem] [&_dt]:font-[760] [&_dt]:uppercase">
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
      </div>
    </section>

    <section class="max-[840px]:grid-cols-1 max-[560px]:px-[18px] max-[560px]:items-start grid grid-cols-[minmax(300px,0.8fr)_minmax(320px,0.7fr)] gap-[72px] border-t border-[#171916] bg-[#d8d2c6] px-[max(24px,calc((100vw_-_1280px)/2))] py-[72px] grid-cols-[minmax(300px,0.7fr)_minmax(300px,0.55fr)_auto] items-end bg-[#f5f2eb]">
      <div>
        <span class="max-[560px]:mb-[26px] max-[560px]:text-[3.2rem] font-[Segoe_UI,Arial,sans-serif] uppercase mb-[22px] inline-block text-[clamp(2rem,3vw,3.3rem)] font-bold leading-[0.9]">02</span>
        <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Перед поездкой</p>
        <h2>Уточните наличие и готовность партии заранее</h2>
      </div>
      <p>
        Производственная площадка не заменяет розничный магазин с постоянной выкладкой. Перед
        приездом нужно подтвердить нужный материал и согласовать время получения.
      </p>
      <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#1f3a2f] no-underline transition-colors duration-150 hover:text-[#d65a1f] disabled:cursor-not-allowed disabled:opacity-50" to="/pilomaterialy">Вернуться к каталогу</NuxtLink>
    </section>
  </main>
</template>
