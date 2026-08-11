<script setup lang="ts">
definePageMeta({
  path: '/kontakty',
})

useSeoMeta({
  title: 'Контакты пилорамы в Разбегаево – телефоны, email, адрес',
  description: 'Телефоны пилорамы в Разбегаево, адрес производственной площадки, схема проезда на Яндекс Картах и юридические реквизиты.',
  ogTitle: 'Контакты пилорамы в Разбегаево',
  ogDescription: 'Телефоны, адрес производственной площадки, схема проезда и юридические реквизиты.',
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
    <section class="max-[840px]:grid-cols-[1fr_0.42fr] max-[560px]:grid-cols-1 max-[560px]:min-h-0 mx-auto grid min-h-[340px] w-[min(1280px,100%)] grid-cols-[minmax(0,0.66fr)_minmax(280px,0.34fr)] border-b border-[#171916]">
      <div class="max-[560px]:min-h-0 max-[560px]:px-5 max-[560px]:pb-10 max-[560px]:pt-[34px] flex flex-col justify-center bg-[#efe6d7] p-10">
        <div aria-hidden="true" />
        <p class="mb-5 font-[Segoe_UI,Arial,sans-serif] text-sm font-[760] uppercase leading-[1.4] tracking-[0.04em]">Производственная площадка</p>
        <h1>Контакты пилорамы в Разбегаево</h1>
      </div>

      <address class="max-[560px]:min-h-0 max-[560px]:border-l-0 max-[560px]:border-t max-[560px]:border-[#171916] max-[560px]:px-5 max-[560px]:py-[34px] flex flex-col justify-center border-l border-[#171916] bg-[#a8461e] px-8 py-10 text-[#fffdf7]">
        <span class="mb-5 font-[Segoe_UI,Arial,sans-serif] text-sm font-[760] uppercase leading-[1.4] tracking-[0.04em]">Адрес</span>
        <strong class="mb-1">Производственная площадка</strong>
        <span>{{ businessAddress }}</span>
      </address>
    </section>

    <section class="max-[840px]:grid-cols-1 mx-auto grid w-[min(1280px,100%)] grid-cols-[minmax(0,0.58fr)_minmax(280px,0.42fr)] border-b border-[#171916]" aria-labelledby="contact-data-title">
      <div class="max-[840px]:border-r-0 max-[840px]:border-b max-[840px]:border-[#171916] max-[560px]:px-5 max-[560px]:py-10 border-r border-[#171916] bg-[#fff8eb] p-[56px]">
        <p class="mb-4 font-[Segoe_UI,Arial,sans-serif] text-sm font-[760] uppercase leading-[1.4] tracking-[0.04em]">Связь с производством</p>
        <h2 id="contact-data-title">Позвоните или напишите</h2>

        <div class="mb-8 mt-5 max-w-[620px] border border-l-[5px] border-[#171916] border-l-[#a8461e] bg-[#f1dcc2] px-7 py-7 shadow-[0_18px_42px_rgba(23,25,22,0.16)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_26px_58px_rgba(23,25,22,0.22)] max-[560px]:px-6 max-[560px]:py-6">
          <div class="grid gap-2">
            <a class="font-[Segoe_UI,Arial,sans-serif] text-[clamp(1.75rem,2.6vw,2.4rem)] font-[780] tracking-normal no-underline hover:text-[#a8461e]" :href="businessPhoneHref">{{ businessPhone }}</a>
            <a class="font-[Segoe_UI,Arial,sans-serif] text-[clamp(1.35rem,2vw,1.85rem)] font-[760] tracking-normal no-underline hover:text-[#a8461e]" :href="businessSecondaryPhoneHref">{{ businessSecondaryPhone }}</a>
            <a class="font-[Segoe_UI,Arial,sans-serif] text-lg font-[700] no-underline hover:text-[#a8461e]" :href="businessEmailHref">{{ businessEmail }}</a>
          </div>
          <a
            class="mt-5 inline-flex min-h-12 w-max items-center justify-center bg-[#a8461e] px-5 py-3 font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#fffdf7] no-underline transition-colors duration-150 hover:bg-[#7a451e]"
            :href="businessMaxUrl"
            target="_blank"
            rel="noopener noreferrer"
          >Написать в MAX</a>
        </div>

        <p>
          При звонке или в сообщении укажите нужный материал, размеры и количество.
        </p>
      </div>

      <div class="max-[560px]:px-5 max-[560px]:py-10 bg-[#ded5c4] p-[56px]">
        <h2>Реквизиты</h2>
        <dl class="mt-7 border-b border-[#171916] [&_div]:grid [&_div]:grid-cols-[120px_1fr] [&_div]:items-start [&_div]:gap-5 [&_div]:border-t [&_div]:border-[#cbb99d] [&_div]:py-3.5 max-[560px]:[&_div]:grid-cols-[108px_1fr] max-[560px]:[&_div]:gap-4 [&_dd]:m-0 [&_dd]:font-[Segoe_UI,Arial,sans-serif] [&_dd]:text-base [&_dd]:font-semibold [&_dd]:leading-[1.45] [&_dd]:[overflow-wrap:anywhere] [&_dt]:font-[Segoe_UI,Arial,sans-serif] [&_dt]:text-sm [&_dt]:font-[760] [&_dt]:uppercase [&_dt]:leading-[1.4]">
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
            <dt>Адрес площадки</dt>
            <dd>{{ businessAddress }}</dd>
          </div>
          <div>
            <dt>Учёт продукции</dt>
            <dd>ЛесЕГАИС</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="max-[840px]:grid-cols-1 mx-auto grid w-[min(1280px,100%)] grid-cols-[minmax(280px,0.38fr)_minmax(0,0.62fr)] border-b border-[#171916] bg-[#d6ded0]" aria-labelledby="map-title">
      <div class="max-[560px]:px-5 max-[560px]:py-10 flex flex-col justify-center p-[56px]">
        <p class="mb-4 font-[Segoe_UI,Arial,sans-serif] text-sm font-[760] uppercase leading-[1.4] tracking-[0.04em]">Схема проезда</p>
        <h2 id="map-title">Производство на карте</h2>
        <p class="max-w-[520px] leading-[1.6] text-[#393d37]">
          Перед выездом позвоните, чтобы согласовать время приезда и готовность заказа к погрузке.
        </p>
        <a
          class="mt-3 inline-flex min-h-12 w-max items-center justify-center border border-[#a8461e] bg-[#a8461e] px-5 py-3 text-center font-[Segoe_UI,Arial,sans-serif] font-[760] leading-[1.2] text-[#fffdf7] no-underline transition-colors duration-150 hover:border-[#7a451e] hover:bg-[#7a451e]"
          :href="businessMapsUrl"
          target="_blank"
          rel="noopener noreferrer"
        >Открыть в Яндекс Картах</a>
      </div>

      <div class="max-[840px]:border-l-0 max-[840px]:border-t flex min-h-[360px] items-center border-l border-[#171916] bg-[#fff8eb] p-[56px] max-[560px]:min-h-0 max-[560px]:p-8">
        <div>
          <p class="mb-3 font-[Segoe_UI,Arial,sans-serif] text-sm font-[760] uppercase">Адрес производственной площадки</p>
          <p class="mb-0 text-lg leading-[1.65]">{{ businessAddress }}</p>
        </div>
      </div>
    </section>

  </main>
</template>
