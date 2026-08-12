<script setup lang="ts">
const route = useRoute()

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
    const observedElements = new Set<HTMLElement>()
    const activeElements = new Set<HTMLElement>()
    let ticking = false
    let intersectionObserver: IntersectionObserver | undefined
    let mutationObserver: MutationObserver | undefined

    const forgetElement = (element: HTMLElement) => {
      intersectionObserver?.unobserve(element)
      observedElements.delete(element)
      activeElements.delete(element)
      element.classList.remove('is-parallax-active')
      element.style.removeProperty('--parallax-y')
    }

    const updateParallax = () => {
      ticking = false

      for (const element of activeElements) {
        const rect = element.getBoundingClientRect()
        const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight
        const depth = Number(element.dataset.parallax || 16)
        element.style.setProperty('--parallax-y', `${Math.max(-1, Math.min(1, progress)) * depth}px`)
      }
    }

    const requestUpdate = () => {
      if (ticking || media.matches || activeElements.size === 0) {
        return
      }

      ticking = true
      window.requestAnimationFrame(updateParallax)
    }

    const syncParallaxElements = () => {
      const currentElements = new Set(document.querySelectorAll<HTMLElement>('[data-parallax]'))

      for (const element of observedElements) {
        if (!currentElements.has(element) || !element.isConnected) {
          forgetElement(element)
        }
      }

      if (!intersectionObserver) {
        return
      }

      for (const element of currentElements) {
        if (!observedElements.has(element)) {
          observedElements.add(element)
          intersectionObserver.observe(element)
        }
      }
    }

    const disableParallax = () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      intersectionObserver?.disconnect()
      intersectionObserver = undefined
      activeElements.clear()
      for (const element of observedElements) {
        element.classList.remove('is-parallax-active')
        element.style.removeProperty('--parallax-y')
      }
      observedElements.clear()
    }

    const enableParallax = () => {
      if (media.matches || intersectionObserver) {
        return
      }

      intersectionObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement
          if (entry.isIntersecting) {
            activeElements.add(element)
            element.classList.add('is-parallax-active')
          }
          else {
            activeElements.delete(element)
            element.classList.remove('is-parallax-active')
          }
        }
        requestUpdate()
      }, { rootMargin: '20% 0px' })

      syncParallaxElements()
      window.addEventListener('scroll', requestUpdate, { passive: true })
      window.addEventListener('resize', requestUpdate)
    }

    const handleMotionPreference = () => {
      if (media.matches) {
        disableParallax()
      }
      else {
        enableParallax()
      }
    }

    const stopRouteWatch = watch(
      () => route.fullPath,
      async () => {
        await nextTick()
        syncParallaxElements()
        requestUpdate()
      },
    )

    mutationObserver = new MutationObserver(() => {
      syncParallaxElements()
      requestUpdate()
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    media.addEventListener('change', handleMotionPreference)
    handleMotionPreference()

    onUnmounted(() => {
      stopRouteWatch()
      mutationObserver?.disconnect()
      media.removeEventListener('change', handleMotionPreference)
      disableParallax()
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

:where(a, button, [tabindex]):focus-visible {
  outline: 3px solid #a8461e;
  outline-offset: 3px;
}

[data-parallax] {
  --parallax-y: 0px;
}

[data-parallax] > img,
[data-parallax] > video {
  transform: translate3d(0, var(--parallax-y), 0) scale(1.045);
  transition: transform 120ms linear;
}

[data-parallax].is-parallax-active > img,
[data-parallax].is-parallax-active > video {
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
