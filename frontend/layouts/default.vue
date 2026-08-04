<script setup lang="ts">
const route = useRoute()
const navOpen = ref(false)

watch(
  () => route.fullPath,
  () => {
    navOpen.value = false
  },
)
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <div class="site-header__inner">
        <NuxtLink class="site-brand" to="/" aria-label="Пилорама Разбегаево, главная страница">
          <span class="site-brand__mark" aria-hidden="true">ПР</span>
          <span class="site-brand__name">
            <strong>Пилорама Разбегаево</strong>
            <small>Ломоносовский район</small>
          </span>
        </NuxtLink>

        <button
          class="nav-toggle"
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
          class="site-nav"
          :class="{ 'is-open': navOpen }"
          aria-label="Основная навигация"
        >
          <NuxtLink to="/pilomaterialy">Пиломатериалы</NuxtLink>
          <NuxtLink to="/foto">Фото</NuxtLink>
          <NuxtLink to="/dostavka">Доставка</NuxtLink>
          <NuxtLink to="/otzyvy">Отзывы</NuxtLink>
          <NuxtLink to="/kontakty">Контакты</NuxtLink>
        </nav>

        <a class="header-phone" :href="businessPhoneHref">{{ businessPhone }}</a>
        <a
          class="header-action"
          :href="businessWhatsAppUrl"
          target="_blank"
          rel="noopener"
        >WhatsApp</a>
      </div>
    </header>

    <slot />

    <footer class="site-footer">
      <div class="site-footer__brand">
        <strong>Пилорама Разбегаево</strong>
        <p>Производственная площадка в Ломоносовском районе Ленинградской области.</p>
      </div>

      <nav class="site-footer__nav" aria-label="Навигация в подвале">
        <span class="technical-label">Разделы</span>
        <NuxtLink to="/pilomaterialy">Каталог пиломатериалов</NuxtLink>
        <NuxtLink to="/foto">Фото производства</NuxtLink>
        <NuxtLink to="/dostavka">Доставка и самовывоз</NuxtLink>
        <NuxtLink to="/otzyvy">Отзывы покупателей</NuxtLink>
        <NuxtLink to="/kontakty">Контакты производства</NuxtLink>
      </nav>

      <div class="site-footer__contact">
        <span class="technical-label">Связь</span>
        <address>Разбегаево, Ломоносовский район, Ленинградская область</address>
        <a class="site-footer__phone" :href="businessPhoneHref">{{ businessPhone }}</a>
        <a
          class="text-link"
          :href="businessWhatsAppUrl"
          target="_blank"
          rel="noopener"
        >Написать в WhatsApp</a>
      </div>

      <div class="site-footer__bottom">
        <span>
          {{ businessRequisites.fullName }} · ИНН {{ businessRequisites.inn }} ·
          ОГРНИП {{ businessRequisites.ogrnip }}
        </span>
      </div>
    </footer>
  </div>
</template>
