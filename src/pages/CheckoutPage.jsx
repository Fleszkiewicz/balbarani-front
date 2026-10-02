import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/cartContextData"
import { useUser } from "../context/userContextData"
import { createOrderService } from "../services/orderServices"
import { formatExtrasSummary, formatFlavorSummary } from "../utils/artisanIceCream"
import toast from 'react-hot-toast'
import { getDeliveryFeeService } from "../services/settingServices"
import {
    TbCreditCard,
    TbCash,
    TbTruckDelivery,
    TbArrowLeft,
    TbShoppingBag,
    TbCheck,
    TbBuildingStore,
    TbShoppingBagCheck
} from 'react-icons/tb'

const CheckoutPage = () => {
    const { cart, total, itemsQuantity, clearCart } = useCart()
    const { userInfo, isAuthenticated, loading: userLoading } = useUser()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        phone: '',
        address: '',
        paymentMethod: 'mercadopago', // default
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [orderCompleted, setOrderCompleted] = useState(null)
    const [deliveryFee, setDeliveryFee] = useState(0)

    // Precompletar el formulario con los datos guardados del perfil
    useEffect(() => {
        getDeliveryFeeService().then(setDeliveryFee)
        if (userInfo) {
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
            toast.error('Debes completar todos los datos de entrega para continuar')
            return
        }

        try {
            setIsSubmitting(true)

            const cleanPhone = formData.phone.trim().replace(/^\+54\s*/, '')
            const fullPhone = `+54 ${cleanPhone}`

            const response = await createOrderService({
                name: formData.name,
                lastName: formData.lastName,
                phone: fullPhone,
                address: formData.address,
                paymentMethod: formData.paymentMethod,
            })

            // 1. Redirección si eligió Mercado Pago
            if (formData.paymentMethod === 'mercadopago' && response.init_point) {
                toast.loading('Redirigiendo a Mercado Pago...')
                window.location.href = response.init_point
                return
            }

            // 2. Pantalla de confirmación para pago en efectivo
            if (formData.paymentMethod === 'efectivo') {
                toast.success('¡Pedido realizado con éxito!')
                setOrderCompleted(response.order)
                if (clearCart) clearCart()
            }
        } catch (error) {
            console.error('Error al confirmar compra:', error)
            toast.error(error.message || 'Ocurrió un error al procesar la compra')
        } finally {
            setIsSubmitting(false)
        }
    }

    // 1. Pantalla de Pedido Confirmado en Efectivo
    if (orderCompleted) {
        const orderCode = orderCompleted._id ? orderCompleted._id.slice(-6).toUpperCase() : ''

        return (
            <main className="max-w-xl mx-auto px-4 py-16 text-center">
                <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200/90 shadow-sm flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                        <TbCheck size={32} />
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">¡Pedido Confirmado!</h1>
                    <p className="text-gray-500 text-xs sm:text-sm mb-6 max-w-md">
                        Gracias por tu compra. Prepararemos tu pedido en la heladería y lo abonás en efectivo al momento de recibirlo.
                    </p>

                    <div className="w-full bg-gray-50 rounded-2xl p-4 text-left mb-6 text-xs flex flex-col gap-2 border border-gray-200/70">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                            <span className="text-gray-500 font-medium">Nº de Comanda:</span>
                            <span className="font-mono font-black text-gray-900 bg-white px-2.5 py-0.5 rounded-lg border border-gray-200">
                                #{orderCode}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-gray-500">
                            <span>Dirección de entrega:</span>
                            <span className="font-semibold text-gray-800 text-right truncate max-w-[200px]">{formData.address}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-500">
                            <span>Receptor:</span>
                            <span className="font-medium text-gray-800">{formData.name} {formData.lastName}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200/60 text-sm">
                            <span className="font-bold text-gray-800">Total a abonar:</span>
                            <span className="font-bold text-base text-gray-900">${orderCompleted.total}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <Link
                            to="/mis-compras"
                            className="flex-1 rounded-xl bg-neutral hover:bg-black/90 px-4 py-2.5 text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors shadow-xs"
                        >
                            <TbShoppingBagCheck size={18} />
                            <span>Ver estado de mi pedido</span>
                        </Link>
                        <Link
                            to="/"
                            className="rounded-xl bg-gray-200 hover:bg-gray-300 px-4 py-2.5 text-sm font-medium text-gray-800 flex items-center justify-center gap-2 transition-colors"
                        >
                            <TbBuildingStore size={18} />
                            <span>Ir a la tienda</span>
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    // 2. Pantalla si el carrito está vacío
    if (!userLoading && cart.length === 0) {
        return (
            <main className="max-w-md mx-auto px-4 py-20 text-center">
                <div className="bg-white p-8 rounded-3xl border border-gray-200/90 shadow-sm flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 mb-4">
                        <TbShoppingBag size={28} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Tu carrito está vacío</h2>
                    <p className="text-gray-500 mb-6 text-xs sm:text-sm">
                        Agregá tus helados y productos favoritos para continuar con la compra.
                    </p>
                    <Link
                        to="/"
                        className="rounded-xl bg-neutral hover:bg-black/90 px-5 py-2 text-sm font-medium text-white flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                        <TbBuildingStore size={18} />
                        <span>Ver catálogo</span>
                    </Link>
                </div>
            </main>
        )
    }

    // Calculamos el total final sumando el costo de envío
    const grandTotal = total + (Number(deliveryFee) || 0)

    return (
        <main className="mx-auto w-full max-w-md sm:max-w-2xl md:max-w-2xl lg:max-w-6xl px-4 sm:px-6 py-8">
            {/* Cabecera */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 mt-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                        Finalizar Compra
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-normal">
                        Completá tus datos de entrega y seleccioná el método de pago.
                    </p>
                </div>

                <Link
                    to="/"
                    className="rounded-xl bg-neutral hover:bg-black/90 px-4 py-1.5 gap-1.5 text-sm font-normal text-white flex items-center transition-colors shadow-xs"
                >
                    <TbArrowLeft size={16} />
                    <span>Volver a la tienda</span>
                </Link>
            </div>

            {/* Formulario y Resumen */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Columna Izquierda: Datos de Entrega + Método de Pago */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    {/* 1. Datos de Entrega */}
                    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-200/90 shadow-2xs">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                                <TbTruckDelivery size={16} />
                            </span>
                            <h2 className="text-base font-bold text-gray-900">1. Datos de Entrega</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ej: Juan"
                                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-neutral text-gray-900 font-normal transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Apellido</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Ej: Pérez"
                                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-neutral text-gray-900 font-normal transition-all"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Teléfono de contacto
                                </label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-700 font-semibold text-xs select-none">
                                        +54
                                    </span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Ej: 3329 123456"
                                        className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-l-none rounded-r-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-neutral text-gray-900 font-normal transition-all"
                                    />
                                </div>
                                <span className="text-[11px] text-gray-400 mt-1 block">
                                    Ingresá tu número con característica (sin 0 ni 15).
                                </span>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Dirección exacta</label>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Ej: Av. San Martín 1234, Dpto 2B"
                                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-neutral text-gray-900 font-normal transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. Método de Pago */}
                    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-200/90 shadow-2xs">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                                <TbCreditCard size={16} />
                            </span>
                            <h2 className="text-base font-bold text-gray-900">2. Método de Pago</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {/* Mercado Pago */}
                            <label
                                className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col justify-between transition-all ${formData.paymentMethod === 'mercadopago'
                                        ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/40'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg">
                                        <TbCreditCard size={18} />
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
                                    <h3 className="font-bold text-gray-900 text-sm">Mercado Pago</h3>
                                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                        Tarjetas de débito, crédito o dinero en cuenta oficial.
                                    </p>
                                </div>
                            </label>

                            {/* Efectivo */}
                            <label
                                className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col justify-between transition-all ${formData.paymentMethod === 'efectivo'
                                        ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/40'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg">
                                        <TbCash size={18} />
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
                                    <h3 className="font-bold text-gray-900 text-sm">Efectivo</h3>
                                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                        Abonás en efectivo cuando recibís el pedido en tu puerta.
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Resumen de Compra */}
                <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-gray-200/90 shadow-2xs flex flex-col gap-4 lg:sticky lg:top-24">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <h2 className="text-base font-bold text-gray-900">Resumen del Pedido</h2>
                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-lg">
                            {itemsQuantity} {itemsQuantity === 1 ? 'artículo' : 'artículos'}
                        </span>
                    </div>

                    {/* Lista resumida de productos */}
                    <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1 divide-y divide-gray-100">
                        {cart.map((item) => {
                            const flavorSummary = formatFlavorSummary(item.configuration)
                            const extrasSummary = formatExtrasSummary(item.configuration)
                            const linePrice = (item.unitTotal ?? item.price) * item.quantity

                            return (
                                <div key={item.cartLineKey} className="flex gap-3 pt-2.5 first:pt-0">
                                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">Sin foto</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline font-semibold text-xs sm:text-sm text-gray-800">
                                            <span className="truncate pr-1">{item.name}</span>
                                            <span className="shrink-0 font-bold text-gray-900">${linePrice}</span>
                                        </div>
                                        <p className="text-[11px] text-gray-400 mt-0.5">Cantidad: {item.quantity}</p>
                                        {flavorSummary && (
                                            <p className="text-[11px] text-gray-600 mt-1 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200/60 font-normal line-clamp-1">
                                                <span className="font-medium text-gray-700">Sabores:</span> {flavorSummary}
                                            </p>
                                        )}
                                        {extrasSummary && (
                                            <p className="text-[10px] text-gray-500 mt-0.5">
                                                + Extras: {extrasSummary}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Desglose de Totales */}
                    <div className="pt-3 border-t border-gray-100 flex flex-col gap-1.5 text-xs">
                        <div className="flex justify-between text-gray-500">
                            <span>Subtotal productos:</span>
                            <span className="font-medium text-gray-800">${total}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Costo de envío:</span>
                            <span className="font-semibold text-emerald-600">
                                {deliveryFee > 0 ? `$${deliveryFee}` : 'Gratis'}
                            </span>
                        </div>
                        <div className="flex justify-between items-baseline pt-2.5 border-t border-gray-100 mt-1">
                            <span className="font-bold text-xs uppercase tracking-wider text-gray-800">Total a abonar:</span>
                            <span className="font-black text-xl text-gray-900">
                                ${grandTotal}
                            </span>
                        </div>
                    </div>

                    {/* Botón de Confirmación Principal */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 rounded-xl font-medium text-sm text-white transition-all shadow-xs flex items-center justify-center gap-2 bg-neutral hover:bg-black/90 disabled:opacity-50 cursor-pointer mt-1"
                    >
                        {isSubmitting ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : formData.paymentMethod === 'mercadopago' ? (
                            <>
                                <TbCreditCard size={18} />
                                <span>Pagar con Mercado Pago</span>
                            </>
                        ) : (
                            <>
                                <TbCash size={18} />
                                <span>Confirmar pedido en efectivo</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </main>
    )
}

export default CheckoutPage
