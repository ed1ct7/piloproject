<script setup lang="ts">
definePageMeta({
  path: '/kontakty',
})

useSeoMeta({
  title: 'Контакты пилорамы в Разбегаево – телефон, WhatsApp, адрес',
  description: 'Телефон и WhatsApp пилорамы в Разбегаево, адрес производственной площадки и юридические реквизиты.',
  ogTitle: 'Контакты пилорамы в Разбегаево',
  ogDescription: 'Телефон, WhatsApp, адрес производственной площадки и юридические реквизиты.',
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
      <div class="max-[560px]:min-h-0 max-[560px]:px-5 max-[560px]:pb-10 max-[560px]:pt-[34px] flex flex-col justify-center p-10">
        <div aria-hidden="true" />
        <p class="mb-5 font-[Segoe_UI,Arial,sans-serif] text-sm font-[760] uppercase leading-[1.4] tracking-[0.04em]">Производственная площадка</p>
        <h1>Контакты пилорамы в Разбегаево</h1>
      </div>

      <address class="max-[560px]:min-h-0 max-[560px]:border-l-0 max-[560px]:border-t max-[560px]:border-[#171916] max-[560px]:px-5 max-[560px]:py-[34px] flex flex-col justify-center border-l border-[#171916] bg-[#d65a1f] px-8 py-10 text-[#fffdf7]">
        <span class="mb-5 font-[Segoe_UI,Arial,sans-serif] text-sm font-[760] uppercase leading-[1.4] tracking-[0.04em]">Адрес</span>
        <strong class="mb-1">Разбегаево</strong>
        <span>Ломоносовский район</span>
        <span>Ленинградская область</span>
      </address>
    </section>

    <section class="max-[840px]:grid-cols-1 mx-auto grid w-[min(1280px,100%)] grid-cols-[minmax(0,0.58fr)_minmax(280px,0.42fr)] border-b border-[#171916]" aria-labelledby="contact-data-title">
      <div class="max-[840px]:border-r-0 max-[840px]:border-b max-[840px]:border-[#171916] max-[560px]:px-5 max-[560px]:py-10 border-r border-[#171916] p-[56px]">
        <p class="mb-4 font-[Segoe_UI,Arial,sans-serif] text-sm font-[760] uppercase leading-[1.4] tracking-[0.04em]">Связь с производством</p>
        <h2 id="contact-data-title">Позвоните или напишите в WhatsApp</h2>

        <div class="mb-8 mt-5 max-w-[620px] border border-l-[5px] border-[#171916] border-l-[#d65a1f] bg-[#f5f2eb] px-7 py-7 max-[560px]:px-6 max-[560px]:py-6">
          <a class="mb-4 inline-block font-[Segoe_UI,Arial,sans-serif] text-[clamp(1.75rem,2.6vw,2.4rem)] font-[780] tracking-normal no-underline hover:text-[#d65a1f]" :href="businessPhoneHref">{{ businessPhone }}</a>
          <div class="flex flex-wrap gap-3">
            <a
              class="inline-flex min-h-12 cursor-pointer items-center justify-center border border-[#d65a1f] bg-[#d65a1f] px-5 py-3 text-center font-[Segoe_UI,Arial,sans-serif] text-base font-[760] leading-[1.2] text-[#fffdf7] no-underline transition-colors duration-150 hover:border-[#a53e10] hover:bg-[#a53e10] disabled:cursor-not-allowed disabled:opacity-50"
              :href="businessWhatsAppUrl"
              target="_blank"
              rel="noopener"
            >Написать в WhatsApp</a>
            <a class="inline-flex min-h-12 cursor-pointer items-center justify-center border border-[#171916] bg-transparent px-5 py-3 text-center font-[Segoe_UI,Arial,sans-serif] text-base font-[760] leading-[1.2] text-[#171916] no-underline transition-colors duration-150 hover:bg-[#171916] hover:text-[#fffdf7] disabled:cursor-not-allowed disabled:opacity-50" :href="businessPhoneHref">Позвонить</a>
          </div>
        </div>

        <p>
          При обращении укажите нужный материал, размеры и количество.
        </p>
      </div>

      <div class="max-[560px]:px-5 max-[560px]:py-10 p-[56px]">
        <h2>Реквизиты</h2>
        <dl class="mt-7 border-b border-[#171916] [&_div]:grid [&_div]:grid-cols-[120px_1fr] [&_div]:items-start [&_div]:gap-5 [&_div]:border-t [&_div]:border-[#aaa69b] [&_div]:py-3.5 max-[560px]:[&_div]:grid-cols-[108px_1fr] max-[560px]:[&_div]:gap-4 [&_dd]:m-0 [&_dd]:font-[Segoe_UI,Arial,sans-serif] [&_dd]:text-base [&_dd]:font-semibold [&_dd]:leading-[1.45] [&_dd]:[overflow-wrap:anywhere] [&_dt]:font-[Segoe_UI,Arial,sans-serif] [&_dt]:text-sm [&_dt]:font-[760] [&_dt]:uppercase [&_dt]:leading-[1.4]">
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

  </main>
</template>
