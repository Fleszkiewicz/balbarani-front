import axios from 'axios'

const API_URL = import.meta.env.VITE_BACKEND_URL + '/auth'
axios.defaults.withCredentials = true

export const getProfileService = async () => {
    try {
        const response = await axios.get(`${API_URL}/profile`)
        return response.data
    } catch (error) {
        throw new Error('Error al obtener el perfil del usuario', { cause: error })
    }
}

export const loginService = async (data, reset, setRedirect, setUserInfo) => {
    try {
        const response = await axios.post(`${API_URL}/login`, data, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })

        if (response.status === 200) {
            setUserInfo(response.data)
            reset()
            setRedirect(true)
            return { success: true, message: 'Inicio de sesión exitoso' }
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Error al iniciar sesión',
            requiresVerification: error.response?.data?.requiresVerification || false,
            email: error.response?.data?.email,
        }
    }
}

// Actualizado: ahora devuelve si requiere verificar el correo
export const registerService = async (data, reset) => {
    try {
        const response = await axios.post(`${API_URL}/register`, data, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })

        if (response.status === 201 || response.status === 200) {
            reset()
            return {
                success: true,
                message: response.data.message || 'Registro exitoso',
                requiresVerification: response.data.requiresVerification,
                email: response.data.email,
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Error al registrarse',
        }
    }
}

// 1. Verificar código de registro
export const verifyEmailService = async ({ email, code }) => {
    try {
        const response = await axios.post(`${API_URL}/verify-email`, { email, code })
        return { success: true, data: response.data }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Error al verificar el código',
        }
    }
}

// 2. Reenviar código de registro
export const resendCodeService = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/resend-code`, { email })
        return { success: true, message: response.data.message }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Error al reenviar código',
        }
    }
}

// 3. Solicitar código para restablecer contraseña
export const forgotPasswordService = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/forgot-password`, { email })
        return { success: true, message: response.data.message }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Error al solicitar recuperación',
        }
    }
}

// 4. Cambiar contraseña con el código
export const resetPasswordService = async ({ email, code, newPassword }) => {
    try {
        const response = await axios.post(`${API_URL}/reset-password`, { email, code, newPassword })
        return { success: true, message: response.data.message }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Error al restablecer contraseña',
        }
    }
}

export const logoutService = async () => {
    try {
        const response = await axios.post(`${API_URL}/logout`)
        return response.data
    } catch (error) {
        throw new Error(error.response?.message || 'Error al cerrar sesión', { cause: error })
    }
}
