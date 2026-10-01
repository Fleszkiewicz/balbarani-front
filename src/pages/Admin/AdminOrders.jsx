import { useState, useEffect } from 'react'
import { getAdminOrdersService, updateOrderStatusService } from '../../services/orderServices.js'
import { getDeliveryFeeService, updateDeliveryFeeService } from '../../services/settingServices.js'
import { formatExtrasSummary, formatFlavorSummary } from '../../utils/artisanIceCream.js'
import {
    FaCreditCard,
    FaMoneyBillWave,
    FaFire,
    FaMotorcycle,
    FaCheckCircle,
    FaChevronDown,
    FaChevronUp,
    FaWhatsapp,
    FaTrashAlt,
    FaHistory,
    FaBoxes,
    FaTimesCircle
} from 'react-icons/fa'
import { GrLocation } from "react-icons/gr"
import toast from 'react-hot-toast'
import ConfirmModal from '../../components/Common/ConfirmModal'

// Helper para armar el link directo a WhatsApp formateando a número argentino (549...)
const getWhatsAppLink = (phone, order) => {
    if (!phone) return '#'
    let cleanNumber = phone.replace(/\D/g, '')

    if (cleanNumber.startsWith('15')) {
        cleanNumber = cleanNumber.slice(2)
    }

    if (!cleanNumber.startsWith('54')) {
        cleanNumber = `549${cleanNumber}`
    } else if (!cleanNumber.startsWith('549')) {
        cleanNumber = `549${cleanNumber.slice(2)}`
    }

    const clientName = order.shippingDetails?.name || 'Cliente'
    const orderCode = order._id.slice(-6).toUpperCase()
    const message = encodeURIComponent(
        `¡Hola ${clientName}! Te escribimos de Heladería Balbarani sobre tu pedido #${orderCode}.`
    )

    return `https://wa.me/${cleanNumber}?text=${message}`
}

// Helper para calcular cuántos minutos pasaron desde que entró la comanda
const getTimeAgo = (dateString) => {
    const minutes = Math.floor((new Date() - new Date(dateString)) / 60000)
    if (minutes < 1) return 'Hace instantes'
    if (minutes === 1) return 'Hace 1 min'
    if (minutes < 60) return `Hace ${minutes} min`
    const hours = Math.floor(minutes / 60)
    return `Hace ${hours} h`
}

// Helper para saber si un pedido ya está completado
const isOrderCompleted = (status) => status === 'entregado' || status === 'finalizado'

const AdminOrders = () => {
    // Estados principales
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedOrders, setExpandedOrders] = useState({})
    const [updatingId, setUpdatingId] = useState(null)
    const [cancelingOrder, setCancelingOrder] = useState(null)
    const [isCanceling, setIsCanceling] = useState(false)

    // Modo de vista: 'live' (Tablero 3 columnas) o 'history' (Columna única a lo largo)
    const [viewMode, setViewMode] = useState('live')

    // Filtro dentro del historial: 'todos' | 'finalizados' | 'cancelados'
    const [historyFilter, setHistoryFilter] = useState('todos')

    // Estados para el valor del delivery
    const [deliveryFee, setDeliveryFee] = useState(0)
    const [newDeliveryFee, setNewDeliveryFee] = useState('')
    const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false)
    const [isUpdatingDelivery, setIsUpdatingDelivery] = useState(false)

    // Cargar pedidos y configurar auto-refresco cada 30 segundos
    useEffect(() => {
        loadOrders()

        // Obtener el valor actual del costo de envío
        getDeliveryFeeService().then((fee) => {
            setDeliveryFee(fee)
            setNewDeliveryFee(fee)
        })

        // Auto-refresco en vivo cada 30 segundos sin recargar el navegador
        const intervalId = setInterval(() => {
            loadOrders(false) // false = no activar el spinner gigante central
        }, 30000)

        // Limpiar intervalo al desmontar la vista
        return () => clearInterval(intervalId)
    }, [])

    // Función para consultar las órdenes al backend
    const loadOrders = async (showInitialSpinner = true) => {
        try {
            if (showInitialSpinner) setLoading(true)
            const data = await getAdminOrdersService()
            setOrders(data)
        } catch (error) {
            console.error('Error al cargar pedidos:', error)
            toast.error('Error al sincronizar pedidos')
        } finally {
            if (showInitialSpinner) setLoading(false)
        }
    }

    // Cambiar estado del pedido con los botones de acción rápida
    const handleAdvanceStatus = async (orderId, nextStatus) => {
        try {
            setUpdatingId(orderId)
            const updated = await updateOrderStatusService(orderId, { status: nextStatus })
            setOrders((prev) => prev.map((ord) => (ord._id === orderId ? updated : ord)))

            if (nextStatus === 'en_preparacion') toast.success('Comanda enviada a preparación')
            else if (nextStatus === 'en_camino') toast.success('Pedido despachado / en camino')
            else if (isOrderCompleted(nextStatus)) toast.success('¡Pedido finalizado con éxito!')
        } catch (error) {
            console.error(error)
            toast.error(error.message || 'Error al actualizar estado')
        } finally {
            setUpdatingId(null)
        }
    }

    // Cancelar o descartar una comanda
    const handleConfirmCancelOrder = async () => {
        if (!cancelingOrder) return
        try {
            setIsCanceling(true)
            const updated = await updateOrderStatusService(cancelingOrder._id, { status: 'cancelado' })
            setOrders((prev) => prev.map((ord) => (ord._id === cancelingOrder._id ? updated : ord)))
            toast.error('Pedido cancelado')
            setCancelingOrder(null)
        } catch (error) {
            console.error(error)
            toast.error(error.message || 'Error al cancelar')
        } finally {
            setIsCanceling(false)
        }
    }

    // Guardar nuevo valor de delivery
    const handleSaveDeliveryFee = async (e) => {
        e.preventDefault()
        try {
            setIsUpdatingDelivery(true)
            const updated = await updateDeliveryFeeService(newDeliveryFee)
            setDeliveryFee(updated)
            setIsDeliveryModalOpen(false)
            toast.success(`Costo de envío actualizado a $${updated}`)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsUpdatingDelivery(false)
        }
    }

    // Alternar ver/ocultar lista de productos
    const toggleExpand = (orderId) => {
        setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }))
    }

    // 1. COMANDAS EN VIVO: Orden FIFO (más antiguas primero arriba)
    const sortedLiveOrders = [...orders].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    )

    const ordersPendientes = sortedLiveOrders.filter((o) => o.status === 'pendiente')
    const ordersEnPreparacion = sortedLiveOrders.filter((o) => o.status === 'en_preparacion')
    const ordersEnCamino = sortedLiveOrders.filter((o) => o.status === 'en_camino')

    // 2. HISTORIAL: Orden inverso (más nuevos finalizados arriba de todo)
    const allHistoryOrders = [...orders]
        .filter((o) => isOrderCompleted(o.status) || o.status === 'cancelado')
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))

    // Filtrar según botón activo en el historial
    const filteredHistoryOrders = allHistoryOrders.filter((o) => {
        if (historyFilter === 'finalizados') return isOrderCompleted(o.status)
        if (historyFilter === 'cancelados') return o.status === 'cancelado'
        return true
    })

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-neutral"></span>
                <p className="text-gray-400 text-xs font-semibold mt-3">Cargando pedidos...</p>
            </div>
        )
    }

    // Render de una Comanda en el Tablero KDS (Columnas)
    const renderLiveOrderCard = (order, columnType) => {
        const isExpanded = !!expandedOrders[order._id]
        const isPaid = order.paymentStatus === 'pagado'
        const isUpdating = updatingId === order._id

        return (
            <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-200/90 shadow-xs flex flex-col justify-between overflow-hidden transition-all duration-150 hover:shadow-md"
            >
                {/* Cabecera de la Comanda */}
                <div className="p-3.5 pb-2 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-gray-900 bg-gray-100 px-2 py-0.5 rounded-lg">
                            #{order._id.slice(-6).toUpperCase()}
                        </span>
                    </div>
                    <span className="text-[11px] font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-lg">
                        {getTimeAgo(order.createdAt)}
                    </span>
                </div>

                {/* Datos del Cliente */}
                <div className="p-3.5 text-xs flex flex-col gap-1.5">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="font-sans font-semibold text-gray-900 text-[16px]">
                            {order.shippingDetails?.name} {order.shippingDetails?.lastName}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-500 -mb-1">
                        <GrLocation className="text-gray-500 shrink-0 text-xs" />
                        <span className="line-clamp-1">{order.shippingDetails?.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                        <a
                            href={getWhatsAppLink(order.shippingDetails?.phone, order)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:text-emerald-700 transition-colors"
                        >
                            <FaWhatsapp size={13} />
                            <span>{order.shippingDetails?.phone}</span>
                        </a>
                    </div>


                    {/* Desglose de Productos */}
                    {isExpanded && (
                        <div className="p-1 bg-gray-100 mt-1 rounded-lg border-t border-b border-gray-100 flex flex-col gap-2">
                            {order.products?.map((item, idx) => {
                                const flavorSummary = formatFlavorSummary(item.configuration)
                                const extrasSummary = formatExtrasSummary(item.configuration)

                                return (
                                    <div key={idx} className="pb-0.5 border-gray-200/60 last:border-none last:pb-0 ">


                                        <div className=" mr-1 ml-1 flex justify-between font-semibold text-gray-800 text-xs">
                                            <span>{item.productId?.name || 'Helado'} x {item.quantity}</span>
                                            <span>${item.price * item.quantity}</span>
                                        </div>
                                        {flavorSummary && (
                                            <p className="text-[11px] text-gray-800 bg-gray-100 rounded-md ml-2 mt-1 font-light">
                                                {flavorSummary}
                                            </p>
                                        )}
                                        {extrasSummary && (
                                            <p className="text-[10px] text-gray-500 mt-0.5">
                                                Extras: {extrasSummary}
                                            </p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    <div className="flex items-center justify-between mt-1">



                        {order.paymentMethod === 'mercadopago' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                <FaCreditCard className="text-[9px]" /> Mercado Pago
                            </span>
                        ) : (
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200`}>
                                <FaMoneyBillWave className="text-[9px]" /> Efectivo
                            </span>
                        )}
                        <span className="text-sm font-black text-gray-900">
                            ${order.total}
                        </span>
                    </div>
                </div>





                {/* Botones de Acción */}
                <div className="p-3 border-t border-gray-200 bg-white flex items-center gap-2 mt-auto">
                    <button
                        onClick={() => setCancelingOrder(order)}
                        disabled={isUpdating}
                        className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-500 flex items-center justify-center transition-colors shrink-0"
                        title="Cancelar / Descartar comanda"
                    >
                        <FaTrashAlt size={11} />
                    </button>

                    <button
                        onClick={() => toggleExpand(order._id)}
                        className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-500 flex items-center justify-center transition-colors shrink-0"
                    >
                        {isExpanded ? (
                            <> <FaChevronUp className="text-[9px]" /></>
                        ) : (
                            <> <FaChevronDown className="text-[9px]" /></>
                        )}
                    </button>


                    {columnType === 'pendiente' && (
                        <button
                            onClick={() => handleAdvanceStatus(order._id, 'en_preparacion')}
                            disabled={isUpdating}
                            className="btn btn-xs flex-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-600 font-normal border-none gap-1 shadow-xs"
                        >
                            {isUpdating ? <span className="loading loading-spinner loading-xs"></span> : <> Preparar pedido</>}
                        </button>
                    )}

                    {columnType === 'en_preparacion' && (
                        <button
                            onClick={() => handleAdvanceStatus(order._id, 'en_camino')}
                            disabled={isUpdating}
                            className="btn btn-xs flex-1 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-600 font-normal border-none gap-1 shadow-xs"
                        >
                            {isUpdating ? <span className="loading loading-spinner loading-xs"></span> : <> Imprimir y enviar pedido</>}
                        </button>
                    )}

                    {columnType === 'en_camino' && (
                        <button
                            onClick={() => handleAdvanceStatus(order._id, 'entregado')}
                            disabled={isUpdating}
                            className="btn btn-xs flex-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-600 font-normal border-none gap-1 shadow-xs"
                        >
                            {isUpdating ? <span className="loading loading-spinner loading-xs"></span> : <> Finalizar pedido</>}
                        </button>
                    )}
                </div>
            </div>
        )
    }

    // Render de una Tarjeta del Historial a lo largo (Horizontal)
    const renderHistoryOrderCard = (order) => {
        const isExpanded = !!expandedOrders[order._id]
        const isCompleted = isOrderCompleted(order.status)

        return (
            <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 sm:p-5 flex flex-col gap-3 transition-all hover:shadow-md"
            >
                {/* Fila Superior: Código, Fecha, Estado y Total */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">

                        {isCompleted ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg">
                                <FaCheckCircle className="text-emerald-600 text-xs" />
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-3 py-2 rounded-lg">
                                <FaTimesCircle className="text-red-500 text-xs" />
                            </span>
                        )}
                        <span className="font-mono text-xs sm:text-sm font-black text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
                            #{order._id.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                            {new Date(order.createdAt).toLocaleDateString('es-AR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <span className="text-base sm:text-lg font-black text-gray-900 ">
                            ${order.total}
                        </span>
                    </div>
                </div>

                {/* Fila Media: Cliente, Dirección, Pago y WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                        <p className="text-[10px] uppercase font-normal text-gray-400">Cliente</p>
                        <p className="font-semibold text-gray-800 text-sm mt-0.5">
                            {order.shippingDetails?.name} {order.shippingDetails?.lastName}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] uppercase font-normal text-gray-400">Dirección</p>
                        <div className="flex items-center gap-1 font-medium text-gray-700 mt-0.5">
                            <GrLocation className="text-gray-700 shrink-0 text-xs" />
                            <span className="truncate">{order.shippingDetails?.address}</span>
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] uppercase font-normal text-gray-400">Contacto</p>
                        <div className="flex items-center gap-1 font-medium text-gray-700 mt-0.5">
                            <a
                                href={getWhatsAppLink(order.shippingDetails?.phone, order)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-medium text-gray-700 hover:text-gray-900"
                            >
                                <FaWhatsapp size={12} />
                                <span>{order.shippingDetails?.phone}</span>
                            </a>
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] uppercase font-normal text-gray-400">Pago</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            {order.paymentMethod === 'mercadopago' ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                    <FaCreditCard className="text-[9px]" /> Mercado Pago
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    <FaMoneyBillWave className="text-[9px]" /> Efectivo
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Acordeón de Productos */}
                <div className="pt-2 border-t border-gray-100">
                    <button
                        onClick={() => toggleExpand(order._id)}
                        className="w-full py-1.5 px-3 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-50 rounded-xl flex items-center justify-between transition-colors "
                    >
                        <span>Ver detalle ( {order.products?.length || 0} )</span>
                        {isExpanded ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                    </button>

                    {isExpanded && (
                        <div className="mt-2.5 p-3.5 bg-gray-50 rounded-xl flex flex-col gap-2">
                            {order.products?.map((item, idx) => {
                                const flavorSummary = formatFlavorSummary(item.configuration)
                                const extrasSummary = formatExtrasSummary(item.configuration)

                                return (
                                    <div key={idx} className="pb-2 border-b border-gray-200/60 last:border-none last:pb-0">
                                        <div className="flex justify-between font-semibold text-gray-800 text-xs">
                                            <span>{item.productId?.name || 'Helado'} x {item.quantity}</span>

                                            <span>${item.price * item.quantity}</span>
                                        </div>
                                        {flavorSummary && (
                                            <p className="text-[11px] text-gray-700 ml-2 font-normal ">
                                                {flavorSummary}
                                            </p>
                                        )}
                                        {extrasSummary && (
                                            <p className="text-[10px] text-gray-500 mt-0.5">
                                                Extras: {extrasSummary}
                                            </p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto pb-24">
            {/* Cabecera Superior */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    {viewMode === 'live' ? (
                        <>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                Gestor de comandas
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                Tablero en tiempo real de pedidos entrantes.
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                Historial de Pedidos
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                Registro completo de comandas finalizadas y canceladas.
                            </p>
                        </>
                    )}
                </div>

                {/* Botones de Cabecera: Delivery y Alternador de Vistas */}
                <div className="flex items-center gap-2">
                    {/* Botón para abrir modal de Delivery */}
                    <button
                        onClick={() => {
                            setNewDeliveryFee(deliveryFee)
                            setIsDeliveryModalOpen(true)
                        }}
                        className="btn btn-sm bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-xs gap-1.5 text-gray-700 shadow-xs"
                        title="Modificar precio del delivery"
                    >
                        <FaMotorcycle className="text-sm text-emerald-600" />
                        <span>Delivery: <strong>${deliveryFee}</strong></span>
                    </button>

                    {/* Botón Historial / Comandas en vivo (Reemplaza a Actualizar) */}
                    {viewMode === 'live' ? (
                        <button
                            onClick={() => setViewMode('history')}
                            className="btn btn-sm bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-xs gap-1.5 text-gray-800 shadow-xs"
                            title="Ver historial de pedidos finalizados"
                        >
                            <FaHistory size={12} className="text-gray-500" />
                            <span>Historial de pedidos</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => setViewMode('live')}
                            className="btn btn-sm bg-neutral text-white hover:bg-neutral-800 border-none rounded-full text-xs gap-1.5 shadow-xs"
                            title="Volver al tablero de comandas"
                        >
                            <FaFire size={12} className="text-amber-400" />
                            <span>Gestor de comandas</span>
                        </button>
                    )}
                </div>
            </div>

            {/* VISTA 1: COMANDAS EN VIVO (TABLERO KANBAN DE 3 COLUMNAS) */}
            {viewMode === 'live' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                    {/* COLUMNA 1: PENDIENTES */}
                    <div className="bg-gray-200/70 rounded-3xl p-4 border border-gray-300/70 flex flex-col gap-3 min-h-[600px]">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-300 px-1">
                            <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
                                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                                <span>Pendientes</span>
                            </div>
                            <span className="text-xs font-black bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                                {ordersPendientes.length}
                            </span>
                        </div>

                        {ordersPendientes.length === 0 ? (
                            <div className=" text-center text-gray-400 text-xs my-auto">
                                No hay pedidos pendientes
                            </div>
                        ) : (
                            ordersPendientes.map((order) => renderLiveOrderCard(order, 'pendiente'))
                        )}
                    </div>

                    {/* COLUMNA 2: EN PREPARACIÓN */}
                    <div className="bg-gray-200/70 rounded-3xl p-4 border border-gray-300/70 flex flex-col gap-3 min-h-[600px]">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-300 px-1">
                            <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                <span>En preparación</span>
                            </div>
                            <span className="text-xs font-black bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full border border-blue-300">
                                {ordersEnPreparacion.length}
                            </span>
                        </div>

                        {ordersEnPreparacion.length === 0 ? (
                            <div className=" text-center text-gray-400 text-xs my-auto">
                                No hay pedidos en preparación
                            </div>
                        ) : (
                            ordersEnPreparacion.map((order) => renderLiveOrderCard(order, 'en_preparacion'))
                        )}
                    </div>

                    {/* COLUMNA 3: EN CAMINO */}
                    <div className="bg-gray-200/70 rounded-3xl p-4 border border-gray-300/70 flex flex-col gap-3 min-h-[600px]">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-300 px-1">
                            <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
                                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                <span>En camino</span>
                            </div>
                            <span className="text-xs font-black bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
                                {ordersEnCamino.length}
                            </span>
                        </div>

                        {ordersEnCamino.length === 0 ? (
                            <div className=" text-center text-gray-400 text-xs my-auto">
                                No hay pedidos en camino
                            </div>
                        ) : (
                            ordersEnCamino.map((order) => renderLiveOrderCard(order, 'en_camino'))
                        )}
                    </div>
                </div>
            )}

            {/* VISTA 2: HISTORIAL DE PEDIDOS (UNA SOLA COLUMNA CON CARDS A LO LARGO) */}
            {viewMode === 'history' && (
                <div className="max-w-4xl mx-auto flex flex-col gap-4">
                    {/* Barra de Filtros del Historial */}
                    <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-200 w-fit">
                        <button
                            onClick={() => setHistoryFilter('todos')}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${historyFilter === 'todos' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setHistoryFilter('finalizados')}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${historyFilter === 'finalizados' ? 'bg-emerald-50 text-black' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Finalizados
                        </button>
                        <button
                            onClick={() => setHistoryFilter('cancelados')}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${historyFilter === 'cancelados' ? 'bg-red-50 text-black' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Cancelados
                        </button>
                    </div>

                    {/* Lista a lo largo de pedidos históricos */}
                    {filteredHistoryOrders.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
                            <FaBoxes className="mx-auto text-3xl mb-2 text-gray-300" />
                            <p className="font-semibold text-sm">No se encontraron pedidos en el historial</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {filteredHistoryOrders.map((order) => renderHistoryOrderCard(order))}
                        </div>
                    )}
                </div>
            )}

            {/* Modal de Configuración de Delivery */}
            {isDeliveryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-gray-100 shadow-xl">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-xl mb-3">
                            <FaMotorcycle />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 text-center">Valor del Delivery</h3>
                        <p className="text-xs text-gray-500 text-center mt-1 mb-6">
                            Este monto se sumará automáticamente a todos los pedidos y carritos de Baradero.
                        </p>

                        <form onSubmit={handleSaveDeliveryFee} className="flex flex-col gap-4">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    value={newDeliveryFee}
                                    onChange={(e) => setNewDeliveryFee(e.target.value)}
                                    className="w-full pl-8 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 font-bold text-lg text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-neutral"
                                    placeholder="0"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsDeliveryModalOpen(false)}
                                    className="btn flex-1 rounded-full text-xs font-semibold btn-ghost"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdatingDelivery}
                                    className="btn flex-1 rounded-full text-xs font-bold bg-neutral text-white hover:bg-neutral-800"
                                >
                                    {isUpdatingDelivery ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        
            {/* Modal de confirmación para cancelar comanda */}
            <ConfirmModal
                isOpen={Boolean(cancelingOrder)}
                title="Cancelar comanda"
                message={`¿Seguro que deseas cancelar la comanda #${cancelingOrder?._id?.slice(-6).toUpperCase()} de ${cancelingOrder?.shippingDetails?.name || 'Cliente'}?`}
                confirmText="Cancelar comanda"
                cancelText="Volver"
                confirmVariant="danger"
                iconType="alert"
                isLoading={isCanceling}
                onConfirm={handleConfirmCancelOrder}
                onClose={() => setCancelingOrder(null)}
            />
        </div>
    )
}

export default AdminOrders
