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

  return {
    listReviews: () => $fetch<Review[]>('/api/reviews', { baseURL: apiBase }),
    getReview: (id: number) => $fetch<Review>(`/api/reviews/${id}`, { baseURL: apiBase }),
    createReview: (payload: CreateReviewPayload) =>
      $fetch<Review>('/api/reviews', {
        baseURL: apiBase,
        method: 'POST',
        body: payload,
      }),
    updateReview: (id: number, payload: UpdateReviewPayload) =>
      $fetch<Review>(`/api/reviews/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        body: payload,
      }),
    deleteReview: (id: number) =>
      $fetch<void>(`/api/reviews/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
      }),
  }
}
