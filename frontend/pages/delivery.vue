<script setup lang="ts">
definePageMeta({
  path: '/dostavka',
})

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
        <h1>Самовывоз и доставка пиломатериалов</h1>
        <p>
          Заказ можно забрать в Разбегаево или оформить доставку. Оплата по факту отгрузки.
        </p>
      </div>

      <figure>
        <NuxtImg
          src="/images/dostavka-pilomaterialov.jpg"
          alt="Машина с пиломатериалами на доставке у участка заказчика"
          width="1200"
          height="1600"
          sizes="xs:100vw sm:50vw md:48vw"
          densities="1"
          format="webp"
          loading="eager"
          preload
        />
        <figcaption>Доставка заказа на участок покупателя</figcaption>
      </figure>
    </section>

    <section class="logistics-options" aria-labelledby="options-title">
      <header>
        <h2 id="options-title">Способы получения</h2>
      </header>

      <article>
        <h3>Самовывоз</h3>
        <p>
          Самовывоз с производственной площадки в Разбегаево.
        </p>
      </article>

      <article>
        <h3>Доставка</h3>
        <p>
          Доставка по Санкт-Петербургу и Ленинградской области. Стоимость уточняйте при заказе.
        </p>
      </article>
    </section>
  </main>
</template>
