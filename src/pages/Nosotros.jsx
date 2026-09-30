import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaIceCream, FaHeart, FaAward, FaSeedling, FaArrowRight } from 'react-icons/fa'
import { Card, Divider } from '../components/ui'

// 4 Fotografías de la heladería para la sección Nosotros
const NOSOTROS_CAROUSEL_IMAGES = [
    'https://res.cloudinary.com/dzxa0ykpd/image/upload/v1790554670/DSC_2805_q0dplf.jpg',
    'https://res.cloudinary.com/dzxa0ykpd/image/upload/v1790560574/DSC_2937_ryt8v8.jpg',
    'https://res.cloudinary.com/dzxa0ykpd/image/upload/v1790554670/DSC_2798_rdrgq7.jpg',
    'https://res.cloudinary.com/dzxa0ykpd/image/upload/v1790554670/DSC_2674_cyf20z.jpg',
]

const Nosotros = () => {
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
            setCurrentSlide((prev) => (prev + 1) % NOSOTROS_CAROUSEL_IMAGES.length)
        }, 7000)

        return () => clearInterval(interval)
    }, [currentSlide])

    return (
        <div className="pb-20">
            {/* HERO SECTION A ANCHO COMPLETO (100% de la pantalla) */}
            <div className="relative w-full overflow-hidden min-h-[540px] sm:min-h-[620px] lg:min-h-[660px] flex items-center justify-center">

                {/* 1. CARRUSEL CON SUPERPOSICIÓN CONTINUA + ANIMACIÓN COMBINAR DE CAPCUT */}
                {NOSOTROS_CAROUSEL_IMAGES.map((imgUrl, index) => {
                    const isCurrent = currentSlide === index
                    const isPrev = prevSlide === index

                    return (
                        <div
                            key={index}
                            className={`absolute inset-0 w-full h-full brightness-50 pointer-events-none ${
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
                            Tradición Artesanal • Baradero
                        </span>
                    </div>

                    {/* Titular Principal con sombra centrada y suave */}
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-medium text-white tracking-tight leading-[1.08] mb-5">
                        Nuestra Pasión <br />
                        <span className="text-white px-2 font-black">
                            por el Helado.
                        </span>
                    </h1>

                    {/* Descripción */}
                    <p className="text-sm sm:text-base lg:text-lg text-white font-medium leading-relaxed mb-8 max-w-2xl">
                        Nacidos en Baradero con el sueño de ofrecer un helado auténtico, cremoso y elaborado todos los días con materias primas nobles y recetas de tradición familiar.
                    </p>

                    {/* Botones de Acción */}
                    <div className="flex flex-wrap items-center justify-center gap-3.5 w-full sm:w-auto">
                        <Link
                            to="/"
                            className="btn rounded-full bg-black/15 hover:bg-black/35 text-white font-semibold px-7 py-3.5 text-xs sm:text-sm transition-all hover:-translate-y-0.5 border-none"
                        >
                            Ir a la Tienda Online
                        </Link>
                    </div>

                    {/* Micro badges de confianza / pilares */}
                    <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-10 mt-10 pt-6 border-t-2 border-white/60 w-full max-w-xl mb-16">
                        <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-white">100% Artesanal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-white">Elaboración Diaria</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-white">De Baradero a tu mesa</span>
                        </div>
                    </div>

                    {/* Indicadores / Puntos del Carrusel */}
                    <div className="flex items-center gap-2 mt-8 -mb-8">
                        {NOSOTROS_CAROUSEL_IMAGES.map((_, idx) => (
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

            {/* CONTENIDO CENTRADO PARA EL RESTO DE LA PÁGINA */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16">
                {/* Historia en Card Elegante */}
                <Card className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaHeart className="text-red-500 text-xl" /> De Baradero a tu mesa
                    </h2>
                    <div className="flex flex-col gap-4 text-gray-600 leading-relaxed text-sm sm:text-base">
                        <p>
                            En <strong>Balbarani</strong> creemos que un buen helado no es un producto industrial más: es un momento de encuentro, una pausa en el día y una sonrisa compartida con los que más querés.
                        </p>
                        <p>
                            Desde nuestro inicio en la ciudad de Baradero, apostamos a la receta artesanal tradicional: sin premezclas artificiales ni conservantes innecesarios. Cada crema, chocolate y dulce de leche nace del balance perfecto entre leche pura, frutas frescas de estación y una paciencia infinita.
                        </p>
                        <p>
                            Con el tiempo incorporamos tecnología para que puedas armar tus potes favoritos desde la web y recibirlos en minutos en tu domicilio, manteniendo intacta la frescura de nuestro mostrador.
                        </p>
                    </div>
                </Card>

                <Divider className="my-10" />

                {/* 3 Pilares en Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <Card className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 text-xl">
                            <FaSeedling />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Ingredientes Reales</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Chocolates de primera línea, dulce de leche repostero y pulpas de frutas naturales seleccionadas.
                        </p>
                    </Card>

                    <Card className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 text-xl">
                            <FaIceCream />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Elaboración Diaria</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Cuidamos la textura y cremosidad en cada bacha para que siempre llegue fresco a tu mesa.
                        </p>
                    </Card>

                    <Card className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-xl">
                            <FaAward />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Identidad Baraderense</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Orgullosos de ser parte de nuestra comunidad y de endulzar cada momento especial de la ciudad.
                        </p>
                    </Card>
                </div>

                {/* CTA para pedir online */}
                <div className="bg-neutral text-white rounded-3xl p-8 sm:p-10 text-center flex flex-col items-center">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-2">¿Querés probar la diferencia?</h3>
                    <p className="text-gray-300 text-sm max-w-md mb-6">
                        Explorá nuestros sabores artesanales y hacé tu pedido online ahora mismo.
                    </p>
                    <Link
                        to="/"
                        className="btn bg-white text-gray-900 hover:bg-gray-100 rounded-full px-8 font-bold border-none flex items-center gap-2"
                    >
                        Ir a la tienda <FaArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Nosotros
