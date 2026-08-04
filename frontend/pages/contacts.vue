<script setup lang="ts">
definePageMeta({
  path: '/kontakty',
})

useSeoMeta({
  title: 'Контакты пилорамы в Разбегаево – телефон, WhatsApp, адрес',
  description: 'Телефон и WhatsApp пилорамы в Разбегаево, адрес производственной площадки и юридические реквизиты.',
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
    <section class="contact-masthead">
      <div class="contact-masthead__title">
        <h1>Контакты пилорамы в Разбегаево</h1>
      </div>

      <address class="contact-address">
        <span class="technical-label">Адрес</span>
        <strong>Разбегаево</strong>
        <span>Ломоносовский район</span>
        <span>Ленинградская область</span>
      </address>
    </section>

    <section class="contact-workspace" aria-labelledby="contact-data-title">
      <figure>
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

      <div class="contact-checklist">
        <h2 id="contact-data-title">Позвоните или напишите в WhatsApp</h2>

        <div class="contact-channels">
          <a class="contact-channels__phone" :href="businessPhoneHref">{{ businessPhone }}</a>
          <div class="section-actions">
            <a
              class="button button--signal"
              :href="businessWhatsAppUrl"
              target="_blank"
              rel="noopener"
            >Написать в WhatsApp</a>
            <a class="button button--outline" :href="businessPhoneHref">Позвонить</a>
          </div>
        </div>

        <p>
          При обращении укажите нужный материал, размеры и количество.
        </p>

        <dl class="contact-requisites">
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
