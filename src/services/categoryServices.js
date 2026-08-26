import axios from 'axios'

const API_URL = import.meta.env.VITE_BACKEND_URL + '/categories'

axios.defaults.withCredentials = true

//servicio para obtener todas las categorías activas
export const getAllCategoriesService = async () => {
    try {
        const response = await axios.get(API_URL)
        return response.data
    } catch (error) {
        throw new Error('Error al obtener las categorías', {
            cause: error,
        })
    }
}

//servicio para obtener una categoría por su slug
export const getCategoryBySlugService = async (slug) => {
    try {
        const response = await axios.get(`${API_URL}/${slug}`)
        return response.data
    } catch (error) {
        throw new Error('Error al obtener la categoría', {
            cause: error,
        })
    }
}

//servicio para crear una categoria
export const createCategoryService = async (data) => {
    try {
        const response = await axios.post(API_URL, data)
        return response.data
    } catch (error) {
        throw new Error(
            error.response?.data?.message || 'Error al crear la categoría',
            { cause: error },
        )
    }
}

//servicio para actualizar una categoría 
export const updateCategoryService = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data)
        return response.data
    } catch (error) {
        throw new Error(
            error.response?.data?.message || 'Error al actualizar la categoría',
            { cause: error },
        )
    }
}

//servicio para eliminar una categoría
export const deleteCategoryService = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`)
        return response.data
    } catch (error) {
        throw new Error(
            error.response?.data?.message || 'Error al eliminar la categoría',
            { cause: error },
        )
    }
}