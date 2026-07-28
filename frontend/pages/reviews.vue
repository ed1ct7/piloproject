<script setup lang="ts">
import type { CreateReviewPayload, Review, UpdateReviewPayload } from '~/composables/useApi'

definePageMeta({
  path: '/otzyvy',
})

type ReviewItem = Review & {
  isFallback?: boolean
}

const fallbackReviews: ReviewItem[] = [
  {
    id: -1,
    authorName: 'Анна',
    text: 'Заказывали доску для каркаса. Материал подобрали быстро, по размерам все совпало, отгрузка прошла без суеты.',
    rating: 5,
    createdAt: '2026-01-18T10:00:00Z',
    updatedAt: '2026-01-18T10:00:00Z',
    isFallback: true,
  },
  {
    id: -2,
    authorName: 'Игорь',
    text: 'Понравилось, что можно было на месте выбрать брус и сразу обсудить доставку. По цене все понятно.',
    rating: 5,
    createdAt: '2026-01-12T10:00:00Z',
    updatedAt: '2026-01-12T10:00:00Z',
    isFallback: true,
  },
  {
    id: -3,
    authorName: 'Марина',
    text: 'Брали заборную доску для участка. Быстро подготовили объем, помогли с машиной, материал аккуратный.',
    rating: 5,
    createdAt: '2025-12-21T10:00:00Z',
    updatedAt: '2025-12-21T10:00:00Z',
    isFallback: true,
  },
]

const trustPoints = [
  {
    title: 'Качество распила',
    text: 'В отзывах чаще всего упоминают ровную геометрию, нормальный подбор партии и соответствие заявленным размерам.',
  },
  {
    title: 'Понятная покупка',
    text: 'Покупателям важны прозрачная цена, возможность выбрать материал на месте и быстрый ответ по наличию.',
  },
  {
    title: 'Отгрузка без затяжек',
    text: 'Для частной стройки критичны сроки, поэтому отдельно показываем скорость подготовки заказа и помощь с доставкой.',
  },
]

const ratingOptions = [5, 4, 3, 2, 1]
const starOptions = [1, 2, 3, 4, 5]
const { listReviews, createReview, updateReview, deleteReview } = useReviewsApi()

const reviews = ref<Review[]>([])
const hasLoadedFromApi = ref(false)
const isLoading = ref(false)
const isSubmitting = ref(false)
const editingId = ref<number | null>(null)
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
const editForm = reactive<CreateReviewPayload>({
  authorName: '',
  text: '',
  rating: 5,
})

const visibleReviews = computed<ReviewItem[]>(() => {
  if (hasLoadedFromApi.value) {
    return reviews.value
  }

  return fallbackReviews
})

const averageRating = computed(() => {
  if (!visibleReviews.value.length) {
    return '5,0'
  }

  const sum = visibleReviews.value.reduce((total: number, review: ReviewItem) => total + review.rating, 0)

  return (sum / visibleReviews.value.length).toFixed(1).replace('.', ',')
})

const reviewStats = computed(() => [
  {
    value: averageRating.value,
    label: 'средняя оценка',
  },
  {
    value: String(visibleReviews.value.length || fallbackReviews.length),
    label: 'отзыва на странице',
  },
  {
    value: '1 день',
    label: 'частый срок отгрузки',
  },
])

const ratingBars = computed(() =>
  ratingOptions.map((rating) => {
    const count = visibleReviews.value.filter((review: ReviewItem) => review.rating === rating).length
    const percent = visibleReviews.value.length ? Math.round((count / visibleReviews.value.length) * 100) : 0

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

const canSubmitEdit = computed(
  () => Boolean(editForm.authorName.trim()) && Boolean(editForm.text.trim()) && isValidRating(editForm.rating),
)

useSeoMeta({
  title: 'Отзывы о пилораме в Разбегаево',
  description:
    'Отзывы покупателей о пилораме в Разбегаево: качество доски и бруса, цены, доставка, скорость распила и обслуживание.',
  ogTitle: 'Отзывы о пилораме в Разбегаево',
  ogDescription: 'Реальные причины выбрать пилораму в Разбегаево: качество материала, понятная цена и быстрая отгрузка.',
  ogType: 'website',
  robots: 'index, follow',
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: 'https://pilorama-razbegaevo.clients.site/otzyvy' }],
})

useSchemaOrg([
  defineLocalBusiness({
    '@id': 'https://pilorama-razbegaevo.clients.site/#localbusiness',
    '@type': 'HomeAndConstructionBusiness',
    name: 'Пилорама Разбегаево',
    url: 'https://pilorama-razbegaevo.clients.site/otzyvy',
    image: 'https://pilorama-razbegaevo.clients.site/images/paint-shop-4.webp',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: String(fallbackReviews.length),
    },
    review: fallbackReviews.map((review) =>
      defineReview({
        author: {
          '@type': 'Person',
          name: review.authorName,
        },
        reviewBody: review.text,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5,
        },
      }),
    ),
  }),
])

onMounted(loadReviews)

async function loadReviews() {
  isLoading.value = true

  try {
    reviews.value = await listReviews()
    hasLoadedFromApi.value = true
    clearFeedback()
  }
  catch {
    hasLoadedFromApi.value = false
    setFeedback('error', 'Не удалось загрузить отзывы из базы. Пока показываем базовые отзывы.')
  }
  finally {
    isLoading.value = false
  }
}

async function submitReview() {
  const payload = normalizeCreatePayload(form)

  if (!payload) {
    setFeedback('error', 'Заполните имя, текст и оценку от 1 до 5.')
    return
  }

  isSubmitting.value = true

  try {
    const createdReview = await createReview(payload)
    hasLoadedFromApi.value = true
    reviews.value = [createdReview, ...reviews.value]
    resetForm()
    setFeedback('success', 'Спасибо, отзыв добавлен.')
  }
  catch {
    setFeedback('error', 'Не удалось добавить отзыв. Проверьте, что backend запущен и доступен.')
  }
  finally {
    isSubmitting.value = false
  }
}

function startEditing(review: ReviewItem) {
  editingId.value = review.id
  editForm.authorName = review.authorName
  editForm.text = review.text
  editForm.rating = review.rating
  clearFeedback()
}

function cancelEditing() {
  editingId.value = null
  resetEditForm()
}

async function submitEdit(review: ReviewItem) {
  const payload = normalizeUpdatePayload(editForm)

  if (!payload) {
    setFeedback('error', 'Для изменения нужны имя, текст и оценка от 1 до 5.')
    return
  }

  try {
    const updatedReview = await updateReview(review.id, payload)
    reviews.value = reviews.value.map((item: Review) => (item.id === updatedReview.id ? updatedReview : item))
    cancelEditing()
    setFeedback('success', 'Отзыв обновлен.')
  }
  catch {
    setFeedback('error', 'Не удалось обновить отзыв.')
  }
}

async function removeReview(review: ReviewItem) {
  if (import.meta.client && !window.confirm(`Удалить отзыв от ${review.authorName}?`)) {
    return
  }

  try {
    await deleteReview(review.id)
    reviews.value = reviews.value.filter((item: Review) => item.id !== review.id)
    setFeedback('success', 'Отзыв удален.')
  }
  catch {
    setFeedback('error', 'Не удалось удалить отзыв.')
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

function normalizeUpdatePayload(payload: CreateReviewPayload): UpdateReviewPayload | null {
  return normalizeCreatePayload(payload)
}

function canManageReview(review: ReviewItem) {
  return hasLoadedFromApi.value && !review.isFallback
}

function resetForm() {
  form.authorName = ''
  form.text = ''
  form.rating = 5
}

function resetEditForm() {
  editForm.authorName = ''
  editForm.text = ''
  editForm.rating = 5
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
    return 'недавно'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate)
}

function ratingLabel(value: number) {
  return `${value} из 5`
}
</script>

<template>
  <main>
    <section class="reviews-hero">
      <NuxtImg
        class="reviews-hero__image"
        src="/images/paint-shop-4.webp"
        alt="Готовые пиломатериалы на производстве в Разбегаево"
        width="1600"
        height="1200"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
        densities="1"
        format="webp"
        loading="eager"
        preload
        fetchpriority="high"
      />
      <div class="reviews-hero__shade" aria-hidden="true" />

      <div class="reviews-hero__inner">
        <p class="eyebrow">Отзывы покупателей</p>
        <h1>Что говорят о пилораме в Разбегаево</h1>
        <p>
          Собираем на странице реальные впечатления о качестве доски и бруса, скорости распила,
          цене, самовывозе и доставке по Ломоносовскому району.
        </p>

        <dl class="reviews-hero__stats" aria-label="Сводка отзывов">
          <div
            v-for="stat in reviewStats"
            :key="stat.label"
          >
            <dt>{{ stat.value }}</dt>
            <dd>{{ stat.label }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="section">
      <div class="section__inner reviews-layout">
        <section class="reviews-stream" aria-labelledby="reviews-list-title">
          <div class="reviews-stream__head">
            <div>
              <p class="eyebrow">Репутация</p>
              <h2 id="reviews-list-title">Отзывы о материале, сроках и доставке</h2>
            </div>
            <button
              class="button button--light"
              type="button"
              :disabled="isLoading"
              @click="loadReviews"
            >
              Обновить
            </button>
          </div>

          <p
            v-if="feedback.message"
            class="form-feedback"
            :class="`form-feedback--${feedback.type}`"
            role="status"
          >
            {{ feedback.message }}
          </p>

          <p
            v-if="isLoading"
            class="review-status"
          >
            Загружаем отзывы...
          </p>

          <div
            v-else-if="!visibleReviews.length"
            class="review-status"
          >
            Пока отзывов нет.
          </div>

          <div
            v-else
            class="reviews-list"
          >
            <article
              v-for="review in visibleReviews"
              :key="review.id"
              class="card public-review"
            >
              <header class="public-review__head">
                <div>
                  <div
                    class="public-review__stars"
                    :aria-label="ratingLabel(review.rating)"
                  >
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

              <form
                v-if="editingId === review.id && canManageReview(review)"
                class="review-edit"
                @submit.prevent="submitEdit(review)"
              >
                <label>
                  <span>Имя</span>
                  <input
                    v-model="editForm.authorName"
                    name="editAuthorName"
                    maxlength="80"
                    autocomplete="name"
                  >
                </label>

                <label>
                  <span>Отзыв</span>
                  <textarea
                    v-model="editForm.text"
                    name="editText"
                    rows="4"
                    maxlength="1000"
                  />
                </label>

                <div class="rating-input" aria-label="Оценка">
                  <label
                    v-for="rating in ratingOptions"
                    :key="rating"
                    :class="{ 'is-active': editForm.rating === rating }"
                  >
                    <input
                      v-model.number="editForm.rating"
                      type="radio"
                      name="editRating"
                      :value="rating"
                    >
                    <span>{{ rating }}</span>
                  </label>
                </div>

                <div class="public-review__actions">
                  <button
                    class="button button--dark"
                    type="submit"
                    :disabled="!canSubmitEdit"
                  >
                    Сохранить
                  </button>
                  <button
                    class="text-button"
                    type="button"
                    @click="cancelEditing"
                  >
                    Отмена
                  </button>
                </div>
              </form>

              <template v-else>
                <p>{{ review.text }}</p>

                <div
                  v-if="canManageReview(review)"
                  class="public-review__actions"
                >
                  <button
                    class="text-button"
                    type="button"
                    @click="startEditing(review)"
                  >
                    Изменить
                  </button>
                  <button
                    class="text-button text-button--danger"
                    type="button"
                    @click="removeReview(review)"
                  >
                    Удалить
                  </button>
                </div>
              </template>
            </article>
          </div>
        </section>

        <aside class="reviews-side" aria-label="Форма и сводка">
          <section class="review-form-panel">
            <p class="eyebrow">Ваш опыт</p>
            <h2>Оставить отзыв</h2>

            <form
              class="review-form"
              @submit.prevent="submitReview"
            >
              <label>
                <span>Имя</span>
                <input
                  v-model="form.authorName"
                  name="authorName"
                  maxlength="80"
                  autocomplete="name"
                  placeholder="Анна"
                >
              </label>

              <label>
                <span>Отзыв</span>
                <textarea
                  v-model="form.text"
                  name="text"
                  rows="5"
                  maxlength="1000"
                  placeholder="Что понравилось в материале, отгрузке или доставке"
                />
              </label>

              <div class="rating-input" aria-label="Оценка">
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

              <button
                class="button button--primary"
                type="submit"
                :disabled="isSubmitting || !canSubmitReview"
              >
                {{ isSubmitting ? 'Отправляем...' : 'Опубликовать отзыв' }}
              </button>
            </form>
          </section>

          <section class="review-scoreboard">
            <h2>Оценки</h2>
            <div class="review-scoreboard__value">
              {{ averageRating }}
            </div>

            <div class="rating-bars">
              <div
                v-for="bar in ratingBars"
                :key="bar.rating"
                class="rating-bar"
              >
                <span>{{ bar.rating }}</span>
                <div>
                  <i :style="{ width: `${bar.percent}%` }" />
                </div>
                <strong>{{ bar.count }}</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </section>

    <section class="section section--soft">
      <div class="section__inner">
        <div class="section__head">
          <div>
            <p class="eyebrow">Почему это важно</p>
            <h2>Отзывы помогают выбрать пиломатериал без догадок</h2>
          </div>
          <p>
            На странице собраны сигналы, которые важны покупателю перед заказом: качество,
            честность по цене, сроки и помощь с доставкой.
          </p>
        </div>

        <div class="grid grid--3">
          <article
            v-for="point in trustPoints"
            :key="point.title"
            class="card review-card"
          >
            <div class="review-card__rating">Покупатели отмечают</div>
            <h3>{{ point.title }}</h3>
            <p>{{ point.text }}</p>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>
