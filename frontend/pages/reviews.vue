<script setup lang="ts">
import type { CreateReviewPayload, Review } from '~/composables/useApi'

definePageMeta({
  path: '/otzyvy',
})

const ratingOptions = [5, 4, 3, 2, 1]
const starOptions = [1, 2, 3, 4, 5]
const ratingSourceUrl = 'https://pilorama-razbegaevo.clients.site/#rating'
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
    <section class="reviews-masthead">
      <div class="reviews-masthead__copy">
        <h1>Отзывы о пилораме в Разбегаево</h1>
        <p>
          На Яндекс Картах указаны рейтинг 4,6 из 5 и 12 отзывов.
          <a class="text-link" :href="ratingSourceUrl" target="_blank" rel="noopener">
            Источник рейтинга
          </a>
        </p>
      </div>

      <figure>
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

    <section class="reviews-workspace">
      <section class="reviews-stream" aria-labelledby="reviews-list-title">
        <header class="reviews-stream__head">
          <div>
            <h2 id="reviews-list-title">Отзывы посетителей сайта</h2>
          </div>
          <button
            class="button button--outline"
            type="button"
            :disabled="isLoading"
            @click="loadReviews"
          >
            {{ isLoading ? 'Обновляем данные' : 'Обновить отзывы' }}
          </button>
        </header>

        <p
          v-if="feedback.message"
          class="form-feedback"
          :class="`form-feedback--${feedback.type}`"
          role="status"
        >
          {{ feedback.message }}
        </p>

        <p v-if="isLoading" class="review-status">
          Загружаем отзывы.
        </p>

        <p v-else-if="hasLoaded && !reviews.length" class="review-status">
          Опубликованных отзывов пока нет.
        </p>

        <p v-else-if="!hasLoaded" class="review-status">
          Отзывы сейчас недоступны.
        </p>

        <div v-else class="reviews-list">
          <article v-for="review in reviews" :key="review.id" class="public-review">
            <header class="public-review__head">
              <div>
                <div class="public-review__stars" :aria-label="ratingLabel(review.rating)">
                  <span
                    v-for="rating in starOptions"
                    :key="rating"
                    :class="{ 'is-muted': rating > review.rating }"
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

      <aside class="reviews-side" aria-label="Форма отзыва и сводка">
        <section class="review-form-panel">
          <h2>Расскажите о своей покупке</h2>
          <p>
            Укажите материал и кратко опишите свой опыт покупки.
          </p>

          <form class="review-form" @submit.prevent="submitReview">
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

            <fieldset class="rating-fieldset">
              <legend>Оценка</legend>
              <div class="rating-input">
                <label
                  v-for="rating in ratingOptions"
                  :key="rating"
                  :class="{ 'is-active': form.rating === rating }"
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
              class="button button--signal"
              type="submit"
              :disabled="isSubmitting || !canSubmitReview"
            >
              {{ isSubmitting ? 'Отправляем отзыв' : 'Опубликовать отзыв' }}
            </button>
          </form>
        </section>

        <section v-if="reviews.length" class="review-scoreboard">
          <div class="review-scoreboard__value">{{ averageRating }}</div>
          <p>{{ reviews.length }} отзывов опубликовано на сайте.</p>

          <div class="rating-bars" aria-label="Распределение оценок">
            <div v-for="bar in ratingBars" :key="bar.rating" class="rating-bar">
              <span>{{ bar.rating }}</span>
              <div><i :style="{ width: `${bar.percent}%` }" /></div>
              <strong>{{ bar.count }}</strong>
            </div>
          </div>
        </section>
      </aside>
    </section>

  </main>
</template>
