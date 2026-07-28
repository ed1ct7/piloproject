<script setup lang="ts">
definePageMeta({
  path: '/kontakty',
})

useSeoMeta({
  title: 'Контакты пилорамы в Разбегаево',
  description: 'Контакты пилорамы в Разбегаево для расчета пиломатериалов, самовывоза и доставки по Ломоносовскому району и Санкт-Петербургу.',
  ogTitle: 'Контакты пилорамы в Разбегаево',
  ogDescription: 'Связь для расчета доски, бруса, самовывоза и доставки пиломатериалов.',
  ogType: 'website',
  robots: 'index, follow',
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: 'https://pilorama-razbegaevo.clients.site/kontakty' }],
})
</script>

<template>
  <main>
    <section class="simple-hero">
      <div class="simple-hero__inner">
        <p class="eyebrow">Связь</p>
        <h1>Контакты</h1>
        <p>Для точного расчета подготовьте размеры, количество, сортность и адрес доставки.</p>
      </div>
    </section>

    <section class="page-section">
      <div class="page-section__inner">
        <div class="card contact-panel">
          <h3>Пилорама Разбегаево</h3>
          <p>Разбегаево, Ломоносовский район, Ленинградская область.</p>
          <p>Телефон и мессенджеры стоит добавить после подтверждения актуальных контактов владельца.</p>
        </div>
      </div>
    </section>
  </main>
</template>
