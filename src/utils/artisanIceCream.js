import { CATEGORY_SLUGS, PRODUCT_CARD_TYPES } from '../constants/categories.js'

const PORTION_LIMITS = [
    { pattern: /1\s*kg/i, max: 4 },
    { pattern: /3\s*\/\s*4/i, max: 4 },
    { pattern: /1\s*\/\s*2/i, max: 3 },
    { pattern: /1\s*\/\s*4/i, max: 2 },
]

export const getMaxFlavorPortions = (productName = '') => {
    const match = PORTION_LIMITS.find(({ pattern }) => pattern.test(productName))
    return match?.max ?? 4
}

export const getProductCardType = (product, categorySlug) => {
    // Si el producto pertenece a "Helados Artesanales" y es de tipo 'flavor',
    // usa la card especial que abre el configurador de sabores.
    if (
        categorySlug === CATEGORY_SLUGS.HELADO_ARTESANAL &&
        product?.inventoryType === 'flavor'
    ) {
        return PRODUCT_CARD_TYPES.ARTISAN_ICE_CREAM
    }
    // Para todas las demás categorías, card normal con "Agregar al carrito".
    return PRODUCT_CARD_TYPES.DEFAULT
}

export const isArtisanIceCreamProduct = (product, categorySlug) =>
    getProductCardType(product, categorySlug) ===
    PRODUCT_CARD_TYPES.ARTISAN_ICE_CREAM

export const buildFlavorQuantities = (flavors = []) =>
    Object.fromEntries(flavors.map((flavor) => [flavor.name, 0]))

export const getTotalSelectedPortions = (flavorQuantities = {}) =>
    Object.values(flavorQuantities).reduce((sum, qty) => sum + qty, 0)

export const isFlavorConfigurationValid = (productName, flavorQuantities) => {
    const max = getMaxFlavorPortions(productName)
    return getTotalSelectedPortions(flavorQuantities) === max
}

export const buildConfigurationPayload = (flavorQuantities) => {
    const flavors = Object.entries(flavorQuantities)
        .filter(([, qty]) => qty > 0)
        .map(([name, quantity]) => ({ name, quantity }))

    return { flavors, extras: [] }
}

export const calculateConfiguredUnitTotal = (basePrice, configuration) => {
    const extrasTotal = (configuration?.extras || []).reduce(
        (sum, extra) => sum + extra.price * extra.quantity,
        0,
    )
    return basePrice + extrasTotal
}

export const getCartLineKey = (productId, configuration = null) => {
    if (!configuration) return `${productId}-default`
    return `${productId}-${JSON.stringify(configuration)}`
}

export const formatFlavorSummary = (configuration) => {
    if (!configuration?.flavors?.length) return null
    return configuration.flavors
        .map(({ name, quantity }) => `${name} x${quantity}`)
        .join(', ')
}

export const formatExtrasSummary = (configuration) => {
    if (!configuration?.extras?.length) return null
    return configuration.extras
        .map(({ name, quantity }) => `${name} x${quantity}`)
        .join(', ')
}
