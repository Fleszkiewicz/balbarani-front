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
        <div className="min-h-screen bg-base-200">
            <header className="navbar bg-base-100 shadow-md px-4">
                <div className="flex-1">
                    <Link to="/admin/dashboard" className="text-xl font-bold">
                        BALBARANI Admin
                    </Link>
                </div>
                <nav className="hidden md:flex gap-2">
                    {NAV_ITEMS.map(({ label, path }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`btn btn-sm ${
                                isActive(path) ? 'btn-primary' : 'btn-ghost'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
                <Link to="/" className="btn btn-sm btn-outline ml-2">
                    Ver tienda
                </Link>
            </header>

            {/* Menú mobile */}
            <div className="md:hidden flex flex-wrap gap-2 p-4 bg-base-100 border-b">
                {NAV_ITEMS.map(({ label, path }) => (
                    <Link
                        key={path}
                        to={path}
                        className={`btn btn-xs ${
                            isActive(path) ? 'btn-primary' : 'btn-ghost'
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