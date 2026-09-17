<script setup lang="ts">
definePageMeta({
  path: '/o-nas',
})

useSeoMeta({
  title: 'О пилораме в Разбегаево, Ломоносовский район',
  description: 'О производстве пиломатериалов в Разбегаево: распил, камерная сушка, строгание, огнебиозащитная обработка и доставка по Санкт-Петербургу и Ленинградской области.',
  ogTitle: 'О пилораме в Разбегаево',
  ogDescription: 'Собственное производство доски, вагонки и других пиломатериалов в Ломоносовском районе Ленинградской области.',
  ogImage: `${siteUrl}/images/pilorama-stanok-brevno.jpg`,
  ogType: 'website',
  ogUrl: `${siteUrl}/o-nas`,
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: `${siteUrl}/o-nas` }],
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Главная', item: '/' },
      { name: 'О нас', item: '/o-nas' },
    ],
  }),
])

/** Ссылки на посадочные каталога: что именно выпускает пилорама. */
const productLinks = [
  { label: 'Доска обрезная', to: '/doska' },
  { label: 'Сухая и строганая доска', to: '/suhaya-doska' },
  { label: 'Вагонка и евровагонка', to: '/vagonka' },
  { label: 'Имитация бруса', to: '/imitatsiya-brusa' },
  { label: 'Пиломатериалы с огнебиозащитой', to: '/ognebiozashchita' },
  { label: 'Весь прайс: 14 позиций', to: '/pilomaterialy' },
]

/** Общий класс текстовых ссылок страницы — как у ссылок в блоке «Фото». */
const textLinkClass = 'w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)'
</script>

<template>
  <main>
    <section class="max-[840px]:grid-cols-1 grid min-h-[430px] grid-cols-[minmax(0,0.58fr)_minmax(340px,0.42fr)] border-b border-(--color-ink)">
      <div class="max-[560px]:px-[18px] max-[560px]:py-12 flex flex-col justify-center gap-5 bg-(--color-sand) py-10 pr-10 pl-[max(40px,calc((100vw_-_1280px)/2))]">
        <div class="grid gap-4">
          <p class="eyebrow mb-0">Собственное производство</p>
          <h1 class="max-w-[700px]">О пилораме в Разбегаево</h1>
        </div>
        <p class="mb-0 max-w-[650px] text-[1.08rem] leading-[1.6] text-(--color-ink)/85">
          Производим пиломатериалы для строительства и отделки на площадке в Ломоносовском районе Ленинградской области: пилим, сушим, строгаем, красим и обрабатываем огнебиозащитой в одном месте.
        </p>
      </div>

      <figure class="max-[840px]:h-auto max-[840px]:min-h-[420px] max-[840px]:border-l-0 max-[840px]:border-t max-[560px]:min-h-[340px] h-[clamp(430px,52vh,520px)] min-w-0 overflow-hidden border-l border-(--color-ink) bg-(--color-forest-deep) [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
        <NuxtImg
          src="/images/pilorama-stanok-brevno.jpg"
          alt="Пилорамный станок с бревном на производственной площадке в Разбегаево"
          width="1200"
          height="1200"
          sizes="xs:100vw sm:100vw md:42vw lg:42vw xl:42vw xxl:42vw"
          densities="1 2"
          format="webp"
          loading="eager"
          preload
        />
      </figure>
    </section>

    <section class="border-b border-(--color-ink)" aria-labelledby="production-title">
      <div class="grid gap-5 py-[56px] pr-6 pl-[max(40px,calc((100vw_-_1280px)/2))] max-[560px]:px-[18px] max-[560px]:py-12">
        <div class="grid gap-4">
          <p class="eyebrow mb-0">Чем занимаемся</p>
          <h2 id="production-title">Что делаем</h2>
        </div>
        <div class="grid max-w-[760px] gap-3">
          <p>
            Пилорама {{ businessRequisites.shortName }} выпускает доску естественной влажности, доску камерной сушки, сухую строганую доску, строганый брусок и рейку, имитацию бруса и вагонку двух профилей. Всего в прайсе 14 позиций, и у каждой указана цена — за кубометр или за штуку.
          </p>
          <p>
            Доску пилим на ленточной пилораме: сечения от 25×100 до 50×200 мм при длине 6 метров. У строганой доски свой ряд, от 20×95 до 45×195 мм, длины 3 и 6 метров. Отделочные позиции идут готовыми размерами: имитация бруса 20×145 мм, евровагонка 12,5×95×3000 мм и вагонка «Штиль» 12,5×120×3000 мм.
          </p>
          <p class="mb-0">
            Наличие сечений подтверждает менеджер: ассортимент на площадке меняется по мере распила, а нестандартные размеры пилим под заказ. У доски, строганой доски и имитации бруса на сайте есть таблицы сечений с ценой за штуку и калькулятор объёма — партию можно прикинуть до звонка.
          </p>
        </div>
        <nav class="flex flex-wrap gap-x-8 gap-y-3" aria-label="Разделы каталога">
          <NuxtLink v-for="link in productLinks" :key="link.to" :class="textLinkClass" :to="link.to">{{ link.label }}</NuxtLink>
        </nav>
      </div>
    </section>

    <section class="border-b border-(--color-ink) bg-(--color-paper)" aria-labelledby="yard-title">
      <div class="grid gap-5 py-[56px] pr-6 pl-[max(40px,calc((100vw_-_1280px)/2))] max-[560px]:px-[18px] max-[560px]:py-12">
        <div class="grid gap-4">
          <p class="eyebrow mb-0">Площадка</p>
          <h2 id="yard-title">Полный цикл на одной территории</h2>
        </div>
        <div class="grid max-w-[760px] gap-3">
          <p>
            На одной территории стоят ленточная пилорама, сушильная камера, строгальный станок, участок покраски и крытый склад. Материал проходит путь от бревна до упакованной пачки, не выезжая за ворота: сухую доску мы не покупаем у посредников, а сушим сами.
          </p>
          <p>
            Огнебиозащитную обработку тоже делаем здесь, при отгрузке партии. К доске естественной влажности она добавляет 2 000 ₽/м³, стоимость обработки сухой доски считают по сечению и объёму. Покраска — отдельная работа, условия по ней уточняйте у менеджера.
          </p>
          <p class="mb-0">
            Готовые штабеля и пачки ждут отгрузки под крышей, а не под дождём. Продукция учитывается в государственной системе ЛесЕГАИС.
          </p>
        </div>
      </div>
    </section>

    <section class="border-b border-(--color-ink)" aria-labelledby="work-title">
      <div class="grid gap-5 py-[56px] pr-6 pl-[max(40px,calc((100vw_-_1280px)/2))] max-[560px]:px-[18px] max-[560px]:py-12">
        <div class="grid gap-4">
          <p class="eyebrow mb-0">Порядок работы</p>
          <h2 id="work-title">Кому и как отгружаем</h2>
        </div>
        <div class="grid max-w-[760px] gap-3">
          <p>
            Работаем и с частными покупателями, и с организациями, оптом и в розницу. Заказ обсуждают по телефону или в MAX: менеджер сверяет наличие сечений, считает объём и называет стоимость партии. Сумма на сайте ориентировочная, заказ считается подтверждённым после звонка менеджера, оплата — по факту отгрузки.
          </p>
          <p>
            Площадка работает без выходных: {{ businessWorkingHours.toLowerCase() }}. Заказ забирают самовывозом из Разбегаево или везут на объект по Санкт-Петербургу и Ленинградской области.
          </p>
          <p>
            Перечень позиций можно собрать прямо на сайте и передать его менеджеру в MAX или назвать по телефону. Полей для имени, телефона и адреса на сайте нет: заявка — это просто список материалов, который вы отправляете сами.
          </p>
          <p class="mb-0">
            Продавец — {{ businessRequisites.fullName }}, ИНН {{ businessRequisites.inn }}, ОГРНИП {{ businessRequisites.ogrnip }}. Запись в реестре сделана {{ businessRequisites.registrationDate }}. Полные реквизиты, телефоны и адрес площадки — на странице контактов.
          </p>
        </div>
      </div>
    </section>

    <section class="max-[840px]:grid-cols-1 max-[560px]:px-[18px] grid grid-cols-[minmax(300px,0.82fr)_minmax(360px,1.18fr)] gap-[clamp(40px,7vw,104px)] border-b border-(--color-ink) bg-(--color-sand) px-[max(24px,calc((100vw_-_1280px)/2))] py-[72px] max-[560px]:py-14" aria-labelledby="next-step-title">
      <div class="grid content-start gap-4">
        <p class="eyebrow mb-0">Фото</p>
        <h2 id="next-step-title">Станки, склад и отгрузка</h2>
      </div>
      <div class="grid content-start gap-5">
        <p class="max-w-[640px] text-[1.05rem] leading-[1.6] text-(--color-ink)/85">
          В фотогалерее собраны реальные кадры производственной площадки: ленточная пилорама с бревном, крытый склад, пачки сухой доски, бруска и рейки, обработанная огнебиозащитой доска и погрузка заказов.
        </p>
        <div class="flex flex-wrap gap-5">
          <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)" to="/foto">Смотреть фотографии</NuxtLink>
          <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)" to="/kontakty">Связаться с нами</NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>
