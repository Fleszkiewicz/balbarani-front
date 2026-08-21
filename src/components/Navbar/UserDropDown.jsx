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
                className="btn btn-ghost btn-circle avatarrole"
            >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <FiUser size={24} />
                </div>
            </div>
            <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow"
            >
                <li>
                    <a className="justify-between">
                        Perfil
                        <span className="badge">Nuevo</span>
                    </a>
                </li>
                <li>
                    <a className="justify-between">Configuración</a>
                </li>
                {isAdmin() && (
                    <li>
                        <Link to="/admin/dashboard">Panel Admin</Link>
                    </li>
                )}
                <li>
                    <a onClick={handleLogout}className="justify-between">Cerrar Sesión</a>
                </li>
            </ul>
        </div>
    )
}

export default UserDropDown
