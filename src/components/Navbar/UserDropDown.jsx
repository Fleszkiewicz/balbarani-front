import { FiUser } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useUser } from '../../context/userContextData'
import toast from 'react-hot-toast'
import { logoutService } from '../../services/authServices'

const UserDropDown = () => {
    const { setUserInfo, isAdmin } = useUser()

    const handleLogout = async () => {
        try {
            await logoutService()
            setUserInfo({})
            toast.success('Sesión cerrada')
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
            toast.error('Error al cerrar sesión')
        }
    }
    return (
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="transition-transform hover:scale-105 active:scale-95"
            >
                <div className="w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <FiUser size={20} strokeWidth={2.5} />
                </div>
            </div>
            <ul
                tabIndex={0}
                className="menu dropdown-content bg-white rounded-[1.5rem] mt-3 z-1 w-52 p-3 shadow-[0_10px_35px_rgba(0,0,0,0.08)] border border-gray-100 gap-1"
            >
                <li>
                    <a className="rounded-xl hover:bg-gray-50 text-gray-700 font-medium py-2.5">
                        Perfil
                    </a>
                </li>
                <li>
                    <a className="rounded-xl hover:bg-gray-50 text-gray-700 font-medium py-2.5">Configuración</a>
                </li>
                {isAdmin() && (
                    <li>
                        <Link to="/admin/dashboard" className="rounded-xl hover:bg-gray-50 text-gray-700 font-medium py-2.5">Panel Admin</Link>
                    </li>
                )}
                <li>
                    <a onClick={handleLogout} className="rounded-xl hover:bg-red-50 text-red-600 font-medium py-2.5 mt-1">Cerrar Sesión</a>
                </li>
            </ul>
        </div>
    )
}

export default UserDropDown
