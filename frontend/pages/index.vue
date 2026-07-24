<script setup lang="ts">
const apiBase = useApiBase()
const { data: health, error } = await useHealth()
</script>

<template>
  <main>
    <h1>Nuxt 3 (SSG) + Rust (Axum)</h1>
    <p>Frontend: Vue 3 + Vite + Nuxt 3, TypeScript, static generate.</p>

    <section>
      <h2>Backend health</h2>
      <p v-if="error">Backend unreachable at {{ apiBase }}</p>
      <pre v-else>{{ health }}</pre>
    </section>
  </main>
</template>
