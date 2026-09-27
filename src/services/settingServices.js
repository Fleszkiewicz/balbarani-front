import axios from 'axios'

const API_URL = import.meta.env.VITE_BACKEND_URL + '/settings'
axios.defaults.withCredentials = true

export const getDeliveryFeeService = async () => {
    try {
        const response = await axios.get(`${API_URL}/delivery-fee`)
        return response.data.deliveryFee
    } catch (error) {
        console.error('Error al obtener costo de delivery:', error)
        return 0
    }
}

export const updateDeliveryFeeService = async (deliveryFee) => {
    try {
        const response = await axios.put(`${API_URL}/delivery-fee`, { deliveryFee })
        return response.data.deliveryFee
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al actualizar delivery', { cause: error })
    }
}
