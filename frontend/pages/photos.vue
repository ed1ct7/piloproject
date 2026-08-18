<script setup lang="ts">
definePageMeta({
  path: '/foto',
})

/**
 * Фотография производственной площадки для галереи.
 *
 * `width`/`height` — натуральный размер исходника в `public/images`.
 * Они нужны и мозаике (стабильный кадр без CLS), и просмотрщику: по ним
 * `@nuxt/image` строит srcset без искажения пропорций.
 */
interface ProductionPhoto {
  image: string
  alt: string
  caption: string
  width: number
  height: number
}

const photos: ProductionPhoto[] = [
  {
    image: '/images/lentochnaya-pilorama-raspil.jpg',
    alt: 'Ленточная пилорама с бревном на рельсах перед распилом',
    caption: 'Ленточная пилорама перед распилом бревна',
    width: 1200,
    height: 1600,
  },
  {
    image: '/images/pilorama-stanok-brevno.jpg',
    alt: 'Пилорамный станок с бревном на подаче под навесом производства',
    caption: 'Подача бревна на пилорамный станок',
    width: 1200,
    height: 1600,
  },
  {
    image: '/images/sklad-obrabotannoi-doski.jpg',
    alt: 'Штабели обработанной доски на крытом складе пилорамы',
    caption: 'Крытый склад обработанной доски',
    width: 960,
    height: 1280,
  },
  {
    image: '/images/shtabel-suhoi-doski.jpg',
    alt: 'Штабели сухой доски в пачках на складе',
    caption: 'Пачки сухой доски на складе',
    width: 960,
    height: 1280,
  },
  {
    image: '/images/bruski-na-sklade.jpg',
    alt: 'Штабели строганого бруска на складе производства',
    caption: 'Строганый брусок в штабелях',
    width: 719,
    height: 1280,
  },
  {
    image: '/images/pachki-reiki-i-bruska.jpg',
    alt: 'Пачки рейки и бруска, подготовленные к отгрузке',
    caption: 'Рейка и брусок в пачках',
    width: 719,
    height: 1280,
  },
  {
    image: '/images/imitatsiya-brusa-upakovka.jpg',
    alt: 'Имитация бруса в защитной упаковке на складе',
    caption: 'Имитация бруса в упаковке',
    width: 960,
    height: 1280,
  },
  {
    image: '/images/doska-s-ognebiozashchitoi.jpg',
    alt: 'Штабель доски, обработанной огнебиозащитным составом',
    caption: 'Доска после обработки огнебиозащитой',
    width: 1600,
    height: 1200,
  },
  {
    image: '/images/ploshchadka-otgruzka-pilomaterialov.jpg',
    alt: 'Производственная площадка с партией доски и машиной на отгрузке',
    caption: 'Комплектование партии на площадке',
    width: 899,
    height: 1599,
  },
  {
    image: '/images/dostavka-pilomaterialov.jpg',
    alt: 'Машина с пиломатериалами на доставке у участка заказчика',
    caption: 'Доставка заказа на участок',
    width: 2048,
    height: 1538,
  },
  {
    image: '/images/brushing-1.jpg',
    alt: 'Крупный план обработанной хвойной доски на производственной линии',
    caption: 'Поверхность доски после обработки',
    width: 2560,
    height: 3409,
  },
  {
    image: '/images/lumber-stack-2025-03-07.jpg',
    alt: 'Партия окрашенных досок на производственной линии',
    caption: 'Партия доски перед комплектованием',
    width: 2560,
    height: 3409,
  },
  {
    image: '/images/sawn-board-stack-2025-04-02.jpg',
    alt: 'Штабель распиленной доски на площадке',
    caption: 'Штабель распиленной доски',
    width: 770,
    height: 1439,
  },
  {
    image: '/images/lumber-yard-2025-05-21.jpg',
    alt: 'Окрашенные доски серого цвета после обработки',
    caption: 'Доска с готовым покрытием',
    width: 1600,
    height: 1200,
  },
  {
    image: '/images/timber-order-2025-05-16.jpg',
    alt: 'Образцы окрашенной древесины с различными вариантами покрытия',
    caption: 'Образцы вариантов покрытия',
    width: 972,
    height: 1296,
  },
  {
    image: '/images/sawmill-yard-1.jpg',
    alt: 'Образцы досок с разными вариантами окрашенной поверхности',
    caption: 'Варианты обработки поверхности',
    width: 1080,
    height: 708,
  },
]

/**
 * Журнальная мозаика (десктоп ≥1100px): span-классы по позиции кадра.
 * Ритм: крупный разворот → ряд мелких → пара широких, дважды, хвост широкими.
 * Раскладка рассчитана на сетку в 6 колонок без дыр при 16 кадрах.
 *
 * `sizes` считается от реальной ширины плитки, иначе браузер берёт самый
 * крупный кандидат срезета и растягивает его: при контенте 1280px колонка
 * равна 196px, поэтому span-4 занимает ~847px, span-3 — ~630px, span-2 — ~413px.
 * У высоких плиток (row-span-2) кадр 4:3 вписывается по высоте, и ширина
 * отрисовки выходит больше ширины плитки — им задан отдельный шаг.
 */
interface MosaicTile {
  span: string
  sizes: string
}

const mosaicTiles: MosaicTile[] = [
  { span: 'min-[1100px]:col-span-4 min-[1100px]:row-span-2', sizes: 'xs:100vw sm:48vw md:48vw lg:33vw xl:67vw xxl:56vw' },
  { span: 'min-[1100px]:col-span-2 min-[1100px]:row-span-2', sizes: 'xs:100vw sm:48vw md:48vw lg:33vw xl:44vw xxl:37vw' },
  { span: 'min-[1100px]:col-span-2', sizes: 'xs:100vw sm:48vw md:48vw lg:33vw xl:33vw xxl:28vw' },
  { span: 'min-[1100px]:col-span-2', sizes: 'xs:100vw sm:48vw md:48vw lg:33vw xl:33vw xxl:28vw' },
  { span: 'min-[1100px]:col-span-2', sizes: 'xs:100vw sm:48vw md:48vw lg:33vw xl:33vw xxl:28vw' },
  { span: 'min-[1100px]:col-span-3', sizes: 'xs:100vw sm:48vw md:48vw lg:33vw xl:50vw xxl:42vw' },
  { span: 'min-[1100px]:col-span-3', sizes: 'xs:100vw sm:48vw md:48vw lg:33vw xl:50vw xxl:42vw' },
  { span: 'min-[1100px]:col-span-2 min-[1100px]:row-span-2', sizes: 'xs:100vw sm:48vw md:48vw lg:33vw xl:44vw xxl:37vw' },
  { span: 'min-[1100px]:col-span-4 min-[1100px]:row-span-2', sizes: 'xs:100vw sm:48vw md:48vw lg:33vw xl:67vw xxl:56vw' },
  { span: 'min-[1100px]:col-span-2', sizes: 'xs:100vw sm:48vw md:48vw lg:33vw xl:33vw xxl:28vw' },
  { span: 'min-[1100px]:col-span-2', sizes: 'xs:100vw sm:48vw md:48vw lg:33vw xl:33vw xxl:28vw' },
  { span: 'min-[1100px]:col-span-2', sizes: 'xs:100vw sm:48vw md:48vw lg:33vw xl:33vw xxl:28vw' },
  { span: 'min-[1100px]:col-span-3', sizes: 'xs:100vw sm:48vw md:48vw lg:33vw xl:50vw xxl:42vw' },
  { span: 'min-[1100px]:col-span-3', sizes: 'xs:100vw sm:48vw md:48vw lg:33vw xl:50vw xxl:42vw' },
  { span: 'min-[1100px]:col-span-3', sizes: 'xs:100vw sm:48vw md:48vw lg:33vw xl:50vw xxl:42vw' },
  { span: 'min-[1100px]:col-span-3', sizes: 'xs:100vw sm:48vw md:48vw lg:33vw xl:50vw xxl:42vw' },
]

const fallbackTile: MosaicTile = {
  span: 'min-[1100px]:col-span-2',
  sizes: 'xs:100vw sm:48vw md:48vw lg:33vw xl:33vw xxl:28vw',
}

function getMosaicTile(index: number): MosaicTile {
  return mosaicTiles[index] ?? fallbackTile
}

const photoDialog = useTemplateRef<HTMLDialogElement>('photo-dialog')
const closePhotoButton = useTemplateRef<HTMLButtonElement>('close-photo-button')
const activePhotoIndex = ref<number | null>(null)
let photoDialogTrigger: HTMLElement | null = null

const activePhoto = computed<ProductionPhoto | null>(() => {
  if (activePhotoIndex.value === null) {
    return null
  }

  return photos[activePhotoIndex.value] ?? null
})

/** Открывает кадр во весь экран и запоминает плитку, чтобы вернуть на неё фокус. */
async function openPhoto(index: number, event?: Event): Promise<void> {
  photoDialogTrigger = event?.currentTarget instanceof HTMLElement ? event.currentTarget : null
  activePhotoIndex.value = index
  await nextTick()

  if (photoDialog.value && !photoDialog.value.open) {
    photoDialog.value.showModal()
    closePhotoButton.value?.focus()
  }
}

function closePhoto(): void {
  if (photoDialog.value?.open) {
    photoDialog.value.close()
    return
  }

  finishClosingPhoto()
}

function finishClosingPhoto(): void {
  activePhotoIndex.value = null
  nextTick(() => photoDialogTrigger?.focus())
}

/** Листает просмотрщик по кругу: -1 — предыдущий кадр, 1 — следующий. */
function shiftActivePhoto(offset: number): void {
  if (activePhotoIndex.value === null) {
    return
  }

  activePhotoIndex.value = (activePhotoIndex.value + offset + photos.length) % photos.length
}

function handlePhotoBackdropClick(event: MouseEvent): void {
  if (event.target === photoDialog.value) {
    closePhoto()
  }
}

useSeoMeta({
  title: 'Фото пилорамы в Разбегаево – производство, склад, отгрузка',
  description: 'Фотографии производственной площадки пилорамы в Разбегаево: ленточная пилорама, распил бревна, склад сухой доски и бруска, обработка огнебиозащитой, отгрузка и доставка.',
  ogTitle: 'Фото производства пилорамы в Разбегаево',
  ogDescription: 'Реальные фотографии площадки: станки, склад, готовые пиломатериалы и отгрузка.',
  ogImage: `${siteUrl}/images/pilorama-stanok-brevno.jpg`,
  ogType: 'website',
  ogUrl: `${siteUrl}/foto`,
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: `${siteUrl}/foto` }],
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Главная', item: '/' },
      { name: 'Фото производства', item: '/foto' },
    ],
  }),
  defineWebPage({
    name: 'Фото производства пилорамы в Разбегаево',
    description: 'Фотографии станков, склада и отгрузки пиломатериалов на производственной площадке.',
  }),
])
</script>

<template>
  <main>
    <section class="max-[840px]:min-h-0 max-[560px]:px-[18px] max-[560px]:pb-10 max-[560px]:pt-[34px] grid min-h-[310px] items-center border-b border-(--color-ink) bg-(--color-sand) px-[max(24px,calc((100vw_-_1280px)/2))] pb-10 pt-14">
      <div class="max-w-[760px] [&_h1]:mb-0">
        <p class="mb-3 font-[Segoe_UI,Arial,sans-serif] text-[0.8125rem] font-[760] uppercase tracking-[0.04em] text-(--color-copper)">Производственная площадка</p>
        <h1>Фото пилорамы и склада</h1>
      </div>
    </section>

    <section class="grid grid-cols-6 grid-flow-dense auto-rows-[200px] gap-5 bg-(--color-cream) px-[max(24px,calc((100vw_-_1280px)/2))] pb-20 pt-14 max-[1100px]:auto-rows-auto max-[1100px]:grid-cols-3 max-[840px]:grid-cols-2 max-[560px]:grid-cols-1 max-[560px]:gap-4 max-[560px]:px-[18px] max-[560px]:pb-14" aria-label="Фотографии производственной площадки">
      <figure v-for="(photo, index) in photos" :key="photo.image" data-parallax="10" class="photo-tile relative overflow-hidden border border-(--color-ink) bg-(--color-sand) min-[1100px]:h-full [&_img]:aspect-[4/3] [&_img]:w-full [&_img]:object-cover min-[1100px]:[&_img]:aspect-auto min-[1100px]:[&_img]:h-full" :class="getMosaicTile(index).span">
        <NuxtImg
          :src="photo.image"
          :alt="photo.alt"
          width="1200"
          height="900"
          :sizes="getMosaicTile(index).sizes"
          densities="1 2"
          format="webp"
          loading="lazy"
        />
        <figcaption class="absolute inset-x-3 bottom-3 bg-[rgb(250_247_240/92%)] px-3 py-2.5 text-[0.7rem] font-bold uppercase leading-[1.4] tracking-[0.08em] text-(--color-ink)">
          {{ photo.caption }}
        </figcaption>
        <button
          class="photo-tile__trigger absolute inset-0 z-10 block w-full border-0 bg-transparent p-0"
          type="button"
          :aria-label="`Открыть фото во весь экран: ${photo.caption}`"
          @click="openPhoto(index, $event)"
        >
          <span class="photo-tile__hint absolute right-3 top-3 border border-(--color-ink) bg-(--color-paper) px-2.5 py-1.5 font-[Segoe_UI,Arial,sans-serif] text-[0.65rem] font-[760] uppercase tracking-[0.1em] text-(--color-ink)">Открыть</span>
        </button>
      </figure>
    </section>

    <dialog
      v-if="activePhoto"
      ref="photo-dialog"
      class="fixed inset-0 z-[60] m-0 hidden h-dvh max-h-none w-screen max-w-none border-0 bg-(--color-ink) p-0 text-(--color-paper) open:grid open:grid-rows-[auto_minmax(0,1fr)_auto]"
      aria-label="Просмотр фотографии производства"
      @click="handlePhotoBackdropClick"
      @close="finishClosingPhoto"
      @keydown.left="shiftActivePhoto(-1)"
      @keydown.right="shiftActivePhoto(1)"
    >
      <div class="flex items-center justify-between gap-4 border-b border-(--color-line-light) px-5 py-3">
        <p class="mb-0 font-[Segoe_UI,Arial,sans-serif] text-[0.7rem] font-[760] uppercase tracking-[0.1em] text-(--color-paper)/80">
          Кадр {{ (activePhotoIndex ?? 0) + 1 }} из {{ photos.length }}
        </p>
        <button
          ref="close-photo-button"
          class="grid size-11 shrink-0 place-items-center border border-(--color-paper) bg-transparent text-2xl leading-none text-(--color-paper) transition-colors hover:border-(--color-copper) hover:bg-(--color-copper) hover:text-(--color-paper)"
          type="button"
          aria-label="Закрыть просмотр фотографии"
          @click="closePhoto"
        >×</button>
      </div>

      <div class="relative grid min-h-0 place-items-center px-16 py-4 max-[640px]:px-4" @click.self="closePhoto">
        <!--
          Просмотрщик тянет исходник из `public/images`, а не вариант `/_ipx/`:
          диалог живёт под `v-if`, его разметки нет в пререндеренном HTML, поэтому
          `scripts/generate-static-images.mjs` не создал бы для него файлы.
          Оригинал заодно и есть та самая «полная» версия кадра.
        -->
        <img
          :key="activePhoto.image"
          :src="activePhoto.image"
          :alt="activePhoto.alt"
          :width="activePhoto.width"
          :height="activePhoto.height"
          class="max-h-[calc(100dvh-172px)] w-auto max-w-full object-contain max-[640px]:max-h-[calc(100dvh-196px)]"
          loading="eager"
          decoding="async"
        />

        <button
          class="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center border border-(--color-paper) bg-[rgb(32_35_31/70%)] text-xl leading-none text-(--color-paper) transition-colors hover:border-(--color-copper) hover:bg-(--color-copper) max-[640px]:bottom-3 max-[640px]:left-3 max-[640px]:top-auto max-[640px]:translate-y-0"
          type="button"
          aria-label="Предыдущее фото"
          @click="shiftActivePhoto(-1)"
        >‹</button>
        <button
          class="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center border border-(--color-paper) bg-[rgb(32_35_31/70%)] text-xl leading-none text-(--color-paper) transition-colors hover:border-(--color-copper) hover:bg-(--color-copper) max-[640px]:bottom-3 max-[640px]:right-3 max-[640px]:top-auto max-[640px]:translate-y-0"
          type="button"
          aria-label="Следующее фото"
          @click="shiftActivePhoto(1)"
        >›</button>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-4 border-t border-(--color-line-light) px-5 py-4">
        <p class="mb-0 max-w-[760px] font-[Segoe_UI,Arial,sans-serif] text-[0.8rem] font-[760] uppercase leading-[1.5] tracking-[0.08em] text-(--color-paper)">
          {{ activePhoto.caption }}
        </p>
        <a
          class="border border-(--color-paper) px-4 py-2.5 font-[Segoe_UI,Arial,sans-serif] text-[0.72rem] font-[760] uppercase tracking-[0.1em] text-(--color-paper) no-underline transition-colors hover:border-(--color-copper) hover:bg-(--color-copper)"
          :href="activePhoto.image"
          target="_blank"
          rel="noopener"
        >Файл {{ activePhoto.width }}×{{ activePhoto.height }}</a>
      </div>
    </dialog>
  </main>
</template>

<style scoped>
.photo-tile__trigger {
  cursor: zoom-in;
}

.photo-tile__hint {
  opacity: 0;
  translate: 0 -6px;
  transition:
    opacity var(--motion-duration-ui) var(--motion-ease-out),
    translate var(--motion-duration-ui) var(--motion-ease-out);
}

.photo-tile:hover .photo-tile__hint,
.photo-tile__trigger:focus-visible .photo-tile__hint {
  opacity: 1;
  translate: 0 0;
}

/* Глобальный :active-скейл кнопки растянул бы оверлей на всю плитку. */
.photo-tile__trigger:active {
  scale: none;
}

@media (prefers-reduced-motion: reduce) {
  .photo-tile__hint {
    translate: none;
    transition: none;
  }
}
</style>
