<script setup lang="ts">
useSeoMeta({
  title: 'Пиломатериалы в Разбегаево — доска, брус, рейка',
  description: 'Каталог пиломатериалов пилорамы в Разбегаево: обрезная доска, брус, заборная доска, брусок, рейка и распил под размер.',
  robots: 'index, follow',
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: 'https://pilorama-razbegaevo.clients.site/pilomaterialy' }],
})
</script>

<template>
  <main>
    <section class="simple-hero">
      <div class="simple-hero__inner">
        <p class="eyebrow">Каталог</p>
        <h1>Пиломатериалы</h1>
        <p>Обрезная доска, брус, брусок, рейка и заборная доска для стройки, ремонта и участка.</p>
      </div>
    </section>

    <section class="page-section">
      <div class="page-section__inner">
        <ul class="info-list">
          <li><strong>Доска.</strong> Для каркасов, кровли, чернового пола, заборов и хозяйственных построек.</li>
          <li><strong>Брус.</strong> Для опор, лаг, бань, навесов и силовых элементов конструкций.</li>
          <li><strong>Брусок и рейка.</strong> Для обрешетки, подсистем, отделки и упаковочных задач.</li>
          <li><strong>Распил под размер.</strong> Возможность подобрать материал под конкретный заказ и объем.</li>
        </ul>
      </div>
    </section>
  </main>
</template>
