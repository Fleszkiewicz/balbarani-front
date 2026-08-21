import { useState, useEffect, ReactNode } from 'react'
import { getProfileService } from '../services/authServices.js'
import { UserContext } from './userContextData'
import type { UserInfo } from '../types/user'

interface UserContextProviderProps {
    children: ReactNode
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
    //const [userInfo, setUserInfo] = useState({})
    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo)
    const [loading, setLoading] = useState(true)

    //funcion para verificar la sesion del usuario(verifica access token)
    const checkSession = async () => {
        try {
            setLoading(true)
            const userData = await getProfileService()
            setUserInfo(userData)
        } catch (error) {
            console.log('No hay session activa: ', error)
            setUserInfo({})
        } finally {
            setLoading(false)
        }
    }

    //funcion para obtener el id del usuario autenticado
    const getUserId = () => {
        return userInfo?.id || null
    }

    //verificar si el usuario esta autenticado o no
    const isAuthenticated = () => {
        return !!userInfo?.id
    }

    const isAdmin = () => {
        return !!userInfo?.isAdmin
    }

    useEffect(() => {
        Promise.resolve().then(checkSession)
    }, [])

    return (
        <UserContext.Provider
            value={{
                userInfo,
                setUserInfo,
                loading,
                checkSession,
                getUserId,
                isAuthenticated,
                isAdmin,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}
