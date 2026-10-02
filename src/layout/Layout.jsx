import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'

const Layout = () => {
    return (
        // Usamos overflow-x-clip en vez de overflow-x-hidden para no romper el 'sticky' del Navbar
        <div className="min-h-screen flex flex-col justify-between bg-gray-100 overflow-x-clip">
            {/* Navbar fijo al hacer scroll */}
            <Navbar />

            {/* Contenido principal */}
            <main className="flex-1 w-full">
                <Outlet />
            </main>

            {/* Footer a ancho completo */}
            <Footer />
        </div>
    )
}

export default Layout
