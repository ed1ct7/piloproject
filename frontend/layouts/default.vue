<template>
  <div class="site-shell">
    <header class="site-header">
      <NuxtLink class="site-brand" to="/" aria-label="Пилорама Разбегаево">
        <span class="site-brand__mark">ПР</span>
        <span>
          <strong>Пилорама Разбегаево</strong>
          <small>пиломатериалы от производителя</small>
        </span>
      </NuxtLink>

      <nav class="site-nav" aria-label="Основная навигация">
        <NuxtLink to="/pilomaterialy">Пиломатериалы</NuxtLink>
        <NuxtLink to="/dostavka">Доставка</NuxtLink>
        <NuxtLink to="/otzyvy">Отзывы</NuxtLink>
        <NuxtLink to="/kontakty">Контакты</NuxtLink>
      </nav>
    </header>

    <slot />

    <footer class="site-footer">
      <div>
        <strong>Пилорама Разбегаево</strong>
        <p>Доска, брус и распил под задачи стройки в Ломоносовском районе и рядом с Санкт-Петербургом.</p>
      </div>
      <div class="site-footer__links">
        <NuxtLink class="text-link" to="/kontakty">Связаться и рассчитать заказ</NuxtLink>
        <NuxtLink class="text-link" to="/system-status">Состояние системы</NuxtLink>
      </div>
    </footer>
  </div>
</template>
