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
    const observedParallaxElements = new Set<HTMLElement>()
    const activeParallaxElements = new Set<HTMLElement>()
    const revealElements = new Set<HTMLElement>()
    const revealSelector = 'main > section, main > article, main article, figure[data-parallax], .site-footer > *'
    let ticking = false
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
        element.classList.add('motion-reveal')
        element.style.setProperty('--motion-delay', `${Math.min(siblingPosition, 5) * 55}ms`)

        const rect = element.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
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

:where(a, button, [tabindex]):focus-visible {
  outline: 3px solid #a8461e;
  outline-offset: 3px;
}

:where(a, button) {
  -webkit-tap-highlight-color: transparent;
}

:where(a, button):active {
  translate: 0 1px;
}

.motion-reveal {
  translate: 0 24px;
  scale: 0.992;
  transition:
    translate 680ms cubic-bezier(0.22, 1, 0.36, 1) var(--motion-delay, 0ms),
    scale 680ms cubic-bezier(0.22, 1, 0.36, 1) var(--motion-delay, 0ms);
  will-change: translate, scale;
}

.motion-reveal.is-motion-visible {
  translate: 0 0;
  scale: 1;
  will-change: auto;
}

.page-enter-active,
.page-leave-active {
  transition:
    opacity 220ms ease,
    transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 220ms ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
  filter: blur(3px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
  filter: blur(2px);
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
    scale: none;
    transform: none;
    filter: none;
    transition: none;
  }

  [data-parallax] > img,
  [data-parallax] > video {
    transform: none;
    transition: none;
  }
}
</style>
