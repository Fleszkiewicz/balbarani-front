import { Link } from 'react-router-dom'
import AuthButtons from './AuthButtons.jsx'
import Cart from './Cart.jsx'
import UserDropDown from './UserDropDown.jsx'
import { useUser } from '../../context/userContextData.ts'

const Navbar = () => {
    const { loading, userInfo } = useUser()

    return (
        <header>
            {!loading && !userInfo?.username && <AuthButtons />}
            <nav
                className="
        navbar
        sticky
        top-0
        z-50
        mx-auto
        w-full
        px-6
        py-3
        bg-base-100/80
        backdrop-blur-xl
        border-b
        border-base-300/50
    "
            >
                <div className="navbar-start">
                    <Link
                        to="/"
                        className="
        text-3xl
        font-semibold
        tracking-tight
        hover:opacity-80
        transition-opacity
    "
                    >
                        Balbarani
                    </Link>
                </div>
                <div className="navbar-end gap-3">
                    {userInfo.isAdmin && (
                        <Link
                            to="/admin/dashboard"
                            className="
        rounded-full
        px-5
        py-2
        text-sm
        font-semibold
        bg-neutral
        text-neutral-content
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-md
    "
                        >
                            Administración
                        </Link>
                    )}
                    
                    <Cart />
                    {!loading && userInfo?.username && <UserDropDown />}
                    
                </div>
            </nav>
        </header>
    )
}

export default Navbar
