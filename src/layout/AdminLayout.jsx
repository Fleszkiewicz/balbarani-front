import { Link, Outlet, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
    { label: 'Catálogo', path: '/admin/dashboard/catalogo' },
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Inventario', path: '/admin/dashboard/inventario' },
    { label: 'Pedidos', path: '/admin/dashboard/pedidos' },
]

const AdminLayout = () => {
    const { pathname } = useLocation()

    const isActive = (path) => {
        if (path === '/admin/dashboard') {
            return pathname === '/admin/dashboard'
        }
        return pathname.startsWith(path)
    }

    return (
        // ✅ Cambiamos bg-base-200 por bg-gray-100 para que todo el fondo sea gris claro
        <div className="min-h-screen bg-gray-100">
            {/* Cabecera blanca con borde sutil para que contraste con el fondo gris */}
            <header className="navbar sticky top-0 z-50 mx-auto w-full px-6 py-3 bg-white/90 backdrop-blur-xl border-b border-gray-200">
                <div className="flex-1">
                    <Link to="/admin/dashboard" className="text-3xl font-semibold tracking-tight hover:opacity-80 transition-opacity">
                        Balbarani <span className="text-lg font-normal text-gray-500">ADMIN</span>
                    </Link>
                </div>
                <nav className="hidden md:flex gap-2">
                    {NAV_ITEMS.map(({ label, path }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${isActive(path)
                                    ? 'bg-neutral text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
                <Link to="/" className="px-4 py-1.5 rounded-full text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all ml-2 shadow-sm hover:shadow-md hover:-translate-y-0.5">
                    Ver tienda
                </Link>
            </header>

            {/* Menú mobile */}
            <div className="md:hidden flex flex-wrap gap-2 p-4 bg-white/90 backdrop-blur-xl border-b border-gray-200 sticky top-[76px] z-40">
                {NAV_ITEMS.map(({ label, path }) => (
                    <Link
                        key={path}
                        to={path}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${isActive(path)
                                ? 'bg-neutral text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {label}
                    </Link>
                ))}
            </div>

            <main className="p-4 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout
