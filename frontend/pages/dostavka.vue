<script setup lang="ts">
useSeoMeta({
  title: 'Доставка пиломатериалов — Разбегаево, Ломоносовский район, СПб',
  description: 'Самовывоз и доставка пиломатериалов из Разбегаево по Ломоносовскому району, ближайшим поселкам и Санкт-Петербургу.',
  robots: 'index, follow',
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: 'https://pilorama-razbegaevo.clients.site/dostavka' }],
})
</script>

<template>
  <main>
    <section class="simple-hero">
      <div class="simple-hero__inner">
        <p class="eyebrow">Логистика</p>
        <h1>Доставка и самовывоз</h1>
        <p>Помогаем подобрать удобный способ отгрузки под объем заказа, адрес и сроки стройки.</p>
      </div>
    </section>

    <section class="page-section">
      <div class="page-section__inner">
        <ul class="info-list">
          <li><strong>Самовывоз.</strong> Подходит, если материал можно забрать своим транспортом.</li>
          <li><strong>Доставка по району.</strong> Уточняем адрес, объем и тип машины перед расчетом.</li>
          <li><strong>Санкт-Петербург и область.</strong> Для крупных заказов подбираем маршрут и формат отгрузки отдельно.</li>
        </ul>
      </div>
    </section>
  </main>
</template>
