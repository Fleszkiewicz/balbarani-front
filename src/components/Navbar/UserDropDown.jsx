import { FiUser } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useUser } from '../../context/userContextData'
import toast from 'react-hot-toast'
import { logoutService } from '../../services/authServices'

const UserDropDown = () => {
    const { userInfo, setUserInfo, isAdmin } = useUser()

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
                className="menu dropdown-content bg-white rounded-[1.5rem] mt-3 z-10 w-64 p-3 shadow-[0_10px_35px_rgba(0,0,0,0.08)] border border-gray-100 gap-1"
            >
                <li className="pointer-events-none">
                    <div className="flex items-center gap-2 px-1 py-2">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                            <FiUser size={20} className="text-gray-600" />
                        </div>

                        <div className="flex flex-col">
                            <span className="font-medium text-gray-800">
                                {userInfo?.username}
                            </span>
                            <span className="text-sm text-gray-500">
                                {userInfo?.email}
                            </span>
                        </div>
                    </div>
                </li>


                {isAdmin() && (
                    <li>
                        <Link
                            to="/admin/dashboard"
                            className="rounded-xl hover:bg-gray-100 bg-gray-50 text-gray-700 font-medium py-2.5"
                        >
                            Panel de Administración
                        </Link>
                    </li>
                )}

                <li>
                    <button
                        onClick={handleLogout}
                        className="rounded-xl hover:bg-red-100 text-red-600 bg-red-50 font-medium py-2.5 text-left"
                    >
                        Cerrar Sesión
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default UserDropDown
