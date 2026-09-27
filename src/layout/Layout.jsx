import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'

const Layout = () => {
    return (
        // ✅ Cambiado bg-base-100 por bg-gray-100
        <div className="min-h-screen flex flex-col justify-between bg-gray-100">
            {/* Contenedor central de la tienda */}
            <div className="w-full max-w-[1000px] lg:max-w-[1200px] mx-auto px-6 pb-10 flex-1">
                <Navbar />
                <main>
                    <Outlet />
                </main>
            </div>

            {/* Footer a ancho completo */}
            <Footer />
        </div>
    )
}

export default Layout
