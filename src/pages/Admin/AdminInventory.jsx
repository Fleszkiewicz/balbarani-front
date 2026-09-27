import { useState, useEffect } from 'react'
import { getAllProductsService, updateProductService } from '../../services/productServices'
import { getFlavorsService, createFlavorService, updateFlavorService, deleteFlavorService } from '../../services/flavorServices'
import { toast } from 'react-hot-toast'
import { FaPlus, FaIceCream, FaBoxes } from 'react-icons/fa'
import { FiTrash } from 'react-icons/fi'

const AdminInventory = () => {
    // Modo de vista: 'stock' (Control de unidades físicas) o 'flavors' (Sabores artesanales)
    const [activeTab, setActiveTab] = useState('stock')

    const [products, setProducts] = useState([])
    const [flavors, setFlavors] = useState([])
    const [loading, setLoading] = useState(true)
    const [newFlavorName, setNewFlavorName] = useState('')

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            const [prods, flavs] = await Promise.all([
                getAllProductsService(),
                getFlavorsService()
            ])
            setProducts(prods.filter(p => p.inventoryType === 'stock'))
            setFlavors(flavs)
        } catch (error) {
            toast.error('Error al cargar datos del inventario')
        } finally {
            setLoading(false)
        }
    }

    // --- Manejo de Stock Físico ---
    const handleStockChange = async (productId, currentStock, delta) => {
        const newStock = Math.max(0, currentStock + delta)
        if (newStock === currentStock) return

        try {
            // Actualización optimista instantánea en UI
            setProducts(prev => prev.map(p =>
                p._id === productId ? { ...p, stock: newStock } : p
            ))

            await updateProductService(productId, { stock: newStock })
        } catch (error) {
            toast.error('Error al actualizar stock')
            loadData() // Revertir en caso de falla
        }
    }

    // --- Manejo de Sabores Artesanales ---
    const handleToggleFlavor = async (flavor) => {
        try {
            const updated = !flavor.available
            // Actualización optimista
            setFlavors(prev => prev.map(f =>
                f._id === flavor._id ? { ...f, available: updated } : f
            ))

            await updateFlavorService(flavor._id, { available: updated })
            toast.success(updated ? `Sabor ${flavor.name} activado` : `Sabor ${flavor.name} pausado`)
        } catch (error) {
            toast.error('Error al actualizar sabor')
            loadData() // Revertir
        }
    }

    const handleAddFlavor = async (e) => {
        e.preventDefault()
        if (!newFlavorName.trim()) return

        try {
            const created = await createFlavorService({ name: newFlavorName.trim() })
            setFlavors(prev => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)))
            setNewFlavorName('')
            toast.success('Sabor agregado exitosamente')
        } catch (error) {
            toast.error(error.message || 'Error al agregar sabor')
        }
    }

    const handleDeleteFlavor = async (flavorId) => {
        if (!window.confirm('¿Estás seguro de eliminar este sabor?')) return

        try {
            await deleteFlavorService(flavorId)
            setFlavors(prev => prev.filter(f => f._id !== flavorId))
            toast.success('Sabor eliminado')
        } catch (error) {
            toast.error('Error al eliminar sabor')
        }
    }

    // Pantalla de carga consistente con la de pedidos
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-neutral"></span>
                <p className="text-gray-400 text-xs font-semibold mt-3">Cargando inventario...</p>
            </div>
        )
    }

    // Agrupación de productos por subcategoría
    const groupedProducts = products.reduce((acc, product) => {
        const subcategoryName = product.subcategory?.name || 'Otros'
        if (!acc[subcategoryName]) {
            acc[subcategoryName] = []
        }
        acc[subcategoryName].push(product)
        return acc
    }, {})

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto pb-24">
            {/* Cabecera Superior con Título, Subtítulo y Botón Alternador */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    {activeTab === 'stock' ? (
                        <>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                Inventario de Stock
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-normal">
                                Control de unidades físicas, reposición inmediata y stock para venta online.
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                Disponibilidad de Sabores
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-normal">
                                Gestiona el stock de sabores disponibles para venta online.
                            </p>
                        </>
                    )}
                </div>

                {/* Botón Cambiante de Vistas (Estilo Pedidos / Historial) */}
                <div className="flex items-center gap-2">
                    {activeTab === 'stock' ? (
                        <button
                            onClick={() => setActiveTab('flavors')}
                            className="btn btn-sm bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-xs gap-1.5 text-gray-800 shadow-xs"
                            title="Ir a disponibilidad de sabores"
                        >
                            <FaIceCream className="text-amber-500 text-xs" />
                            <span className="font-medium">Disponibilidad de sabores</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => setActiveTab('stock')}
                            className="btn btn-sm bg-neutral text-white hover:bg-neutral-800 border-none rounded-full text-xs gap-1.5 shadow-xs"
                            title="Volver al stock físico"
                        >
                            <FaBoxes className="text-gray-300 text-xs" />
                            <span className="font-medium">Stock físico</span>
                        </button>
                    )}
                </div>
            </div>

            {/* VISTA 1: TABLAS DE STOCK FÍSICO (COMPACTAS Y FINAS) */}
            {activeTab === 'stock' && (
                <div className="flex flex-col gap-5">
                    {Object.keys(groupedProducts).length === 0 ? (
                        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
                            <FaBoxes className="mx-auto text-3xl mb-2 text-gray-300" />
                            <p className="font-medium text-sm">No se encontraron productos con inventario de stock</p>
                        </div>
                    ) : (
                        Object.entries(groupedProducts).map(([subcategoryName, subcategoryProducts]) => (
                            <div
                                key={subcategoryName}
                                className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden"
                            >
                                {/* Barra de la Subcategoría */}
                                <div className="bg-gray-50/80 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-bold text-sm text-gray-900">{subcategoryName}</h2>
                                    </div>
                                </div>

                                {/* Tabla Compacta */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-100 text-[10px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/40">
                                                <th className="py-2 px-4 w-[45%] font-medium">Producto</th>
                                                <th className="py-2 px-4 w-[30%] font-medium">Categoría</th>
                                                <th className="py-2 px-4 w-[25%] font-medium text-right sm:text-left">Stock / Ajuste</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100">
                                            {subcategoryProducts.map((product) => (
                                                <tr
                                                    key={product._id}
                                                    className="hover:bg-gray-50/60 transition-colors"
                                                >
                                                    {/* PRODUCTO (Imagen chica + Nombre + Precio) */}
                                                    <td className="py-2 px-4">
                                                        <div className="flex items-center gap-3">
                                                            {product.imageUrl ? (
                                                                <img
                                                                    src={product.imageUrl}
                                                                    alt={product.name}
                                                                    className="w-9 h-9 rounded-xl object-cover border border-gray-100 shrink-0"
                                                                />
                                                            ) : (
                                                                <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs shrink-0 font-medium">
                                                                    N/A
                                                                </div>
                                                            )}
                                                            <div className="min-w-0">
                                                                <p className="font-semibold text-xs sm:text-sm text-gray-900 truncate" title={product.name}>
                                                                    {product.name}
                                                                </p>
                                                                <p className="text-[11px] font-normal text-gray-400">
                                                                    ${product.price}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* CATEGORÍA */}
                                                    <td className="py-2 px-4">
                                                        <span className="inline-block text-[11px] font-medium text-gray-600 bg-gray-100/80 px-2 py-0.5 rounded-md truncate max-w-[150px]">
                                                            {product.category?.name || 'General'}
                                                        </span>
                                                    </td>

                                                    {/* ACCIONES Y STOCK */}
                                                    <td className="py-2 px-4">
                                                        <div className="flex items-center justify-end sm:justify-start gap-1.5">
                                                            {/* Control Stepper compacto */}
                                                            <div className="inline-flex items-center rounded-xl bg-gray-100 p-0.5">
                                                                <button
                                                                    className="w-7 h-7 flex items-center justify-center rounded-lg font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-200/80 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                                                    onClick={() => handleStockChange(product._id, product.stock, -1)}
                                                                    disabled={product.stock <= 0}
                                                                    title="Restar 1"
                                                                >
                                                                    -
                                                                </button>

                                                                <span
                                                                    className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg text-white mx-0.5 shadow-2xs ${product.stock > 3
                                                                        ? 'bg-emerald-500'
                                                                        : product.stock === 0
                                                                            ? 'bg-red-500'
                                                                            : 'bg-amber-400'
                                                                        }`}
                                                                    title={`Stock actual: ${product.stock}`}
                                                                >
                                                                    {product.stock}
                                                                </span>

                                                                <button
                                                                    className="w-7 h-7 flex items-center justify-center rounded-lg font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-200/80 transition-colors"
                                                                    onClick={() => handleStockChange(product._id, product.stock, 1)}
                                                                    title="Sumar 1"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>

                                                            {/* Botón sumar 10 rápido */}
                                                            <button
                                                                className="h-8 px-2.5 rounded-xl bg-gray-100 hover:bg-gray-200/80 text-[11px] font-medium text-gray-700 transition-colors"
                                                                onClick={() => handleStockChange(product._id, product.stock, 10)}
                                                                title="Sumar 10 unidades rápido"
                                                            >
                                                                +10
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* VISTA 2: DISPONIBILIDAD DE SABORES (CENTRADITA, FINA Y ELEGANTE) */}
            {activeTab === 'flavors' && (
                <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden max-w-4xl mx-auto">
                    {/* Barra Superior con Input Compacto para Agregar */}
                    <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50">
                        <div>
                            <h2 className="font-bold text-sm sm:text-base text-gray-900">Sabores Artesanales</h2>
                            <p className="text-xs text-gray-500 font-normal">
                                Pausa o activa sabores según disponibilidad.
                            </p>
                        </div>

                        {/* Formulario compacto para nuevo sabor */}
                        <form onSubmit={handleAddFlavor} className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Nuevo sabor..."
                                value={newFlavorName}
                                onChange={(e) => setNewFlavorName(e.target.value)}
                                className="input input-sm rounded-xl border border-gray-200 bg-white text-xs px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-neutral w-48 sm:w-56 font-normal"
                            />
                            <button
                                type="submit"
                                disabled={!newFlavorName.trim()}
                                className="btn btn-sm rounded-xl bg-neutral text-white hover:bg-neutral-800 border-none font-medium text-xs px-3.5 gap-1.5 disabled:bg-gray-200 shadow-2xs"
                            >
                                <FaPlus size={10} />
                                <span>Agregar</span>
                            </button>
                        </form>
                    </div>

                    {/* Tabla Fina de Sabores */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-[10px] font-normal text-gray-400 uppercase tracking-wider bg-gray-50/40">
                                    <th className="py-2.5 px-4 font-medium">Sabor</th>
                                    <th className="py-2.5 px-4 font-medium text-center w-36">Estado Online</th>
                                    <th className="py-2.5 px-4 font-medium text-right w-24">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {flavors.map((flavor) => (
                                    <tr
                                        key={flavor._id}
                                        className="hover:bg-gray-50/60 transition-colors group"
                                    >
                                        {/* Nombre del Sabor */}
                                        <td className="py-2 px-4">
                                            <span className={`text-xs sm:text-sm ${flavor.available
                                                ? 'font-medium text-gray-900'
                                                : 'font-normal text-gray-400 line-through'
                                                }`}>
                                                {flavor.name}
                                            </span>
                                        </td>

                                        {/* Toggle de Disponibilidad */}
                                        <td className="py-2 px-4 text-center">
                                            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    className="toggle toggle-sm rounded-full border-gray-300 bg-white hover:bg-white [--tglbg:#D1D5DB] checked:[--tglbg:#16A34A] checked:border-[#16A34A]"
                                                    checked={flavor.available}
                                                    onChange={() => handleToggleFlavor(flavor)}
                                                />
                                                <span className={`text-[11px] font-medium hidden sm:inline ${flavor.available ? 'text-emerald-700' : 'text-gray-400'
                                                    }`}>
                                                    {flavor.available ? 'Disponible' : 'Pausado'}
                                                </span>
                                            </label>
                                        </td>

                                        {/* Botón Eliminar */}
                                        <td className="py-2 px-4 text-right">
                                            <button
                                                className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                onClick={() => handleDeleteFlavor(flavor._id)}
                                                title="Eliminar sabor permanentemente"
                                            >
                                                <FiTrash size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {flavors.length === 0 && (
                        <div className="p-8 text-center text-gray-400 text-xs font-normal">
                            No hay sabores cargados aún.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default AdminInventory
