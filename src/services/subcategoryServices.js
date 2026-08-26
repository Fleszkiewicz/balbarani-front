import axios from 'axios'

const API_URL = import.meta.env.VITE_BACKEND_URL + '/subcategories'

axios.defaults.withCredentials = true

//servicio para obtener las subcategorías de una categoría puntual
export const getSubcategoriesByCategoryService = async (categorySlug) => {
    try {
        const response = await axios.get(`${API_URL}/by-category/${categorySlug}`)
        return response.data
    } catch (error) {
        throw new Error('Error al obtener las subcategorías', {
            cause: error,
        })
    }
}

//servicio para crear una subcategoria
export const createSubcategoryService = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/`, data)
        return response.data
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            'Error al crear la subcategoría',
            { cause: error },
        )
    }
}

//servicio para eliminar una subcategoria
export const deleteSubcategoryService = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`)
        return response.data
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            'Error al eliminar la subcategoría',
            { cause: error },
        )
    }
}

//servicio para actualizar una subcategoria
export const updateSubcategoryService = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data)
        return response.data
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            'Error al actualizar la subcategoría',
            { cause: error },
        )
    }
}