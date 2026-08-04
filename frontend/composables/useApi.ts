/**
 * Ответ проверки работоспособности backend-сервиса
 */
export interface Health {
  status: string
  service: string
}

/**
 * Отзыв покупателя, возвращаемый backend API
 */
export interface Review {
  id: number
  authorName: string
  text: string
  rating: number
  createdAt: string
  updatedAt: string
}

/**
 * Полоса распределения оценок, рассчитанная backend API
 */
export interface ReviewRatingBar {
  rating: number
  count: number
  percent: number
}

/**
 * Сводка отзывов, рассчитанная backend API
 */
export interface ReviewSummary {
  totalCount: number
  averageRating: string | null
  ratingBars: ReviewRatingBar[]
}

/**
 * Публичные данные страницы отзывов
 */
export interface PublicReviews {
  reviews: Review[]
  summary: ReviewSummary
  ratingOptions: number[]
  reviewTextLimit: number
  selectedRating: number | null
  sort: ReviewSort
}

export type ReviewSort = 'newest' | 'highest' | 'lowest'

/**
 * Параметры публичной выборки отзывов
 */
export interface PublicReviewsQuery {
  rating?: number
  sort?: ReviewSort
}

/**
 * Данные для создания отзыва
 */
export interface CreateReviewPayload {
  authorName: string
  text: string
  rating: number
}

/**
 * Данные для изменения отзыва
 */
export interface UpdateReviewPayload {
  authorName?: string
  text?: string
  rating?: number
}

/**
 * Ответ проверки админской авторизации
 */
export interface AdminSession {
  authenticated: boolean
}

/**
 * Возвращает базовый URL backend-сервиса из runtime-конфигурации
 * @note значение переопределяется переменной окружения `NUXT_PUBLIC_API_BASE`
 * @returns базовый URL backend-сервиса
 */
export function useApiBase(): string {
  return useRuntimeConfig().public.apiBase
}

/**
 * Запрашивает состояние работоспособности backend-сервиса
 * @note выполняется на этапе генерации (SSG) и повторно при гидрации на клиенте
 * @returns асинхронный ресурс с состоянием сервиса
 */
export function useHealth() {
  return useFetch<Health>('/api/health', {
    baseURL: useApiBase(),
  })
}

/**
 * Возвращает методы клиентской работы с отзывами через backend API
 * @returns CRUD-методы отзывов
 */
export function useReviewsApi() {
  const apiBase = useApiBase()
  const adminHeaders = (authorization: string) => ({
    authorization,
  })

  return {
    verifyAdminSession: (authorization: string) =>
      $fetch<AdminSession>('/api/admin/session', {
        baseURL: apiBase,
        headers: adminHeaders(authorization),
      }),
    listReviews: () => $fetch<Review[]>('/api/reviews', { baseURL: apiBase }),
    listPublicReviews: (query?: PublicReviewsQuery) =>
      $fetch<PublicReviews>('/api/reviews/public', {
        baseURL: apiBase,
        query,
      }),
    getReview: (id: number) => $fetch<Review>(`/api/reviews/${id}`, { baseURL: apiBase }),
    createReview: (payload: CreateReviewPayload) =>
      $fetch<Review>('/api/reviews', {
        baseURL: apiBase,
        method: 'POST',
        body: payload,
      }),
    updateReview: (id: number, payload: UpdateReviewPayload, authorization: string) =>
      $fetch<Review>(`/api/reviews/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: adminHeaders(authorization),
        body: payload,
      }),
    deleteReview: (id: number, authorization: string) =>
      $fetch<void>(`/api/reviews/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: adminHeaders(authorization),
      }),
  }
}
