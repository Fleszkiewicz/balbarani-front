import { useState, useEffect } from 'react'
import { FaCheckCircle, FaChartLine, FaTruck, FaStore, FaHandshake, FaWhatsapp } from 'react-icons/fa'
import { Card } from '../components/ui'
import toast from 'react-hot-toast'

// 3 Fotografías para la sección Franquicias
const FRANQUICIAS_CAROUSEL_IMAGES = [
    'https://res.cloudinary.com/dzxa0ykpd/image/upload/v1790560574/DSC_2882_fjnfip.jpg',
    'https://res.cloudinary.com/dzxa0ykpd/image/upload/v1790560574/DSC_2913_zd1huv.jpg',
    'https://res.cloudinary.com/dzxa0ykpd/image/upload/v1790560574/DSC_5448_rhgosu.jpg',
]

const Franquicias = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [prevSlide, setPrevSlide] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        city: '',
        hasPremises: 'no',
        message: '',
    })
    const [sent, setSent] = useState(false)

    const goToSlide = (nextIndex) => {
        if (nextIndex === currentSlide) return
        setPrevSlide(currentSlide)
        setCurrentSlide(nextIndex)
    }

    // Rotación automática cada 7 segundos con combinación suave estilo CapCut
    useEffect(() => {
        const interval = setInterval(() => {
            setPrevSlide(currentSlide)
            setCurrentSlide((prev) => (prev + 1) % FRANQUICIAS_CAROUSEL_IMAGES.length)
        }, 7000)

        return () => clearInterval(interval)
    }, [currentSlide])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const text = encodeURIComponent(
            `¡Hola Balbarani! Me interesa información sobre franquicias.\nNombre: ${formData.name}\nCiudad: ${formData.city}\nTel: ${formData.phone}\nEmail: ${formData.email}\nLocal propio: ${formData.hasPremises}\nComentario: ${formData.message}`
        )
        window.open(`https://wa.me/5493329123456?text=${text}`, '_blank')
        setSent(true)
        toast.success('¡Solicitud enviada con éxito!')
    }

    return (
        <div className="pb-20">
            {/* HERO SECTION A ANCHO COMPLETO (100% de la pantalla) */}
            <div className="relative w-full overflow-hidden min-h-[540px] sm:min-h-[620px] lg:min-h-[660px] flex items-center justify-center">

                {/* 1. CARRUSEL CON SUPERPOSICIÓN CONTINUA + ANIMACIÓN COMBINAR DE CAPCUT */}
                {FRANQUICIAS_CAROUSEL_IMAGES.map((imgUrl, index) => {
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
                            Oportunidad de Negocio • Franquicias
                        </span>
                    </div>

                    {/* Titular Principal con tipografía y sombra suaves */}
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-medium text-white tracking-tight leading-[1.08] mb-5">
                        Abrí tu Heladería <br />
                        <span className="text-white px-2 font-black">
                            Balbarani.
                        </span>
                    </h1>

                    {/* Descripción */}
                    <p className="text-sm sm:text-base lg:text-lg text-white font-medium leading-relaxed mb-8 max-w-2xl">
                        Sumate a una marca con auténtica identidad artesanal, alta rentabilidad y un modelo de operación simple, probado y rentable.
                    </p>

                    {/* Botón de Acción con scroll al formulario */}
                    <div className="flex flex-wrap items-center justify-center gap-3.5 w-full sm:w-auto">
                        <button
                            onClick={() => document.getElementById('postulacion')?.scrollIntoView({ behavior: 'smooth' })}
                            className="btn rounded-full bg-black/15 hover:bg-black/35 text-white font-semibold px-7 py-3.5 text-xs sm:text-sm transition-all hover:-translate-y-0.5 border-none cursor-pointer"
                        >
                            Postulate como Franquiciado
                        </button>
                    </div>

                    {/* Micro badges de confianza / ventajas */}
                    <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-10 mt-10 pt-6 border-t-2 border-white/60 w-full max-w-xl mb-16">
                        <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-white">Alta Rentabilidad</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-white">Abastecimiento Garantizado</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-white">Soporte Continuo</span>
                        </div>
                    </div>

                    {/* Indicadores / Puntos del Carrusel */}
                    <div className="flex items-center gap-2 mt-8 -mb-8">
                        {FRANQUICIAS_CAROUSEL_IMAGES.map((_, idx) => (
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
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16">
                {/* Ventajas del Negocio en Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <Card className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-4">
                            <FaChartLine />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Alta Rentabilidad</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Producto de consumo masivo con márgenes sólidos y rápido recupero de la inversión inicial.
                        </p>
                    </Card>

                    <Card className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-4">
                            <FaTruck />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Abastecimiento Garantizado</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Te enviamos el producto terminado listo para despachar, conservando la máxima calidad sin necesidad de fábrica en tu local.
                        </p>
                    </Card>

                    <Card className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl mb-4">
                            <FaStore />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Soporte Continuo</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Te asesoramos en la elección del punto comercial, diseño del local y capacitación integral de tu equipo.
                        </p>
                    </Card>
                </div>

                {/* Formulario de Postulación */}
                <div id="postulacion" className="scroll-mt-24">
                    <Card className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 text-xl">
                                <FaHandshake />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Postulate como Franquiciado</h2>
                            <p className="text-xs text-gray-500 mt-1">Completá el formulario y nuestro equipo comercial se comunicará a la brevedad.</p>
                        </div>

                        {sent ? (
                            <div className="text-center py-8">
                                <FaCheckCircle className="text-emerald-500 text-5xl mx-auto mb-3" />
                                <h3 className="text-xl font-bold text-gray-900">¡Gracias por tu interés!</h3>
                                <p className="text-xs text-gray-500 mt-2 mb-6">Hemos recibido tus datos y te contactaremos en breve.</p>
                                <button onClick={() => setSent(false)} className="btn btn-sm btn-ghost cursor-pointer">Enviar otra consulta</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label text-xs font-bold text-gray-600">Nombre y Apellido</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Ej: Laura Martínez"
                                            className="input input-bordered w-full rounded-2xl bg-gray-50/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="label text-xs font-bold text-gray-600">Teléfono (con WhatsApp)</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Ej: 3329 123456"
                                            className="input input-bordered w-full rounded-2xl bg-gray-50/50"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label text-xs font-bold text-gray-600">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="tu@correo.com"
                                            className="input input-bordered w-full rounded-2xl bg-gray-50/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="label text-xs font-bold text-gray-600">Ciudad / Localidad de Interés</label>
                                        <input
                                            type="text"
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="Ej: San Pedro / Zárate"
                                            className="input input-bordered w-full rounded-2xl bg-gray-50/50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label text-xs font-bold text-gray-600">¿Contás con local comercial?</label>
                                    <select
                                        name="hasPremises"
                                        value={formData.hasPremises}
                                        onChange={handleChange}
                                        className="select select-bordered w-full rounded-2xl bg-gray-50/50 text-sm"
                                    >
                                        <option value="no">No, estoy en búsqueda</option>
                                        <option value="propio">Sí, cuento con local propio</option>
                                        <option value="alquiler">Sí, cuento con local alquilado</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="label text-xs font-bold text-gray-600">Mensaje o Comentarios (Opcional)</label>
                                    <textarea
                                        name="message"
                                        rows={3}
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Contanos sobre tu experiencia o tus dudas..."
                                        className="textarea textarea-bordered w-full rounded-2xl bg-gray-50/50"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="mt-2 rounded-full bg-neutral py-3.5 font-bold text-white transition-all hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <FaWhatsapp className="text-emerald-400 text-lg" /> Enviar Solicitud por WhatsApp
                                </button>
                            </form>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Franquicias
