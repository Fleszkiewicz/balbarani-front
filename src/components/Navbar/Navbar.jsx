import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Cart from './Cart.jsx'
import UserDropDown from './UserDropDown.jsx'
import { useUser } from '../../context/userContextData.ts'
import { FiMenu, FiX, FiShoppingBag, FiInfo, FiBriefcase, FiMail, FiUser } from 'react-icons/fi'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { TbLogin2 } from 'react-icons/tb'

const Navbar = () => {
    const { loading, userInfo } = useUser()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const location = useLocation()

    const closeMenu = () => setIsMenuOpen(false)

    const navLinks = [
        { title: 'Tienda Online', path: '/', icon: FiShoppingBag },
        { title: 'Sobre Nosotros', path: '/nosotros', icon: FiInfo },
        { title: 'Franquicias', path: '/franquicias', icon: FiBriefcase },
        { title: 'Contacto', path: '/contacto', icon: FiMail },
    ]

    return (
        <>
            {/* Header a ancho completo que ocupa todo el eje X */}
            <header className="sticky top-0 z-40 w-full bg-black border-b border-neutral-900 shadow-md">
                <nav className="w-full px-4 sm:px-8 h-16 flex items-center justify-between">

                    {/* Esquina Izquierda: Menú Hamburguesa (mobile) + Logo Balbarani */}
                    <div className="flex-1 flex items-center justify-start gap-3">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            aria-label="Abrir menú"
                            className="btn btn-ghost btn-sm text-white hover:text-pink-400 transition-colors md:hidden"
                        >
                            <FiMenu size={20} />
                        </button>

                        <Link
                            to="/"
                            className="flex flex-col hover:opacity-90 transition-opacity"
                        >
                            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-none whitespace-nowrap">
                                Balbarani
                            </span>
                            <span className="text-[10px] sm:text-[10px] md:text-[11px] font-medium text-gray-400 tracking-wider ml-0.5 uppercase whitespace-nowrap mt-0.5 ">
                                Heladería Artesanal • Baradero
                            </span>
                        </Link>

                    </div>

                    {/* Centro (Desktop): Enlaces centrados en el medio */}
                    <div className="hidden md:flex items-center justify-center gap-7 lg:gap-8">
                        {navLinks.map((item) => {
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`text-[15px] font-normal tracking-tight transition-colors py-0.5 whitespace-nowrap ${isActive
                                        ? 'text-pink-400 border-b-2 border-pink-500'
                                        : 'text-white hover:text-pink-400'
                                        }`}
                                >
                                    {item.title}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Esquina Derecha: Carrito y Usuario */}
                    <div className="flex-1 flex items-center justify-end gap-3">
                        {/* Botón Carrito */}
                        <Cart />

                        {/* Usuario Logueado o Botón de Ingreso */}
                        {!loading && userInfo?.username ? (
                            <UserDropDown />
                        ) : (
                            <Link
                                to="/login"
                                className="btn btn-sm rounded-full bg-neutral text-white hover:text-pink-400 hover:bg-neutral border-none text-[14px] font-normal px-4 gap-1.5 shadow-2xs"
                            >
                                <TbLogin2 size={24} />
                                <span className="hidden sm:inline">Iniciar Sesión</span>
                            </Link>
                        )}
                    </div>
                </nav>
            </header>

            {/* DRAWER LATERAL DESPLEGABLE MOBILE */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    {/* Backdrop Oscuro con blur */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
                        onClick={closeMenu}
                    />

                    {/* Menú Lateral */}
                    <div className="relative w-80 max-w-[90vw] bg-black h-screen shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto">
                        <div>
                            {/* Cabecera del Drawer */}
                            <div className="flex items-center justify-between pb-5 border-b border-neutral-800">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight text-white whitespace-nowrap">Balbarani</h2>
                                    <p className="text-[10px] sm:text-[11px] font-medium text-gray-400 uppercase tracking-wider -mt-1 whitespace-nowrap">
                                        Heladería Artesanal • Baradero
                                    </p>
                                </div>

                                <button
                                    onClick={closeMenu}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:text-pink-400 transition-colors cursor-pointer"
                                    aria-label="Cerrar menú"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            {/* Enlaces de Navegación con Íconos */}
                            <div className="flex flex-col mt-5 gap-1">
                                {navLinks.map((item) => {
                                    const Icon = item.icon
                                    const isActive = location.pathname === item.path

                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={closeMenu}
                                            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive
                                                ? 'bg-neutral-900 text-pink-400 font-semibold'
                                                : 'text-white hover:bg-neutral-900 font-medium'
                                                }`}
                                        >
                                            <div className="w-8 h-8 flex items-center justify-center text-base">
                                                <Icon />
                                            </div>
                                            <span className="text-sm font-semibold">{item.title}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Pie del Drawer: WhatsApp e Instagram */}
                        <div className="pt-6 border-t border-neutral-800 flex flex-col gap-3">
                            <a
                                href="https://wa.me/5493329123456"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-neutral text-white font-semibold text-xs hover:text-emerald-400 transition-colors"
                            >
                                <FaWhatsapp size={15} />
                                <span>Pedir por WhatsApp</span>
                            </a>

                            <div className="flex items-center justify-between text-xs text-gray-400 font-medium px-1">
                                <span>Baradero, Bs. As.</span>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-pink-400 transition-colors"
                                >
                                    <FaInstagram size={16} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar
