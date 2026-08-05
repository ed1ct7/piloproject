import { priceListProducts, type PriceListProduct } from '~/utils/products'

export interface CartItem {
  productId: string
  quantity: number
}

export interface CartProductItem extends CartItem {
  product: PriceListProduct
}

const cartStorageKey = 'pilorama-cart-v1'
const productIds = new Set(priceListProducts.map((product) => product.id))

function normalizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) {
    return []
  }

  const quantities = new Map<string, number>()

  for (const item of value) {
    if (!item || typeof item !== 'object') {
      continue
    }

    const productId = 'productId' in item ? item.productId : undefined
    const quantity = 'quantity' in item ? item.quantity : undefined

    if (typeof productId !== 'string' || !productIds.has(productId) || typeof quantity !== 'number' || !Number.isFinite(quantity)) {
      continue
    }

    const normalizedQuantity = Math.floor(quantity)
    if (normalizedQuantity > 0) {
      quantities.set(productId, (quantities.get(productId) ?? 0) + normalizedQuantity)
    }
  }

  return Array.from(quantities, ([productId, quantity]) => ({ productId, quantity }))
}

export function useCart() {
  const items = useState<CartItem[]>('cart-items', () => [])
  const initialized = useState<boolean>('cart-initialized', () => false)

  if (import.meta.client) {
    onMounted(() => {
      if (initialized.value) {
        return
      }

      try {
        const savedCart = localStorage.getItem(cartStorageKey)
        items.value = savedCart ? normalizeCart(JSON.parse(savedCart)) : []
      }
      catch {
        items.value = []
      }

      initialized.value = true
    })

    watch(
      items,
      (value: CartItem[]) => {
        if (!initialized.value) {
          return
        }

        try {
          localStorage.setItem(cartStorageKey, JSON.stringify(value))
        }
        catch {
          // Корзина продолжает работать в памяти, если localStorage недоступен.
        }
      },
      { deep: true },
    )
  }

  const detailedItems = computed<CartProductItem[]>(() =>
    items.value.flatMap((item) => {
      const product = priceListProducts.find((candidate) => candidate.id === item.productId)
      return product ? [{ ...item, product }] : []
    }),
  )

  const totalQuantity = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0),
  )

  const subtotal = computed(() =>
    detailedItems.value.reduce((total: number, item: CartProductItem) => total + item.product.price * item.quantity, 0),
  )

  function addProduct(productId: string) {
    if (!productIds.has(productId)) {
      return
    }

    const existingItem = items.value.find((item) => item.productId === productId)
    if (existingItem) {
      existingItem.quantity += 1
      return
    }

    items.value.push({ productId, quantity: 1 })
  }

  function setQuantity(productId: string, quantity: number) {
    const item = items.value.find((candidate) => candidate.productId === productId)
    if (!item || !Number.isFinite(quantity)) {
      return
    }

    const normalizedQuantity = Math.floor(quantity)
    if (normalizedQuantity <= 0) {
      removeProduct(productId)
      return
    }

    item.quantity = normalizedQuantity
  }

  function increment(productId: string) {
    const item = items.value.find((candidate) => candidate.productId === productId)
    if (item) {
      item.quantity += 1
    }
  }

  function decrement(productId: string) {
    const item = items.value.find((candidate) => candidate.productId === productId)
    if (item) {
      setQuantity(productId, item.quantity - 1)
    }
  }

  function removeProduct(productId: string) {
    items.value = items.value.filter((item) => item.productId !== productId)
  }

  function clearCart() {
    items.value = []
  }

  return {
    items: readonly(items),
    initialized: readonly(initialized),
    detailedItems,
    totalQuantity,
    subtotal,
    addProduct,
    setQuantity,
    increment,
    decrement,
    removeProduct,
    clearCart,
  }
}
