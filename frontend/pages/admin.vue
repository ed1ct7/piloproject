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
    <section class="border-b border-[#171916] bg-[#d8d2c6] px-[clamp(18px,4vw,64px)] pb-[42px] pt-16">
      <div class="mx-auto w-[min(1080px,100%)]">
        <p class="mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em] uppercase">Админка</p>
        <h1>Отзывы</h1>
        <p>Служебный раздел для владельца пилорамы.</p>
      </div>
    </section>

    <section class="px-[clamp(18px,4vw,64px)] pb-[90px] pt-[54px]">
      <div class="mx-auto w-[min(980px,100%)]">
        <section
          v-if="!isAuthenticated"
          class="border border-[#171916] bg-[#f5f2eb] max-[840px]:grid-cols-1 max-[560px]:p-[18px] grid grid-cols-[0.45fr_0.55fr] gap-8 p-7"
          aria-labelledby="admin-login-title"
        >
          <div class="[&_p]:text-[#393d37]">
            <h2 id="admin-login-title">Вход администратора</h2>
            <p>После входа откроется список отзывов.</p>
          </div>

          <div class="min-w-0">
            <p
              v-if="feedback.message"
              class="mb-[22px] mt-0 border border-[#171916] px-[18px] py-4 leading-[1.55]"
              :class="feedback.type === 'success' ? 'border-[#1f3a2f] bg-[#dfe8df] text-[#13251e]' : 'border-[#a53e10] bg-[#f4d9ca] text-[#6a290d]'"
              role="status"
            >
              {{ feedback.message }}
            </p>

            <form
              class="mt-7 grid gap-[18px] [&>label]:grid [&>label]:gap-2 [&>label]:font-[Segoe_UI,Arial,sans-serif] [&>label]:font-bold [&>label>input]:min-h-12 [&>label>input]:w-full [&>label>input]:min-w-0 [&>label>input]:border [&>label>input]:border-[#171916] [&>label>input]:bg-[#f5f2eb] [&>label>input]:px-3 [&>label>input]:py-[11px] [&>label>input]:text-[#171916] [&>label>input:focus]:border-[#d65a1f] [&>label>input:focus]:outline [&>label>input:focus]:outline-[3px] [&>label>input:focus]:outline-offset-2 [&>label>input:focus]:outline-[#d65a1f] [&>label>textarea]:min-h-[130px] [&>label>textarea]:w-full [&>label>textarea]:min-w-0 [&>label>textarea]:resize-y [&>label>textarea]:border [&>label>textarea]:border-[#171916] [&>label>textarea]:bg-[#f5f2eb] [&>label>textarea]:p-3 [&>label>textarea]:leading-[1.5] [&>label>textarea]:text-[#171916] [&>label>textarea:focus]:border-[#d65a1f] [&>label>textarea:focus]:outline [&>label>textarea:focus]:outline-[3px] [&>label>textarea:focus]:outline-offset-2 [&>label>textarea:focus]:outline-[#d65a1f]"
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
                class="inline-flex min-h-12 cursor-pointer items-center justify-center border border-[#171916] px-[18px] py-3 text-center font-[Segoe_UI,Arial,sans-serif] font-[760] leading-[1.1] no-underline transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 border-[#d65a1f] bg-[#d65a1f] text-[#fffdf7] hover:border-[#a53e10] hover:bg-[#a53e10]"
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
            class="max-[840px]:grid-cols-1 mb-7 grid grid-cols-[1fr_auto] items-end gap-6"
            aria-label="Панель модерации"
          >
            <div>
              <p class="mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em] uppercase">Отзывы</p>
              <h2>{{ reviewsCountLabel }}</h2>
              <p>Проверьте новые сообщения и оставьте только актуальные отзывы покупателей.</p>
            </div>

            <div class="flex flex-wrap gap-3">
              <button
                class="inline-flex min-h-12 cursor-pointer items-center justify-center border border-[#171916] px-[18px] py-3 text-center font-[Segoe_UI,Arial,sans-serif] font-[760] leading-[1.1] no-underline transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 bg-[#f5f2eb] text-[#171916] hover:bg-[#171916] hover:text-[#fffdf7]"
                type="button"
                :disabled="isLoadingReviews"
                @click="loadReviews"
              >
                Обновить
              </button>
              <button
                class="inline-flex min-h-12 cursor-pointer items-center justify-center border border-[#171916] px-[18px] py-3 text-center font-[Segoe_UI,Arial,sans-serif] font-[760] leading-[1.1] no-underline transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 border-[#1f3a2f] bg-[#1f3a2f] text-[#fffdf7] hover:border-[#13251e] hover:bg-[#13251e]"
                type="button"
                @click="logout()"
              >
                Выйти
              </button>
            </div>
          </section>

          <p
            v-if="feedback.message"
            class="mb-[22px] mt-0 border border-[#171916] px-[18px] py-4 leading-[1.55]"
            :class="feedback.type === 'success' ? 'border-[#1f3a2f] bg-[#dfe8df] text-[#13251e]' : 'border-[#a53e10] bg-[#f4d9ca] text-[#6a290d]'"
            role="status"
          >
            {{ feedback.message }}
          </p>

          <p
            v-if="isLoadingReviews"
            class="mb-[22px] mt-0 border border-[#171916] px-[18px] py-4 leading-[1.55] bg-[#f5f2eb]"
          >
            Загружаем отзывы...
          </p>

          <div
            v-else-if="!reviews.length"
            class="border border-[#171916] bg-[#f5f2eb] text-[#393d37] p-6"
          >
            Отзывов пока нет.
          </div>

          <div
            v-else
            class="border-b border-[#171916] grid gap-4"
          >
            <article
              v-for="review in reviews"
              :key="review.id"
              class="border border-[#171916] bg-[#f5f2eb] py-7 max-[560px]:p-[18px] p-6 [&>p]:mb-0 [&>p]:max-w-[760px] [&>p]:text-[#393d37] [&>p]:leading-[1.65] [&_time]:shrink-0 [&_time]:font-[Segoe_UI,Arial,sans-serif] [&_time]:text-[0.8125rem] [&_time]:leading-[1.4] [&_time]:text-[#393d37]"
            >
              <header class="max-[560px]:grid mb-[18px] flex justify-between gap-[18px]">
                <div>
                  <div
                    class="mb-2.5 flex gap-0.5 leading-none text-[#d65a1f]"
                    :aria-label="ratingLabel(review.rating)"
                  >
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

              <form
                v-if="editingId === review.id"
                class="mt-7 grid gap-[18px] [&>label]:grid [&>label]:gap-2 [&>label]:font-[Segoe_UI,Arial,sans-serif] [&>label]:font-bold [&>label>input]:min-h-12 [&>label>input]:w-full [&>label>input]:min-w-0 [&>label>input]:border [&>label>input]:border-[#171916] [&>label>input]:bg-[#f5f2eb] [&>label>input]:px-3 [&>label>input]:py-[11px] [&>label>input]:text-[#171916] [&>label>input:focus]:border-[#d65a1f] [&>label>input:focus]:outline [&>label>input:focus]:outline-[3px] [&>label>input:focus]:outline-offset-2 [&>label>input:focus]:outline-[#d65a1f] [&>label>textarea]:min-h-[130px] [&>label>textarea]:w-full [&>label>textarea]:min-w-0 [&>label>textarea]:resize-y [&>label>textarea]:border [&>label>textarea]:border-[#171916] [&>label>textarea]:bg-[#f5f2eb] [&>label>textarea]:p-3 [&>label>textarea]:leading-[1.5] [&>label>textarea]:text-[#171916] [&>label>textarea:focus]:border-[#d65a1f] [&>label>textarea:focus]:outline [&>label>textarea:focus]:outline-[3px] [&>label>textarea:focus]:outline-offset-2 [&>label>textarea:focus]:outline-[#d65a1f]"
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

                <div class="max-[560px]:justify-between flex gap-2 [&_input]:absolute [&_input]:size-px [&_input]:opacity-0 [&_label]:relative [&_label]:grid [&_label]:h-[42px] [&_label]:w-[46px] [&_label]:cursor-pointer [&_span]:grid [&_span]:h-full [&_span]:w-full [&_span]:place-items-center [&_span]:border [&_span]:border-[#171916] [&_span]:bg-[#f5f2eb] [&_span]:font-[Segoe_UI,Arial,sans-serif] [&_span]:font-[760] [&_label:hover>span]:border-[#d65a1f] [&_label:hover>span]:bg-[#d65a1f] [&_label:hover>span]:text-[#fffdf7]" aria-label="Оценка">
                  <label
                    v-for="rating in ratingOptions"
                    :key="rating"
                    :class="editForm.rating === rating ? '[&>span]:border-[#d65a1f] [&>span]:bg-[#d65a1f] [&>span]:text-[#fffdf7]' : ''"
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

                <div class="mt-[18px] flex flex-wrap gap-3">
                  <button
                    class="inline-flex min-h-12 cursor-pointer items-center justify-center border border-[#171916] px-[18px] py-3 text-center font-[Segoe_UI,Arial,sans-serif] font-[760] leading-[1.1] no-underline transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 border-[#d65a1f] bg-[#d65a1f] text-[#fffdf7] hover:border-[#a53e10] hover:bg-[#a53e10]"
                    type="submit"
                    :disabled="isSaving || !canSaveReview"
                  >
                    {{ isSaving ? 'Сохраняем...' : 'Сохранить' }}
                  </button>
                  <button
                    class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#1f3a2f] no-underline transition-colors duration-150 hover:text-[#d65a1f] disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    @click="cancelEditing"
                  >
                    Отмена
                  </button>
                </div>
              </form>

              <template v-else>
                <p>{{ review.text }}</p>

                <div class="mt-[18px] flex flex-wrap gap-3">
                  <button
                    class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#1f3a2f] no-underline transition-colors duration-150 hover:text-[#d65a1f] disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    @click="startEditing(review)"
                  >
                    Изменить
                  </button>
                  <button
                    class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#1f3a2f] no-underline transition-colors duration-150 hover:text-[#d65a1f] disabled:cursor-not-allowed disabled:opacity-50 text-[#8b2d12]"
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
