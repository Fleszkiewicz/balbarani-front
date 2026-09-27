import { useState } from 'react'
import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp, FaClock, FaStar } from 'react-icons/fa'
import { Badge, Card } from '../components/ui'
import toast from 'react-hot-toast'

const Contacto = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [sending, setSending] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setSending(true)
        setTimeout(() => {
            setSending(false)
            setForm({ name: '', email: '', message: '' })
            toast.success('¡Mensaje enviado con éxito! Te responderemos pronto.')
        }, 1000)
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <div className="flex justify-center mb-4">
                    <Badge variant="warning" className="px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full">
                        Atención al Cliente
                    </Badge>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-2">
                    Estamos para Ayudarte
                </h1>
                <p className="text-gray-500 text-sm sm:text-base">
                    Vení a visitarnos a nuestro local en Baradero o comunicate directamente con nosotros.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Columna Izquierda: Datos, WhatsApp y Mapa */}
                <div className="lg:col-span-6 flex flex-col gap-6">
                    {/* Tarjeta de Información */}
                    <Card className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Información de Contacto</h2>

                        <div className="flex items-start gap-3 text-sm text-gray-600">
                            <FaMapMarkerAlt className="text-red-500 mt-1 shrink-0 text-base" />
                            <div>
                                <p className="font-bold text-gray-800">Dirección</p>
                                <p className="text-gray-500 text-xs">Baradero, Provincia de Buenos Aires, Argentina</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 text-sm text-gray-600">
                            <FaClock className="text-amber-500 mt-1 shrink-0 text-base" />
                            <div>
                                <p className="font-bold text-gray-800">Horarios de Atención</p>
                                <p className="text-gray-500 text-xs">Lunes a Jueves: 14:00 a 00:00 hs</p>
                                <p className="text-gray-500 text-xs">Viernes a Domingos: 12:00 a 01:00 hs</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 text-sm text-gray-600">
                            <FaPhoneAlt className="text-emerald-500 mt-1 shrink-0 text-sm" />
                            <div>
                                <p className="font-bold text-gray-800">Teléfono / WhatsApp</p>
                                <p className="text-gray-500 text-xs">+54 9 3329 123456</p>
                            </div>
                        </div>

                        {/* Botón WhatsApp directo */}
                        <a
                            href="https://wa.me/5493329123456?text=¡Hola%20Balbarani!%20Tengo%20una%20consulta."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 btn rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 text-sm border-none shadow-sm"
                        >
                            <FaWhatsapp size={18} /> Chatear por WhatsApp
                        </a>
                    </Card>

                    {/* Mapa de Baradero embebido */}
                    <Card className="bg-white p-3 rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-64">
                        <iframe
                            title="Ubicación Balbarani Baradero"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26573.74328574366!2d-59.52494957973059!3d-33.811804753965955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95ba2898dbf5b5b9%3A0x6b4aa3664d5c8088!2sBaradero%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar"
                            className="w-full h-full rounded-2xl border-none"
                            loading="lazy"
                        />
                    </Card>
                </div>

                {/* Columna Derecha: Formulario & Reseñas */}
                <div className="lg:col-span-6 flex flex-col gap-6">
                    {/* Formulario */}
                    <Card className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Dejanos un Mensaje</h2>
                        <p className="text-xs text-gray-500 mb-6">Completá el formulario para consultas, sugerencias o eventos.</p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="label text-xs font-bold text-gray-600">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Tu nombre"
                                    className="input input-bordered w-full rounded-2xl bg-gray-50/50"
                                />
                            </div>

                            <div>
                                <label className="label text-xs font-bold text-gray-600">Correo Electrónico</label>
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="tu@correo.com"
                                    className="input input-bordered w-full rounded-2xl bg-gray-50/50"
                                />
                            </div>

                            <div>
                                <label className="label text-xs font-bold text-gray-600">Mensaje</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    placeholder="¿En qué te podemos ayudar?"
                                    className="textarea textarea-bordered w-full rounded-2xl bg-gray-50/50 text-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="btn rounded-full bg-neutral text-white hover:bg-neutral-800 font-bold mt-2"
                            >
                                {sending ? 'Enviando...' : 'Enviar Mensaje'}
                            </button>
                        </form>
                    </Card>

                    {/* Reseñas Google Maps */}
                    <Card className="bg-amber-50/60 p-6 rounded-3xl border border-amber-100 shadow-none">
                        <div className="flex items-center gap-1.5 text-amber-500 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} size={15} />
                            ))}
                            <span className="text-xs font-bold text-gray-700 ml-2">4.9 / 5 en Google Maps</span>
                        </div>
                        <p className="text-xs text-gray-600 italic">
                            "El mejor helado artesanal de Baradero sin dudas. El dulce de leche granizado y el pistacho son de otro planeta."
                        </p>
                        <p className="text-[11px] font-semibold text-gray-500 mt-2">— Cliente Verificado</p>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Contacto