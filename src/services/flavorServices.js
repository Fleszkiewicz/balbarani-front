import axios from 'axios'

const API_URL = import.meta.env.VITE_BACKEND_URL + '/flavors'

axios.defaults.withCredentials = true

export const getFlavorsService = async () => {
    try {
        const response = await axios.get(API_URL)
        return response.data
    } catch (error) {
        throw new Error('Error al obtener los sabores', {
            cause: error,
        })
    }
}

export const createFlavorService = async (data) => {
    try {
        const response = await axios.post(API_URL, data)
        return response.data
    } catch (error) {
        throw new Error(
            error.response?.data?.message || 'Error al crear el sabor',
            { cause: error },
        )
    }
}

export const updateFlavorService = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data)
        return response.data
    } catch (error) {
        throw new Error(
            error.response?.data?.message || 'Error al actualizar el sabor',
            { cause: error },
        )
    }
}

export const deleteFlavorService = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`)
        return response.data
    } catch (error) {
        throw new Error(
            error.response?.data?.message || 'Error al eliminar el sabor',
            { cause: error },
        )
    }
}
