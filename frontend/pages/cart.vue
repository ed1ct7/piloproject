<script setup lang="ts">
import type { CartProductItem } from '~/composables/useCart'

definePageMeta({
  path: '/cart',
  alias: ['/korzina'],
})

useSeoMeta({
  title: 'Корзина',
  description: 'Корзина заказа пиломатериалов пилорамы в Разбегаево.',
  robots: 'noindex, nofollow',
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/cart` }],
})

const {
  detailedItems,
  subtotal,
  increment,
  decrement,
  removeProduct,
  clearCart,
} = useCart()

const formattedSubtotal = computed(() => `${subtotal.value.toLocaleString('ru-RU')} ₽`)
const copyFeedback = ref('')
const orderText = computed(() => {
  const lines = detailedItems.value.map((item: CartProductItem, index: number) => {
    const { product, quantity } = item
    return `${index + 1}. ${product.title} — ${quantity} ${product.unit} × ${(product.price ?? 0).toLocaleString('ru-RU')} ₽/${product.unit}`
  })
  return [
    'Здравствуйте! Хочу заказать пиломатериалы:',
    '',
    ...lines,
    '',
    `Предварительная сумма: ${formattedSubtotal.value}`,
    'Пожалуйста, подтвердите наличие, итоговую стоимость и условия доставки.',
  ].join('\n')
})

async function copyOrderText() {
  try {
    await navigator.clipboard.writeText(orderText.value)
    copyFeedback.value = 'Состав заказа скопирован. Его можно отправить менеджеру в любом мессенджере.'
  }
  catch {
    copyFeedback.value = 'Не удалось скопировать автоматически. Позвоните менеджеру — корзина сохранится в браузере.'
  }
}
</script>

<template>
  <main>
    <section class="max-[560px]:px-[18px] border-b border-[#171916] bg-[#d8d2c6] px-[max(24px,calc((100vw_-_1280px)/2))] pb-10 pt-14">
      <h1>Корзина</h1>
    </section>

    <section class="max-[560px]:px-[18px] bg-[#f5f2eb] px-[max(24px,calc((100vw_-_1280px)/2))] pb-20 pt-10">
      <div v-if="detailedItems.length === 0" class="py-12">
        <h2>Корзина пуста</h2>
        <p>Добавьте нужные позиции из каталога пиломатериалов.</p>
        <NuxtLink class="w-max border-b-2 border-current pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#1f3a2f] no-underline hover:text-[#d65a1f]" to="/pilomaterialy">Перейти в каталог</NuxtLink>
      </div>

      <template v-else>
        <article v-for="item in detailedItems" :key="item.productId" class="max-[840px]:grid-cols-1 grid grid-cols-[minmax(280px,1fr)_auto_auto] items-center gap-8 border-b border-[#171916] py-8">
          <div>
            <h2 class="mb-3">{{ item.product.title }}</h2>
            <p class="mb-0 font-[Segoe_UI,Arial,sans-serif] font-extrabold text-[#a53e10]">{{ formatProductPrice(item.product) }}</p>
          </div>

          <div class="flex items-center gap-3" :aria-label="`Количество: ${item.product.title}`">
            <button class="size-11 border border-[#171916] bg-transparent text-xl" type="button" :aria-label="`Уменьшить количество: ${item.product.title}`" @click="decrement(item.productId)">−</button>
            <output class="min-w-16 text-center font-[Segoe_UI,Arial,sans-serif] font-[760]" :aria-label="`Количество ${item.quantity} ${item.product.unit}`">{{ item.quantity }} {{ item.product.unit }}</output>
            <button class="size-11 border border-[#171916] bg-transparent text-xl" type="button" :aria-label="`Увеличить количество: ${item.product.title}`" @click="increment(item.productId)">+</button>
          </div>

          <button class="w-max border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#a53e10]" type="button" @click="removeProduct(item.productId)">Удалить</button>
        </article>

        <div class="mt-10 flex flex-wrap items-end justify-between gap-8">
          <button class="w-max border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#a53e10]" type="button" @click="clearCart">Очистить корзину</button>
          <div class="max-w-[560px]">
            <p class="mb-3 font-[Segoe_UI,Arial,sans-serif] text-[0.8125rem] font-[760] uppercase">Предварительная сумма</p>
            <p class="text-[clamp(1.8rem,3vw,2.8rem)] font-[750] leading-none">{{ formattedSubtotal }}</p>
            <p>Наличие, итоговую стоимость и условия доставки подтверждает менеджер.</p>
            <div class="flex flex-wrap gap-3">
              <button
                class="inline-flex min-h-11 cursor-pointer items-center border-0 bg-[#d65a1f] px-5 py-3 font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#fffdf7] transition-colors duration-150 hover:bg-[#a53e10]"
                type="button"
                @click="copyOrderText"
              >Скопировать заказ</button>
              <a
                class="inline-flex min-h-11 items-center border border-[#171916] px-5 py-3 font-[Segoe_UI,Arial,sans-serif] font-[760] no-underline transition-colors duration-150 hover:bg-[#171916] hover:text-[#fffdf7]"
                :href="businessPhoneHref"
              >Позвонить: {{ businessPhone }}</a>
            </div>
            <p v-if="copyFeedback" class="mt-4 text-sm" role="status">{{ copyFeedback }}</p>
            <a
              class="mt-3 inline-flex border-b-2 border-current pb-1 font-[Segoe_UI,Arial,sans-serif] font-[760] no-underline hover:text-[#d65a1f]"
              :href="businessSecondaryPhoneHref"
            >Дополнительный телефон: {{ businessSecondaryPhone }}</a>
          </div>
        </div>
      </template>
    </section>
  </main>
</template>
