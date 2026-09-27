import { Link } from 'react-router-dom'
import { FaInstagram, FaWhatsapp, FaFacebook, FaMapMarkerAlt, FaClock, FaPhoneAlt } from 'react-icons/fa'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="w-full bg-amber-50 border-t border-gray-100 mt-10 text-gray-600">
            {/* Contenedor Principal */}
            <div className="max-w-[1200px] mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                    {/* Columna 1: Marca & Descripción */}
                    <div className="flex flex-col gap-3">
                        <Link to="/" className="text-3xl font-semibold tracking-tight text-gray-900 hover:opacity-80 transition-opacity">
                            Balbarani
                        </Link>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider -mt-1">
                            Heladería Artesanal
                        </p>
                        <p className="text-sm text-gray-500 leading-relaxed mt-1">
                            Elaboración artesanal con materias primas de primera calidad. Sabores únicos pensados para compartir en familia.
                        </p>
                        {/* Redes Sociales */}
                        <div className="flex items-center gap-3 mt-2">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-pink-600 hover:bg-pink-50 hover:border-pink-200 transition-all text-sm"
                            >
                                <FaInstagram />
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all text-sm"
                            >
                                <FaFacebook />
                            </a>
                            <a
                                href="https://wa.me/5493329123456"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                                className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 transition-all text-sm"
                            >
                                <FaWhatsapp />
                            </a>
                        </div>
                    </div>

                    {/* Columna 2: Navegación Rápida */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                            Navegación
                        </h4>
                        <ul className="flex flex-col gap-2 text-sm text-gray-500">
                            <li>
                                <Link to="/" className="hover:text-gray-900 transition-colors">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link to="/checkout" className="hover:text-gray-900 transition-colors">
                                    Finalizar Compra
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="hover:text-gray-900 transition-colors">
                                    Mi Cuenta
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="hover:text-gray-900 transition-colors">
                                    Registrarse
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 3: Contacto & Ubicación */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                            Ubicación y Contacto
                        </h4>
                        <ul className="flex flex-col gap-3 text-sm text-gray-500">
                            <li className="flex items-start gap-2.5">
                                <FaMapMarkerAlt className="text-red-500 mt-1 shrink-0 text-sm" />
                                <span>Baradero, Buenos Aires, Argentina</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <FaPhoneAlt className="text-emerald-500 shrink-0 text-xs" />
                                <span>+54 3329 123456</span>
                            </li>
                            <li className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-1.5 w-fit font-semibold mt-1">
                                🛵 Envíos a todo Baradero
                            </li>
                        </ul>
                    </div>

                    {/* Columna 4: Horarios */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                            Horarios de Atención
                        </h4>
                        <ul className="flex flex-col gap-2 text-sm text-gray-500">
                            <li className="flex items-start gap-2.5">
                                <FaClock className="text-amber-500 mt-1 shrink-0 text-xs" />
                                <div>
                                    <p className="font-semibold text-gray-700">Lunes a Jueves</p>
                                    <p className="text-xs text-gray-400">14:00 a 00:00 hs</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <FaClock className="text-amber-500 mt-1 shrink-0 text-xs" />
                                <div>
                                    <p className="font-semibold text-gray-700">Viernes a Domingos</p>
                                    <p className="text-xs text-gray-400">12:00 a 01:00 hs</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Barra Inferior (Copyright) */}
                <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-2">
                    <p>© {currentYear} Heladería Balbarani. Todos los derechos reservados.</p>
                    <p className="flex items-center gap-1 font-medium">
                        Hecho con cariño en Baradero 🍦
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
