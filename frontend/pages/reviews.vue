<script setup lang="ts">
import type { CreateReviewPayload, Review } from '~/composables/useApi'

definePageMeta({
  path: '/otzyvy',
})

const ratingOptions = [5, 4, 3, 2, 1]
const starOptions = [1, 2, 3, 4, 5]
const { listReviews, createReview } = useReviewsApi()

// Отзывы загружаются на этапе генерации (SSG) и попадают в статический HTML,
// чтобы поисковые роботы видели их без выполнения JavaScript. Для этого backend
// должен быть доступен по `NUXT_PUBLIC_API_BASE` в момент `npm run generate`.
const {
  data: reviews,
  status: reviewsStatus,
  error: reviewsError,
  refresh: refreshReviews,
} = await useAsyncData<Review[]>('reviews', () => listReviews(), {
  default: () => [],
})

const isLoading = computed(() => reviewsStatus.value === 'pending')
const hasLoaded = computed(() => !reviewsError.value && reviewsStatus.value !== 'idle')
const isSubmitting = ref(false)
const feedback = reactive<{
  type: 'success' | 'error' | ''
  message: string
}>({
  type: '',
  message: '',
})
const form = reactive<CreateReviewPayload>({
  authorName: '',
  text: '',
  rating: 5,
})

const averageRating = computed(() => {
  if (!reviews.value.length) {
    return null
  }

  const sum = reviews.value.reduce((total: number, review: Review) => total + review.rating, 0)
  return (sum / reviews.value.length).toFixed(1).replace('.', ',')
})

const ratingBars = computed(() =>
  ratingOptions.map((rating) => {
    const count = reviews.value.filter((review: Review) => review.rating === rating).length
    const percent = reviews.value.length ? Math.round((count / reviews.value.length) * 100) : 0

    return {
      rating,
      count,
      percent,
    }
  }),
)

const canSubmitReview = computed(
  () => Boolean(form.authorName.trim()) && Boolean(form.text.trim()) && isValidRating(form.rating),
)

useSeoMeta({
  title: 'Отзывы о пилораме в Разбегаево',
  description: 'Отзывы покупателей о пилораме в Разбегаево и форма для публикации опыта покупки, самовывоза или доставки пиломатериалов.',
  ogTitle: 'Отзывы о пилораме в Разбегаево',
  ogDescription: 'Отзывы покупателей о материале, обслуживании, самовывозе и доставке.',
  ogType: 'website',
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: `${siteUrl}/otzyvy` }],
})

useSchemaOrg([
  defineWebPage({
    name: 'Отзывы о пилораме в Разбегаево',
    description: 'Отзывы покупателей о пиломатериалах и обслуживании на производственной площадке.',
  }),
])

// Если во время генерации backend был недоступен, пробуем догрузить на клиенте.
onMounted(() => {
  if (reviewsError.value) {
    loadReviews()
  }
})

async function loadReviews() {
  await refreshReviews()

  if (reviewsError.value) {
    setFeedback('error', 'Отзывы из базы сейчас недоступны, попробуйте обновить страницу позднее.')
  }
  else {
    clearFeedback()
  }
}

async function submitReview() {
  const payload = normalizeCreatePayload(form)

  if (!payload) {
    setFeedback('error', 'Заполните имя, текст и выберите оценку.')
    return
  }

  isSubmitting.value = true

  try {
    const createdReview = await createReview(payload)
    reviews.value = [createdReview, ...reviews.value]
    reviewsError.value = null
    resetForm()
    setFeedback('success', 'Спасибо, ваш отзыв успешно добавлен на страницу.')
  }
  catch {
    setFeedback('error', 'Отзыв сейчас не отправился, попробуйте повторить позднее.')
  }
  finally {
    isSubmitting.value = false
  }
}

function normalizeCreatePayload(payload: CreateReviewPayload): CreateReviewPayload | null {
  const authorName = payload.authorName.trim()
  const text = payload.text.trim()

  if (!authorName || !text || !isValidRating(payload.rating)) {
    return null
  }

  return {
    authorName,
    text,
    rating: payload.rating,
  }
}

function resetForm() {
  form.authorName = ''
  form.text = ''
  form.rating = 5
}

function setFeedback(type: 'success' | 'error', message: string) {
  feedback.type = type
  feedback.message = message
}

function clearFeedback() {
  feedback.type = ''
  feedback.message = ''
}

function isValidRating(value: number) {
  return value >= 1 && value <= 5
}

function formatDate(value: string) {
  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Дата публикации этого отзыва пока не указана'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate)
}

function ratingLabel(value: number) {
  return `Оценка ${value} из 5`
}
</script>

<template>
  <main>
    <section class="max-[840px]:grid-cols-1 mx-auto grid min-h-[540px] w-[min(1280px,100%)] grid-cols-[minmax(0,0.54fr)_minmax(0,0.46fr)] border-b border-[#171916]">
      <div class="max-[840px]:min-h-[500px] max-[560px]:min-h-0 max-[560px]:px-[18px] max-[560px]:pb-12 max-[560px]:pt-[42px] flex flex-col justify-end p-[52px]">
        <div class="max-[840px]:mb-12 max-[560px]:mb-[38px] font-[Segoe_UI,Arial,sans-serif] uppercase grid self-start gap-1.5 text-[0.8125rem] font-bold leading-[1.4] tracking-[0.035em]">
          <span>ОТЗЫВЫ / БАЗА</span>
          <span>РАЗБЕГАЕВО</span>
        </div>
        <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Опыт покупателей</p>
        <h1>Отзывы о пилораме в Разбегаево</h1>
        <p>
          Здесь публикуются сообщения покупателей о материале, обслуживании, самовывозе и
          доставке. Страница получает данные напрямую из базы и не подменяет их примерами.
        </p>
      </div>

      <figure class="relative min-h-[540px] border-l border-[#171916] max-[840px]:min-h-[500px] max-[840px]:border-l-0 max-[840px]:border-t max-[560px]:min-h-[380px] [&_figcaption]:absolute [&_figcaption]:inset-x-0 [&_figcaption]:bottom-0 [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
        <NuxtImg
          src="/images/shtabel-suhoi-doski.jpg"
          alt="Штабели сухой доски в пачках на складе пилорамы"
          width="960"
          height="1280"
          sizes="xs:100vw sm:52vw md:50vw"
          densities="1"
          format="webp"
          loading="eager"
          preload
        />
        <figcaption>Склад сухой доски на площадке</figcaption>
      </figure>
    </section>

    <section class="max-[840px]:grid-cols-1 mx-auto grid w-[min(1280px,100%)] grid-cols-[minmax(0,0.62fr)_minmax(340px,0.38fr)] border-b border-[#171916]">
      <section class="max-[840px]:border-r-0 max-[840px]:border-b max-[840px]:border-[#171916] max-[560px]:px-[18px] min-w-0 border-r border-[#171916] px-[52px] py-16" aria-labelledby="reviews-list-title">
        <header class="max-[560px]:grid max-[560px]:items-start mb-[42px] flex items-end justify-between gap-7">
          <div>
            <span class="max-[560px]:mb-[26px] max-[560px]:text-[3.2rem] font-[Segoe_UI,Arial,sans-serif] uppercase mb-[22px] inline-block text-[clamp(2rem,3vw,3.3rem)] font-bold leading-[0.9]">01</span>
            <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Опубликованные сообщения</p>
            <h2 id="reviews-list-title">Отзывы покупателей</h2>
          </div>
          <button
            class="inline-flex min-h-12 cursor-pointer items-center justify-center border border-[#171916] px-[18px] py-3 text-center font-[Segoe_UI,Arial,sans-serif] font-[760] leading-[1.1] no-underline transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent text-[#171916] hover:bg-[#171916] hover:text-[#fffdf7]"
            type="button"
            :disabled="isLoading"
            @click="loadReviews"
          >
            {{ isLoading ? 'Обновляем данные' : 'Обновить отзывы' }}
          </button>
        </header>

        <p
          v-if="feedback.message"
          class="mb-[22px] mt-0 border border-[#171916] px-[18px] py-4 leading-[1.55]"
          :class="feedback.type === 'success' ? 'border-[#1f3a2f] bg-[#dfe8df] text-[#13251e]' : 'border-[#a53e10] bg-[#f4d9ca] text-[#6a290d]'"
          role="status"
        >
          {{ feedback.message }}
        </p>

        <p v-if="isLoading" class="mb-[22px] mt-0 border border-[#171916] px-[18px] py-4 leading-[1.55] bg-[#f5f2eb]">
          Данные загружаются из базы отзывов покупателей.
        </p>

        <p v-else-if="hasLoaded && !reviews.length" class="mb-[22px] mt-0 border border-[#171916] px-[18px] py-4 leading-[1.55] bg-[#f5f2eb]">
          Опубликованных отзывов пока нет, поэтому здесь не показаны вымышленные примеры.
        </p>

        <p v-else-if="!hasLoaded" class="mb-[22px] mt-0 border border-[#171916] px-[18px] py-4 leading-[1.55] bg-[#f5f2eb]">
          После восстановления соединения подтверждённые отзывы снова появятся на странице.
        </p>

        <div v-else class="border-b border-[#171916]">
          <article v-for="review in reviews" :key="review.id" class="border-t border-[#171916] bg-transparent py-7 [&>p]:mb-0 [&>p]:max-w-[760px] [&>p]:text-[#393d37] [&>p]:leading-[1.65] [&_time]:shrink-0 [&_time]:font-[Segoe_UI,Arial,sans-serif] [&_time]:text-[0.8125rem] [&_time]:leading-[1.4] [&_time]:text-[#393d37]">
            <header class="max-[560px]:grid mb-[18px] flex justify-between gap-[18px]">
              <div>
                <div class="mb-2.5 flex gap-0.5 leading-none text-[#d65a1f]" :aria-label="ratingLabel(review.rating)">
                  <span
                    v-for="rating in starOptions"
                    :key="rating"
                    :class="rating > review.rating ? 'text-[#aaa69b]' : 'text-[#d65a1f]'"
                    aria-hidden="true"
                  >★</span>
                </div>
                <h3>{{ review.authorName }}</h3>
              </div>
              <time :datetime="review.createdAt">{{ formatDate(review.createdAt) }}</time>
            </header>
            <p>{{ review.text }}</p>
          </article>
        </div>
      </section>

      <aside class="min-w-0 bg-[#d8d2c6]" aria-label="Форма отзыва и сводка">
        <section class="max-[560px]:px-[18px] border-b border-[#171916] px-[46px] py-14">
          <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Новый отзыв</p>
          <h2>Расскажите о своей покупке</h2>
          <p>
            Опишите материал, получение заказа и важные детали обслуживания. Конкретный опыт
            помогает следующему покупателю понять условия без рекламных обещаний.
          </p>

          <form class="mt-7 grid gap-[18px] [&>label]:grid [&>label]:gap-2 [&>label]:font-[Segoe_UI,Arial,sans-serif] [&>label]:font-bold [&>label>input]:min-h-12 [&>label>input]:w-full [&>label>input]:min-w-0 [&>label>input]:border [&>label>input]:border-[#171916] [&>label>input]:bg-[#f5f2eb] [&>label>input]:px-3 [&>label>input]:py-[11px] [&>label>input]:text-[#171916] [&>label>input:focus]:border-[#d65a1f] [&>label>input:focus]:outline [&>label>input:focus]:outline-[3px] [&>label>input:focus]:outline-offset-2 [&>label>input:focus]:outline-[#d65a1f] [&>label>textarea]:min-h-[130px] [&>label>textarea]:w-full [&>label>textarea]:min-w-0 [&>label>textarea]:resize-y [&>label>textarea]:border [&>label>textarea]:border-[#171916] [&>label>textarea]:bg-[#f5f2eb] [&>label>textarea]:p-3 [&>label>textarea]:leading-[1.5] [&>label>textarea]:text-[#171916] [&>label>textarea:focus]:border-[#d65a1f] [&>label>textarea:focus]:outline [&>label>textarea:focus]:outline-[3px] [&>label>textarea:focus]:outline-offset-2 [&>label>textarea:focus]:outline-[#d65a1f]" @submit.prevent="submitReview">
            <label>
              <span>Имя</span>
              <input
                v-model="form.authorName"
                name="authorName"
                maxlength="80"
                autocomplete="name"
                placeholder="Ваше имя"
              >
            </label>

            <label>
              <span>Отзыв</span>
              <textarea
                v-model="form.text"
                name="text"
                rows="6"
                maxlength="1000"
                placeholder="Опишите материал, отгрузку или доставку"
              />
            </label>

            <fieldset class="m-0 border-0 p-0 [&_legend]:mb-2 [&_legend]:font-[Segoe_UI,Arial,sans-serif] [&_legend]:font-bold">
              <legend>Оценка</legend>
              <div class="max-[560px]:justify-between flex gap-2 [&_input]:absolute [&_input]:size-px [&_input]:opacity-0 [&_label]:relative [&_label]:grid [&_label]:h-[42px] [&_label]:w-[46px] [&_label]:cursor-pointer [&_span]:grid [&_span]:h-full [&_span]:w-full [&_span]:place-items-center [&_span]:border [&_span]:border-[#171916] [&_span]:bg-[#f5f2eb] [&_span]:font-[Segoe_UI,Arial,sans-serif] [&_span]:font-[760] [&_label:hover>span]:border-[#d65a1f] [&_label:hover>span]:bg-[#d65a1f] [&_label:hover>span]:text-[#fffdf7]">
                <label
                  v-for="rating in ratingOptions"
                  :key="rating"
                  :class="form.rating === rating ? '[&>span]:border-[#d65a1f] [&>span]:bg-[#d65a1f] [&>span]:text-[#fffdf7]' : ''"
                >
                  <input
                    v-model.number="form.rating"
                    type="radio"
                    name="rating"
                    :value="rating"
                  >
                  <span>{{ rating }}</span>
                </label>
              </div>
            </fieldset>

            <button
              class="inline-flex min-h-12 cursor-pointer items-center justify-center border border-[#171916] px-[18px] py-3 text-center font-[Segoe_UI,Arial,sans-serif] font-[760] leading-[1.1] no-underline transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 border-[#d65a1f] bg-[#d65a1f] text-[#fffdf7] hover:border-[#a53e10] hover:bg-[#a53e10]"
              type="submit"
              :disabled="isSubmitting || !canSubmitReview"
            >
              {{ isSubmitting ? 'Отправляем отзыв' : 'Опубликовать отзыв' }}
            </button>
          </form>
        </section>

        <section v-if="reviews.length" class="max-[560px]:px-[18px] border-b border-[#171916] px-[46px] py-14">
          <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Сводка базы</p>
          <div class="my-[18px] font-[Segoe_UI,Arial,sans-serif] text-[clamp(4rem,8vw,8rem)] font-[760] leading-[0.8]">{{ averageRating }}</div>
          <p>{{ reviews.length }} подтверждённых сообщений загружено на страницу.</p>

          <div class="mt-[26px] grid gap-2.5" aria-label="Распределение оценок">
            <div v-for="bar in ratingBars" :key="bar.rating" class="grid grid-cols-[20px_minmax(0,1fr)_24px] items-center gap-2.5 font-[Segoe_UI,Arial,sans-serif] text-[0.8125rem] font-semibold [&>div]:h-2 [&>div]:border [&>div]:border-[#171916] [&_i]:block [&_i]:h-full [&_i]:bg-[#d65a1f]">
              <span>{{ bar.rating }}</span>
              <div><i :style="{ width: `${bar.percent}%` }" /></div>
              <strong>{{ bar.count }}</strong>
            </div>
          </div>
        </section>
      </aside>
    </section>

    <section class="max-[840px]:grid-cols-1 max-[560px]:px-[18px] grid grid-cols-[minmax(300px,0.8fr)_minmax(320px,0.7fr)] gap-[72px] border-t border-[#171916] bg-[#d8d2c6] px-[max(24px,calc((100vw_-_1280px)/2))] py-[72px] bg-[#f5f2eb]">
      <div>
        <span class="max-[560px]:mb-[26px] max-[560px]:text-[3.2rem] font-[Segoe_UI,Arial,sans-serif] uppercase mb-[22px] inline-block text-[clamp(2rem,3vw,3.3rem)] font-bold leading-[0.9]">02</span>
        <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Принцип публикации</p>
        <h2>Только сообщения из действующей базы</h2>
      </div>
      <p>
        Мы не показываем декоративные оценки и не придумываем отзывы для заполнения страницы.
        Если база временно недоступна, интерфейс сообщает об этом прямо.
      </p>
    </section>
  </main>
</template>
