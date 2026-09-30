import { Link } from 'react-router-dom'
import { FaInstagram, FaWhatsapp, FaFacebook, FaClock } from 'react-icons/fa'
import { GrLocation } from 'react-icons/gr'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="w-full bg-black border-t border-neutral-900 text-gray-400">
            {/* Contenedor Principal */}
            <div className="max-w-[1200px] mx-auto px-6 py-10 sm:py-12">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 pb-8 border-b border-neutral-900">

                    {/* Columna 1: Marca & Redes Sociales */}
                    <div className="flex flex-col gap-2">
                        <Link to="/" className="flex flex-col hover:opacity-90 transition-opacity w-fit">
                            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none">
                                Balbarani
                            </span>
                            <span className="text-[11px] font-medium text-gray-400 tracking-widest mt-1 ml-0.5 uppercase">
                                Heladería Artesanal • Baradero
                            </span>
                        </Link>

                        {/* Botones de Redes Sociales (minimalistas oscuros con hover de marca) */}
                        <div className="flex items-center gap-2.5 mt-2">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-gray-300 hover:text-pink-400 hover:border-pink-500/40 hover:bg-neutral-800 transition-all text-sm"
                            >
                                <FaInstagram />
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-gray-300 hover:text-blue-400 hover:border-blue-500/40 hover:bg-neutral-800 transition-all text-sm"
                            >
                                <FaFacebook />
                            </a>
                            <a
                                href="https://wa.me/5493329123456"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-gray-300 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-neutral-800 transition-all text-sm"
                            >
                                <FaWhatsapp />
                            </a>
                        </div>
                    </div>

                    {/* Columna 2: Info directa sin títulos (Ubicación, WhatsApp, Horarios) */}
                    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4 sm:gap-6 md:gap-4 lg:gap-8 text-[13px] text-gray-300">
                        {/* Ubicación */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-red-400 shrink-0">
                                <GrLocation className="text-xs" />
                            </div>
                            <span>Baradero, Buenos Aires</span>
                        </div>

                        {/* WhatsApp / Teléfono */}
                        <a
                            href="https://wa.me/5493329123456"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 hover:text-emerald-400 transition-colors w-fit"
                        >
                            <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400 shrink-0">
                                <FaWhatsapp className="text-xs" />
                            </div>
                            <span>+54 3329 123456</span>
                        </a>

                        {/* Horarios de Atención */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
                                <FaClock className="text-xs" />
                            </div>
                            <span>Todos los días: 14:00 a 00:00 hs</span>
                        </div>
                    </div>
                </div>

                {/* Barra Inferior (Copyright) */}
                <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-[12px] text-gray-500 gap-2">
                    <p>© {currentYear} Heladería Balbarani. Todos los derechos reservados.</p>
                    <p className="text-gray-600 text-[11px]">Pasión y tradición familiar</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
