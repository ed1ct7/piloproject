<script setup lang="ts">
import type { Review, UpdateReviewPayload } from '~/composables/useApi'

const ratingOptions = [5, 4, 3, 2, 1]
const starOptions = [1, 2, 3, 4, 5]
const { verifyAdminSession, listReviews, updateReview, deleteReview } = useReviewsApi()

const credentials = reactive({
  username: '',
  password: '',
})
const editForm = reactive({
  authorName: '',
  text: '',
  rating: 5,
})
const feedback = reactive<{
  type: 'success' | 'error' | ''
  message: string
}>({
  type: '',
  message: '',
})

const reviews = ref<Review[]>([])
const authHeader = ref('')
const editingId = ref<number | null>(null)
const isAuthenticated = ref(false)
const isCheckingSession = ref(false)
const isLoadingReviews = ref(false)
const isSaving = ref(false)
const deletingId = ref<number | null>(null)

const canSubmitLogin = computed(
  () => Boolean(credentials.username.trim()) && Boolean(credentials.password),
)
const canSaveReview = computed(
  () => Boolean(editForm.authorName.trim()) && Boolean(editForm.text.trim()) && isValidRating(editForm.rating),
)
const reviewsCountLabel = computed(() => {
  const count = reviews.value.length

  if (count === 1) {
    return '1 отзыв'
  }

  if (count > 1 && count < 5) {
    return `${count} отзыва`
  }

  return `${count} отзывов`
})

useSeoMeta({
  title: 'Админка отзывов',
  description: 'Закрытая страница модерации отзывов пилорамы в Разбегаево.',
  robots: 'noindex, nofollow',
})

useHead({
  htmlAttrs: { lang: 'ru' },
})

async function submitLogin() {
  if (!canSubmitLogin.value) {
    setFeedback('error', 'Введите логин и пароль.')
    return
  }

  await verifySession(buildBasicAuthHeader(credentials.username.trim(), credentials.password))
}

async function verifySession(nextAuthHeader: string) {
  isCheckingSession.value = true

  try {
    await verifyAdminSession(nextAuthHeader)
    authHeader.value = nextAuthHeader
    isAuthenticated.value = true
    credentials.password = ''

    clearFeedback()
    await loadReviews()
  }
  catch {
    logout(false)
    setFeedback('error', 'Неверный логин или пароль администратора.')
  }
  finally {
    isCheckingSession.value = false
  }
}

async function loadReviews() {
  isLoadingReviews.value = true

  try {
    reviews.value = await listReviews()
    clearFeedback()
  }
  catch {
    setFeedback('error', 'Не удалось загрузить отзывы. Проверьте доступность backend.')
  }
  finally {
    isLoadingReviews.value = false
  }
}

function startEditing(review: Review) {
  editingId.value = review.id
  editForm.authorName = review.authorName
  editForm.text = review.text
  editForm.rating = review.rating
  clearFeedback()
}

function cancelEditing() {
  editingId.value = null
  editForm.authorName = ''
  editForm.text = ''
  editForm.rating = 5
}

async function saveReview(review: Review) {
  const payload = normalizeUpdatePayload()

  if (!payload || !authHeader.value) {
    setFeedback('error', 'Заполните имя, текст и оценку от 1 до 5.')
    return
  }

  isSaving.value = true

  try {
    const updatedReview = await updateReview(review.id, payload, authHeader.value)
    reviews.value = reviews.value.map((item: Review) => (item.id === updatedReview.id ? updatedReview : item))
    cancelEditing()
    setFeedback('success', 'Отзыв обновлен.')
  }
  catch (error) {
    handleAdminError(error, 'Не удалось обновить отзыв.')
  }
  finally {
    isSaving.value = false
  }
}

async function removeReview(review: Review) {
  if (!authHeader.value) {
    setFeedback('error', 'Сессия администратора не найдена.')
    return
  }

  if (!window.confirm(`Удалить отзыв от ${review.authorName}?`)) {
    return
  }

  deletingId.value = review.id

  try {
    await deleteReview(review.id, authHeader.value)
    reviews.value = reviews.value.filter((item: Review) => item.id !== review.id)
    setFeedback('success', 'Отзыв удален.')
  }
  catch (error) {
    handleAdminError(error, 'Не удалось удалить отзыв.')
  }
  finally {
    deletingId.value = null
  }
}

function logout(showMessage = true) {
  authHeader.value = ''
  isAuthenticated.value = false
  reviews.value = []
  cancelEditing()

  if (showMessage) {
    setFeedback('success', 'Вы вышли из админки.')
  }
}

function normalizeUpdatePayload(): UpdateReviewPayload | null {
  const authorName = editForm.authorName.trim()
  const text = editForm.text.trim()

  if (!authorName || !text || !isValidRating(editForm.rating)) {
    return null
  }

  return {
    authorName,
    text,
    rating: editForm.rating,
  }
}

function buildBasicAuthHeader(username: string, password: string) {
  const bytes = new TextEncoder().encode(`${username}:${password}`)
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return `Basic ${btoa(binary)}`
}

function handleAdminError(error: unknown, fallbackMessage: string) {
  if (isUnauthorizedError(error)) {
    logout(false)
    setFeedback('error', 'Сессия администратора истекла или пароль изменился. Войдите снова.')
    return
  }

  setFeedback('error', fallbackMessage)
}

function isUnauthorizedError(error: unknown) {
  const fetchError = error as {
    statusCode?: number
    response?: {
      status?: number
    }
  }

  return fetchError.statusCode === 401 || fetchError.response?.status === 401
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

function ratingLabel(value: number) {
  return `${value} из 5`
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
</script>

<template>
  <main>
    <section class="simple-hero admin-hero">
      <div class="simple-hero__inner">
        <p class="eyebrow">Админка</p>
        <h1>Отзывы</h1>
        <p>Служебный раздел для владельца пилорамы.</p>
      </div>
    </section>

    <section class="page-section admin-section">
      <div class="page-section__inner admin-layout">
        <section
          v-if="!isAuthenticated"
          class="card admin-login-panel"
          aria-labelledby="admin-login-title"
        >
          <div class="admin-login-panel__text">
            <h2 id="admin-login-title">Вход администратора</h2>
            <p>После входа откроется список отзывов.</p>
          </div>

          <div class="admin-login-panel__form">
            <p
              v-if="feedback.message"
              class="form-feedback"
              :class="`form-feedback--${feedback.type}`"
              role="status"
            >
              {{ feedback.message }}
            </p>

            <form
              class="review-form"
              @submit.prevent="submitLogin"
            >
              <label>
                <span>Логин</span>
                <input
                  v-model="credentials.username"
                  name="username"
                  autocomplete="username"
                  maxlength="80"
                >
              </label>

              <label>
                <span>Пароль</span>
                <input
                  v-model="credentials.password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                >
              </label>

              <button
                class="button button--primary"
                type="submit"
                :disabled="isCheckingSession || !canSubmitLogin"
              >
                {{ isCheckingSession ? 'Проверяем...' : 'Войти' }}
              </button>
            </form>
          </div>
        </section>

        <template v-else>
          <section
            class="section__head admin-toolbar"
            aria-label="Панель модерации"
          >
            <div>
              <p class="eyebrow">Отзывы</p>
              <h2>{{ reviewsCountLabel }}</h2>
              <p>Проверьте новые сообщения и оставьте только актуальные отзывы покупателей.</p>
            </div>

            <div class="admin-toolbar__actions">
              <button
                class="button button--light"
                type="button"
                :disabled="isLoadingReviews"
                @click="loadReviews"
              >
                Обновить
              </button>
              <button
                class="button button--dark"
                type="button"
                @click="logout()"
              >
                Выйти
              </button>
            </div>
          </section>

          <p
            v-if="feedback.message"
            class="form-feedback"
            :class="`form-feedback--${feedback.type}`"
            role="status"
          >
            {{ feedback.message }}
          </p>

          <p
            v-if="isLoadingReviews"
            class="review-status"
          >
            Загружаем отзывы...
          </p>

          <div
            v-else-if="!reviews.length"
            class="card admin-empty"
          >
            Отзывов пока нет.
          </div>

          <div
            v-else
            class="reviews-list admin-review-list"
          >
            <article
              v-for="review in reviews"
              :key="review.id"
              class="card public-review admin-review"
            >
              <header class="admin-review__head">
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
                v-if="editingId === review.id"
                class="review-edit"
                @submit.prevent="saveReview(review)"
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
                    rows="5"
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
                    class="button button--primary"
                    type="submit"
                    :disabled="isSaving || !canSaveReview"
                  >
                    {{ isSaving ? 'Сохраняем...' : 'Сохранить' }}
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

                <div class="public-review__actions">
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
                    :disabled="deletingId === review.id"
                    @click="removeReview(review)"
                  >
                    {{ deletingId === review.id ? 'Удаляем...' : 'Удалить' }}
                  </button>
                </div>
              </template>
            </article>
          </div>
        </template>
      </div>
    </section>
  </main>
</template>
