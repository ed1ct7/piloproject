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
    <section class="max-[840px]:grid-cols-[1fr_0.42fr] max-[560px]:grid-cols-1 max-[560px]:min-h-0 mx-auto grid min-h-[340px] w-[min(1280px,100%)] grid-cols-[minmax(0,0.66fr)_minmax(280px,0.34fr)] border-b border-[#171916]">
      <div class="max-[560px]:min-h-0 max-[560px]:px-[18px] max-[560px]:pb-10 max-[560px]:pt-[34px] flex flex-col justify-center p-10">
        <div class="max-[840px]:mb-8 max-[560px]:mb-7 font-[Segoe_UI,Arial,sans-serif] uppercase grid self-start gap-1.5 text-[0.8125rem] font-bold leading-[1.4] tracking-[0.035em]">
          <span>КОНТАКТ / 01</span>
          <span>ЛОМОНОСОВСКИЙ РАЙОН</span>
        </div>
        <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Производственная площадка</p>
        <h1>Контакты пилорамы в Разбегаево</h1>
      </div>

      <address class="max-[560px]:min-h-0 max-[560px]:border-l-0 max-[560px]:border-t max-[560px]:border-[#171916] max-[560px]:px-[18px] max-[560px]:py-[34px] flex flex-col justify-center border-l border-[#171916] bg-[#d65a1f] px-8 py-10 text-[#fffdf7]">
        <span class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Адрес</span>
        <strong>Разбегаево</strong>
        <span>Ломоносовский район</span>
        <span>Ленинградская область</span>
      </address>
    </section>

    <section class="max-[840px]:grid-cols-[0.38fr_0.62fr] max-[560px]:grid-cols-1 mx-auto grid w-[min(1280px,100%)] grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] border-b border-[#171916]" aria-labelledby="contact-data-title">
      <figure class="relative min-h-[480px] border-r border-[#171916] max-[560px]:min-h-[320px] max-[560px]:border-r-0 max-[560px]:border-b [&_figcaption]:absolute [&_figcaption]:inset-x-0 [&_figcaption]:bottom-0 [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
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

      <div class="max-[560px]:px-[18px] max-[560px]:py-[52px] p-[56px]">
        <span class="max-[560px]:mb-[26px] max-[560px]:text-[3.2rem] font-[Segoe_UI,Arial,sans-serif] uppercase mb-[22px] inline-block text-[clamp(2rem,3vw,3.3rem)] font-bold leading-[0.9]">01</span>
        <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Связь с производством</p>
        <h2 id="contact-data-title">Позвоните или напишите в WhatsApp</h2>

        <div class="mb-[34px] mt-1.5 max-w-[620px] border border-l-[5px] border-[#171916] border-l-[#d65a1f] bg-[#f5f2eb] px-6 py-[26px]">
          <a class="mb-2.5 inline-block font-[Segoe_UI,Arial,sans-serif] text-[clamp(1.7rem,2.6vw,2.4rem)] font-[780] tracking-normal no-underline hover:text-[#d65a1f]" :href="businessPhoneHref">{{ businessPhone }}</a>
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
          При обращении укажите нужный материал, размеры и количество.
        </p>

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

  </main>
</template>
