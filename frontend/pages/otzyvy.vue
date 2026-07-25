<script setup lang="ts">
useSeoMeta({
  title: 'Отзывы о пилораме в Разбегаево',
  description: 'Отзывы покупателей о пилораме в Разбегаево: качество доски и бруса, цены, доставка, скорость распила и обслуживание.',
  robots: 'index, follow',
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: 'https://pilorama-razbegaevo.clients.site/otzyvy' }],
})
</script>

<template>
  <main>
    <section class="simple-hero">
      <div class="simple-hero__inner">
        <p class="eyebrow">Репутация</p>
        <h1>Отзывы покупателей</h1>
        <p>В отзывах чаще всего отмечают качество пиломатериалов, понятные цены, скорость и помощь с доставкой.</p>
      </div>
    </section>

    <section class="page-section">
      <div class="page-section__inner">
        <ul class="info-list">
          <li><strong>Качество.</strong> Покупатели выделяют ровную доску, хороший распил и соответствие заявленному материалу.</li>
          <li><strong>Сроки.</strong> Заказы готовят быстро, при наличии материала отгрузка возможна в короткий срок.</li>
          <li><strong>Доставка.</strong> Клиенты отмечают помощь с доставкой и понятное сопровождение заказа.</li>
        </ul>
      </div>
    </section>
  </main>
</template>
