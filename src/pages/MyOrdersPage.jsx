import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyOrdersService } from '../services/orderServices'
import { formatFlavorSummary, formatExtrasSummary } from '../utils/artisanIceCream'
import { useUser } from '../context/userContextData'
import {
    FaCreditCard,
    FaMoneyBillWave,
    FaMotorcycle,
    FaCheckCircle,
    FaClock,
    FaShoppingBag,
    FaWhatsapp,
    FaChevronDown,
    FaChevronUp,
    FaSyncAlt,
    FaFire,
    FaMapMarkerAlt
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { TbMapPin } from 'react-icons/tb'


// Pasos del flujo de preparación de la heladería
const ORDER_STEPS = [
    { key: 'pendiente', label: 'Recibido', icon: FaClock },
    { key: 'en_preparacion', label: 'En preparación', icon: FaFire },
    { key: 'en_camino', label: 'En camino', icon: FaMotorcycle },
    { key: 'entregado', label: 'Entregado', icon: FaCheckCircle }
]

// Helper para determinar el índice del paso actual
const getStepIndex = (status) => {
    switch (status) {
        case 'pendiente': return 0
        case 'en_preparacion': return 1
        case 'en_camino': return 2
        case 'entregado': return 3
        default: return 0
    }
}

// Helper para armar link directo de consulta a WhatsApp
const getWhatsAppHelpLink = (orderCode) => {
    const message = encodeURIComponent(
        `¡Hola Heladería Balbarani! Quisiera consultar sobre el estado de mi pedido #${orderCode}.`
    )
    return `https://wa.me/5493329123456?text=${message}`
}

const MyOrdersPage = () => {
    const { userInfo, loading: userLoading } = useUser()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [expandedHistory, setExpandedHistory] = useState({})

    // Cargar órdenes
    const loadOrders = async (silent = false) => {
        try {
            if (!silent) setLoading(true)
            else setIsRefreshing(true)
            const data = await getMyOrdersService()
            setOrders(data || [])
        } catch (error) {
            console.error('Error al cargar órdenes:', error)
            if (!silent) toast.error('No pudimos cargar tus compras')
        } finally {
            setLoading(false)
            setIsRefreshing(false)
        }
    }

    useEffect(() => {
        if (userInfo?.id) {
            loadOrders()
            // Auto-refresco en segundo plano cada 25 segundos para actualizar el estado
            const interval = setInterval(() => {
                loadOrders(true)
            }, 25000)
            return () => clearInterval(interval)
        } else if (!userLoading) {
            setLoading(false)
        }
    }, [userInfo, userLoading])

    // Alternar ver detalle en el historial
    const toggleHistory = (orderId) => {
        setExpandedHistory((prev) => ({ ...prev, [orderId]: !prev[orderId] }))
    }

    // Separamos pedidos activos (en curso) de los finalizados o cancelados
    const activeOrders = orders.filter((o) =>
        ['pendiente', 'en_preparacion', 'en_camino'].includes(o.status)
    )
    const pastOrders = orders.filter((o) =>
        ['entregado', 'cancelado'].includes(o.status)
    )

    // Si aún está cargando la sesión
    if (userLoading || loading) {
        return (
            <main className="max-w-4xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-neutral"></span>
                <p className="text-gray-500 text-sm font-medium mt-3">Cargando tus compras...</p>
            </main>
        )
    }

    // Si no está autenticado
    if (!userInfo?.id) {
        return (
            <main className="max-w-md mx-auto px-4 py-20 text-center">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                    <FaShoppingBag className="text-5xl text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Iniciá sesión</h2>
                    <p className="text-gray-500 mb-6 text-sm">
                        Para ver tus compras y el estado de tu pedido necesitás iniciar sesión en tu cuenta.
                    </p>
                    <Link to="/login" className="btn btn-neutral rounded-full px-8">
                        Ingresar a mi cuenta
                    </Link>
                </div>
            </main>
        )
    }

    // Si no tiene compras registradas
    if (orders.length === 0) {
        return (
            <main className="max-w-md mx-auto px-4 py-20 text-center">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 mb-4">
                        <FaShoppingBag size={28} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Aún no tenés compras</h2>
                    <p className="text-gray-500 mb-6 text-sm">
                        Explorá nuestros deliciosos helados artesanales y postres en la tienda.
                    </p>
                    <Link to="/" className="btn btn-neutral rounded-full px-8 font-semibold">
                        Ver catálogo de helados
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="mx-auto w-full max-w-md sm:max-w-2xl md:max-w-2xl lg:max-w-6xl px-4 sm:px-6 py-8 ">
            {/* Cabecera de la página */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 mt-6">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                        Mis Compras
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Seguí el estado de tus pedidos en tiempo real y revisá tu historial.
                    </p>
                </div>

                <button
                    onClick={() => loadOrders(true)}
                    disabled={isRefreshing}
                    className="rounded-xl bg-neutral hover:bg-black/90 px-4 py-1.5 gap-1.5 text-sm font-normal text-white flex items-center"
                >
                    <FaSyncAlt className={`${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>{isRefreshing ? 'Actualizando...' : 'Actualizar estado'}</span>
                </button>
            </div>

            {/* SECCIÓN 1: PEDIDO PENDIENTE / EN CURSO */}
            {activeOrders.length > 0 && (
                <div className="mb-12 flex flex-col gap-6 px-4 sm:px-6 md:px-8 lg:px-10 max-w-md sm:max-w-2xl md:max-w-2xl lg:max-w-6xl mx-auto">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                        <h2 className="text-xl font-bold text-gray-900 ml-2">
                            {activeOrders.length} Pedido en curso
                        </h2>
                    </div>

                    {activeOrders.map((order) => {
                        const currentStepIndex = getStepIndex(order.status)
                        const orderCode = order._id.slice(-6).toUpperCase()

                        return (
                            <div
                                key={order._id}
                                className="bg-white rounded-3xl border border-emerald-400 shadow-sm overflow-hidden"
                            >
                                {/* Barra superior de estado */}
                                <div className="bg-emerald-50/70 p-4 sm:p-3 border-b border-emerald-400 flex flex-wrap items-center justify-between gap-3 ">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-sm font-black bg-white px-3 py-1 rounded-xl text-gray-900 border border-emerald-400">
                                            #{orderCode}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString([], {
                                                day: '2-digit',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })} hs
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Método de pago */}
                                        {order.paymentMethod === 'mercadopago' ? (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                                                <FaCreditCard size={11} /> Mercado Pago
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                                                <FaMoneyBillWave size={11} /> Efectivo al recibir
                                            </span>
                                        )}


                                    </div>
                                </div>

                                <div className="p-4 sm:p-5">
                                    {/* LÍNEA DE PROGRESO / STEPPER */}
                                    <div className="mb-4">
                                        <div className="grid grid-cols-4 relative">
                                            {/* Línea de fondo */}
                                            <div className="absolute top-5 left-[11%] right-[11%] h-1 bg-gray-200 -z-0">
                                                <div
                                                    className="h-full bg-emerald-600 transition-all duration-500"
                                                    style={{
                                                        width: `${(currentStepIndex / (ORDER_STEPS.length - 1)) * 100}%`
                                                    }}
                                                />
                                            </div>

                                            {ORDER_STEPS.map((step, idx) => {
                                                const Icon = step.icon
                                                const isCompleted = idx <= currentStepIndex
                                                const isCurrent = idx === currentStepIndex

                                                return (
                                                    <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                                                        <div
                                                            className={`w-6 h-6 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${isCurrent
                                                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md scale-110'
                                                                : isCompleted
                                                                    ? 'bg-emerald-600 text-white'
                                                                    : 'bg-white border-2 border-gray-300 text-gray-400'
                                                                }`}
                                                        >
                                                            <Icon size={16} />
                                                        </div>
                                                        <span className={`text-xs sm:text-sm font-medium mt-2 ${isCurrent ? 'text-emerald-700' : isCompleted ? 'text-gray-800' : 'text-gray-400'
                                                            }`}>
                                                            {step.label}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>




                                    </div>
                                    {/* Botón WhatsApp de ayuda
                                    <a
                                        href={getWhatsAppHelpLink(orderCode)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-xs sm:btn-sm rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 border-none shadow-xs"
                                    >
                                        <FaWhatsapp size={14} />
                                        <span>Consultar por WhatsApp</span>
                                    </a> */}

                                    {/* DETALLES Y RESUMEN DEL PEDIDO COMPACTO */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 pt-3 border-t border-gray-100">
                                        {/* Columna Izquierda: Lista de Productos */}
                                        <div className="md:col-span-7 flex flex-col gap-1.5">
                                            <div className="flex items-center justify-between px-1">
                                                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                                                    Productos ({order.products?.reduce((acc, p) => acc + (p.quantity || 1), 0)})
                                                </span>
                                            </div>

                                            <div className="bg-gray-50/80 rounded-2xl p-3 border border-gray-100 flex flex-col divide-y divide-gray-200/60">
                                                {order.products?.map((item, idx) => {
                                                    const flavorSummary = formatFlavorSummary(item.configuration)
                                                    const extrasSummary = formatExtrasSummary(item.configuration)

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="py-2 first:pt-0 last:pb-0 flex flex-col gap-0.5"
                                                        >
                                                            <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-gray-800">
                                                                <span className="truncate pr-2">
                                                                    {item.productId?.name || 'Producto'}
                                                                    <span className="text-gray-500 font-normal ml-1 text-xs">
                                                                        x{item.quantity}
                                                                    </span>
                                                                </span>
                                                                <span className="font-bold text-gray-900 shrink-0 text-xs sm:text-sm">
                                                                    ${item.price * item.quantity}
                                                                </span>
                                                            </div>

                                                            {/* Sabores de helados elegidos */}
                                                            {flavorSummary && (
                                                                <p className="text-[11px] text-gray-600 mt-0.5 bg-white px-2 py-0.5 rounded-md border border-gray-200/70 font-normal leading-tight">
                                                                    <span className="font-medium text-gray-700">Sabores:</span> {flavorSummary}
                                                                </p>
                                                            )}

                                                            {/* Extras */}
                                                            {extrasSummary && (
                                                                <p className="text-[10px] text-gray-500 pl-0.5">
                                                                    + Extras: {extrasSummary}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Columna Derecha: Tarjeta Unificada de Entrega y Totales */}
                                        <div className="md:col-span-5 flex flex-col gap-1.5">
                                            <div className="flex items-center px-1">
                                                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                                                    Detalles de compra
                                                </span>
                                            </div>

                                            <div className="bg-gray-50/80 rounded-2xl p-3 border border-gray-100 flex flex-col justify-between gap-2.5 text-xs">
                                                {/* Datos de envío */}
                                                <div className="flex flex-col gap-0.5 pb-2.5 border-b border-gray-200/60">
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                                        <TbMapPin size={13} className="text-gray-600 shrink-0" />
                                                        Dirección de entrega
                                                    </span>
                                                    <p className="font-semibold text-gray-800 text-xs truncate mt-0.5" title={order.shippingDetails?.address}>
                                                        {order.shippingDetails?.address}
                                                    </p>
                                                    <p className="text-gray-500 text-[11px] truncate">
                                                        {order.shippingDetails?.name} {order.shippingDetails?.lastName} • {order.shippingDetails?.phone}
                                                    </p>
                                                </div>

                                                {/* Desglose de totales */}
                                                <div className="flex flex-col gap-1 text-[11px]">
                                                    <div className="flex justify-between text-gray-500">
                                                        <span>Subtotal productos:</span>
                                                        <span className="font-medium text-gray-700">${order.total - (order.deliveryFee || 0)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-gray-500">
                                                        <span>Costo de envío:</span>
                                                        <span className="font-medium text-gray-700">${order.deliveryFee || 0}</span>
                                                    </div>
                                                    <div className="border-t border-gray-200/80 pt-1.5 mt-0.5 flex justify-between items-baseline">
                                                        <span className="font-bold text-gray-800 text-xs">Total:</span>
                                                        <span className="font-bold text-base text-gray-900">
                                                            ${order.total}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* SECCIÓN 2: HISTORIAL DE COMPRAS ANTERIORES */}
            {pastOrders.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-black text-gray-900 mb-1">
                        Historial de pedidos anteriores ({pastOrders.length})
                    </h2>

                    <div className="flex flex-col gap-3">
                        {pastOrders.map((order) => {
                            const isExpanded = !!expandedHistory[order._id]
                            const orderCode = order._id.slice(-6).toUpperCase()
                            const isDelivered = order.status === 'entregado'

                            return (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden transition-all"
                                >
                                    {/* Cabecera del pedido colapsable */}
                                    <div
                                        onClick={() => toggleHistory(order._id)}
                                        className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/70 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="font-mono text-xs font-black bg-gray-100 text-gray-800 px-2.5 py-1 rounded-lg">
                                                #{orderCode}
                                            </span>
                                            <span className="text-xs text-gray-500 font-medium">
                                                {new Date(order.createdAt).toLocaleDateString([], {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${isDelivered
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                : 'bg-red-50 text-red-600 border border-red-200'
                                                }`}>
                                                {isDelivered ? 'Entregado' : 'Cancelado'}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className="font-black text-gray-900 text-base">
                                                ${order.total}
                                            </span>
                                            <button className="text-gray-400 hover:text-gray-600">
                                                {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Detalle expandido */}
                                    {isExpanded && (
                                        <div className="p-4 sm:p-5 bg-gray-50/80 border-t border-gray-100 flex flex-col gap-3 text-xs">
                                            <div className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                                                Productos incluidos:
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                {order.products?.map((item, idx) => {
                                                    const flavorSummary = formatFlavorSummary(item.configuration)
                                                    return (
                                                        <div key={idx} className="bg-white p-2.5 rounded-xl border border-gray-200/70">
                                                            <div className="flex justify-between font-bold text-gray-800">
                                                                <span>{item.productId?.name || 'Helado'} x {item.quantity}</span>
                                                                <span>${item.price * item.quantity}</span>
                                                            </div>
                                                            {flavorSummary && (
                                                                <p className="text-[11px] text-gray-600 mt-1 font-normal">
                                                                    🍦 {flavorSummary}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <div className="flex justify-between items-center pt-2 text-gray-500 border-t border-gray-200/60">
                                                <span>Dirección: {order.shippingDetails?.address}</span>
                                                <span>Método: {order.paymentMethod === 'mercadopago' ? 'Mercado Pago' : 'Efectivo'}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </main>
    )
}

export default MyOrdersPage
