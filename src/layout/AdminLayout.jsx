import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import UserDropDown from '../components/Navbar/UserDropDown.jsx'

// Secciones del panel en el orden solicitado
const NAV_ITEMS = [
    { label: 'Catálogo', path: '/admin/dashboard/catalogo' },
    { label: 'Inventario', path: '/admin/dashboard/inventario' },
    { label: 'Pedidos', path: '/admin/dashboard/pedidos' },
]

const AdminLayout = () => {
    const { pathname } = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const isActive = (path) => {
        return pathname.startsWith(path)
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header negro con el mismo estilo del navbar principal */}
            <header className="sticky top-0 z-40 w-full bg-black border-b border-neutral-900 shadow-md">
                <nav className="w-full px-4 sm:px-8 h-16 flex items-center justify-between">

                    {/* Esquina Izquierda: Menú Hamburguesa (mobile) + Logo Balbarani ADMIN */}
                    <div className="flex-1 flex items-center justify-start gap-3">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            aria-label="Abrir menú"
                            className="btn btn-ghost btn-sm text-white hover:text-pink-400 transition-colors md:hidden"
                        >
                            <FiMenu size={20} />
                        </button>

                        <Link
                            to="/admin/dashboard/pedidos"
                            className="flex flex-col hover:opacity-90 transition-opacity"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-none whitespace-nowrap">
                                    Balbarani
                                </span>
                                <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest bg-neutral-900 px-2 py-0.5 rounded-full border border-neutral-800">
                                    ADMIN
                                </span>
                            </div>

                            <span className="text-[10px] sm:text-[10px] md:text-[11px] font-medium text-gray-400 tracking-wider ml-0.5 uppercase whitespace-nowrap mt-0.5 ">
                                Heladería Artesanal • Baradero
                            </span>
                        </Link>
                    </div>

                    {/* Centro (Desktop): Enlaces Directos perfectamente centrados en la pantalla */}
                    <div className="hidden md:flex items-center justify-center gap-7 lg:gap-8">
                        {NAV_ITEMS.map((item) => {
                            const active = isActive(item.path)
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`text-[15px] font-medium tracking-tight transition-colors py-0.5 whitespace-nowrap ${active
                                        ? 'text-pink-400 border-b-2 border-pink-600'
                                        : 'text-white hover:text-pink-400'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Esquina Derecha: Dropdown de Usuario (simétrico para centrar el medio) */}
                    <div className="flex-1 flex items-center justify-end">
                        <UserDropDown />
                    </div>
                </nav>
            </header>

            {/* Menú mobile (Drawer lateral en negro idéntico al navbar de la web) */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    {/* Backdrop Oscuro */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Drawer lateral */}
                    <div className="relative w-80 max-w-[90vw] bg-black h-screen shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto">
                        <div>
                            {/* Cabecera del Drawer */}
                            <div className="flex items-center justify-between pb-5 border-b border-neutral-800">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-2xl font-bold tracking-tight text-white whitespace-nowrap">Balbarani</h2>
                                        <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest bg-neutral-900 px-2 py-0.5 rounded-full border border-neutral-800">
                                            ADMIN
                                        </span>
                                    </div>
                                    <p className="text-[10px] sm:text-[11px] font-medium text-gray-400 tracking-wider mt-0.5 uppercase whitespace-nowrap">
                                        Heladería Artesanal • Baradero
                                    </p>
                                </div>

                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:text-pink-400 transition-colors cursor-pointer"
                                    aria-label="Cerrar menú"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            {/* Enlaces de Navegación */}
                            <div className="flex flex-col mt-5 gap-1">
                                {NAV_ITEMS.map((item) => {
                                    const active = isActive(item.path)
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${active
                                                ? 'bg-neutral-900 text-pink-400 font-semibold'
                                                : 'text-white hover:bg-neutral-900 font-medium'
                                                }`}
                                        >
                                            <span className="text-sm font-semibold">{item.label}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Pie del Drawer */}
                        <div className="pt-6 border-t border-neutral-800 flex flex-col gap-3">
                            <Link
                                to="/"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-neutral text-white font-medium text-xs hover:text-pink-400 transition-colors"
                            >
                                <span>Volver a la Tienda</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <main className="p-4 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout
