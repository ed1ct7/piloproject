<script setup lang="ts">
const route = useRoute()
const navOpen = ref(false)
const { totalQuantity } = useCart()

watch(
  () => route.fullPath,
  () => {
    navOpen.value = false
  },
)
</script>

<template>
  <div class="min-h-screen overflow-x-hidden bg-[#e9e5dc] font-[Segoe_UI,Arial,sans-serif] text-base leading-[1.55] text-[#171916] selection:bg-[#1f3a2f] selection:text-[#fffdf7] [&_a]:text-inherit [&_address]:not-italic [&_button]:font-[inherit] [&_figure]:m-0 [&_figcaption]:flex [&_figcaption]:justify-between [&_figcaption]:gap-4 [&_figcaption]:border-t [&_figcaption]:border-[#171916] [&_figcaption]:bg-[#f5f2eb] [&_figcaption]:px-3 [&_figcaption]:py-2.5 [&_figcaption]:font-[Segoe_UI,Arial,sans-serif] [&_figcaption]:text-[0.8125rem] [&_figcaption]:font-semibold [&_figcaption]:uppercase [&_figcaption]:leading-[1.4] [&_figcaption]:text-[#171916] [&_h1]:mt-0 [&_h1]:text-[clamp(2.55rem,3.65vw,4.55rem)] [&_h1]:font-[750] [&_h1]:leading-[1.04] [&_h1]:tracking-normal [&_h1]:[overflow-wrap:anywhere] [&_h2]:mt-0 [&_h2]:text-[clamp(1.85rem,2.35vw,2.9rem)] [&_h2]:font-[750] [&_h2]:leading-[1.1] [&_h2]:tracking-normal [&_h2]:[overflow-wrap:anywhere] [&_h3]:mt-0 [&_h3]:text-[clamp(1.15rem,1.35vw,1.45rem)] [&_h3]:font-[750] [&_h3]:leading-[1.15] [&_h3]:[overflow-wrap:anywhere] [&_img]:block [&_img]:max-w-full [&_p]:mt-0 [&_video]:block [&_video]:max-w-full max-[560px]:[&_figcaption]:block max-[560px]:[&_h1]:text-[clamp(2.15rem,10vw,3rem)] max-[560px]:[&_h2]:text-[clamp(1.6rem,7.5vw,2.2rem)]">
    <header class="sticky top-0 z-30 min-h-[72px] border-b border-[#171916] bg-[#f5f2eb]">
      <div class="max-[1100px]:grid-cols-[minmax(220px,1fr)_auto] max-[840px]:min-h-16 max-[840px]:w-[calc(100%-32px)] max-[840px]:grid-cols-[1fr_auto_auto] max-[560px]:grid-cols-[1fr_auto] relative mx-auto grid min-h-[72px] w-[min(1280px,calc(100%_-_48px))] grid-cols-[minmax(240px,1fr)_auto_auto_auto] items-center">
        <NuxtLink class="max-[560px]:gap-[9px] inline-flex w-max items-center gap-[13px] no-underline" to="/" aria-label="Пилорама Разбегаево, главная страница">
          <span class="max-[840px]:size-9 grid size-[42px] place-items-center bg-[#1f3a2f] font-[Segoe_UI,Arial,sans-serif] text-[0.8125rem] font-extrabold text-[#fffdf7]" aria-hidden="true">ПР</span>
          <span class="grid leading-[1.08]">
            <strong class="text-[1.05rem] font-[750]">Пилорама Разбегаево</strong>
            <small class="mt-1 font-[Segoe_UI,Arial,sans-serif] text-[0.8125rem] font-semibold uppercase tracking-[0.02em] text-[#393d37]">Ломоносовский район</small>
          </span>
        </NuxtLink>

        <button
          class="max-[840px]:col-start-2 max-[840px]:ml-2.5 max-[840px]:block max-[560px]:col-start-2 hidden size-11 border border-[#171916] bg-transparent [&_span]:mx-auto [&_span]:my-[5px] [&_span]:block [&_span]:h-0.5 [&_span]:w-5 [&_span]:bg-[#171916]"
          type="button"
          :aria-expanded="navOpen"
          aria-controls="main-navigation"
          aria-label="Открыть основную навигацию"
          @click="navOpen = !navOpen"
        >
          <span />
          <span />
        </button>

        <nav
          id="main-navigation"
          class="max-[1100px]:col-span-full max-[1100px]:row-start-2 max-[1100px]:min-h-11 max-[1100px]:border-t max-[1100px]:border-[#aaa69b] max-[840px]:absolute max-[840px]:inset-x-0 max-[840px]:top-full max-[840px]:hidden max-[840px]:border-y max-[840px]:border-[#171916] max-[840px]:bg-[#f5f2eb] flex self-stretch [&_a.router-link-active]:border-[#171916] [&_a.router-link-active]:bg-[#1f3a2f] [&_a.router-link-active]:text-[#fffdf7] [&_a:hover]:border-[#171916] [&_a:hover]:bg-[#1f3a2f] [&_a:hover]:text-[#fffdf7] [&_a]:grid [&_a]:place-items-center [&_a]:border-x [&_a]:border-transparent [&_a]:px-[15px] [&_a]:font-[Segoe_UI,Arial,sans-serif] [&_a]:text-[0.88rem] [&_a]:font-bold [&_a]:no-underline [&_a]:transition-colors [&_a]:duration-150 max-[840px]:[&_a]:min-h-12 max-[840px]:[&_a]:place-items-start max-[840px]:[&_a]:border-t max-[840px]:[&_a]:border-[#aaa69b] max-[840px]:[&_a]:px-4 max-[840px]:[&_a]:py-3"
          :class="navOpen ? 'max-[840px]:grid' : 'max-[840px]:hidden'"
          aria-label="Основная навигация"
        >
          <NuxtLink to="/pilomaterialy">Пиломатериалы</NuxtLink>
          <NuxtLink to="/o-nas">О нас</NuxtLink>
          <NuxtLink to="/foto">Фото</NuxtLink>
          <NuxtLink to="/dostavka">Доставка</NuxtLink>
          <NuxtLink to="/otzyvy">Отзывы</NuxtLink>
          <NuxtLink to="/kontakty">Контакты</NuxtLink>
          <NuxtLink to="/cart">Корзина ({{ totalQuantity }})</NuxtLink>
        </nav>

        <a class="max-[1100px]:hidden ml-[18px] inline-flex items-center whitespace-nowrap font-[Segoe_UI,Arial,sans-serif] text-[0.92rem] font-[760] tracking-[0.01em] no-underline hover:text-[#d65a1f]" :href="businessPhoneHref">{{ businessPhone }}</a>
        <a
          class="max-[1100px]:col-start-2 max-[1100px]:row-start-1 max-[840px]:col-start-3 max-[840px]:ml-2.5 max-[840px]:min-h-11 max-[840px]:px-3 max-[560px]:hidden ml-[18px] inline-flex min-h-11 items-center bg-[#d65a1f] px-4 font-[Segoe_UI,Arial,sans-serif] text-sm font-[760] text-[#fffdf7] no-underline transition-colors duration-150 hover:bg-[#a53e10]"
          :href="businessWhatsAppUrl"
          target="_blank"
          rel="noopener"
        >WhatsApp</a>
      </div>
    </header>

    <slot />

    <footer class="max-[840px]:grid-cols-2 max-[560px]:grid-cols-1 max-[560px]:px-[18px] grid grid-cols-[1.6fr_0.8fr_0.8fr] gap-16 bg-[#171916] px-[max(24px,calc((100vw_-_1280px)/2))] pb-6 pt-[72px] text-[#fffdf7]">
      <div class="max-[840px]:col-span-full max-[560px]:col-auto">
        <strong class="block max-w-[560px] text-[clamp(1.6rem,2.4vw,2.6rem)] leading-[1.03]">Пилорама Разбегаево</strong>
        <p>Производственная площадка в Ломоносовском районе Ленинградской области.</p>
      </div>

      <nav class="flex flex-col items-start gap-3 [&_a]:no-underline [&_a]:text-[#d8d2c6] [&_a:hover]:text-[#d65a1f]" aria-label="Навигация в подвале">
        <span class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Разделы</span>
        <NuxtLink to="/pilomaterialy">Каталог пиломатериалов</NuxtLink>
        <NuxtLink to="/o-nas">О производстве</NuxtLink>
        <NuxtLink to="/foto">Фото производства</NuxtLink>
        <NuxtLink to="/dostavka">Доставка и самовывоз</NuxtLink>
        <NuxtLink to="/otzyvy">Отзывы покупателей</NuxtLink>
        <NuxtLink to="/kontakty">Контакты производства</NuxtLink>
      </nav>

      <div class="flex flex-col items-start gap-3 text-[#d8d2c6]">
        <span class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Связь</span>
        <address>Разбегаево, Ломоносовский район, Ленинградская область</address>
        <a class="font-[Segoe_UI,Arial,sans-serif] text-[1.15rem] font-[760] text-[#fffdf7] no-underline hover:text-[#d65a1f]" :href="businessPhoneHref">{{ businessPhone }}</a>
        <a
          class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#fffdf7] no-underline transition-colors duration-150 hover:text-[#d65a1f] disabled:cursor-not-allowed disabled:opacity-50"
          :href="businessWhatsAppUrl"
          target="_blank"
          rel="noopener"
        >Написать в WhatsApp</a>
      </div>

      <div class="max-[560px]:grid col-span-full mt-[30px] flex justify-between gap-6 border-t border-[#555852] pt-[18px] font-[Segoe_UI,Arial,sans-serif] text-[0.8125rem] leading-[1.45] text-[#9fa099]">
        <span>
          {{ businessRequisites.fullName }} · ИНН {{ businessRequisites.inn }} ·
          ОГРНИП {{ businessRequisites.ogrnip }}
        </span>
      </div>
    </footer>
  </div>
</template>
