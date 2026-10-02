
import axios from 'axios'

const API_URL = import.meta.env.VITE_BACKEND_URL + '/orders'

axios.defaults.withCredentials = true

export const createOrderService = async (orderData) => {
    try {
        const response = await axios.post(API_URL, orderData)
        return response.data
    } catch (error) {
        throw new Error(error.response.data.message || 'Error al procesar el pedido', { cause: error })
    }
}

export const getAdminOrdersService = async () => {
    try {
        const response = await axios.get(API_URL)
        return response.data.orders
    } catch (error) {
        throw new Error(
            error.response?.data?.message || 'Error al obtener las órdenes',
            { cause: error }
        )
    }
}

export const updateOrderStatusService = async (orderId, updates) => {
    try {
        // updates puede ser { status: 'en_preparacion' } o { paymentStatus: 'pagado' }
        const response = await axios.put(`${API_URL}/${orderId}/status`, updates)
        return response.data.order
    } catch (error) {
        throw new Error(
            error.response?.data?.message || 'Error al actualizar el estado de la orden',
            { cause: error }
        )
    }
}


// Obtener el historial y compras en curso del usuario autenticado
export const getMyOrdersService = async () => {
    try {
        const response = await axios.get(`${API_URL}/my-orders`)
        return response.data.orders
    } catch (error) {
        throw new Error(
            error.response?.data?.message || 'Error al obtener tus compras',
            { cause: error }
        )
    }
}
