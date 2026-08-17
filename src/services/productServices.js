import axios from 'axios'

const API_URL = import.meta.env.VITE_BACKEND_URL + '/products'

axios.defaults.withCredentials = true

//servicio para obtener productos, con filtros opcionales por categoria/subcategoria
export const getAllProductsService = async (categorySlug, subcategorySlug) => {
    try {
        const params = {}
        if (categorySlug) params.category = categorySlug
        if (subcategorySlug) params.subcategory = subcategorySlug

        const response = await axios.get(API_URL, { params })
        return response.data
    } catch (error) {
        throw new Error('Error al obtener los productos', {
            cause: error,
        })
    }
}

//servicio para obtener un producto por id
export const getProductByIdService = async (productId) => {
    try {
        const response = await axios.get(`${API_URL}/${productId}`)
        return response.data
    } catch (error) {
        throw new Error('Error al obtener el producto', {
            cause: error,
        })
    }
}