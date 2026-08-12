<script setup lang="ts">
import type { CartProductItem } from '~/composables/useCart'

definePageMeta({
  path: '/cart',
  alias: ['/korzina'],
})

useSeoMeta({
  title: 'Предварительная заявка',
  description: 'Локальный перечень пиломатериалов для предварительной заявки.',
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
    'Здравствуйте! Направляю предварительную заявку на пиломатериалы:',
    '',
    ...lines,
    '',
    `Предварительная сумма: ${formattedSubtotal.value}`,
    'Пожалуйста, подтвердите наличие, итоговую стоимость и условия доставки. Эта заявка не подтверждает заказ.',
  ].join('\n')
})

async function copyOrderText() {
  try {
    await navigator.clipboard.writeText(orderText.value)
    copyFeedback.value = 'Состав заявки скопирован. Откройте MAX и отправьте его менеджеру.'
  }
  catch {
    copyFeedback.value = 'Не удалось скопировать автоматически. Позвоните менеджеру — заявка сохранится в браузере.'
  }
}
</script>

<template>
  <main>
    <section class="max-[560px]:px-[18px] border-b border-[#171916] bg-[#d6ded0] px-[max(24px,calc((100vw_-_1280px)/2))] pb-10 pt-14">
      <h1>Предварительная заявка</h1>
    </section>

    <section class="max-[560px]:px-[18px] bg-[#efe6d7] px-[max(24px,calc((100vw_-_1280px)/2))] pb-20 pt-10">
      <div v-if="detailedItems.length === 0" class="grid justify-items-start gap-4 py-12">
        <h2>Заявка пуста</h2>
        <p>Добавьте нужные позиции из каталога пиломатериалов.</p>
        <NuxtLink class="w-max border-b-2 border-current pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#1f3a2f] no-underline hover:text-[#a8461e]" to="/pilomaterialy">Перейти в каталог</NuxtLink>
      </div>

      <template v-else>
        <article v-for="item in detailedItems" :key="item.productId" class="max-[840px]:grid-cols-1 grid grid-cols-[minmax(280px,1fr)_auto_auto] items-center gap-8 border-b border-[#171916] py-8">
          <div>
            <h2 class="mb-3">{{ item.product.title }}</h2>
            <p class="mb-0 font-[Segoe_UI,Arial,sans-serif] font-extrabold text-[#a8461e]">{{ formatProductPrice(item.product) }}</p>
          </div>

          <div class="flex items-center gap-3" :aria-label="`Количество: ${item.product.title}`">
            <button class="size-11 border border-[#171916] bg-[#ded5c4] text-xl transition-colors hover:bg-[#cbb99d]" type="button" :aria-label="`Уменьшить количество: ${item.product.title}`" @click="decrement(item.productId)">−</button>
            <output class="min-w-16 text-center font-[Segoe_UI,Arial,sans-serif] font-[760]" :aria-label="`Количество ${item.quantity} ${item.product.unit}`">{{ item.quantity }} {{ item.product.unit }}</output>
            <button class="size-11 border border-[#171916] bg-[#ded5c4] text-xl transition-colors hover:bg-[#cbb99d]" type="button" :aria-label="`Увеличить количество: ${item.product.title}`" @click="increment(item.productId)">+</button>
          </div>

          <button class="w-max border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#a8461e]" type="button" @click="removeProduct(item.productId)">Удалить</button>
        </article>

        <div class="mt-10 flex flex-wrap items-end justify-between gap-8">
          <button class="w-max border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#a8461e]" type="button" @click="clearCart">Очистить заявку</button>
          <div class="max-w-[560px]">
            <p class="mb-3 font-[Segoe_UI,Arial,sans-serif] text-[0.8125rem] font-[760] uppercase">Предварительная сумма</p>
            <p class="mb-5 text-[clamp(1.8rem,3vw,2.8rem)] font-[750] leading-none">{{ formattedSubtotal }}</p>
            <p class="mb-5">Передача перечня не подтверждает заказ. Наличие, цена, доставка и заключение договора согласовываются с менеджером.</p>
            <div class="flex flex-wrap gap-3">
              <button
                class="inline-flex min-h-11 cursor-pointer items-center border-0 bg-[#a8461e] px-5 py-3 font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#fffdf7] transition-colors duration-150 hover:bg-[#7a451e]"
                type="button"
                @click="copyOrderText"
              >Скопировать заявку</button>
              <a
                class="inline-flex min-h-11 items-center border border-[#a8461e] bg-[#a8461e] px-5 py-3 font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#fffdf7] no-underline transition-colors duration-150 hover:border-[#7a451e] hover:bg-[#7a451e]"
                :href="businessMaxUrl"
                target="_blank"
                rel="noopener noreferrer"
              >Открыть MAX</a>
              <a
                class="inline-flex min-h-11 items-center border border-[#1f3a2f] bg-[#1f3a2f] px-5 py-3 font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#fffdf7] no-underline transition-colors duration-150 hover:border-[#171916] hover:bg-[#171916]"
                :href="businessPhoneHref"
              >Позвонить: {{ businessPhone }}</a>
            </div>
            <UiStatusMessage class="mt-4" :message="copyFeedback" />
            <a
              class="mt-3 inline-flex border-b-2 border-current pb-1 font-[Segoe_UI,Arial,sans-serif] font-[760] no-underline hover:text-[#a8461e]"
              :href="businessSecondaryPhoneHref"
            >Дополнительный телефон: {{ businessSecondaryPhone }}</a>
          </div>
        </div>
      </template>
    </section>
  </main>
</template>
