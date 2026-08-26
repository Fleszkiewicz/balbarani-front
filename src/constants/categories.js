// Slugs de todas las categorías del catálogo.
// Estos valores deben coincidir exactamente con los slugs
// generados automáticamente por el backend (slugify del name).
export const CATEGORY_SLUGS = {
    HELADO_ARTESANAL: 'helado-artesanal',   // ← caso especial: abre configurador de sabores
    LINEA_YAS: 'linea-yas',
    POSTRES_HELADOS: 'postres-helados-valvarani',
    BALDES_FAMILIARES: 'baldes-familiares-valvarani',
    PALETAS_HELADAS: 'paletas-heladas-valvarani',
    GIO_FRUTAS: 'gio-frutas-congeladas',
    POSTRES: 'postres',
    PROMOCIONES: 'promociones',
    EXTRAS: 'extras',
}

// Tipos de card de producto.
// ARTISAN_ICE_CREAM: abre ArtisanIceCreamConfigModal en vez de agregar directo al carrito.
// DEFAULT: agrega directo al carrito.
export const PRODUCT_CARD_TYPES = {
    ARTISAN_ICE_CREAM: 'artisan-ice-cream',
    DEFAULT: 'default',
}
