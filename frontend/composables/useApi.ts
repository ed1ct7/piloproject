/**
 * Ответ проверки работоспособности backend-сервиса
 */
export interface Health {
  status: string
  service: string
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
