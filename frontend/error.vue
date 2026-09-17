<script setup lang="ts">
import type { NuxtError } from '#app'

/**
 * Клиентская страница ошибок Nuxt (показывается, например, когда переход
 * между страницами SPA попадает на неизвестный слаг `pages/[landing].vue` и
 * тот выбрасывает `createError({ statusCode: 404 })` уже после гидратации).
 * Разметка намеренно дублирует `pages/not-found.vue` — тело статической
 * страницы 404 для случая без JavaScript, см. `docs/seo-audit-2026-09-16.md`,
 * п. 9. Общий компонент не выносим: правки в `frontend/components/` вне
 * задачи этого релиза.
 */
defineProps<{
  error: NuxtError
}>()

// `error.vue` заменяет собой `app.vue` целиком (см. `NuxtRoot`), поэтому
// глобальные `htmlAttrs.lang` и `titleTemplate` из `app.vue` здесь не
// применяются — оба задаём на месте, title сразу с суффиксом бренда.
useHead({
  htmlAttrs: { lang: 'ru' },
})

useSeoMeta({
  title: 'Страница не найдена · Пилорама Разбегаево',
  robots: 'noindex, nofollow',
})

/** Те же пять посадочных, что в подменю шапки и в `pages/not-found.vue`. */
const landingLinks: { label: string, to: string }[] = [
  { label: 'Доска обрезная', to: '/doska' },
  { label: 'Сухая и строганая доска', to: '/suhaya-doska' },
  { label: 'Вагонка', to: '/vagonka' },
  { label: 'Имитация бруса', to: '/imitatsiya-brusa' },
  { label: 'Огнебиозащита', to: '/ognebiozashchita' },
]

/**
 * Уводит с экрана ошибки на обычную страницу.
 * @note обычный переход через `NuxtLink` может оставить приложение в
 *       состоянии ошибки поверх нового маршрута — `clearError` явно снимает
 *       его перед редиректом, это документированный способ Nuxt
 * @param path путь, на который перейти после сброса ошибки
 */
async function goTo(path: string): Promise<void> {
  await clearError({ redirect: path })
}
</script>

<template>
  <NuxtLayout>
    <main>
      <section class="max-[560px]:px-[18px] max-[560px]:pb-9 max-[560px]:pt-8 border-b border-(--color-ink) bg-(--color-sand) px-[max(24px,calc((100vw_-_1280px)/2))] pb-12 pt-14" aria-labelledby="error-title">
        <div class="max-w-[680px]">
          <p class="eyebrow">Ошибка {{ error.statusCode ?? error.status ?? 404 }}</p>
          <h1 id="error-title" class="mb-6">Страница не найдена</h1>
          <p class="mb-0 max-w-[560px] text-[clamp(1.04rem,1.35vw,1.25rem)] leading-[1.55] text-(--color-ink)/85">
            Такой страницы нет — возможно, адрес устарел или введён с ошибкой. Ниже — каталог,
            посадочные страницы и контакты пилорамы в Разбегаево.
          </p>
        </div>
      </section>

      <section class="max-[560px]:px-[18px] max-[560px]:py-12 bg-(--color-cream) px-[max(24px,calc((100vw_-_1280px)/2))] py-16" aria-labelledby="error-links-title">
        <div class="max-[840px]:grid-cols-1 grid grid-cols-[minmax(280px,0.6fr)_minmax(280px,0.4fr)] gap-[clamp(40px,6vw,88px)]">
          <div class="grid content-start gap-4">
            <p class="eyebrow mb-0">Куда пойти дальше</p>
            <h2 id="error-links-title">Каталог и разделы сайта</h2>
            <ul class="mt-2 grid gap-3 pl-0 [list-style:none]">
              <li>
                <a class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)" href="/pilomaterialy" @click.prevent="goTo('/pilomaterialy')">Каталог пиломатериалов и цены</a>
              </li>
              <li v-for="link in landingLinks" :key="link.to">
                <a class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)" :href="link.to" @click.prevent="goTo(link.to)">{{ link.label }}</a>
              </li>
              <li>
                <a class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)" href="/dostavka" @click.prevent="goTo('/dostavka')">Доставка и самовывоз</a>
              </li>
              <li>
                <a class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)" href="/kontakty" @click.prevent="goTo('/kontakty')">Контакты и адрес производства</a>
              </li>
              <li>
                <a class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)" href="/" @click.prevent="goTo('/')">На главную</a>
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
  </NuxtLayout>
</template>
