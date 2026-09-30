import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CategoryGrid from '../components/CategoryGrid/CategoryGrid.jsx'
import { FaIceCream, FaMotorcycle, FaStar, FaArrowRight } from 'react-icons/fa'
import { FiCheckCircle } from 'react-icons/fi'

// Las 5 imágenes de Cloudinary en alta resolución
const HERO_CAROUSEL_IMAGES = [
    'https://res.cloudinary.com/dzxa0ykpd/image/upload/v1790536700/DSC_1143_1_ktg4se.jpg',
    'https://res.cloudinary.com/dzxa0ykpd/image/upload/v1790536700/DSC_1139_a5s6oz.jpg',
    'https://res.cloudinary.com/dzxa0ykpd/image/upload/v1790536641/DSC_1131_emdaxy.jpg',
    'https://res.cloudinary.com/dzxa0ykpd/image/upload/v1790536641/DSC_1137_oacejf.jpg',
    'https://res.cloudinary.com/dzxa0ykpd/image/upload/v1790536641/DSC_1127_1_tsostw.jpg',
]

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [prevSlide, setPrevSlide] = useState(null)

    const goToSlide = (nextIndex) => {
        if (nextIndex === currentSlide) return
        setPrevSlide(currentSlide)
        setCurrentSlide(nextIndex)
    }

    // Rotación automática cada 7 segundos con combinación suave estilo CapCut
    useEffect(() => {
        const interval = setInterval(() => {
            setPrevSlide(currentSlide)
            setCurrentSlide((prev) => (prev + 1) % HERO_CAROUSEL_IMAGES.length)
        }, 7000)

        return () => clearInterval(interval)
    }, [currentSlide])

    return (
        <div className="pb-20">
            {/* HERO SECTION A ANCHO COMPLETO (100% de la pantalla) */}
            <div className="relative w-full overflow-hidden min-h-[540px] sm:min-h-[620px] lg:min-h-[660px] flex items-center justify-center">

                {/* 1. CARRUSEL CON SUPERPOSICIÓN CONTINUA + ANIMACIÓN COMBINAR DE CAPCUT */}
                {HERO_CAROUSEL_IMAGES.map((imgUrl, index) => {
                    const isCurrent = currentSlide === index
                    const isPrev = prevSlide === index

                    return (
                        <div
                            key={index}
                            className={`absolute inset-0 w-full h-full pointer-events-none ${
                                isCurrent
                                    ? 'z-10 opacity-100'
                                    : isPrev
                                    ? 'z-0 opacity-100'
                                    : 'z-0 opacity-0'
                            }`}
                            style={{
                                backgroundImage: `url(${imgUrl})`,
                                backgroundPosition: 'center 45%',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                transition: isCurrent ? 'opacity 1400ms ease-in-out' : 'none',
                                animation: isCurrent
                                    ? 'capcutZoom 7s cubic-bezier(0.25, 1, 0.5, 1) forwards'
                                    : 'none',
                                transform: isPrev ? 'scale(1.08)' : isCurrent ? undefined : 'scale(1)',
                            }}
                        />
                    )
                })}

                {/* 2. CONTENIDO CENTRADO (z-20 para quedar siempre por encima de las capas) */}
                <div className="relative z-20 flex flex-col items-center text-center px-4 sm:px-6 py-16 sm:py-24 max-w-4xl mx-auto">
                    {/* Badge de Identidad */}
                    <div className="inline-flex items-center gap-2 bg-white/40 px-4 py-1.5 rounded-full mb-6">
                        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">
                            Heladería Artesanal • Baradero
                        </span>
                    </div>

                    {/* Titular Principal: Con sombra suave, leve y centrada en todos los lados */}
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-medium text-white tracking-tight leading-[1.08] mb-5">
                        El auténtico sabor <br />
                        <span className="text-white px-2 font-black">
                            hecho con pasión.
                        </span>
                    </h1>

                    {/* Descripción */}
                    <p className="text-sm sm:text-base lg:text-lg text-white font-medium leading-relaxed mb-8 max-w-2xl">
                        Helado artesanal elaborado a diario con leche fresca de tambo local y frutas naturales seleccionadas. Pedí tus potes favoritos y disfrutalos en tu mesa en minutos.
                    </p>

                    {/* Botones de Acción */}
                    <div className="flex flex-wrap items-center justify-center gap-3.5 w-full sm:w-auto">
                        <button
                            onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                            className="btn rounded-full bg-black/15 hover:bg-black/35 text-white font-semibold px-7 py-3.5 text-xs sm:text-sm transition-all hover:-translate-y-0.5 border-none cursor-pointer"
                        >
                            <span>Pedí Online Ahora</span>
                        </button>

                        <Link
                            to="/nosotros"
                            className="btn rounded-full bg-black/15 hover:bg-black/35 text-white font-semibold px-7 py-3.5 text-xs sm:text-sm transition-all hover:-translate-y-0.5 border-none"
                        >
                            Conocé Nuestra Historia
                        </Link>
                    </div>

                    {/* Micro badges de confianza */}
                    <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-10 mt-10 pt-6 border-t-2 border-white/60 w-full max-w-xl mb-16">
                        <div className="flex items-center gap-2">
                            <FiCheckCircle className="text-white shrink-0 text-base" />
                            <span className="text-xs sm:text-sm font-bold text-white">100% Artesanal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaMotorcycle className="text-white shrink-0 text-sm" />
                            <span className="text-xs sm:text-sm font-bold text-white">Envíos en el día</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaStar className="text-white shrink-0 text-sm" />
                            <span className="text-xs sm:text-sm font-bold text-white">4.9 en Baradero</span>
                        </div>
                    </div>

                    {/* Indicadores / Puntos del Carrusel */}
                    <div className="flex items-center gap-2 mt-8 -mb-8">
                        {HERO_CAROUSEL_IMAGES.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => goToSlide(idx)}
                                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                                    currentSlide === idx ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white'
                                }`}
                                aria-label={`Ir a foto ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* CONTENIDO CENTRADO PARA EL RESTO DE LA TIENDA */}
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
                {/* SECCIÓN DEL MENÚ Y CATEGORÍAS */}
                <div id="categories" className="text-center mb-12 mt-16 scroll-mt-24">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-black-600 bg-gray-200 px-3 py-1 rounded-full">
                        Menú Digital
                    </span>
                    <h2 className="text-2xl sm:text-5xl font-black text-gray-900 tracking-tight mt-3">
                        ¿Qué tenés ganas de disfrutar hoy?
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-lg mx-auto">
                        Seleccioná los productos de la categoría que más te gusten y armá tu pedido.
                    </p>
                </div>

                {/* GRILLA DE CATEGORÍAS */}
                <CategoryGrid />

                {/* BANNER DESTACADO: PROMOS */}
                <div className="mt-14 bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-3xl overflow-hidden shadow-lg p-6 sm:p-10 text-white relative">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-8 z-10">
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest text-white inline-block mb-3">
                                PROMOS IMPERDIBLES
                            </span>
                            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                                Promociones que cuidan tu bolsillo, ¡aprovechalas!
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-100 mt-2 max-w-xl font-normal leading-relaxed">
                                Aprovechá todas nuestras promos y disfrutá de los mejores productos de Balbarani a precios especiales. Ideales para compartir en el río o llevar en conservadora.
                            </p>
                            <button
                                onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn btn-sm rounded-full bg-white text-gray-900 hover:bg-gray-100 font-bold px-6 border-none mt-5 gap-2 shadow-md cursor-pointer"
                            >
                                <span>Ver sabores en el catálogo</span>
                                <FaArrowRight size={10} />
                            </button>
                        </div>

                        <div className="md:col-span-4 flex justify-center">
                            <img
                                src="https://res.cloudinary.com/dzxa0ykpd/image/upload/v1790536700/DSC_1143_1_ktg4se.jpg"
                                alt="Promociones Balbarani"
                                className="w-48 h-48 sm:w-56 sm:h-56 object-cover rounded-2xl border-4 border-white/40 shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
