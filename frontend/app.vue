<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'ru',
  },
  titleTemplate: (title) => {
    if (!title) {
      return 'Пилорама Разбегаево'
    }

    return title.includes('Пилорама Разбегаево') ? title : `${title} · Пилорама Разбегаево`
  },
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
@import "tailwindcss";
</style>
