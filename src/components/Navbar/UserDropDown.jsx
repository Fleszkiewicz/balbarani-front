import { FiUser, FiShoppingBag } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'
import { useUser } from '../../context/userContextData'
import toast from 'react-hot-toast'
import { logoutService } from '../../services/authServices'
import ConfirmModal from '../Common/ConfirmModal'
import { useState } from 'react'
import { TbBuildingStore, TbShoppingBagCheck, TbLogout, TbUserShield } from "react-icons/tb";

const UserDropDown = () => {
    const { userInfo, setUserInfo, isAdmin } = useUser()
    const location = useLocation()
    const isInAdmin = location.pathname.startsWith('/admin')
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleConfirmLogout = async () => {
        try {
            setIsLoggingOut(true)
            await logoutService()
            setUserInfo({})
            setIsLogoutModalOpen(false)
            toast.success('Sesión cerrada')
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
            toast.error('Error al cerrar sesión')
        } finally {
            setIsLoggingOut(false)
        }
    }

    return (
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="transition-transform hover:scale-105 active:scale-95"
            >
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white hover:text-pink-400 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <FiUser size={20} strokeWidth={2.5} />
                </div>
            </div>
            <ul
                tabIndex={0}
                className="menu dropdown-content bg-white rounded-[1.5rem] mt-3 z-10 w-64 p-3 shadow-[0_10px_35px_rgba(0,0,0,0.08)] border border-gray-100 gap-1"
            >
                <li className="pointer-events-none">
                    <div className="flex items-center gap-2 px-1 py-2">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                            <FiUser size={20} className="text-gray-600" />
                        </div>

                        <div className="flex flex-col">
                            <span className="font-medium text-gray-800 -mt-1">
                                {userInfo?.username}
                            </span>
                            <span className="text-sm text-gray-500 -mt-1">
                                {userInfo?.email}
                            </span>
                        </div>
                    </div>
                </li>

                {/* Opción Mis compras para el usuario logueado */}
                <li>
                    <Link
                        to="/mis-compras"
                        onClick={() => document.activeElement?.blur()}
                        className="rounded-xl hover:bg-gray-200 bg-gray-200/60 text-gray-700 font-medium py-2.5 flex items-center gap-2.5 transition-colors"
                    >
                        <TbShoppingBagCheck className="text-gray-500" size={20} />
                        <span>Mis compras</span>
                    </Link>
                </li>

                {/* Botón dinámico: si está en admin va a Tienda, si está en la tienda va a Admin */}
                {isAdmin() && (
                    <li>
                        {isInAdmin ? (
                            <Link
                                to="/"
                                onClick={() => document.activeElement?.blur()}
                                className="rounded-xl hover:bg-gray-200 bg-gray-200/60 text-gray-700 font-medium py-2.5"
                            >
                                <TbBuildingStore size={20} className="text-gray-500" />
                                Tienda online
                            </Link>
                        ) : (
                            <Link
                                to="/admin/dashboard"
                                onClick={() => document.activeElement?.blur()}
                                className="rounded-xl hover:bg-gray-200 bg-gray-200/60 text-gray-700 font-medium py-2.5"
                            >

                                <TbUserShield size={20} className="text-gray-500" />
                                Panel de Administración
                            </Link>
                        )}
                    </li>
                )}

                <li>
                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="rounded-xl hover:bg-red-100 text-red-600 bg-red-50 font-medium py-2.5 text-left"
                    >
                        <TbLogout size={20} className="text-red-500" />Cerrar Sesión
                    </button>
                </li>
            </ul>
            {/* Modal de confirmación para cerrar sesión */}
            <ConfirmModal
                isOpen={isLogoutModalOpen}
                title="Cerrar sesión"
                message="¿Estás seguro de que deseas salir de tu cuenta?"
                confirmText="Cerrar sesión"
                cancelText="Cancelar"
                confirmVariant="danger"
                iconType="logout"
                isLoading={isLoggingOut}
                onConfirm={handleConfirmLogout}
                onClose={() => setIsLogoutModalOpen(false)}
            />
        </div>
    )
}

export default UserDropDown
