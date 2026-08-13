<script setup lang="ts">
withDefaults(defineProps<{
  message: string
  floating?: boolean
}>(), {
  floating: false,
})
</script>

<template>
  <div
    class="pointer-events-none"
    :class="floating ? 'fixed inset-x-4 bottom-5 z-[70] flex justify-center' : ''"
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >
    <Transition name="status-message">
      <p
        v-if="message"
        class="mb-0 border border-[#171916] bg-[#1f3a2f] px-4 py-3 font-[Segoe_UI,Arial,sans-serif] text-sm font-[760] text-[#fffdf7] shadow-[0_14px_36px_rgba(23,25,22,0.24)]"
      >
        {{ message }}
      </p>
    </Transition>
  </div>
</template>

<style scoped>
.status-message-enter-active,
.status-message-leave-active {
  transition:
    opacity var(--motion-duration-ui) var(--motion-ease-out),
    transform var(--motion-duration-ui) var(--motion-ease-out);
}

.status-message-enter-from,
.status-message-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (prefers-reduced-motion: reduce) {
  .status-message-enter-active,
  .status-message-leave-active {
    transition: opacity var(--motion-duration-press) var(--motion-ease-out);
  }

  .status-message-enter-from,
  .status-message-leave-to {
    transform: none;
  }
}
</style>
