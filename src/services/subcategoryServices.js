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