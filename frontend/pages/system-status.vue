<script setup lang="ts">
useSeoMeta({
  title: 'Состояние системы',
  description: 'Проверка доступности backend-сервиса PiloProject.',
  robots: 'noindex, nofollow',
})

const apiBase = useApiBase()
const { data: health, error } = await useHealth()
</script>

<template>
  <section>
    <p class="eyebrow">Диагностика</p>
    <h1>Состояние системы</h1>
    <p class="lead">
      Результат проверки соединения между интерфейсом Nuxt и backend-сервисом Rust.
    </p>

    <div
      class="status-card"
      :class="{ 'status-card--error': error }"
    >
      <h2>{{ error ? 'Сервис недоступен' : 'Сервис работает' }}</h2>
      <p v-if="error">
        Не удалось подключиться к backend-сервису по адресу {{ apiBase }}.
      </p>
      <pre v-else>{{ health }}</pre>
    </div>
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

.status-card {
  max-width: 42rem;
  padding: 1.25rem;
  border-left: 0.3rem solid #3c7a4c;
  border-radius: 0.5rem;
  background: #edf7ef;
}

.status-card--error {
  border-left-color: #ad3f36;
  background: #fff0ee;
}

.status-card h2 {
  margin-top: 0;
}

.status-card pre {
  margin-bottom: 0;
  overflow-x: auto;
}
</style>
