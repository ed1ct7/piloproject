<script setup lang="ts">
definePageMeta({ path: '/otzyvy' })

useSeoMeta({
  title: 'Отзывы о пилораме в Разбегаево',
  description: 'Отзывы о пилораме размещены в карточке организации на Яндекс Картах.',
  ogTitle: 'Отзывы о пилораме в Разбегаево',
  ogDescription: 'Посмотреть отзывы или оставить свой можно на Яндекс Картах.',
  ogType: 'website',
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: `${siteUrl}/otzyvy` }],
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Главная', item: '/' },
      { name: 'Отзывы', item: '/otzyvy' },
    ],
  }),
])
</script>

<template>
  <main>
    <section class="border-b border-[#171916] bg-[#d8d2c6] px-[max(24px,calc((100vw_-_1280px)/2))] py-16 max-[560px]:px-[18px]">
      <p class="mb-4 font-[Segoe_UI,Arial,sans-serif] text-sm font-[760] uppercase tracking-[0.04em]">Независимая площадка</p>
      <h1>Отзывы покупателей</h1>
      <p class="max-w-[720px] text-lg leading-[1.65] text-[#393d37]">
        Мы не принимаем и не храним отзывы на этом сайте. Посмотреть отзывы или оставить свой можно в карточке организации на Яндекс Картах.
      </p>
      <a
        class="mt-4 inline-flex min-h-12 items-center bg-[#d65a1f] px-6 py-3 font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#fffdf7] no-underline hover:bg-[#a53e10]"
        :href="businessMapsUrl"
        target="_blank"
        rel="noopener noreferrer"
      >Открыть отзывы в Яндекс Картах</a>
      <p class="mt-6 max-w-[720px] text-sm text-[#555852]">
        Внешний сервис откроется только после нажатия. На его стороне действуют собственные правила обработки данных.
      </p>
    </section>
  </main>
</template>
