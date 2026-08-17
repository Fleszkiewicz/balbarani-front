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