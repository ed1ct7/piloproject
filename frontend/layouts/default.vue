<script setup lang="ts">
const route = useRoute()
const navOpen = ref(false)
const menuButton = useTemplateRef<HTMLButtonElement>('menu-button')
const { totalQuantity } = useCart()

function closeNavigation(restoreFocus = false): void {
  if (!navOpen.value) {
    return
  }

  navOpen.value = false
  if (restoreFocus) {
    nextTick(() => menuButton.value?.focus())
  }
}

function handleNavigationEscape(): void {
  closeNavigation(true)
}

watch(
  () => route.fullPath,
  () => {
    closeNavigation()
  },
)
</script>

<template>
  <div class="min-h-screen overflow-x-hidden bg-[#efe6d7] font-[Segoe_UI,Arial,sans-serif] text-base leading-[1.55] text-[#171916] selection:bg-[#1f3a2f] selection:text-[#fffdf7] [&_address]:not-italic [&_button]:font-[inherit] [&_figure]:m-0 [&_figcaption]:flex [&_figcaption]:justify-between [&_figcaption]:gap-4 [&_figcaption]:border-t [&_figcaption]:border-[#171916] [&_figcaption]:bg-[#fff8eb] [&_figcaption]:px-4 [&_figcaption]:py-3 [&_figcaption]:font-[Segoe_UI,Arial,sans-serif] [&_figcaption]:text-sm [&_figcaption]:font-semibold [&_figcaption]:uppercase [&_figcaption]:leading-[1.4] [&_figcaption]:text-[#171916] [&_h1]:mt-0 [&_h1]:text-[clamp(2.55rem,3.65vw,4.55rem)] [&_h1]:font-[750] [&_h1]:leading-[1.04] [&_h1]:tracking-normal [&_h1]:[overflow-wrap:anywhere] [&_h2]:mt-0 [&_h2]:text-[clamp(1.85rem,2.35vw,2.9rem)] [&_h2]:font-[750] [&_h2]:leading-[1.1] [&_h2]:tracking-normal [&_h2]:[overflow-wrap:anywhere] [&_h3]:mt-0 [&_h3]:text-[clamp(1.15rem,1.35vw,1.45rem)] [&_h3]:font-[750] [&_h3]:leading-[1.15] [&_h3]:[overflow-wrap:anywhere] [&_img]:block [&_img]:max-w-full [&_p]:mt-0 [&_video]:block [&_video]:max-w-full max-[560px]:[&_figcaption]:block max-[560px]:[&_h1]:text-[clamp(2.15rem,10vw,3rem)] max-[560px]:[&_h2]:text-[clamp(1.6rem,7.5vw,2.2rem)]">
    <header class="site-header sticky top-0 z-30 min-h-[72px] border-b border-[#171916] bg-[#fff8eb] shadow-[0_8px_18px_rgba(23,25,22,0.08)]" @keydown.esc="handleNavigationEscape">
      <div class="max-[1100px]:grid-cols-[minmax(220px,1fr)_auto] max-[840px]:min-h-16 max-[840px]:w-[calc(100%-32px)] max-[840px]:grid-cols-[1fr_auto_auto] max-[560px]:grid-cols-[1fr_auto] relative mx-auto grid min-h-[72px] w-[min(1280px,calc(100%_-_48px))] grid-cols-[minmax(240px,1fr)_auto_auto_auto] items-center">
        <NuxtLink class="site-logo max-[560px]:gap-[9px] inline-flex w-max items-center gap-[13px] no-underline" to="/" aria-label="Пилорама Разбегаево, главная страница">
          <span class="site-logo__mark max-[840px]:size-9 grid size-11 place-items-center bg-[#1f3a2f] font-[Segoe_UI,Arial,sans-serif] text-sm font-extrabold text-[#fffdf7]" aria-hidden="true">ПР</span>
          <span class="grid leading-[1.08]">
            <strong class="text-[1.08rem] font-[750]">Пилорама Разбегаево</strong>
            <small class="mt-1 font-[Segoe_UI,Arial,sans-serif] text-sm font-semibold uppercase tracking-[0.02em] text-[#393d37]">Ломоносовский район</small>
          </span>
        </NuxtLink>

        <button
          ref="menu-button"
          class="menu-toggle max-[840px]:col-start-2 max-[840px]:ml-2.5 max-[840px]:block max-[560px]:col-start-2 hidden size-11 border border-[#171916] bg-transparent [&_span]:mx-auto [&_span]:my-[5px] [&_span]:block [&_span]:h-0.5 [&_span]:w-5 [&_span]:bg-[#171916]"
          :class="{ 'is-open': navOpen }"
          type="button"
          :aria-expanded="navOpen"
          aria-controls="main-navigation"
          :aria-label="navOpen ? 'Закрыть основную навигацию' : 'Открыть основную навигацию'"
          @click="navOpen = !navOpen"
        >
          <span />
          <span />
        </button>

        <nav
          id="main-navigation"
          class="primary-navigation max-[1100px]:col-span-full max-[1100px]:row-start-2 max-[1100px]:min-h-11 max-[1100px]:border-t max-[1100px]:border-[#cbb99d] max-[840px]:absolute max-[840px]:inset-x-0 max-[840px]:top-full max-[840px]:hidden max-[840px]:border-y max-[840px]:border-[#171916] max-[840px]:bg-[#fff8eb] flex self-stretch [&_a.router-link-active]:border-[#171916] [&_a.router-link-active]:bg-[#1f3a2f] [&_a.router-link-active]:text-[#fffdf7] [&_a:hover]:border-[#171916] [&_a:hover]:bg-[#1f3a2f] [&_a:hover]:text-[#fffdf7] [&_a]:grid [&_a]:place-items-center [&_a]:whitespace-nowrap [&_a]:border-x [&_a]:border-transparent [&_a]:px-[15px] [&_a]:font-[Segoe_UI,Arial,sans-serif] [&_a]:text-[0.9375rem] [&_a]:font-bold [&_a]:no-underline [&_a]:transition-colors [&_a]:duration-150 max-[840px]:[&_a]:min-h-12 max-[840px]:[&_a]:place-items-start max-[840px]:[&_a]:border-t max-[840px]:[&_a]:border-[#cbb99d] max-[840px]:[&_a]:px-4 max-[840px]:[&_a]:py-3"
          :class="navOpen ? 'max-[840px]:grid' : 'max-[840px]:hidden'"
          aria-label="Основная навигация"
        >
          <NuxtLink to="/pilomaterialy">Пиломатериалы</NuxtLink>
          <NuxtLink to="/o-nas">О нас</NuxtLink>
          <NuxtLink to="/foto">Фото</NuxtLink>
          <NuxtLink to="/dostavka">Доставка</NuxtLink>
          <NuxtLink to="/kontakty">Контакты</NuxtLink>
          <NuxtLink to="/cart">Заявка ({{ totalQuantity }})</NuxtLink>
        </nav>

        <a class="max-[1100px]:hidden ml-[18px] inline-flex items-center whitespace-nowrap font-[Segoe_UI,Arial,sans-serif] text-base font-[760] tracking-[0.01em] no-underline hover:text-[#a8461e]" :href="businessPhoneHref">{{ businessPhone }}</a>
        <a
          class="site-header__cta max-[1100px]:col-start-2 max-[1100px]:row-start-1 max-[840px]:col-start-3 max-[840px]:ml-2.5 max-[840px]:min-h-11 max-[840px]:px-3 max-[560px]:hidden ml-[18px] inline-flex min-h-11 items-center bg-[#a8461e] px-4 font-[Segoe_UI,Arial,sans-serif] text-[0.9375rem] font-[760] text-[#fffdf7] no-underline transition-colors duration-150 hover:bg-[#7a451e]"
          :href="businessMaxUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Написать в MAX"
        >Написать в MAX</a>
      </div>
    </header>

    <slot />

    <footer class="site-footer max-[840px]:grid-cols-2 max-[840px]:gap-10 max-[560px]:grid-cols-1 max-[560px]:px-5 max-[560px]:pt-12 grid grid-cols-[1.6fr_0.8fr_0.8fr] gap-16 bg-[#14251e] px-[max(24px,calc((100vw_-_1280px)/2))] pb-6 pt-16 text-[#fffdf7]">
      <div class="max-[840px]:col-span-full max-[560px]:col-auto">
        <strong class="block max-w-[560px] text-[clamp(1.6rem,2.4vw,2.6rem)] leading-[1.03]">Пилорама Разбегаево</strong>
      </div>

      <nav class="flex flex-col items-start gap-3 [&_a]:no-underline [&_a]:text-[#efe6d7] [&_a:hover]:text-[#a8461e]" aria-label="Навигация в подвале">
        <span class="mb-3 font-[Segoe_UI,Arial,sans-serif] text-sm font-[760] uppercase leading-[1.4] tracking-[0.04em]">Разделы</span>
        <NuxtLink to="/pilomaterialy">Каталог пиломатериалов</NuxtLink>
        <NuxtLink to="/o-nas">О производстве</NuxtLink>
        <NuxtLink to="/foto">Фото производства</NuxtLink>
        <NuxtLink to="/dostavka">Доставка и самовывоз</NuxtLink>
        <NuxtLink to="/kontakty">Контакты производства</NuxtLink>
      </nav>

      <div class="flex flex-col items-start gap-3 text-[#efe6d7]">
        <span class="mb-3 font-[Segoe_UI,Arial,sans-serif] text-sm font-[760] uppercase leading-[1.4] tracking-[0.04em]">Связь</span>
        <address>{{ businessAddress }}</address>
        <a class="font-[Segoe_UI,Arial,sans-serif] text-[1.15rem] font-[760] text-[#fffdf7] no-underline hover:text-[#a8461e]" :href="businessPhoneHref">{{ businessPhone }}</a>
        <a
          class="font-[Segoe_UI,Arial,sans-serif] text-[1.15rem] font-[760] text-[#fffdf7] no-underline hover:text-[#a8461e]"
          :href="businessSecondaryPhoneHref"
        >{{ businessSecondaryPhone }}</a>
        <a class="font-[Segoe_UI,Arial,sans-serif] font-[700] text-[#fffdf7] no-underline hover:text-[#a8461e]" :href="businessEmailHref">{{ businessEmail }}</a>
        <a
          class="w-max border-b-2 border-current pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#fffdf7] no-underline transition-colors duration-150 hover:text-[#a8461e]"
          :href="businessMaxUrl"
          target="_blank"
          rel="noopener noreferrer"
        >Написать в MAX</a>
        <a
          class="w-max border-b-2 border-current pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#fffdf7] no-underline transition-colors duration-150 hover:text-[#a8461e]"
          :href="businessMapsUrl"
          target="_blank"
          rel="noopener noreferrer"
        >Открыть в Яндекс Картах</a>
      </div>

      <div class="max-[840px]:flex-col max-[840px]:items-start col-span-full mt-6 flex justify-between gap-4 border-t border-[#555852] pt-5 font-[Segoe_UI,Arial,sans-serif] text-sm leading-[1.5] text-[#b8b8b2]">
        <span>
          {{ businessRequisites.fullName }} · ИНН {{ businessRequisites.inn }} ·
          ОГРНИП {{ businessRequisites.ogrnip }}
        </span>
        <NuxtLink class="shrink-0 underline underline-offset-4 hover:text-[#fffdf7]" to="/politika-konfidencialnosti">Политика конфиденциальности</NuxtLink>
      </div>
    </footer>
  </div>
</template>

<style>
.site-header {
  isolation: isolate;
}

.site-header::after {
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  z-index: 1;
  height: 3px;
  content: '';
  background: #a8461e;
  transform: scaleX(0);
  transform-origin: left center;
  pointer-events: none;
}

.site-logo__mark {
  transform-origin: center;
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1), background-color 220ms ease;
}

.site-logo:hover .site-logo__mark {
  background: #a8461e;
  transform: rotate(-4deg) scale(1.06);
}

.menu-toggle {
  transition: background-color 180ms ease, color 180ms ease, transform 180ms ease;
}

.menu-toggle span {
  transform-origin: center;
  transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease;
}

.menu-toggle:hover {
  background: #d6ded0;
}

.menu-toggle.is-open span:first-child {
  transform: translateY(3.5px) rotate(45deg);
}

.menu-toggle.is-open span:last-child {
  transform: translateY(-3.5px) rotate(-45deg);
}

.primary-navigation a {
  transition-property: color, background-color, border-color, transform;
  transition-duration: 220ms;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

.site-header__cta {
  box-shadow: 0 7px 16px rgb(122 69 30 / 18%);
  transition-property: color, background-color, border-color, box-shadow, transform;
  transition-duration: 240ms;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

.site-header__cta:hover {
  box-shadow: 0 11px 24px rgb(122 69 30 / 26%);
  transform: translateY(-2px);
}

.site-footer a {
  transition: color 180ms ease, translate 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.site-footer a:hover {
  translate: 3px 0;
}

@supports (animation-timeline: scroll()) {
  .site-header::after {
    animation: site-scroll-progress linear both;
    animation-timeline: scroll(root);
  }
}

@keyframes site-scroll-progress {
  to {
    transform: scaleX(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-header::after {
    display: none;
    animation: none;
  }

  .site-logo__mark,
  .menu-toggle,
  .menu-toggle span,
  .primary-navigation a,
  .site-header__cta,
  .site-footer a {
    translate: none;
    transform: none;
    transition: none;
  }
}
</style>
