<script setup lang="ts">
definePageMeta({
  path: '/kontakty',
})

useSeoMeta({
  title: 'Контакты пилорамы в Разбегаево, Ленинградская область',
  description: 'Телефоны пилорамы в Разбегаево (Ломоносовский район Ленинградской области), адрес производственной площадки, схема проезда на Яндекс Картах и юридические реквизиты.',
  ogTitle: 'Контакты пилорамы в Разбегаево',
  ogDescription: 'Телефоны, адрес производственной площадки, схема проезда и юридические реквизиты.',
  ogImage: `${siteUrl}/images/ploshchadka-otgruzka-pilomaterialov.jpg`,
  ogType: 'website',
  ogUrl: `${siteUrl}/kontakty`,
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
    <section class="max-[840px]:grid-cols-[1fr_0.42fr] max-[560px]:grid-cols-1 max-[560px]:min-h-0 grid min-h-[340px] grid-cols-[minmax(0,0.66fr)_minmax(280px,0.34fr)] border-b border-(--color-ink)">
      <div class="max-[560px]:min-h-0 max-[560px]:px-5 max-[560px]:pb-10 max-[560px]:pt-[34px] flex flex-col justify-center bg-(--color-sand) py-10 pr-10 pl-[max(40px,calc((100vw_-_1280px)/2))]">
        <div aria-hidden="true" />
        <p class="eyebrow">Производственная площадка</p>
        <h1>Контакты пилорамы в Разбегаево</h1>
      </div>

      <address class="max-[560px]:min-h-0 max-[560px]:border-l-0 max-[560px]:border-t max-[560px]:border-(--color-ink) max-[560px]:px-5 max-[560px]:py-[34px] flex flex-col justify-center border-l border-(--color-ink) bg-(--color-copper) px-8 py-10 text-(--color-paper)">
        <span class="mb-5 font-[Segoe_UI,Arial,sans-serif] text-sm font-[760] uppercase leading-[1.4] tracking-[0.04em]">Адрес</span>
        <strong class="mb-1">Производственная площадка</strong>
        <span>{{ businessAddress }}</span>
        <strong class="mb-1 mt-5">Режим работы</strong>
        <span>{{ businessWorkingHours }}</span>
        <a
          class="mt-6 inline-flex min-h-12 w-max items-center justify-center border border-(--color-paper) px-5 py-3 font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-paper) no-underline transition-colors duration-150 hover:bg-(--color-paper) hover:text-(--color-copper)"
          :href="businessMapsUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Открыть производство в Яндекс Картах, откроется новая вкладка"
        >Открыть в Яндекс Картах</a>
      </address>
    </section>

    <section class="max-[840px]:grid-cols-1 grid grid-cols-[minmax(0,0.58fr)_minmax(280px,0.42fr)] border-b border-(--color-ink)" aria-labelledby="contact-data-title">
      <div class="max-[840px]:border-r-0 max-[840px]:border-b max-[840px]:border-(--color-ink) max-[560px]:px-5 max-[560px]:py-10 border-r border-(--color-ink) bg-(--color-paper) py-[56px] pr-[56px] pl-[max(40px,calc((100vw_-_1280px)/2))]">
        <p class="eyebrow">Связь с производством</p>
        <h2 id="contact-data-title">Позвоните или напишите</h2>

        <div class="mb-8 mt-5 max-w-[620px] border border-l-[5px] border-(--color-ink) border-l-(--color-copper) bg-(--color-sand) px-7 py-7 shadow-[0_18px_42px_rgba(32,35,31,0.16)] max-[560px]:px-6 max-[560px]:py-6">
          <div class="grid gap-2">
            <a class="font-[Segoe_UI,Arial,sans-serif] text-[clamp(1.75rem,2.6vw,2.4rem)] font-[780] tracking-normal no-underline hover:text-(--color-copper)" :href="businessPhoneHref">{{ businessPhone }}</a>
            <a class="font-[Segoe_UI,Arial,sans-serif] text-[clamp(1.35rem,2vw,1.85rem)] font-[760] tracking-normal no-underline hover:text-(--color-copper)" :href="businessSecondaryPhoneHref">{{ businessSecondaryPhone }}</a>
            <a class="font-[Segoe_UI,Arial,sans-serif] text-lg font-[700] no-underline hover:text-(--color-copper)" :href="businessEmailHref">{{ businessEmail }}</a>
          </div>
          <a
            class="mt-5 inline-flex min-h-12 w-max items-center justify-center bg-(--color-copper) px-5 py-3 font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-paper) no-underline transition-colors duration-150 hover:bg-(--color-copper-dark)"
            :href="businessMaxUrl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Написать в MAX, откроется новая вкладка"
          >Написать в MAX</a>
        </div>

        <p>
          При звонке или в сообщении укажите нужный материал, размеры и количество.
        </p>
      </div>

      <div class="max-[560px]:px-5 max-[560px]:py-10 bg-(--color-sand) py-[56px] pl-[56px] pr-[max(56px,calc((100vw_-_1280px)/2))]">
        <h2>Реквизиты</h2>
        <dl class="mt-7 border-b border-(--color-ink) [&_div]:grid [&_div]:grid-cols-[120px_1fr] [&_div]:items-start [&_div]:gap-5 [&_div]:border-t [&_div]:border-(--color-sand) [&_div]:py-3.5 max-[560px]:[&_div]:grid-cols-[108px_1fr] max-[560px]:[&_div]:gap-4 [&_dd]:m-0 [&_dd]:font-[Segoe_UI,Arial,sans-serif] [&_dd]:text-base [&_dd]:font-semibold [&_dd]:leading-[1.45] [&_dd]:[overflow-wrap:anywhere] [&_dt]:font-[Segoe_UI,Arial,sans-serif] [&_dt]:text-sm [&_dt]:font-[760] [&_dt]:uppercase [&_dt]:leading-[1.4]">
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
            <dt>Регистрация</dt>
            <dd>{{ businessRequisites.registrationAuthority }}, {{ businessRequisites.registrationDate }}</dd>
          </div>
          <div>
            <dt>Учёт продукции</dt>
            <dd>ЛесЕГАИС</dd>
          </div>
        </dl>
      </div>
    </section>

    <section
      class="max-[840px]:grid-cols-1 max-[560px]:px-5 grid grid-cols-[minmax(300px,0.82fr)_minmax(360px,1.18fr)] gap-[clamp(40px,6vw,96px)] border-b border-(--color-ink) bg-(--color-paper) py-[64px] pl-[max(40px,calc((100vw_-_1280px)/2))] pr-[max(40px,calc((100vw_-_1280px)/2))]"
      aria-labelledby="pickup-title"
    >
      <div class="grid content-start gap-4">
        <p class="eyebrow mb-0">Самовывоз</p>
        <h2 id="pickup-title">Как добраться и самовывоз</h2>
      </div>
      <div class="grid content-start gap-4">
        <p class="mb-0 max-w-[680px] leading-[1.55] text-(--color-ink)/85">
          Производственная площадка пилорамы находится в деревне Разбегаево, Горбунковское сельское поселение, Ломоносовский район Ленинградской области, в промзоне Большевик. {{ businessWorkingHours }}, поэтому забрать заказ можно в удобный день недели.
        </p>
        <p class="mb-0 max-w-[680px] leading-[1.55] text-(--color-ink)/70">
          Самовывоз проходит в несколько шагов: сначала мы готовим и сортируем материал, затем сообщаем, что заказ полностью готов к выдаче. Дальше согласуем удобное время приезда, чтобы партия уже стояла на погрузке к вашему приезду, и на месте своими силами грузим материал в машину.
        </p>
        <p class="mb-0 max-w-[680px] leading-[1.55] text-(--color-ink)/70">
          Учитывайте длину пиломатериалов при выборе транспорта: имитация бруса выпускается длиной 3000 или 6000&nbsp;мм, а длину доски в конкретной партии уточните у менеджера. Кузов или прицеп для самовывоза подбирайте под самую длинную позицию в заказе, чтобы материал уместился целиком.
        </p>
        <p class="mb-0 max-w-[680px] leading-[1.55] text-(--color-ink)/70">
          Маршрут до площадки — по кнопке «Открыть в Яндекс Картах» вверху страницы.
        </p>
        <p class="mb-0 max-w-[680px] leading-[1.55] text-(--color-ink)/70">
          Пилорама в Ломоносовском районе, в деревне Разбегаево, принимает самовывоз и организует доставку по Санкт-Петербургу и Ленинградской области: по Ломоносовскому району, в Красное Село, Ропшу, Петергоф, Стрельну и Гатчину.
        </p>
      </div>
    </section>

    <section
      class="max-[840px]:grid-cols-1 max-[560px]:px-5 grid grid-cols-[minmax(300px,0.82fr)_minmax(360px,1.18fr)] gap-[clamp(40px,6vw,96px)] border-b border-(--color-ink) bg-(--color-sand) py-[64px] pl-[max(40px,calc((100vw_-_1280px)/2))] pr-[max(40px,calc((100vw_-_1280px)/2))]"
      aria-labelledby="manager-title"
    >
      <div class="grid content-start gap-4">
        <p class="eyebrow mb-0">Заказ</p>
        <h2 id="manager-title">Что сказать менеджеру</h2>
      </div>
      <div class="grid content-start gap-4">
        <p class="mb-0 max-w-[680px] leading-[1.55] text-(--color-ink)/85">
          Чтобы менеджер быстро подобрал материал и посчитал стоимость, подготовьте перед звонком или сообщением:
        </p>
        <ul class="m-0 grid max-w-[680px] list-disc gap-2 pl-5 leading-[1.55] text-(--color-ink)/85">
          <li>материал, сечение и длину;</li>
          <li>объём в кубометрах или количество штук;</li>
          <li>нужна ли огнебиозащитная обработка;</li>
          <li>самовывоз из Разбегаево или адрес доставки.</li>
        </ul>
        <p class="mb-0 max-w-[680px] leading-[1.55] text-(--color-ink)/70">
          Указать всё это можно по телефону, в мессенджере MAX или одним сообщением — так менеджеру не придётся уточнять детали повторно.
        </p>
        <p class="mb-0 max-w-[680px] leading-[1.55] text-(--color-ink)/70">
          Менеджер сверит наличие нужной партии и назовёт итоговую стоимость. Заказ считается подтверждённым после звонка менеджера, оплата — по факту отгрузки. Продаём материал и оптом, и в розницу. Обратите внимание: вся продукция изготовлена из хвойной древесины.
        </p>
        <p class="mb-0 max-w-[680px] leading-[1.55] text-(--color-ink)/70">
          Для доставки подберём подходящий транспорт под объём заказа: стоимость зависит от адреса и объёма, дату согласуем заранее, а водитель свяжется с вами перед выездом. Подробнее о доставке — на странице
          <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[1px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)" to="/dostavka">«Доставка»</NuxtLink>, весь ассортимент с ценами — в разделе
          <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[1px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)" to="/pilomaterialy">«Пиломатериалы»</NuxtLink>.
        </p>
      </div>
    </section>

    <section
      class="max-[840px]:grid-cols-1 max-[560px]:px-5 grid grid-cols-[minmax(300px,0.82fr)_minmax(360px,1.18fr)] gap-[clamp(40px,6vw,96px)] border-b border-(--color-ink) bg-(--color-cream) py-[64px] pl-[max(40px,calc((100vw_-_1280px)/2))] pr-[max(40px,calc((100vw_-_1280px)/2))]"
      aria-labelledby="site-title"
    >
      <div class="grid content-start gap-4">
        <p class="eyebrow mb-0">Производство</p>
        <h2 id="site-title">Площадка</h2>
      </div>
      <div class="grid content-start gap-4">
        <p class="mb-0 max-w-[680px] leading-[1.55] text-(--color-ink)/85">
          На площадке в Разбегаево работает ленточная пилорама: на ней распиливаем брёвна на доску нужного сечения. На выходе получаем доску естественной влажности, сухую и строганую доску, имитацию бруса, евровагонку и вагонку «Штиль». Материал сушим в камерной сушке, строгаем и красим. При отгрузке партии по запросу проводим огнебиозащитную обработку — доплата 2 000 ₽/м³. Готовая продукция хранится на крытом складе, что защищает пиломатериалы от осадков до отгрузки, а сама продукция учитывается в системе ЛесЕГАИС.
        </p>
        <p class="mb-0 max-w-[680px] leading-[1.55] text-(--color-ink)/70">
          Подробнее о производстве — на странице
          <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[1px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)" to="/o-nas">«О пилораме»</NuxtLink>, фотографии станков, склада и отгрузки — в разделе
          <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[1px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)" to="/foto">«Фото»</NuxtLink>.
        </p>
      </div>
    </section>

  </main>
</template>
