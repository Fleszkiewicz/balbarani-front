import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AuthButtons from './AuthButtons.jsx'
import Cart from './Cart.jsx'
import UserDropDown from './UserDropDown.jsx'
import { useUser } from '../../context/userContextData.ts'
import { FiMenu, FiX, FiShoppingBag, FiInfo, FiBriefcase, FiMail, FiMapPin } from 'react-icons/fi'
import { FaInstagram, FaWhatsapp, FaIceCream } from 'react-icons/fa'

const Navbar = () => {
    const { loading, userInfo } = useUser()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const location = useLocation()

    const closeMenu = () => setIsMenuOpen(false)

    const navLinks = [
        {
            title: 'Pedir Online',
            subtitle: 'Elegí tus gustos y recibilos en casa',
            path: '/',
            icon: FiShoppingBag,
            highlight: true,
        },
        {
            title: 'Sobre Nosotros',
            subtitle: 'Nuestra historia y tradición artesanal',
            path: '/nosotros',
            icon: FiInfo,
        },
        {
            title: 'Franquicias',
            subtitle: 'Sumate y abrí tu heladería Balbarani',
            path: '/franquicias',
            icon: FiBriefcase,
        },
        {
            title: 'Contáctanos',
            subtitle: 'Ubicación, WhatsApp, mapa y consultas',
            path: '/contacto',
            icon: FiMail,
        },
    ]

    return (
        <header>
            {!loading && !userInfo?.username && <AuthButtons />}
            <nav className="navbar sticky top-0 z-40 mx-auto w-full px-4 sm:px-6 py-3 bg-base-100/80 backdrop-blur-xl border-b border-base-300/50">
                {/* Izquierda: Botón Hamburguesa + Logo Balbarani */}
                <div className="navbar-start flex items-center gap-2">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        aria-label="Abrir menú"
                        className="btn btn-ghost btn-circle text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <FiMenu size={22} />
                    </button>
                    <Link
                        to="/"
                        className="text-2xl sm:text-3xl font-semibold tracking-tight hover:opacity-80 transition-opacity"
                    >
                        Balbarani
                    </Link>
                </div>

                {/* Derecha: Carrito y Usuario */}
                <div className="navbar-end gap-3">
                    <Cart />
                    {!loading && userInfo?.username && <UserDropDown />}
                </div>
            </nav>

            {/* Panel Lateral Desplegable (Drawer) */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Fondo oscuro con clic para cerrar */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
                        onClick={closeMenu}
                    />

                    {/* Menú que entra desde la izquierda */}
                    <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto">
                        {/* Cabecera del Menú */}
                        <div>
                            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Balbarani</h2>
                                    <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                                        <FaIceCream /> Helados Artesanales
                                    </p>
                                </div>
                                <button
                                    onClick={closeMenu}
                                    className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>

                            {/* Enlaces de Navegación */}
                            <div className="flex flex-col gap-2 mt-6">
                                {navLinks.map(({ title, subtitle, path, icon: Icon, highlight }) => {
                                    const isActive = location.pathname === path
                                    return (
                                        <Link
                                            key={path}
                                            to={path}
                                            onClick={closeMenu}
                                            className={`flex items-start gap-3.5 p-3.5 rounded-2xl transition-all ${isActive
                                                    ? 'bg-neutral text-white shadow-sm'
                                                    : highlight
                                                        ? 'bg-amber-50/70 hover:bg-amber-100/70 text-gray-900 border border-amber-100'
                                                        : 'hover:bg-gray-50 text-gray-700'
                                                }`}
                                        >
                                            <div
                                                className={`p-2 rounded-xl shrink-0 ${isActive
                                                        ? 'bg-white/20 text-white'
                                                        : highlight
                                                            ? 'bg-amber-100 text-amber-800'
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}
                                            >
                                                <Icon size={18} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm leading-tight">{title}</h3>
                                                <p
                                                    className={`text-xs mt-0.5 line-clamp-1 ${isActive ? 'text-gray-200' : 'text-gray-400'
                                                        }`}
                                                >
                                                    {subtitle}
                                                </p>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Pie del Menú Lateral */}
                        <div className="pt-6 border-t border-gray-100 flex flex-col gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-2 text-gray-600">
                                <FiMapPin className="text-red-500 shrink-0 text-sm" />
                                <span>Baradero, Buenos Aires</span>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-full bg-gray-50 hover:bg-pink-50 hover:text-pink-600 flex items-center justify-center border border-gray-200 transition-colors"
                                >
                                    <FaInstagram size={14} />
                                </a>
                                <a
                                    href="https://wa.me/5493329123456"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-full bg-gray-50 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center border border-gray-200 transition-colors"
                                >
                                    <FaWhatsapp size={14} />
                                </a>
                                <span className="text-[11px] text-gray-400 ml-auto">Desde Baradero ❤️</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar
