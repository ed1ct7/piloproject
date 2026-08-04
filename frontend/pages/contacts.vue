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
    <section class="contact-masthead">
      <div class="contact-masthead__title">
        <div class="page-masthead__mark">
          <span>КОНТАКТ / 01</span>
          <span>ЛОМОНОСОВСКИЙ РАЙОН</span>
        </div>
        <p class="technical-label">Производственная площадка</p>
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
        <span class="section-index">01</span>
        <p class="technical-label">Связь с производством</p>
        <h2 id="contact-data-title">Позвоните или напишите в WhatsApp</h2>

        <div class="contact-channels">
          <a class="contact-channels__phone" :href="businessPhoneHref">{{ businessPhone }}</a>
          <p>Звонки и сообщения принимаются в рабочее время площадки.</p>
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
          Чтобы расчёт занял один разговор, подготовьте параметры заказа по списку.
          Если нужна помощь с выбором позиции, назовите назначение конструкции.
        </p>

        <ol>
          <li><span>01</span>Материал и требуемые размеры</li>
          <li><span>02</span>Количество штук или общий объём</li>
          <li><span>03</span>Необходимость распила и обработки</li>
          <li><span>04</span>Самовывоз или адрес доставки</li>
        </ol>

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

    <section class="contact-next">
      <div>
        <span class="section-index">02</span>
        <p class="technical-label">Перед поездкой</p>
        <h2>Уточните наличие и готовность партии заранее</h2>
      </div>
      <p>
        Производственная площадка не заменяет розничный магазин с постоянной выкладкой. Перед
        приездом нужно подтвердить нужный материал и согласовать время получения.
      </p>
      <NuxtLink class="text-link" to="/pilomaterialy">Вернуться к каталогу</NuxtLink>
    </section>
  </main>
</template>
