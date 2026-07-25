<script setup lang="ts">
const route = useRoute()

const navigation = [
  { label: 'Главная', to: '/' },
  { label: 'Состояние системы', to: '/system-status' },
]
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <NuxtLink
        class="brand"
        to="/"
      >
        PiloProject
      </NuxtLink>

      <nav aria-label="Основная навигация">
        <ul>
          <li
            v-for="item in navigation"
            :key="item.to"
          >
            <NuxtLink
              :to="item.to"
              :class="{ 'nav-link--active': route.path === item.to }"
              :aria-current="route.path === item.to ? 'page' : undefined"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>

<style>
:root {
  color: #17231a;
  background: #f7f9f7;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color-scheme: light;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

.site-shell {
  width: min(72rem, calc(100% - 2rem));
  margin: 0 auto;
}

.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 4.5rem;
  border-bottom: 1px solid #d9e1db;
  gap: 2rem;
}

.brand {
  color: inherit;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-decoration: none;
}

nav ul {
  display: flex;
  margin: 0;
  padding: 0;
  gap: 1.25rem;
  list-style: none;
}

nav a {
  color: #4a554d;
  font-size: 0.9375rem;
  text-decoration: none;
}

nav a:hover,
nav .nav-link--active {
  color: #17231a;
  text-decoration: underline;
  text-underline-offset: 0.35rem;
}

main {
  padding: clamp(3rem, 8vw, 7rem) 0;
}

@media (max-width: 38rem) {
  .site-header {
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    padding: 1rem 0;
    gap: 0.75rem;
  }

  nav ul {
    flex-wrap: wrap;
  }
}
</style>
