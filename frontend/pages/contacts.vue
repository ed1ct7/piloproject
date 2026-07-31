<script setup lang="ts">
definePageMeta({
  path: '/kontakty',
})

useSeoMeta({
  title: 'Контакты пилорамы в Разбегаево',
  description: 'Адрес пилорамы в Разбегаево и список данных для расчёта доски, бруса, самовывоза и доставки по Ломоносовскому району.',
  ogTitle: 'Контакты пилорамы в Разбегаево',
  ogDescription: 'Адрес производства и подготовка запроса на расчёт пиломатериалов.',
  ogType: 'website',
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: `${siteUrl}/kontakty` }],
})
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
          src="/images/paint-shop-1.jpg"
          alt="Рабочая зона производственного цеха пилорамы"
          width="1200"
          height="1600"
          sizes="xs:100vw sm:48vw md:42vw"
          densities="1"
          format="webp"
          loading="eager"
          preload
        />
        <figcaption>Рабочая зона производственной площадки</figcaption>
      </figure>

      <div class="contact-checklist">
        <span class="section-index">01</span>
        <p class="technical-label">Запрос на расчёт</p>
        <h2 id="contact-data-title">Подготовьте параметры будущего заказа</h2>
        <p>
          Для расчёта потребуется название материала, размеры и количество. Также укажите
          назначение, если нужна помощь с выбором подходящей позиции.
        </p>

        <ol>
          <li><span>01</span>Материал и требуемые размеры</li>
          <li><span>02</span>Количество штук или общий объём</li>
          <li><span>03</span>Необходимость распила и обработки</li>
          <li><span>04</span>Самовывоз или адрес доставки</li>
        </ol>

        <div class="contact-notice" role="note">
          <strong>Контактный номер временно уточняется.</strong>
          <p>
            До публикации проверенного номера подготовьте параметры заказа по списку выше.
            Актуальный способ связи будет указан здесь после подтверждения контакта.
          </p>
        </div>
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
