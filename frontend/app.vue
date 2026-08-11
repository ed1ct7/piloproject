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

if (import.meta.client) {
  onMounted(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (media.matches) {
      return
    }

    let ticking = false

    const updateParallax = () => {
      ticking = false

      for (const element of document.querySelectorAll<HTMLElement>('[data-parallax]')) {
        const rect = element.getBoundingClientRect()
        const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight
        const depth = Number(element.dataset.parallax || 16)
        element.style.setProperty('--parallax-y', `${Math.max(-1, Math.min(1, progress)) * depth}px`)
      }
    }

    const requestUpdate = () => {
      if (ticking) {
        return
      }

      ticking = true
      window.requestAnimationFrame(updateParallax)
    }

    updateParallax()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    onUnmounted(() => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    })
  })
}
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
@import "tailwindcss";

[data-parallax] {
  --parallax-y: 0px;
}

[data-parallax] > img,
[data-parallax] > video {
  transform: translate3d(0, var(--parallax-y), 0) scale(1.045);
  transition: transform 120ms linear;
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  [data-parallax] > img,
  [data-parallax] > video {
    transform: none;
    transition: none;
  }
}
</style>
