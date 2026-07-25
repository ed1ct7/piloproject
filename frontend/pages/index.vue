<script setup lang="ts">
useSeoMeta({
  title: 'Главная',
  description: 'Главная страница PiloProject со ссылками на основные разделы.',
})
</script>

<template>
  <section>
    <p class="eyebrow">PiloProject</p>
    <h1>Главная</h1>
    <p class="lead">
      Проект объединяет статический интерфейс Nuxt и API на Rust.
    </p>

    <NuxtLink
      class="page-card"
      to="/system-status"
    >
      <span>
        <strong>Состояние системы</strong>
        <small>Проверить доступность backend-сервиса</small>
      </span>
      <span aria-hidden="true">→</span>
    </NuxtLink>
  </section>
</template>

<style scoped>
.eyebrow {
  margin: 0 0 0.5rem;
  color: #59705f;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 6vw, 3.5rem);
}

.lead {
  max-width: 42rem;
  margin: 1rem 0 2rem;
  color: #4a554d;
  font-size: 1.125rem;
  line-height: 1.7;
}

.page-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 34rem;
  padding: 1.25rem;
  border: 1px solid #d9e1db;
  border-radius: 0.75rem;
  color: inherit;
  text-decoration: none;
  transition: border-color 160ms ease, transform 160ms ease;
}

.page-card:hover {
  border-color: #59705f;
  transform: translateY(-2px);
}

.page-card span:first-child {
  display: grid;
  gap: 0.35rem;
}

.page-card small {
  color: #657068;
}
</style>
