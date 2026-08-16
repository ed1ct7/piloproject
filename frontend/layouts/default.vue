<script setup lang="ts">
const route = useRoute()
const navOpen = ref(false)
const catalogOpen = ref(false)
const isHydrated = ref(false)
const menuButton = useTemplateRef<HTMLButtonElement>('menu-button')
const catalogButton = useTemplateRef<HTMLButtonElement>('catalog-button')
const { totalQuantity, initialized: cartInitialized } = useCart()

/**
 * Разделы каталога в подменю шапки: те же посадочные, что в подвале и на
 * `pages/index.vue`, но доступные с любой страницы без прокрутки вниз.
 */
const catalogLinks: { label: string, to: string }[] = [
  { label: 'Весь каталог и цены', to: '/pilomaterialy' },
  { label: 'Доска обрезная', to: '/doska' },
  { label: 'Сухая и строганая доска', to: '/suhaya-doska' },
  { label: 'Вагонка', to: '/vagonka' },
  { label: 'Имитация бруса', to: '/imitatsiya-brusa' },
  { label: 'Огнебиозащита', to: '/ognebiozashchita' },
]

/** Подменю раскрывается по наведению только на десктопе с мышью. */
let catalogHoverQuery: MediaQueryList | undefined

onMounted(() => {
  isHydrated.value = true
  catalogHoverQuery = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 841px)')
})

function closeCatalog(restoreFocus = false): void {
  if (!catalogOpen.value) {
    return
  }

  catalogOpen.value = false
  if (restoreFocus) {
    nextTick(() => catalogButton.value?.focus())
  }
}

/**
 * Кнопка-шеврон переключает подменю. На устройствах с мышью подменю уже
 * раскрыто наведением, поэтому клик его не схлопывает — закрывают уход
 * курсора и Escape. Клавиатурная активация (`detail === 0`) переключает
 * состояние всегда, чтобы `aria-expanded` не расходился с поведением.
 */
function toggleCatalog(event: MouseEvent): void {
  if (event.detail !== 0 && catalogHoverQuery?.matches) {
    catalogOpen.value = true
    return
  }

  catalogOpen.value = !catalogOpen.value
}

function handleCatalogPointerEnter(): void {
  if (catalogHoverQuery?.matches) {
    catalogOpen.value = true
  }
}

function handleCatalogPointerLeave(): void {
  if (catalogHoverQuery?.matches) {
    catalogOpen.value = false
  }
}

/** Закрывает подменю, когда фокус ушёл за пределы группы «Пиломатериалы». */
function handleCatalogFocusOut(event: FocusEvent): void {
  const group = event.currentTarget
  const nextTarget = event.relatedTarget

  if (!(group instanceof HTMLElement)) {
    return
  }

  if (nextTarget instanceof Node && group.contains(nextTarget)) {
    return
  }

  catalogOpen.value = false
}

function closeNavigation(restoreFocus = false): void {
  closeCatalog()

  if (!navOpen.value) {
    return
  }

  navOpen.value = false
  if (restoreFocus) {
    nextTick(() => menuButton.value?.focus())
  }
}

function handleNavigationEscape(): void {
  if (catalogOpen.value) {
    closeCatalog(true)
    return
  }

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
  <div
    class="site-shell min-h-screen overflow-x-hidden bg-(--color-cream) font-[Segoe_UI,Arial,sans-serif] text-base leading-[1.6] text-(--color-ink) selection:bg-(--color-forest) selection:text-(--color-paper) [&_address]:not-italic [&_button]:font-[inherit] [&_figure]:m-0 [&_img]:block [&_img]:max-w-full [&_p]:mt-0 [&_video]:block [&_video]:max-w-full"
    :data-hydrated="isHydrated"
  >
    <a class="skip-link" href="#main-content">Перейти к основному содержимому</a>

    <header class="site-header sticky top-0 z-30 min-h-[76px]" @keydown.esc="handleNavigationEscape">
      <div class="max-[1100px]:grid-cols-[minmax(220px,1fr)_auto] max-[840px]:min-h-16 max-[840px]:w-[calc(100%-32px)] max-[840px]:grid-cols-[1fr_auto_auto] max-[560px]:grid-cols-[1fr_auto] relative mx-auto grid min-h-[76px] w-[min(1320px,calc(100%_-_48px))] grid-cols-[minmax(255px,1fr)_auto_auto_auto] items-center">
        <NuxtLink class="site-logo max-[560px]:gap-[9px] inline-flex min-w-0 w-max items-center gap-[13px] no-underline" to="/" aria-label="Пилорама Разбегаево, главная страница">
          <span class="site-logo__mark max-[840px]:size-9 grid size-11 place-items-center text-sm text-(--color-paper)" aria-hidden="true">ПР</span>
          <span class="grid leading-[1.05]">
            <strong class="site-logo__title max-[360px]:text-[0.98rem] text-[1.08rem] font-normal">Пилорама Разбегаево</strong>
            <small class="max-[360px]:hidden mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-(--color-ink)/70">Собственное производство</small>
          </span>
        </NuxtLink>

        <button
          ref="menu-button"
          class="menu-toggle max-[840px]:col-start-2 max-[840px]:ml-2.5 max-[840px]:block max-[560px]:col-start-2 hidden size-11 border border-(--color-ink) bg-transparent [&_span]:mx-auto [&_span]:my-[5px] [&_span]:block [&_span]:h-0.5 [&_span]:w-5 [&_span]:bg-(--color-ink)"
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
          class="primary-navigation max-[1100px]:col-span-full max-[1100px]:row-start-2 max-[1100px]:min-h-11 max-[1100px]:border-t max-[1100px]:border-(--color-sand) max-[840px]:absolute max-[840px]:inset-x-0 max-[840px]:top-full max-[840px]:border-y max-[840px]:border-(--color-sand) max-[840px]:bg-(--color-paper) flex self-stretch [&>a]:grid [&>a]:place-items-center [&>a]:whitespace-nowrap [&>a]:px-[15px] [&>a]:text-[0.9rem] [&>a]:font-semibold [&>a]:no-underline max-[840px]:[&>a]:min-h-12 max-[840px]:[&>a]:place-items-start max-[840px]:[&>a]:border-t max-[840px]:[&>a]:border-(--color-sand) max-[840px]:[&>a]:px-4 max-[840px]:[&>a]:py-3"
          :class="{ 'is-open': navOpen }"
          aria-label="Основная навигация"
          @click="closeNavigation()"
        >
          <div
            class="nav-catalog"
            :class="{ 'is-open': catalogOpen }"
            @mouseenter="handleCatalogPointerEnter"
            @mouseleave="handleCatalogPointerLeave"
            @focusout="handleCatalogFocusOut"
          >
            <div class="nav-catalog__row">
              <NuxtLink class="nav-catalog__link" to="/pilomaterialy">Пиломатериалы</NuxtLink>
              <button
                ref="catalog-button"
                class="nav-catalog__toggle"
                type="button"
                :aria-expanded="catalogOpen"
                aria-controls="catalog-submenu"
                :aria-label="catalogOpen ? 'Скрыть разделы каталога' : 'Показать разделы каталога'"
                @click.stop="toggleCatalog"
              >
                <svg width="11" height="7" viewBox="0 0 11 7" fill="none" aria-hidden="true" focusable="false">
                  <path d="M1 1L5.5 5.5L10 1" stroke="currentColor" stroke-width="1.6" />
                </svg>
              </button>
            </div>

            <div v-show="catalogOpen" id="catalog-submenu" class="nav-catalog__panel" @click="closeCatalog()">
              <NuxtLink v-for="link in catalogLinks" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink>
            </div>
          </div>
          <NuxtLink to="/o-nas">О нас</NuxtLink>
          <NuxtLink to="/foto">Фото</NuxtLink>
          <NuxtLink to="/dostavka">Доставка</NuxtLink>
          <NuxtLink to="/kontakty">Контакты</NuxtLink>
          <NuxtLink to="/cart">Заявка<template v-if="cartInitialized"> ({{ totalQuantity }})</template></NuxtLink>

          <div class="max-[840px]:flex hidden flex-col items-start gap-3 border-t border-(--color-sand) px-4 pb-5 pt-4">
            <a class="font-[Segoe_UI,Arial,sans-serif] text-[1.2rem] font-[760] no-underline hover:text-(--color-copper)" :href="businessPhoneHref">{{ businessPhone }}</a>
            <span class="text-[0.85rem] text-(--color-ink)/70">{{ businessWorkingHours }}</span>
            <a
              class="inline-flex min-h-11 items-center bg-(--color-copper) px-5 text-[0.9rem] font-bold text-(--color-paper) no-underline hover:bg-(--color-copper-dark)"
              :href="businessMaxUrl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать в MAX (откроется в новой вкладке)"
            >Написать в MAX</a>
          </div>
        </nav>

        <a class="max-[1100px]:hidden ml-[20px] inline-flex items-center whitespace-nowrap text-[0.95rem] font-semibold tracking-[0.01em] no-underline hover:text-(--color-copper)" :href="businessPhoneHref">{{ businessPhone }}</a>
        <a
          class="site-header__cta max-[1100px]:col-start-2 max-[1100px]:row-start-1 max-[840px]:col-start-3 max-[840px]:ml-2.5 max-[840px]:min-h-11 max-[840px]:px-3 max-[560px]:hidden ml-[20px] inline-flex min-h-11 items-center bg-(--color-copper) px-5 text-[0.9rem] font-bold text-(--color-paper) no-underline hover:bg-(--color-copper-dark)"
          :href="businessMaxUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Написать в MAX (откроется в новой вкладке)"
        >Написать в MAX</a>
      </div>
    </header>

    <div id="main-content" tabindex="-1">
      <slot />
    </div>

    <footer class="site-footer max-[840px]:grid-cols-2 max-[840px]:gap-10 max-[560px]:grid-cols-1 max-[560px]:px-5 max-[560px]:pt-12 grid grid-cols-[1.6fr_0.8fr_0.8fr] gap-16 bg-(--color-forest-deep) px-[max(24px,calc((100vw_-_1320px)/2))] pb-6 pt-16 text-(--color-paper)">
      <div class="max-[840px]:col-span-full max-[560px]:col-auto">
        <strong class="site-footer__title block max-w-[560px] text-[clamp(2rem,3vw,3.5rem)] font-normal leading-[1.02]">Пилорама<br>Разбегаево</strong>
      </div>

      <nav class="flex flex-col items-start gap-3 [&_a]:no-underline [&_a]:text-(--color-sand) [&_a:hover]:text-(--color-copper)" aria-label="Навигация в подвале">
        <span class="mb-3 font-[Segoe_UI,Arial,sans-serif] text-sm font-[760] uppercase leading-[1.4] tracking-[0.04em]">Разделы</span>
        <NuxtLink to="/pilomaterialy">Каталог пиломатериалов</NuxtLink>
        <NuxtLink to="/doska">Доска обрезная</NuxtLink>
        <NuxtLink to="/suhaya-doska">Сухая и строганая доска</NuxtLink>
        <NuxtLink to="/vagonka">Вагонка</NuxtLink>
        <NuxtLink to="/imitatsiya-brusa">Имитация бруса</NuxtLink>
        <NuxtLink to="/ognebiozashchita">Огнебиозащита</NuxtLink>
        <NuxtLink to="/o-nas">О производстве</NuxtLink>
        <NuxtLink to="/foto">Фото производства</NuxtLink>
        <NuxtLink to="/dostavka">Доставка и самовывоз</NuxtLink>
        <NuxtLink to="/kontakty">Контакты производства</NuxtLink>
      </nav>

      <div class="flex flex-col items-start gap-3 text-(--color-sand)">
        <span class="mb-3 font-[Segoe_UI,Arial,sans-serif] text-sm font-[760] uppercase leading-[1.4] tracking-[0.04em]">Связь</span>
        <address>{{ businessAddress }}</address>
        <span>{{ businessWorkingHours }}</span>
        <a class="font-[Segoe_UI,Arial,sans-serif] text-[1.15rem] font-[760] text-(--color-paper) no-underline hover:text-(--color-copper)" :href="businessPhoneHref">{{ businessPhone }}</a>
        <a
          class="font-[Segoe_UI,Arial,sans-serif] text-[1.15rem] font-[760] text-(--color-paper) no-underline hover:text-(--color-copper)"
          :href="businessSecondaryPhoneHref"
        >{{ businessSecondaryPhone }}</a>
        <a class="font-[Segoe_UI,Arial,sans-serif] font-[700] text-(--color-paper) no-underline hover:text-(--color-copper)" :href="businessEmailHref">{{ businessEmail }}</a>
        <a
          class="w-max border-b-2 border-current pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-paper) no-underline transition-colors duration-150 hover:text-(--color-copper)"
          :href="businessMaxUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Написать в MAX (откроется в новой вкладке)"
        >Написать в MAX</a>
        <a
          class="w-max border-b-2 border-current pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-paper) no-underline transition-colors duration-150 hover:text-(--color-copper)"
          :href="businessMapsUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Открыть в Яндекс Картах (откроется в новой вкладке)"
        >Открыть в Яндекс Картах</a>
      </div>

      <div class="col-span-full mt-6 grid gap-3 border-t border-(--color-line-light) pt-5 font-[Segoe_UI,Arial,sans-serif] text-sm leading-[1.5] text-(--color-cream)/75">
        <p class="mb-0 max-w-[840px]">
          Цены и сведения о товарах на сайте носят справочный характер и не являются публичной
          офертой (ст. 437 ГК РФ). Наличие, стоимость и условия поставки подтверждает менеджер.
        </p>
        <div class="max-[840px]:flex-col max-[840px]:items-start flex justify-between gap-4">
          <span>
            {{ businessRequisites.fullName }} · ИНН {{ businessRequisites.inn }} ·
            ОГРНИП {{ businessRequisites.ogrnip }}
          </span>
          <NuxtLink class="shrink-0 underline underline-offset-4 hover:text-(--color-paper)" to="/politika-konfidencialnosti">Политика конфиденциальности</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
.skip-link {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 100;
  padding: 10px 14px;
  color: var(--color-forest-deep);
  font-weight: 700;
  background: var(--color-paper);
  border: 3px solid var(--color-forest-deep);
  box-shadow: 0 8px 24px rgb(18 39 30 / 24%);
}

.skip-link:not(:focus) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  white-space: nowrap;
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
}

#main-content:focus {
  outline: none;
}

/* Единая тёмная шапка на всех страницах — сливается с forest-deep полями */
.site-header {
  border-bottom: 1px solid var(--color-line-light);
  background: rgb(18 39 30 / 92%);
  backdrop-filter: blur(14px);
  isolation: isolate;
  color: var(--color-cream);
}

.site-header::after {
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  z-index: 1;
  height: 2px;
  content: '';
  background: var(--color-copper);
  transform: scaleX(0);
  transform-origin: left center;
  pointer-events: none;
}

.site-logo__mark {
  background: var(--color-forest);
  border-radius: 50%;
  font-family: Georgia, 'Times New Roman', serif;
  letter-spacing: 0.06em;
  transform-origin: center;
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1), background-color 220ms ease;
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
  margin: 0;
  overflow-wrap: anywhere;
}

.site-shell h1 {
  font-size: clamp(2.8rem, 4.1vw, 4.8rem);
  font-weight: 400;
  line-height: 1.02;
}

.site-shell h2 {
  font-size: clamp(2.1rem, 3vw, 3.4rem);
  font-weight: 400;
  line-height: 1.06;
}

.site-shell h3 {
  font-size: clamp(1.25rem, 1.6vw, 1.65rem);
  font-weight: 700;
  line-height: 1.18;
}

.menu-toggle {
  transition: background-color 180ms ease, color 180ms ease, transform 180ms ease;
}

.menu-toggle span {
  transform-origin: center;
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease;
}

.menu-toggle.is-open span:first-child {
  transform: translateY(3.5px) rotate(45deg);
}

.menu-toggle.is-open span:last-child {
  transform: translateY(-3.5px) rotate(-45deg);
}

.primary-navigation > a {
  position: relative;
  transition:
    color 240ms ease,
    background-color 240ms ease;
}

.primary-navigation > a::after {
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

.primary-navigation > a:focus-visible {
  color: var(--color-copper);
}

.primary-navigation > a:focus-visible::after,
.primary-navigation > a.router-link-active::after {
  transform: scaleX(1);
}

/* Группа «Пиломатериалы»: ссылка на каталог + кнопка раскрытия разделов */
.nav-catalog {
  position: relative;
  display: flex;
  align-self: stretch;
}

.nav-catalog__row {
  display: flex;
  align-self: stretch;
}

.nav-catalog__link {
  position: relative;
  display: grid;
  place-items: center;
  padding-inline: 15px 6px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
  transition: color 240ms ease;
}

.nav-catalog__link::after {
  position: absolute;
  right: 6px;
  bottom: 13px;
  left: 15px;
  height: 1px;
  content: '';
  background: currentcolor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 240ms ease;
}

.nav-catalog__link:focus-visible::after,
.nav-catalog__link.router-link-active::after {
  transform: scaleX(1);
}

.nav-catalog__toggle {
  display: grid;
  place-items: center;
  padding-inline: 2px 15px;
  color: inherit;
  cursor: pointer;
  background: transparent;
  border: 0;
  transition: color 240ms ease;
}

.nav-catalog__toggle svg {
  transition: transform var(--motion-duration-ui) var(--motion-ease-out);
}

.nav-catalog.is-open .nav-catalog__toggle svg {
  transform: rotate(180deg);
}

.nav-catalog__panel {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  min-width: 272px;
  padding-block: 8px;
  color: var(--color-ink);
  background: var(--color-paper);
  box-shadow: 0 30px 70px rgb(32 35 31 / 18%);
}

.nav-catalog__panel a {
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 8px 18px;
  font-size: 0.9rem;
  font-weight: 600;
  color: inherit;
  text-decoration: none;
  transition: color var(--motion-duration-ui) ease, background-color var(--motion-duration-ui) ease;
}

.nav-catalog__panel a:first-child {
  padding-bottom: 12px;
  margin-bottom: 6px;
  border-bottom: 1px solid var(--color-sand);
}

.nav-catalog__panel a:focus-visible,
.nav-catalog__panel a.router-link-active {
  color: var(--color-copper);
}

.site-header__cta {
  box-shadow: 0 9px 22px rgb(125 61 36 / 18%);
  transition-property: color, background-color, border-color, box-shadow, transform;
  transition-duration: 240ms;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

.site-header .site-logo__mark {
  background: var(--color-cream);
  color: var(--color-forest-deep);
}

.site-header .site-logo small {
  color: rgb(243 239 230 / 75%);
}

.site-header .menu-toggle {
  border-color: var(--color-cream);
}

.site-header .menu-toggle span {
  background: var(--color-cream);
}

/* Панель мобильного меню остаётся бумажной — внутри возвращаем тёмный текст */
@media (max-width: 840px) {
  .site-header .primary-navigation {
    color: var(--color-ink);
  }
}

/* Медь на forest-deep не проходит контраст — hover/focus светлой медью #d5a184
   (легализованное исключение для тёмных поверхностей). Только десктоп: на ≤840
   ссылки живут в бумажной панели, где остаётся обычная медь. */
@media (min-width: 841px) {
  .site-header .primary-navigation > a:focus-visible,
  .site-header .nav-catalog__link:focus-visible,
  .site-header .nav-catalog__toggle:focus-visible {
    color: #d5a184;
  }
}

@media (hover: hover) and (pointer: fine) and (min-width: 841px) {
  .site-header .primary-navigation > a:hover,
  .site-header .nav-catalog__row:hover .nav-catalog__link,
  .site-header .nav-catalog__row:hover .nav-catalog__toggle,
  .site-header a[href^='tel:']:hover {
    color: #d5a184;
  }
}

@media (hover: hover) and (pointer: fine) {
  .site-header .menu-toggle:hover {
    background: rgb(243 239 230 / 16%);
  }
}

.site-footer a {
  transition: color 180ms ease, translate 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.site-footer a:focus-visible {
  color: var(--color-paper);
  border-radius: 2px;
  outline: 3px solid #f5c98b;
  outline-offset: 4px;
}

@media (hover: hover) and (pointer: fine) {
  .site-logo:hover .site-logo__mark {
    background: var(--color-copper);
    transform: rotate(-3deg) scale(1.04);
  }

  .primary-navigation > a:hover {
    color: var(--color-copper);
  }

  .primary-navigation > a:hover::after,
  .nav-catalog__row:hover .nav-catalog__link::after {
    transform: scaleX(1);
  }

  .nav-catalog__panel a:hover {
    color: var(--color-copper);
    background: rgb(32 35 31 / 5%);
  }

  .site-header__cta:hover {
    box-shadow: 0 13px 30px rgb(125 61 36 / 25%);
    transform: translateY(-2px);
  }

  .site-footer a:hover {
    translate: 3px 0;
  }
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

@media (max-width: 560px) {
  .site-shell h1 {
    overflow-wrap: normal;
    font-size: clamp(2.45rem, 11vw, 3.3rem);
    hyphens: none;
    word-break: normal;
  }

  .site-shell h2 {
    font-size: clamp(2rem, 9vw, 2.75rem);
  }
}

@media (max-width: 840px) {
  .site-header .primary-navigation {
    display: none;
  }

  .site-header .primary-navigation.is-open {
    display: grid;
  }

  .site-footer a {
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    padding-block: 8px;
  }

  /* В бумажной панели меню группа разворачивается в столбец: строка-триггер
     и вложенный список разделов под ней */
  .nav-catalog {
    flex-direction: column;
    align-self: auto;
  }

  .nav-catalog__row {
    border-top: 1px solid var(--color-sand);
  }

  .nav-catalog__link {
    flex: 1;
    min-height: 48px;
    padding: 12px 16px;
    place-items: center start;
  }

  .nav-catalog__link::after {
    display: none;
  }

  .nav-catalog__toggle {
    min-width: 56px;
    min-height: 48px;
    padding-inline: 16px;
  }

  .nav-catalog__panel {
    position: static;
    min-width: 0;
    padding-block: 0;
    background: rgb(32 35 31 / 4%);
    box-shadow: none;
  }

  .nav-catalog__panel a {
    min-height: 48px;
    padding-left: 32px;
  }

  .nav-catalog__panel a:first-child {
    padding-bottom: 8px;
    margin-bottom: 0;
    border-bottom: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-header::after {
    display: none;
    animation: none;
  }

  .site-logo__mark,
  .skip-link,
  .menu-toggle,
  .menu-toggle span,
  .primary-navigation > a,
  .nav-catalog__link,
  .nav-catalog__toggle,
  .nav-catalog__panel a,
  .site-header__cta,
  .site-footer a {
    translate: none;
    transform: none;
    transition: none;
  }

  /* Поворот шеврона — индикатор состояния, гасим только анимацию */
  .nav-catalog__toggle svg {
    transition: none;
  }

  /* transform у линии-подчёркивания НЕ сбрасывать: scaleX(0) прячет линию
     неактивных пунктов, гасим только анимацию */
  .primary-navigation > a::after {
    transition: none;
  }
}
</style>
