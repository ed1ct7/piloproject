<script setup lang="ts">
import type { ProductSizeTable } from '~/utils/product-sizes'

const props = withDefaults(defineProps<{
  table: ProductSizeTable
  /** Плотная версия для каталога: меньше кегль и отступы. */
  compact?: boolean
}>(), {
  compact: false,
})

const headingId = useId()

/** Колонки с найденной позицией прайса; цена по запросу в таблицу не попадает. */
const columns = computed(() => props.table.columns.flatMap((column) => {
  const product = getSizeTableProduct(column)
  return product ? [{ ...column, product }] : []
}))
const rows = computed(() => getSizeTableRows(props.table))

/** Подпись под таблицей: оговорка позиции, выбор длины и общая оговорка про «от». */
const footnote = computed(() => [
  props.table.note,
  props.table.lengthsMm.length > 1 ? `Длина ${props.table.lengthsMm.join(' или ')} мм на выбор.` : undefined,
  'Все цены «от», наличие и итог подтверждает менеджер.',
].filter((part): part is string => part !== undefined).join(' '))
</script>

<template>
  <div v-if="columns.length && rows.length" class="size-table min-w-0" :class="{ 'size-table--compact': compact }">
    <h3 :id="headingId" class="mb-3" :class="compact ? '!text-[1.05rem]' : ''">{{ table.title }}</h3>
    <div
      class="size-table__scroll max-w-full overflow-x-auto border border-(--color-line) bg-(--color-paper)"
      tabindex="0"
      role="region"
      :aria-labelledby="headingId"
    >
      <table :style="{ minWidth: `${340 + columns.length * (compact ? 120 : 150)}px` }">
        <caption class="sr-only">{{ table.title }}: сечение, длина, объём одной штуки и цена за штуку при цене за кубометр из прайса</caption>
        <thead>
          <tr>
            <th scope="col">Сечение, мм</th>
            <th scope="col">Длина, мм</th>
            <th scope="col">Объём 1 шт., м³</th>
            <th v-for="column in columns" :key="column.productId" scope="col">
              {{ column.label }}
              <span class="size-table__rate">{{ formatProductPrice(column.product) }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="`${formatSection(row.section)}-${row.lengthMm}`">
            <th scope="row">{{ formatSection(row.section) }}</th>
            <td>{{ row.lengthMm }}</td>
            <td>{{ formatVolume(row.pieceVolume) }}</td>
            <td v-for="column in columns" :key="column.productId">
              от {{ formatRoubles(getPiecePrice(row.pieceVolume, column.product.price) ?? 0) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="mb-0 mt-3 max-w-[760px] text-[0.9rem] leading-[1.55] text-(--color-ink)/70">
      <span class="hidden max-[720px]:inline">Таблица прокручивается вправо — там цена за штуку. </span>{{ footnote }}
    </p>
  </div>
</template>

<style scoped>
.size-table table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 0.94rem;
  line-height: 1.4;
  font-variant-numeric: tabular-nums;
}

.size-table th,
.size-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-line);
  text-align: left;
  vertical-align: top;
  white-space: nowrap;
}

.size-table thead th {
  border-bottom: 1px solid var(--color-ink);
  font-size: 0.72rem;
  font-weight: 760;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-ink);
}

.size-table__rate {
  display: block;
  margin-top: 4px;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
  color: rgb(32 35 31 / 70%);
}

.size-table tbody th {
  font-weight: 700;
}

.size-table tbody tr:nth-child(even) {
  background: var(--color-cream);
}

.size-table tbody tr:last-child th,
.size-table tbody tr:last-child td {
  border-bottom: 0;
}

.size-table--compact table {
  font-size: 0.86rem;
}

.size-table--compact th,
.size-table--compact td {
  padding: 8px 12px;
}

@media (max-width: 560px) {
  .size-table th,
  .size-table td {
    padding: 10px 12px;
  }
}
</style>
