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

useSeoMeta({
  ogSiteName: 'Пилорама Разбегаево',
  ogLocale: 'ru_RU',
})

if (import.meta.client) {
  onMounted(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const observedParallaxElements = new Set<HTMLElement>()
    const activeParallaxElements = new Set<HTMLElement>()
    const revealElements = new Set<HTMLElement>()
    const revealSelector = 'main > section, main > article, main article, figure[data-parallax], .site-footer > *'
    let ticking = false
    let hasSyncedReveal = false
    let parallaxObserver: IntersectionObserver | undefined
    let revealObserver: IntersectionObserver | undefined
    let mutationObserver: MutationObserver | undefined

    const forgetParallaxElement = (element: HTMLElement) => {
      parallaxObserver?.unobserve(element)
      observedParallaxElements.delete(element)
      activeParallaxElements.delete(element)
      element.classList.remove('is-parallax-active')
      element.style.removeProperty('--parallax-y')
    }

    const forgetRevealElement = (element: HTMLElement) => {
      revealObserver?.unobserve(element)
      revealElements.delete(element)
      element.classList.remove('motion-reveal', 'is-motion-visible')
      element.style.removeProperty('--motion-delay')
    }

    const updateParallax = () => {
      ticking = false

      for (const element of activeParallaxElements) {
        const rect = element.getBoundingClientRect()
        const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight
        const depth = Number(element.dataset.parallax || 16)
        element.style.setProperty('--parallax-y', `${Math.max(-1, Math.min(1, progress)) * depth}px`)
      }
    }

    const requestUpdate = () => {
      if (ticking || media.matches || activeParallaxElements.size === 0) {
        return
      }

      ticking = true
      window.requestAnimationFrame(updateParallax)
    }

    const syncParallaxElements = () => {
      const currentElements = new Set(document.querySelectorAll<HTMLElement>('[data-parallax]'))

      for (const element of observedParallaxElements) {
        if (!currentElements.has(element) || !element.isConnected) {
          forgetParallaxElement(element)
        }
      }

      if (!parallaxObserver) {
        return
      }

      for (const element of currentElements) {
        if (!observedParallaxElements.has(element)) {
          observedParallaxElements.add(element)
          parallaxObserver.observe(element)
        }
      }
    }

    const syncRevealElements = () => {
      const currentElements = new Set(document.querySelectorAll<HTMLElement>(revealSelector))

      for (const element of revealElements) {
        if (!currentElements.has(element) || !element.isConnected) {
          forgetRevealElement(element)
        }
      }

      if (!revealObserver) {
        return
      }

      const siblingPositions = new Map<HTMLElement, number>()
      for (const element of currentElements) {
        if (revealElements.has(element)) {
          continue
        }

        const parent = element.parentElement
        const siblingPosition = parent ? siblingPositions.get(parent) ?? 0 : 0
        if (parent) {
          siblingPositions.set(parent, siblingPosition + 1)
        }

        revealElements.add(element)

        const rect = element.getBoundingClientRect()
        const isInViewport = rect.top < window.innerHeight * 0.92 && rect.bottom > 0

        // При навигации первый экран новой страницы показываем сразу: иначе reveal
        // догоняет переход страницы и движение читается как два отдельных рывка.
        if (isInViewport && hasSyncedReveal) {
          continue
        }

        element.classList.add('motion-reveal')
        element.style.setProperty('--motion-delay', `${Math.min(siblingPosition, 4) * 40}ms`)

        if (isInViewport) {
          window.requestAnimationFrame(() => {
            if (element.isConnected && !media.matches) {
              element.classList.add('is-motion-visible')
            }
          })
        }
        else {
          revealObserver.observe(element)
        }
      }

      hasSyncedReveal = true
    }

    const disableMotion = () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      parallaxObserver?.disconnect()
      revealObserver?.disconnect()
      parallaxObserver = undefined
      revealObserver = undefined
      activeParallaxElements.clear()
      for (const element of observedParallaxElements) {
        element.classList.remove('is-parallax-active')
        element.style.removeProperty('--parallax-y')
      }
      observedParallaxElements.clear()
      for (const element of revealElements) {
        element.classList.remove('motion-reveal', 'is-motion-visible')
        element.style.removeProperty('--motion-delay')
      }
      revealElements.clear()
    }

    const enableMotion = () => {
      if (media.matches || parallaxObserver || revealObserver) {
        return
      }

      parallaxObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement
          if (entry.isIntersecting) {
            activeParallaxElements.add(element)
            element.classList.add('is-parallax-active')
          }
          else {
            activeParallaxElements.delete(element)
            element.classList.remove('is-parallax-active')
          }
        }
        requestUpdate()
      }, { rootMargin: '20% 0px' })

      revealObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue
          }

          const element = entry.target as HTMLElement
          element.classList.add('is-motion-visible')
          revealObserver?.unobserve(element)
        }
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })

      syncParallaxElements()
      syncRevealElements()
      window.addEventListener('scroll', requestUpdate, { passive: true })
      window.addEventListener('resize', requestUpdate)
    }

    const handleMotionPreference = () => {
      if (media.matches) {
        disableMotion()
      }
      else {
        enableMotion()
      }
    }

    const stopRouteWatch = watch(
      () => route.fullPath,
      async () => {
        await nextTick()
        syncParallaxElements()
        syncRevealElements()
        requestUpdate()
      },
    )

    mutationObserver = new MutationObserver(() => {
      syncParallaxElements()
      syncRevealElements()
      requestUpdate()
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    media.addEventListener('change', handleMotionPreference)
    handleMotionPreference()

    onUnmounted(() => {
      stopRouteWatch()
      mutationObserver?.disconnect()
      media.removeEventListener('change', handleMotionPreference)
      disableMotion()
    })
  })
}
</script>

<template>
  <NuxtLayout>
    <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
  </NuxtLayout>
</template>

<style>
@import "tailwindcss";

:root {
  --color-ink: #20231f;
  --color-forest: #183126;
  --color-forest-soft: #29483a;
  --color-forest-deep: #12271e;
  --color-cream: #f3efe6;
  --color-paper: #faf7f0;
  --color-sand: #ded4c3;
  --color-line: rgb(32 35 31 / 22%);
  --color-line-light: rgb(250 247 240 / 24%);
  --color-copper: #934626;
  --color-copper-dark: #7d3d24;
  --color-focus-inner: #fffdf7;
  --color-focus-outer: #20231f;
  --motion-duration-press: 140ms;
  --motion-duration-ui: 180ms;
  --motion-duration-page: 220ms;
  --motion-duration-reveal: 280ms;
  --motion-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --motion-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
}

html {
  background: var(--color-cream);
}

body {
  margin: 0;
  background: var(--color-cream);
  color: var(--color-ink);
}

:where(a, button, [tabindex]):focus-visible {
  outline: 2px solid var(--color-focus-inner);
  outline-offset: 2px;
  box-shadow: 0 0 0 5px var(--color-focus-outer) !important;
}

:where(a, button) {
  -webkit-tap-highlight-color: transparent;
  transition: scale var(--motion-duration-press) var(--motion-ease-out);
}

:where(a, button):active {
  scale: 0.98;
}

.motion-reveal {
  translate: 0 14px;
  scale: 0.996;
  transition:
    translate var(--motion-duration-reveal) var(--motion-ease-out) var(--motion-delay, 0ms),
    scale var(--motion-duration-reveal) var(--motion-ease-out) var(--motion-delay, 0ms);
  will-change: translate, scale;
}

.motion-reveal.is-motion-visible {
  translate: 0 0;
  scale: 1;
  will-change: auto;
}

.page-enter-active {
  transition:
    opacity var(--motion-duration-page) var(--motion-ease-out),
    transform var(--motion-duration-page) var(--motion-ease-out);
}

.page-leave-active {
  transition: opacity var(--motion-duration-press) var(--motion-ease-out);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
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
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
  }

  .motion-reveal,
  .motion-reveal.is-motion-visible,
  .page-enter-from,
  .page-leave-to {
    translate: none;
    opacity: 1;
    scale: none;
    transform: none;
    filter: none;
    transition: none;
  }

  :where(a, button) {
    transition: none;
  }

  :where(a, button):active {
    scale: none;
  }

  [data-parallax] > img,
  [data-parallax] > video {
    transform: none;
    transition: none;
  }
}
</style>
