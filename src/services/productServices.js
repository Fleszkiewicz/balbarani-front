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

//servicio para crear un producto
export const createProductService = async (data) => {
    try {
        const response = await axios.post(API_URL, data)
        return response.data
    } catch (error) {
        throw new Error(
            error.response?.data?.[0]?.message ||
            error.response?.data?.message ||
            'Error al crear el producto',
            { cause: error },
        )
    }
}

//servicio para actualizar un producto
export const updateProductService = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data)
        return response.data
    } catch (error) {
        throw new Error(
            error.response?.data?.[0]?.message ||
            error.response?.data?.message ||
            'Error al actualizar el producto',
            { cause: error },
        )
    }
}

//servicio para eliminar un producto
export const deleteProductService = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`)
        return response.data
    } catch (error) {
        throw new Error(
            error.response?.data?.message || 'Error al eliminar el producto',
            { cause: error },
        )
    }
}
