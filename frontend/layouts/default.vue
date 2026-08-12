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
  <div class="site-shell min-h-screen overflow-x-hidden bg-[#f3efe6] font-[Segoe_UI,Arial,sans-serif] text-base leading-[1.6] text-[#20231f] selection:bg-[#183126] selection:text-[#faf7f0] [&_address]:not-italic [&_button]:font-[inherit] [&_figure]:m-0 [&_img]:block [&_img]:max-w-full [&_p]:mt-0 [&_video]:block [&_video]:max-w-full">
    <header class="site-header sticky top-0 z-30 min-h-[76px]" @keydown.esc="handleNavigationEscape">
      <div class="max-[1101px]:grid-cols-[minmax(220px,1fr)_auto] max-[841px]:min-h-16 max-[841px]:w-[calc(100%-32px)] max-[841px]:grid-cols-[1fr_auto_auto] max-[560px]:grid-cols-[1fr_auto] relative mx-auto grid min-h-[76px] w-[min(1320px,calc(100%_-_48px))] grid-cols-[minmax(255px,1fr)_auto_auto_auto] items-center">
        <NuxtLink class="site-logo max-[560px]:gap-[9px] inline-flex min-w-0 w-max items-center gap-[13px] no-underline" to="/" aria-label="Пилорама Разбегаево, главная страница">
          <span class="site-logo__mark max-[841px]:size-9 grid size-11 place-items-center text-sm text-[#f7f1e7]" aria-hidden="true">ПР</span>
          <span class="grid leading-[1.05]">
            <strong class="site-logo__title max-[360px]:text-[0.98rem] text-[1.08rem] font-normal">Пилорама Разбегаево</strong>
            <small class="max-[360px]:hidden mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-[#596057]">Собственное производство</small>
          </span>
        </NuxtLink>

        <button
          ref="menu-button"
          class="menu-toggle max-[841px]:col-start-2 max-[841px]:ml-2.5 max-[841px]:block max-[560px]:col-start-2 hidden size-11 border border-[#171916] bg-transparent [&_span]:mx-auto [&_span]:my-[5px] [&_span]:block [&_span]:h-0.5 [&_span]:w-5 [&_span]:bg-[#171916]"
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
          class="primary-navigation max-[1101px]:col-span-full max-[1101px]:row-start-2 max-[1101px]:min-h-11 max-[1101px]:border-t max-[1101px]:border-[#d7cebf] max-[841px]:absolute max-[841px]:inset-x-0 max-[841px]:top-full max-[841px]:hidden max-[841px]:border-y max-[841px]:border-[#b9ae9e] max-[841px]:bg-[#faf7f0] flex self-stretch [&_a]:grid [&_a]:place-items-center [&_a]:whitespace-nowrap [&_a]:px-[15px] [&_a]:text-[0.9rem] [&_a]:font-semibold [&_a]:no-underline max-[841px]:[&_a]:min-h-12 max-[841px]:[&_a]:place-items-start max-[841px]:[&_a]:border-t max-[841px]:[&_a]:border-[#d7cebf] max-[841px]:[&_a]:px-4 max-[841px]:[&_a]:py-3"
          :class="navOpen ? 'max-[841px]:grid' : 'max-[841px]:hidden'"
          aria-label="Основная навигация"
        >
          <NuxtLink to="/pilomaterialy">Пиломатериалы</NuxtLink>
          <NuxtLink to="/o-nas">О нас</NuxtLink>
          <NuxtLink to="/foto">Фото</NuxtLink>
          <NuxtLink to="/dostavka">Доставка</NuxtLink>
          <NuxtLink to="/kontakty">Контакты</NuxtLink>
          <NuxtLink to="/cart">Заявка ({{ totalQuantity }})</NuxtLink>
        </nav>

        <a class="max-[1101px]:hidden ml-[20px] inline-flex items-center whitespace-nowrap text-[0.95rem] font-semibold tracking-[0.01em] no-underline hover:text-[#a65331]" :href="businessPhoneHref">{{ businessPhone }}</a>
        <a
          class="site-header__cta max-[1101px]:col-start-2 max-[1101px]:row-start-1 max-[841px]:col-start-3 max-[841px]:ml-2.5 max-[841px]:min-h-11 max-[841px]:px-3 max-[560px]:hidden ml-[20px] inline-flex min-h-11 items-center bg-[#a65331] px-5 text-[0.9rem] font-bold text-[#faf7f0] no-underline hover:bg-[#7d3d24]"
          :href="businessMaxUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Написать в MAX"
        >Написать в MAX</a>
      </div>
    </header>

    <slot />

    <footer class="site-footer max-[841px]:grid-cols-2 max-[841px]:gap-10 max-[560px]:grid-cols-1 max-[560px]:px-5 max-[560px]:pt-12 grid grid-cols-[1.6fr_0.8fr_0.8fr] gap-16 bg-[#12271e] px-[max(24px,calc((100vw_-_1320px)/2))] pb-6 pt-16 text-[#faf7f0]">
      <div class="max-[841px]:col-span-full max-[560px]:col-auto">
        <strong class="site-footer__title block max-w-[560px] text-[clamp(2rem,3vw,3.5rem)] font-normal leading-[1.02]">Пилорама<br>Разбегаево</strong>
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

      <div class="max-[841px]:flex-col max-[841px]:items-start col-span-full mt-6 flex justify-between gap-4 border-t border-[#555852] pt-5 font-[Segoe_UI,Arial,sans-serif] text-sm leading-[1.5] text-[#b8b8b2]">
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
  border-bottom: 1px solid rgb(32 35 31 / 18%);
  background: rgb(250 247 240 / 94%);
  box-shadow: 0 12px 32px rgb(32 35 31 / 6%);
  backdrop-filter: blur(14px);
  isolation: isolate;
}

.site-header::after {
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  z-index: 1;
  height: 2px;
  content: '';
  background: #a65331;
  transform: scaleX(0);
  transform-origin: left center;
  pointer-events: none;
}

.site-logo__mark {
  background: #183126;
  border-radius: 50%;
  font-family: Georgia, 'Times New Roman', serif;
  letter-spacing: 0.06em;
  transform-origin: center;
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1), background-color 220ms ease;
}

.site-logo:hover .site-logo__mark {
  background: #a65331;
  transform: rotate(-3deg) scale(1.04);
}

.site-logo__title,
.site-footer__title,
.site-shell h1,
.site-shell h2 {
  font-family: Georgia, 'Times New Roman', serif;
  letter-spacing: -0.025em;
}

.site-shell h1,
.site-shell h2,
.site-shell h3 {
  overflow-wrap: anywhere;
}

.menu-toggle {
  transition: background-color 180ms ease, color 180ms ease, transform 180ms ease;
}

.menu-toggle span {
  transform-origin: center;
  transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease;
}

.menu-toggle:hover {
  background: #e8e1d5;
}

.menu-toggle.is-open span:first-child {
  transform: translateY(3.5px) rotate(45deg);
}

.menu-toggle.is-open span:last-child {
  transform: translateY(-3.5px) rotate(-45deg);
}

.primary-navigation a {
  position: relative;
  transition:
    color 240ms ease,
    background-color 240ms ease;
}

.primary-navigation a::after {
  position: absolute;
  right: 15px;
  bottom: 13px;
  left: 15px;
  height: 1px;
  content: '';
  background: currentcolor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 240ms ease;
}

.primary-navigation a:hover,
.primary-navigation a:focus-visible {
  color: #a65331;
}

.primary-navigation a:hover::after,
.primary-navigation a:focus-visible::after,
.primary-navigation a.router-link-active::after {
  transform: scaleX(1);
}

.site-header__cta {
  box-shadow: 0 9px 22px rgb(125 61 36 / 18%);
  transition-property: color, background-color, border-color, box-shadow, transform;
  transition-duration: 240ms;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

.site-header__cta:hover {
  box-shadow: 0 13px 30px rgb(125 61 36 / 25%);
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
  .primary-navigation a::after,
  .site-header__cta,
  .site-footer a {
    translate: none;
    transform: none;
    transition: none;
  }
}
</style>
