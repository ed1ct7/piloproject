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

const {
  initialized,
  detailedItems,
  subtotal,
  increment,
  decrement,
  removeProduct,
  clearCart,
} = useCart()

const formattedSubtotal = computed(() => `${subtotal.value.toLocaleString('ru-RU')} ₽`)
const copyFeedback = ref('')
const cartFeedback = ref('')
let cartFeedbackTimeout: ReturnType<typeof setTimeout> | undefined
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

function showCartFeedback(message: string): void {
  cartFeedback.value = ''
  if (cartFeedbackTimeout) {
    clearTimeout(cartFeedbackTimeout)
  }

  nextTick(() => {
    cartFeedback.value = message
    cartFeedbackTimeout = setTimeout(() => {
      cartFeedback.value = ''
    }, 4000)
  })
}

function incrementWithFeedback(item: CartProductItem): void {
  const nextQuantity = item.quantity + 1
  increment(item.productId)
  showCartFeedback(`${item.product.title}: количество увеличено до ${nextQuantity} ${item.product.unit}.`)
}

function decrementWithFeedback(item: CartProductItem): void {
  if (item.quantity <= 1) {
    removeProduct(item.productId)
    showCartFeedback(`${item.product.title}: удалено из заявки.`)
    return
  }

  const nextQuantity = item.quantity - 1
  decrement(item.productId)
  showCartFeedback(`${item.product.title}: количество уменьшено до ${nextQuantity} ${item.product.unit}.`)
}

function removeWithFeedback(item: CartProductItem): void {
  removeProduct(item.productId)
  showCartFeedback(`${item.product.title}: удалено из заявки.`)
}

function clearWithFeedback(): void {
  clearCart()
  showCartFeedback('Заявка очищена.')
}

onBeforeUnmount(() => {
  if (cartFeedbackTimeout) {
    clearTimeout(cartFeedbackTimeout)
  }
})
</script>

<template>
  <main>
    <section class="max-[560px]:px-[18px] border-b border-(--color-ink) bg-(--color-sand) px-[max(24px,calc((100vw_-_1280px)/2))] pb-10 pt-14">
      <p class="mb-3 font-[Segoe_UI,Arial,sans-serif] text-[0.8125rem] font-[760] uppercase tracking-[0.04em] text-(--color-copper)">Без оплаты на сайте</p>
      <h1>Предварительная заявка</h1>
    </section>

    <section class="max-[560px]:px-[18px] bg-(--color-cream) px-[max(24px,calc((100vw_-_1280px)/2))] pb-20 pt-10">
      <UiStatusMessage class="mb-4" :message="cartFeedback" />

      <div v-if="!initialized" class="grid justify-items-start gap-4 py-12" aria-busy="true" aria-live="polite">
        <h2>Загружаем заявку</h2>
        <p>Проверяем сохранённые на этом устройстве позиции.</p>
      </div>

      <div v-else-if="detailedItems.length === 0" class="grid max-w-[640px] justify-items-start gap-5 py-14">
        <h2>Заявка пуста</h2>
        <p class="mb-0 text-(--color-ink)/85">Соберите перечень нужных позиций из каталога — менеджер подтвердит наличие, цену и доставку. Оплата только по факту отгрузки.</p>
        <div class="flex flex-wrap gap-3">
          <NuxtLink class="inline-flex min-h-11 items-center bg-(--color-copper) px-5 py-3 font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-paper) no-underline transition-colors duration-150 hover:bg-(--color-copper-dark)" to="/pilomaterialy">Перейти в каталог</NuxtLink>
          <a
            class="inline-flex min-h-11 items-center border border-(--color-ink) px-5 py-3 font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-ink) no-underline transition-colors duration-150 hover:border-(--color-copper) hover:text-(--color-copper)"
            :href="businessMaxUrl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Написать в MAX (откроется в новой вкладке)"
          >Написать в MAX</a>
        </div>
      </div>

      <template v-else>
        <article v-for="item in detailedItems" :key="item.productId" class="max-[840px]:grid-cols-1 grid grid-cols-[minmax(280px,1fr)_auto_auto] items-center gap-8 border-b border-(--color-ink) py-8">
          <div>
            <h2 class="mb-3">{{ item.product.title }}</h2>
            <p class="mb-0 font-[Segoe_UI,Arial,sans-serif] font-extrabold text-(--color-copper)">{{ formatProductPrice(item.product) }}</p>
          </div>

          <div class="flex items-center gap-3" :aria-label="`Количество: ${item.product.title}`">
            <button class="size-11 border border-(--color-ink) bg-(--color-sand) text-xl transition-colors hover:bg-(--color-line)" type="button" :aria-label="`Уменьшить количество: ${item.product.title}`" @click="decrementWithFeedback(item)">−</button>
            <output class="min-w-16 text-center font-[Segoe_UI,Arial,sans-serif] font-[760]" :aria-label="`Количество ${item.quantity} ${item.product.unit}`">{{ item.quantity }} {{ item.product.unit }}</output>
            <button class="size-11 border border-(--color-ink) bg-(--color-sand) text-xl transition-colors hover:bg-(--color-line)" type="button" :aria-label="`Увеличить количество: ${item.product.title}`" @click="incrementWithFeedback(item)">+</button>
          </div>

          <button class="inline-flex min-h-11 w-max items-center border-0 border-b-2 border-current bg-transparent px-0 font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-copper)" type="button" @click="removeWithFeedback(item)">Удалить</button>
        </article>

        <div class="mt-10 flex flex-wrap items-end justify-between gap-8">
          <button class="inline-flex min-h-11 w-max items-center border-0 border-b-2 border-current bg-transparent px-0 font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-copper)" type="button" @click="clearWithFeedback">Очистить заявку</button>
          <div class="max-w-[560px]">
            <p class="mb-3 font-[Segoe_UI,Arial,sans-serif] text-[0.8125rem] font-[760] uppercase">Предварительная сумма</p>
            <p class="mb-5 text-[clamp(1.8rem,3vw,2.8rem)] font-[750] leading-none">{{ formattedSubtotal }}</p>
            <p class="mb-5">Передача перечня не подтверждает заказ. Наличие, цена, доставка и заключение договора согласовываются с менеджером.</p>
            <div class="flex flex-wrap gap-3">
              <button
                class="inline-flex min-h-11 cursor-pointer items-center border-0 bg-(--color-copper) px-5 py-3 font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-paper) transition-colors duration-150 hover:bg-(--color-copper-dark)"
                type="button"
                @click="copyOrderText"
              >Скопировать заявку</button>
              <a
                class="inline-flex min-h-11 items-center border border-(--color-copper) bg-(--color-copper) px-5 py-3 font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-paper) no-underline transition-colors duration-150 hover:border-(--color-copper-dark) hover:bg-(--color-copper-dark)"
                :href="businessMaxUrl"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Открыть MAX в новой вкладке"
              >Открыть MAX</a>
              <a
                class="inline-flex min-h-11 items-center border border-(--color-forest) bg-(--color-forest) px-5 py-3 font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-paper) no-underline transition-colors duration-150 hover:border-(--color-ink) hover:bg-(--color-ink)"
                :href="businessPhoneHref"
              >Позвонить: {{ businessPhone }}</a>
            </div>
            <UiStatusMessage class="mt-4" :message="copyFeedback" />
            <a
              class="mt-3 inline-flex min-h-11 max-w-full flex-wrap items-center gap-x-1 border-b-2 border-current font-[Segoe_UI,Arial,sans-serif] font-[760] no-underline hover:text-(--color-copper) max-[560px]:w-full"
              :href="businessSecondaryPhoneHref"
            >
              <span>Дополнительный телефон:</span>
              <span class="whitespace-nowrap">{{ businessSecondaryPhone }}</span>
            </a>
          </div>
        </div>
      </template>
    </section>
  </main>
</template>
