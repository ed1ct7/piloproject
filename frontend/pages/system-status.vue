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
  <section class="px-[max(24px,calc((100vw_-_1280px)/2))] py-16 md:py-20">
    <p class="mb-4 font-[Segoe_UI,Arial,sans-serif] text-[0.8125rem] font-[760] uppercase leading-[1.4] tracking-[0.04em]">Диагностика</p>
    <h1>Состояние системы</h1>
    <p class="my-4 mb-8 max-w-2xl text-lg leading-[1.7] text-[#393d37]">
      Результат проверки соединения между интерфейсом Nuxt и backend-сервисом Rust.
    </p>

    <div
      class="max-w-2xl rounded-lg border-l-[0.3rem] p-5"
      :class="error ? 'border-l-[#ad3f36] bg-[#fff0ee]' : 'border-l-[#3c7a4c] bg-[#edf7ef]'"
    >
      <h2 class="mt-0">{{ error ? 'Сервис недоступен' : 'Сервис работает' }}</h2>
      <p v-if="error">
        Не удалось подключиться к backend-сервису по адресу {{ apiBase }}.
      </p>
      <pre v-else class="mb-0 overflow-x-auto">{{ health }}</pre>
    </div>
  </section>
</template>
