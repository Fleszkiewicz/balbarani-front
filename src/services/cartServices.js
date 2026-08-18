import axios from 'axios'

const API_URL = import.meta.env.VITE_BACKEND_URL + '/cart'

axios.defaults.withCredentials = true

export const addToCartService = async (
    userId,
    productId,
    quantity = 1,
    configuration = null,
) => {
    try {
        const response = await axios.post(`${API_URL}/add`, {
            userId,
            productId,
            quantity,
            configuration,
        })
        return response.data
    } catch (error) {
        throw new Error('Error al agregar el producto al carrito', {
            cause: error,
        })
    }
}

export const getCartService = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/get/${userId}`)
        return response.data
    } catch (error) {
        throw new Error('Error al obtener el carrito del usuario', {
            cause: error,
        })
    }
}

export const updateCartService = async (
    userId,
    productId,
    quantity,
    configuration = null,
) => {
    try {
        const response = await axios.put(`${API_URL}/update/${userId}`, {
            productId,
            quantity,
            configuration,
        })
        return response.data
    } catch (error) {
        throw new Error('Error al actualizar el carrito', {
            cause: error,
        })
    }
}

export const deleteCartService = async (
    userId,
    productId,
    configuration = null,
) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/${userId}`, {
            data: { productId, configuration },
        })
        return response.data
    } catch (error) {
        throw new Error('Error al eliminar el producto del carrito', {
            cause: error,
        })
    }
}

export const clearCartService = async (userId) => {
    try {
        const response = await axios.delete(`${API_URL}/clear/${userId}`)
        return response.data
    } catch (error) {
        throw new Error('Error al limpiar el carrito', {
            cause: error,
        })
    }
}

export const getCartTotalService = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/total/${userId}`)
        return response.data
    } catch (error) {
        throw new Error('Error al obtener el precio total del carrito', {
            cause: error,
        })
    }
}
