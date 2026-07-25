<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'ru',
  },
  titleTemplate: title => title ? `${title} · PiloProject` : 'PiloProject',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
