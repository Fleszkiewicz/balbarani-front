import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col justify-between bg-gray-100 overflow-x-hidden">
            {/* Navbar a ancho completo */}
            <Navbar />

            {/* Contenido principal a ancho completo */}
            <main className="flex-1 w-full">
                <Outlet />
            </main>

            {/* Footer a ancho completo */}
            <Footer />
        </div>
    )
}

export default Layout
