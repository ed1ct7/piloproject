<script setup lang="ts">
/**
 * SSR-страница 404: используется как тело `error_page 404` в nginx
 * (см. `docs/seo-audit-2026-09-16.md`, п. 9) — без неё в проде отдавалась
 * пустая SPA-оболочка без title, текста и ссылок. Canonical сознательно не
 * ставится: страница не индексируется и не имеет единственного «правильного» URL.
 */
useSeoMeta({
  title: 'Страница не найдена',
  description: 'Страница не найдена или была перемещена. Ссылки на каталог пиломатериалов, посадочные страницы и контакты пилорамы в Разбегаево.',
  robots: 'noindex, nofollow',
})

/** Ссылки на посадочные страницы каталога — те же пять, что в подменю шапки. */
const landingLinks: { label: string, to: string }[] = [
  { label: 'Доска обрезная', to: '/doska' },
  { label: 'Сухая и строганая доска', to: '/suhaya-doska' },
  { label: 'Вагонка', to: '/vagonka' },
  { label: 'Имитация бруса', to: '/imitatsiya-brusa' },
  { label: 'Огнебиозащита', to: '/ognebiozashchita' },
]
</script>

<template>
  <main>
    <section class="max-[560px]:px-[18px] max-[560px]:pb-9 max-[560px]:pt-8 border-b border-(--color-ink) bg-(--color-sand) px-[max(24px,calc((100vw_-_1280px)/2))] pb-12 pt-14" aria-labelledby="not-found-title">
      <div class="max-w-[680px]">
        <p class="eyebrow">Ошибка 404</p>
        <h1 id="not-found-title" class="mb-6">Страница не найдена</h1>
        <p class="mb-0 max-w-[560px] text-[clamp(1.04rem,1.35vw,1.25rem)] leading-[1.55] text-(--color-ink)/85">
          Такой страницы нет — возможно, адрес устарел или введён с ошибкой. Ниже — каталог,
          посадочные страницы и контакты пилорамы в Разбегаево.
        </p>
      </div>
    </section>

    <section class="max-[560px]:px-[18px] max-[560px]:py-12 bg-(--color-cream) px-[max(24px,calc((100vw_-_1280px)/2))] py-16" aria-labelledby="not-found-links-title">
      <div class="max-[840px]:grid-cols-1 grid grid-cols-[minmax(280px,0.6fr)_minmax(280px,0.4fr)] gap-[clamp(40px,6vw,88px)]">
        <div class="grid content-start gap-4">
          <p class="eyebrow mb-0">Куда пойти дальше</p>
          <h2 id="not-found-links-title">Каталог и разделы сайта</h2>
          <ul class="mt-2 grid gap-3 pl-0 [list-style:none]">
            <li>
              <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)" to="/pilomaterialy">Каталог пиломатериалов и цены</NuxtLink>
            </li>
            <li v-for="link in landingLinks" :key="link.to">
              <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)" :to="link.to">{{ link.label }}</NuxtLink>
            </li>
            <li>
              <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)" to="/dostavka">Доставка и самовывоз</NuxtLink>
            </li>
            <li>
              <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)" to="/kontakty">Контакты и адрес производства</NuxtLink>
            </li>
            <li>
              <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)" to="/">На главную</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="grid content-start gap-4 border-l border-(--color-sand) pl-[clamp(24px,4vw,56px)] max-[840px]:border-l-0 max-[840px]:pl-0">
          <p class="eyebrow mb-0">Связаться напрямую</p>
          <p class="mb-0 max-w-[400px] text-(--color-ink)/85">Позвоните менеджеру — подскажет нужный раздел и уточнит наличие пиломатериалов.</p>
          <a class="w-max font-[Segoe_UI,Arial,sans-serif] text-[1.3rem] font-[760] text-(--color-ink) no-underline hover:text-(--color-copper)" :href="businessPhoneHref">{{ businessPhone }}</a>
        </div>
      </div>
    </section>
  </main>
</template>
