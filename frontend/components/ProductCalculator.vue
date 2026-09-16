<script setup lang="ts">
import type { PriceListProduct } from '~/utils/products'
import type { LumberQuantityUnit, ProductSizeTable } from '~/utils/product-sizes'

/**
 * Калькулятор объёма и стоимости «от».
 * @note считает только в браузере пользователя: ничего не хранит, не отправляет
 *       и не читает — режим сайта приватный
 */
const props = defineProps<{ tables: ProductSizeTable[] }>()

interface CalculatorOption {
  product: PriceListProduct & { price: number }
  table: ProductSizeTable
}

const controlId = useId()

/** Позиции с ценой за кубометр из переданных таблиц. */
const options = computed<CalculatorOption[]>(() => props.tables.flatMap((table) =>
  table.columns.flatMap((column) => {
    const product = getSizeTableProduct(column)
    return product ? [{ product, table }] : []
  }),
))

const selectedProductId = ref(options.value[0]?.product.id ?? '')
const sectionIndex = ref(0)
const lengthIndex = ref(0)
const quantityInput = ref('1')
const unit = ref<LumberQuantityUnit>('шт.')

const selected = computed<CalculatorOption | undefined>(() =>
  options.value.find((option: CalculatorOption) => option.product.id === selectedProductId.value),
)
const sections = computed(() => selected.value?.table.sections ?? [])
const lengths = computed(() => selected.value?.table.lengthsMm ?? [])

// При смене позиции список сечений и длин меняется — выбор возвращается к первому пункту.
watch(selectedProductId, () => {
  sectionIndex.value = 0
  lengthIndex.value = 0
})

const quantity = computed(() => {
  const normalized = quantityInput.value.trim().replace(',', '.')
  return normalized === '' ? Number.NaN : Number(normalized)
})

const result = computed(() => {
  const option = selected.value
  const section = sections.value[sectionIndex.value]
  const lengthMm = lengths.value[lengthIndex.value]
  if (!option || !section || lengthMm === undefined) {
    return null
  }

  return calculateLumber({
    thicknessMm: section[0],
    widthMm: section[1],
    lengthMm,
    pricePerCubicMeter: option.product.price,
    quantity: quantity.value,
    unit: unit.value,
  })
})

const quantityHint = computed(() => unit.value === 'шт.'
  ? `Введите целое число штук от 1 до ${maxCalculatorPieces.toLocaleString('ru-RU')}.`
  : `Введите объём от 0,001 до ${maxCalculatorVolume.toLocaleString('ru-RU')} м³ — переведём в целые доски.`)
</script>

<template>
  <div v-if="options.length" class="calculator min-w-0" :aria-labelledby="`${controlId}-heading`" role="group">
    <h3 :id="`${controlId}-heading`" class="mb-3">Калькулятор объёма и стоимости</h3>
    <p class="mb-6 max-w-[680px] leading-[1.6] text-(--color-ink)/85">
      Выберите позицию, сечение и длину, укажите количество в штуках или кубометрах. Сумма — по цене «от» без доставки, считается прямо в браузере и никуда не отправляется.
    </p>

    <div class="calculator__fields grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)] gap-x-5 gap-y-4 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
      <div>
        <label :for="`${controlId}-product`">Позиция и сорт</label>
        <select :id="`${controlId}-product`" v-model="selectedProductId">
          <option v-for="option in options" :key="option.product.id" :value="option.product.id">{{ option.product.title }}</option>
        </select>
      </div>
      <div>
        <label :for="`${controlId}-section`">Сечение, мм</label>
        <select :id="`${controlId}-section`" v-model="sectionIndex">
          <option v-for="(section, index) in sections" :key="formatSection(section)" :value="index">{{ formatSection(section) }}</option>
        </select>
      </div>
      <div>
        <label :for="`${controlId}-length`">Длина, мм</label>
        <select :id="`${controlId}-length`" v-model="lengthIndex" :disabled="lengths.length < 2">
          <option v-for="(lengthMm, index) in lengths" :key="lengthMm" :value="index">{{ lengthMm }}</option>
        </select>
      </div>
      <div>
        <label :for="`${controlId}-quantity`">Количество</label>
        <div class="grid grid-cols-[minmax(0,1fr)_92px] gap-2">
          <input
            :id="`${controlId}-quantity`"
            v-model="quantityInput"
            type="text"
            inputmode="decimal"
            autocomplete="off"
            :aria-invalid="result === null"
            :aria-describedby="`${controlId}-hint`"
          >
          <select v-model="unit" aria-label="Единица количества">
            <option value="шт.">шт.</option>
            <option value="м³">м³</option>
          </select>
        </div>
      </div>
    </div>
    <p :id="`${controlId}-hint`" class="mb-0 mt-3 text-[0.9rem] leading-[1.5] text-(--color-ink)/70">{{ quantityHint }}</p>

    <div class="calculator__result mt-7 border-t border-(--color-line) pt-6" aria-live="polite" aria-atomic="true">
      <dl v-if="result" class="calculator__values m-0 grid grid-cols-4 gap-x-6 gap-y-5 max-[900px]:grid-cols-2">
        <div>
          <dt>Объём одной штуки</dt>
          <dd>{{ formatVolume(result.pieceVolume) }} м³</dd>
        </div>
        <div>
          <dt>Штук в партии</dt>
          <dd>{{ result.pieces.toLocaleString('ru-RU') }} шт.</dd>
        </div>
        <div>
          <dt>Объём партии</dt>
          <dd>{{ formatVolume(result.totalVolume) }} м³</dd>
        </div>
        <div>
          <dt>Стоимость материала</dt>
          <dd class="calculator__total">от {{ formatRoubles(result.totalPrice) }}</dd>
        </div>
      </dl>
      <p v-else class="mb-0 leading-[1.6]">Проверьте количество: {{ quantityHint }}</p>
      <p class="mb-0 mt-5 max-w-[680px] text-[0.9rem] leading-[1.55] text-(--color-ink)/70">
        Одна штука — от {{ result ? formatRoubles(result.piecePrice) : '—' }}. Сумма партии считается по общему объёму и округлена вверх до рубля.
        <template v-if="selected?.table.lowerEstimate">Ширина габаритная, поэтому это нижняя оценка. </template>
        <template v-if="unit === 'м³'">Объём округлён вверх до целой доски. </template>
        Наличие сечений и итоговую цену подтверждает менеджер.
      </p>
    </div>
  </div>
</template>

<style scoped>
.calculator label {
  display: block;
  margin-bottom: 8px;
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 0.72rem;
  font-weight: 760;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgb(32 35 31 / 70%);
}

.calculator select,
.calculator input {
  width: 100%;
  min-width: 0;
  min-height: 48px;
  padding: 10px 12px;
  border: 1px solid var(--color-ink);
  border-radius: 0;
  background: var(--color-paper);
  color: var(--color-ink);
  font: inherit;
  font-variant-numeric: tabular-nums;
}

.calculator select:disabled {
  color: rgb(32 35 31 / 70%);
  background: var(--color-cream);
}

.calculator select:focus-visible,
.calculator input:focus-visible {
  outline: 2px solid var(--color-focus-inner);
  outline-offset: 2px;
  box-shadow: 0 0 0 5px var(--color-focus-outer);
}

.calculator input[aria-invalid='true'] {
  border-color: var(--color-copper);
  box-shadow: inset 0 -2px 0 var(--color-copper);
}

.calculator dt {
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 0.72rem;
  font-weight: 760;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgb(32 35 31 / 70%);
}

.calculator dd {
  margin: 6px 0 0;
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: clamp(1.18rem, 1.5vw, 1.45rem);
  font-weight: 800;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.calculator__total {
  color: var(--color-copper);
}
</style>
