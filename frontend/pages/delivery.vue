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
    <section class="split-masthead">
      <div class="split-masthead__copy">
        <div class="page-masthead__mark">
          <span>ЛОГИСТИКА / 01</span>
          <span>РАЗБЕГАЕВО</span>
        </div>
        <p class="technical-label">Получение заказа</p>
        <h1>Самовывоз и доставка пиломатериалов</h1>
        <p>
          Готовую партию можно забрать с производственной площадки или согласовать доставку.
          Возможность, стоимость и транспорт определяются после уточнения объёма и адреса.
        </p>
      </div>

      <figure>
        <NuxtImg
          src="/images/lumber-stack-2025-03-07.jpg"
          alt="Подготовленная партия окрашенных досок на производственной линии"
          width="1200"
          height="1600"
          sizes="xs:100vw sm:50vw md:48vw"
          densities="1"
          format="webp"
          loading="eager"
          preload
        />
        <figcaption>Партия материала перед комплектованием</figcaption>
      </figure>
    </section>

    <section class="logistics-options" aria-labelledby="options-title">
      <header>
        <span class="section-index">01</span>
        <p class="technical-label">Два способа получения</p>
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

    <section class="delivery-route" aria-labelledby="delivery-route-title">
      <div class="delivery-route__heading">
        <span class="section-index">02</span>
        <p class="technical-label">Данные для логистики</p>
        <h2 id="delivery-route-title">Что потребуется сообщить перед расчётом</h2>
      </div>

      <ol>
        <li v-for="step in deliverySteps" :key="step[0]">
          <span>{{ step[0] }}</span>
          <h3>{{ step[1] }}</h3>
          <p>{{ step[2] }}</p>
        </li>
      </ol>
    </section>

    <section class="service-area">
      <div>
        <span class="section-index">03</span>
        <p class="technical-label">География</p>
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
        <NuxtLink class="button button--dark" to="/kontakty">Подготовить адрес и заказ</NuxtLink>
      </div>
    </section>
  </main>
</template>
