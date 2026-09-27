import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/cartContextData"
import { useUser } from "../context/userContextData"
import { createOrderService } from "../services/orderServices"
import { formatExtrasSummary, formatFlavorSummary } from "../utils/artisanIceCream"
import { FaMoneyBillWave, FaCreditCard, FaCheckCircle, FaArrowLeft, FaShoppingBag } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { getDeliveryFeeService } from "../services/settingServices"

const CheckoutPage = () => {
    const { cart, total, itemsQuantity, clearCart } = useCart()
    const { userInfo, isAuthenticated, loading: userLoading } = useUser()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        paymentMethod: 'mercadopago', //default
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [orderCompleted, setOrderCompleted] = useState(null)
    const [deliveryFee, setDeliveryFee] = useState(0)

    // Precompletar el form con los datos guardados del perfil
    useEffect(() => {
        getDeliveryFeeService().then(setDeliveryFee)
        if (userInfo) {
            // Si ya tenía +54 guardado, se lo quitamos visualmente para que no se repita en el input
            const localPhone = (userInfo.phone || '').replace(/^\+54\s*/, '')

            setFormData((prev) => ({
                ...prev,
                name: userInfo.name || '',
                lastName: userInfo.lastName || '',
                phone: localPhone,
                address: userInfo.address || ''
            }))
        }
    }, [userInfo])



    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!isAuthenticated()) {
            toast.error('Debes iniciar sesión para completar tu pedido')
            navigate('/login')
            return
        }

        if (cart.length === 0) {
            toast.error('Tu carrito está vacío')
            return
        }

        if (!formData.name.trim() || !formData.lastName.trim() || !formData.phone.trim() || !formData.address.trim()) {
            toast.error('Debes completar todos los datos de envío para continuar')
            return
        }

        try {
            setIsSubmitting(true)

            // Nos aseguramos de que se guarde con el prefijo +54
            const cleanPhone = formData.phone.trim().replace(/^\+54\s*/, '')
            const fullPhone = `+54 ${cleanPhone}`

            const response = await createOrderService({
                name: formData.name,
                lastName: formData.lastName,
                phone: formData.phone,
                address: formData.address,
                paymentMethod: formData.paymentMethod,
            })

            //1. si eligio Mercado Pago, sera redirigido a su checkout
            if (formData.paymentMethod === 'mercadopago' && response.init_point) {
                toast.loading('Redirigiendo a Mercado Pago...')
                window.location.href = response.init_point
                return
            }

            //2. si eligio efectivo, se muestra pantalla de éxito
            if (formData.paymentMethod === 'efectivo') {
                toast.success('¡Pedido realizado con éxito!')
                setOrderCompleted(response.order)
                if (clearCart) clearCart()
            }
        } catch (error) {
            console.error('error al confirmar compra:', error)
            toast.error(error.message || 'Ocurrió un error al procesar la compra')
        } finally {
            setIsSubmitting(false)
        }

    }
    // Pantalla de Pedido Confirmado en Efectivo
    if (orderCompleted) {
        return (
            <main className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                    <FaCheckCircle className="text-6xl text-emerald-500 mb-4 animate-bounce" />
                    <h1 className="text-3xl font-black text-gray-900 mb-2">¡Pedido Confirmado!</h1>
                    <p className="text-gray-600 mb-6">
                        Gracias por tu compra. Prepararemos tu pedido y lo abonás en efectivo al momento de recibirlo.
                    </p>
                    <div className="w-full bg-gray-50 rounded-2xl p-4 text-left mb-6 text-sm">
                        <p className="text-gray-500 font-medium">Nº de Pedido: <span className="text-gray-900 font-semibold text-base">{orderCompleted._id}</span></p>
                        <p className="text-gray-500 font-medium mt-1">Dirección de entrega: <span className="text-gray-900 font-semibold text-base">{formData.address}</span></p>
                        <p className="text-gray-500 font-medium mt-1">Total a abonar: <span className="text-gray-900 font-bold text-base">${orderCompleted.total}</span></p>
                    </div>
                    <Link
                        to="/"
                        className="btn btn-neutral rounded-full px-8 font-semibold"
                    >
                        Volver a la tienda
                    </Link>
                </div>
            </main>
        )
    }
    // Si el carrito está vacío y no venimos de completar la orden
    if (!userLoading && cart.length === 0) {
        return (
            <main className="max-w-md mx-auto px-4 py-20 text-center">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                    <FaShoppingBag className="text-5xl text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
                    <p className="text-gray-500 mb-6 text-sm">Agregá tus productos favoritos para continuar con la compra.</p>
                    <Link to="/" className="btn btn-neutral rounded-full px-8">
                        Ver Catálogo
                    </Link>
                </div>
            </main>
        )
    }
    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors font-medium">
                <FaArrowLeft /> Volver a la tienda
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8">
                Finalizar Compra
            </h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Columna Izquierda: Formulario + Método de Pago */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    {/* Datos de Entrega */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">1. Datos de Entrega</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="label text-xs font-bold text-gray-600 uppercase tracking-wider">Nombre</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ej: Juan"
                                    className="input input-bordered w-full rounded-xl bg-gray-50/50 focus:bg-white"
                                />
                            </div>
                            <div>
                                <label className="label text-xs font-bold text-gray-600 uppercase tracking-wider">Apellido</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Ej: Pérez"
                                    className="input input-bordered w-full rounded-xl bg-gray-50/50 focus:bg-white"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="label text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Teléfono de Contacto
                                </label>
                                <div className="flex">
                                    {/* Prefijo fijo +54 */}
                                    <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-300 bg-gray-100 text-gray-700 font-bold text-sm select-none">
                                        +54
                                    </span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Ej: 3329 123456"
                                        className="input input-bordered w-full rounded-l-none rounded-r-xl bg-gray-50/50 focus:bg-white"
                                    />
                                </div>
                                <span className="text-[11px] text-gray-400 mt-1 pl-1">
                                    Ingresá tu número con característica sin el 0 ni el 15.
                                </span>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="label text-xs font-bold text-gray-600 uppercase tracking-wider">Dirección de Entrega</label>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Ej: Av. San Martín 1234, Piso 2 Depto B"
                                    className="input input-bordered w-full rounded-xl bg-gray-50/50 focus:bg-white"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Método de Pago */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">2. Método de Pago</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Opción Mercado Pago */}
                            <label
                                className={`cursor-pointer border-2 rounded-2xl p-5 flex flex-col justify-between transition-all ${formData.paymentMethod === 'mercadopago'
                                    ? 'border-blue-500 bg-blue-50/30 shadow-sm'
                                    : 'border-gray-100 hover:border-gray-200'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="p-2.5 rounded-xl bg-blue-100 text-blue-600 text-lg">
                                        <FaCreditCard />
                                    </span>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="mercadopago"
                                        checked={formData.paymentMethod === 'mercadopago'}
                                        onChange={handleChange}
                                        className="radio radio-primary radio-sm"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Mercado Pago</h3>
                                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                        Tarjetas de crédito, débito o dinero en cuenta con Checkout oficial.
                                    </p>
                                </div>
                            </label>
                            {/* Opción Efectivo */}
                            <label
                                className={`cursor-pointer border-2 rounded-2xl p-5 flex flex-col justify-between transition-all ${formData.paymentMethod === 'efectivo'
                                    ? 'border-emerald-500 bg-emerald-50/30 shadow-sm'
                                    : 'border-gray-100 hover:border-gray-200'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600 text-lg">
                                        <FaMoneyBillWave />
                                    </span>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="efectivo"
                                        checked={formData.paymentMethod === 'efectivo'}
                                        onChange={handleChange}
                                        className="radio radio-primary radio-sm"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Efectivo</h3>
                                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                        Abonás en efectivo cuando recibís el pedido en tu domicilio.
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
                {/* Columna Derecha: Resumen de Compra */}
                <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-6 lg:sticky lg:top-24">
                    <h2 className="text-xl font-bold text-gray-900">Resumen del Pedido</h2>
                    {/* Lista resumida de productos */}
                    <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
                        {cart.map((item) => {
                            const flavorSummary = formatFlavorSummary(item.configuration)
                            const extrasSummary = formatExtrasSummary(item.configuration)
                            const linePrice = (item.unitTotal ?? item.price) * item.quantity
                            return (
                                <div key={item.cartLineKey} className="flex gap-3 py-2 border-b border-gray-50 last:border-none">
                                    <div className="w-14 h-14 rounded-xl bg-gray-50 overflow-hidden shrink-0">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Sin foto</div>
                                        )}
                                    </div>
                                    <div className="flex-1 text-sm">
                                        <div className="flex justify-between font-semibold text-gray-800">
                                            <span>{item.name}</span>
                                            <span>${linePrice}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">Cant: {item.quantity}</p>
                                        {flavorSummary && (
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                                <span className="font-medium">Sabores:</span> {flavorSummary}
                                            </p>
                                        )}
                                        {extrasSummary && (
                                            <p className="text-xs text-gray-500 line-clamp-1">
                                                <span className="font-medium">Extras:</span> {extrasSummary}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {/* Totales */}
                    <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Artículos ({itemsQuantity})</span>
                            <span>${total}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Envío (Delivery)</span>
                            <span className="text-emerald-600 font-semibold">
                                {deliveryFee > 0 ? `$${deliveryFee}` : 'Gratis'}
                            </span>
                        </div>
                        <div className="flex justify-between text-xl font-black text-gray-900 pt-2 border-t border-gray-100">
                            <span>Total</span>
                            <span>${total}</span>
                        </div>
                    </div>
                    {/* Botón de Confirmación */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full h-14 rounded-full font-semibold  text-base text-white transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${formData.paymentMethod === 'mercadopago'
                            ? 'bg-[#02BEFE] hover:bg-[#009BEB]'
                            : 'bg-green-500 hover:bg-green-600'
                            }`}
                    >
                        {isSubmitting ? (
                            <span className="loading loading-spinner loading-md"></span>
                        ) : formData.paymentMethod === 'mercadopago' ? (
                            'Pagar con Mercado Pago'
                        ) : (
                            'Confirmar Pedido en Efectivo'
                        )}
                    </button>
                </div>
            </form>
        </main>
    )
}
export default CheckoutPage

