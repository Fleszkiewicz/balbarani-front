import { useState } from 'react'
import { FaCheckCircle, FaChartLine, FaTruck, FaStore, FaHandshake, FaWhatsapp } from 'react-icons/fa'
import { Badge, Card } from '../components/ui'
import toast from 'react-hot-toast'

const Franquicias = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        city: '',
        hasPremises: 'no',
        message: '',
    })
    const [sent, setSent] = useState(false)

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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
            {/* Cabecera */}
            <div className="text-center max-w-2xl mx-auto mb-16">
                <div className="flex justify-center mb-4">
                    <Badge variant="success" className="px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full">
                        Oportunidad de Negocio
                    </Badge>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
                    Abrí tu Heladería Balbarani
                </h1>
                <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
                    Sumate a una marca con identidad artesanal, alta rentabilidad y un modelo de operación simple y probado.
                </p>
            </div>

            {/* Ventajas del Negocio en Cards de Astryx */}
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
                        <button onClick={() => setSent(false)} className="btn btn-sm btn-ghost">Enviar otra consulta</button>
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
                            className="mt-2 rounded-full bg-neutral py-3.5 font-bold text-white transition-all hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            <FaWhatsapp className="text-emerald-400 text-lg" /> Enviar Solicitud por WhatsApp
                        </button>
                    </form>
                )}
            </Card>
        </div>
    )
}

export default Franquicias