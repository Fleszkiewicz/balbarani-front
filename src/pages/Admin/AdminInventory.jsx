import { useState, useEffect, useMemo } from 'react'
import { getAllProductsService, updateProductService } from '../../services/productServices'
import { getFlavorsService, createFlavorService, updateFlavorService, deleteFlavorService } from '../../services/flavorServices'
import { toast } from 'react-hot-toast'
import { FaPlus, FaSearch } from 'react-icons/fa'
import { FiTrash } from 'react-icons/fi'
import ConfirmModal from '../../components/Common/ConfirmModal'
import { TbIceCream2, TbPackage, TbTrash } from 'react-icons/tb'

// Categorías oficiales de sabores
const FLAVOR_CATEGORIES = ['Cremas', 'Frutales', 'Chocolates', 'Dulce de leches']

const AdminInventory = () => {
    // Modo de vista: 'stock' (Control de unidades físicas) o 'flavors' (Sabores artesanales)
    const [activeTab, setActiveTab] = useState('stock')

    const [products, setProducts] = useState([])
    const [flavors, setFlavors] = useState([])
    const [loading, setLoading] = useState(true)
    const [deletingFlavor, setDeletingFlavor] = useState(null)
    const [isDeletingFlavor, setIsDeletingFlavor] = useState(false)

    // Formulario de nuevo sabor
    const [newFlavorName, setNewFlavorName] = useState('')
    const [newFlavorCategory, setNewFlavorCategory] = useState('Cremas')

    // Filtros de sabores y de stock
    const [selectedFlavorCategoryFilter, setSelectedFlavorCategoryFilter] = useState('ALL')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL')

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
            setFlavors(prev => prev.map(f =>
                f._id === flavor._id ? { ...f, available: updated } : f
            ))

            await updateFlavorService(flavor._id, { available: updated })
            toast.success(updated ? `Sabor ${flavor.name} activado` : `Sabor ${flavor.name} pausado`)
        } catch (error) {
            toast.error('Error al actualizar sabor')
            loadData()
        }
    }

    const handleAddFlavor = async (e) => {
        e.preventDefault()
        if (!newFlavorName.trim()) return

        try {
            const created = await createFlavorService({
                name: newFlavorName.trim(),
                category: newFlavorCategory,
            })
            setFlavors(prev => [...prev, created])
            setNewFlavorName('')
            toast.success(`Sabor "${created.name}" agregado a ${created.category}`)
        } catch (error) {
            toast.error(error.message || 'Error al agregar sabor')
        }
    }

    const handleConfirmDeleteFlavor = async () => {
        if (!deletingFlavor) return
        try {
            setIsDeletingFlavor(true)
            await deleteFlavorService(deletingFlavor._id)
            setFlavors(prev => prev.filter(f => f._id !== deletingFlavor._id))
            toast.success('Sabor eliminado')
            setDeletingFlavor(null)
        } catch (error) {
            toast.error('Error al eliminar sabor')
        } finally {
            setIsDeletingFlavor(false)
        }
    }

    // Lista única de categorías para el filtro
    const availableCategories = useMemo(() => {
        const cats = products.map(p => p.category?.name).filter(Boolean)
        return Array.from(new Set(cats))
    }, [products])

    // Agrupación jerárquica: Categoría -> Subcategoría -> Productos
    const groupedByCategoryAndSubcategory = useMemo(() => {
        return products.reduce((acc, product) => {
            const categoryName = product.category?.name || 'Otras Categorías'
            const subcategoryName = product.subcategory?.name || 'General'

            // Aplicar filtro de categoría
            if (selectedCategoryFilter !== 'ALL' && categoryName !== selectedCategoryFilter) {
                return acc
            }

            // Aplicar filtro de búsqueda por nombre
            if (searchQuery.trim() && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return acc
            }

            if (!acc[categoryName]) {
                acc[categoryName] = {}
            }
            if (!acc[categoryName][subcategoryName]) {
                acc[categoryName][subcategoryName] = []
            }
            acc[categoryName][subcategoryName].push(product)
            return acc
        }, {})
    }, [products, selectedCategoryFilter, searchQuery])

    // Sabores agrupados por categoría oficial
    const flavorsByCategory = useMemo(() => {
        const categoriesToShow = selectedFlavorCategoryFilter === 'ALL'
            ? FLAVOR_CATEGORIES
            : [selectedFlavorCategoryFilter]

        return categoriesToShow.map(cat => {
            const catFlavors = flavors.filter(f => (f.category || 'Cremas') === cat)
            const availableCount = catFlavors.filter(f => f.available).length
            return {
                category: cat,
                flavors: catFlavors,
                availableCount,
                totalCount: catFlavors.length,
            }
        })
    }, [flavors, selectedFlavorCategoryFilter])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-neutral"></span>
                <p className="text-gray-400 text-xs font-semibold mt-3">Cargando inventario...</p>
            </div>
        )
    }

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
                                Organizado por categorías y subcategorías con ajuste de reposición en tiempo real.
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                Disponibilidad de Sabores
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-normal">
                                Gestioná los sabores artesanales organizados por Cremas, Frutales, Chocolates y Dulce de leches.
                            </p>
                        </>
                    )}
                </div>

                {/* Botón Cambiante de Vistas */}
                <div className="flex items-center gap-2">
                    {activeTab === 'stock' ? (
                        <button
                            onClick={() => setActiveTab('flavors')}
                            className="rounded-xl bg-neutral hover:bg-black/90 px-4 py-1.5 gap-1.5 text-sm font-normal text-white flex items-center"

                        >
                            <TbIceCream2 className="text-white" />
                            <span className="font-normal">Disponibilidad de sabores</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => setActiveTab('stock')}
                            className="rounded-xl bg-neutral hover:bg-black/90 px-4 py-1.5 gap-1.5 text-sm font-normal text-white flex items-center"
                        >
                            <TbPackage className="text-white" />
                            <span className="font-normal">Stock físico</span>
                        </button>
                    )}
                </div>
            </div>

            {/* VISTA 1: TABLAS DE STOCK FÍSICO POR CATEGORÍA Y SUBCATEGORÍA (ORIGINAL CON ESTADO) */}
            {activeTab === 'stock' && (
                <div className="flex flex-col gap-6 mx-auto grid w-full max-w-md sm:max-w-2xl md:max-w-2xl lg:max-w-6xl">
                    {/* Barra de Filtros y Búsqueda */}
                    <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        {/* Buscador */}
                        <div className="relative flex-1 max-w-md">
                            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <input
                                type="text"
                                placeholder="Buscar producto por nombre..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-neutral text-gray-900 font-normal"
                            />
                        </div>

                        {/* Filtro por Categoría */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium hidden md:inline">Filtrar:</span>
                            <select
                                value={selectedCategoryFilter}
                                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                                className="select select-sm rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-800 font-medium focus:outline-none cursor-pointer"
                            >
                                <option value="ALL">Todas las categorías ({products.length})</option>
                                {availableCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Listado agrupado por Categoría y Subcategoría */}
                    {Object.keys(groupedByCategoryAndSubcategory).length === 0 ? (
                        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
                            <FaBoxes className="mx-auto text-3xl mb-2 text-gray-300" />
                            <p className="font-medium text-sm">No se encontraron productos para los filtros seleccionados</p>
                        </div>
                    ) : (
                        Object.entries(groupedByCategoryAndSubcategory).map(([categoryName, subcategories]) => {
                            const totalCategoryProds = Object.values(subcategories).flat().length
                            const totalCategoryStock = Object.values(subcategories).flat().reduce((sum, p) => sum + (p.stock || 0), 0)

                            return (
                                <div
                                    key={categoryName}
                                    className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden"
                                >
                                    {/* 1. Header de Categoría Principal */}
                                    <div className="bg-gray-100/70 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-2.5">
                                            <h2 className="font-bold text-base sm:text-lg text-gray-900 tracking-tight">
                                                {categoryName}
                                            </h2>

                                        </div>
                                        <span className="text-[11px] font-bold text-gray-600 bg-white px-2.5 py-0.5 rounded-full ">
                                            {totalCategoryProds} {totalCategoryProds === 1 ? 'producto' : 'productos'}
                                        </span>
                                    </div>

                                    {/* 2. Subcategorías y Tablas Compactas */}
                                    <div className="divide-y divide-gray-100">
                                        {Object.entries(subcategories).map(([subcategoryName, subcategoryProducts]) => (
                                            <div key={subcategoryName} className="p-0">
                                                {/* Barra de Subcategoría */}
                                                <div className="bg-gray-50/60 px-4 sm:px-6 py-2 border-b border-t border-gray-200 flex items-center justify-between">
                                                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                                                        {subcategoryName}
                                                    </span>
                                                    <span className="text-[11px] text-gray-400 font-normal">
                                                        {subcategoryProducts.length} {subcategoryProducts.length === 1 ? 'variedad' : 'variedades'}
                                                    </span>
                                                </div>

                                                {/* Tabla de Productos de la Subcategoría */}
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-left border-collapse table-fixed min-w-[500px] sm:min-w-full">
                                                        {/* Definición de anchos fijos para que ninguna fila se desfase */}
                                                        <colgroup>
                                                            <col className="w-auto" />
                                                            <col className="w-28 sm:w-36" style={{ width: '130px' }} />
                                                            <col className="w-36 sm:w-44" style={{ width: '165px' }} />
                                                        </colgroup>

                                                        <tbody className="divide-y divide-gray-100">
                                                            {subcategoryProducts.map((product) => (
                                                                <tr
                                                                    key={product._id}
                                                                    className="hover:bg-gray-50/60 transition-colors"
                                                                >
                                                                    {/* Producto (Imagen + Nombre con truncate + Precio) */}
                                                                    <td className="py-2 px-4 sm:px-6 min-w-0">
                                                                        <div className="flex items-center gap-3 min-w-0">
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
                                                                            <div className="min-w-0 flex-1">
                                                                                <p className="font-semibold text-xs sm:text-sm text-gray-900 truncate" title={product.name}>
                                                                                    {product.name}
                                                                                </p>
                                                                                <p className="text-[11px] font-normal text-gray-500">
                                                                                    ${product.price}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </td>

                                                                    {/* Estado de Stock (Agotado / Bajo stock / En stock) */}
                                                                    <td className="py-2 px-2 sm:px-4 text-right">
                                                                        <div className="flex items-center justify-end">
                                                                            {product.stock === 0 ? (
                                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold bg-red-100 text-red-700 whitespace-nowrap">
                                                                                    Agotado
                                                                                </span>
                                                                            ) : product.stock <= 3 ? (
                                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-700 whitespace-nowrap">
                                                                                    Bajo stock
                                                                                </span>
                                                                            ) : (
                                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-700 whitespace-nowrap">
                                                                                    En stock
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </td>

                                                                    {/* Control Stepper compacto fijado al final de la fila */}
                                                                    <td className="py-2 px-4 sm:px-6 text-right">
                                                                        <div className="flex items-center justify-end gap-1.5">
                                                                            <div className="inline-flex items-center rounded-xl bg-gray-100 p-0.5">
                                                                                <button
                                                                                    className="w-7 h-7 flex items-center justify-center rounded-lg font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-200/80 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                                                                    onClick={() => handleStockChange(product._id, product.stock, -1)}
                                                                                    disabled={product.stock <= 0}
                                                                                    title="Restar 1"
                                                                                >
                                                                                    -
                                                                                </button>
                                                                                <span className={`w-9 text-center font-bold text-xs ${product.stock === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                                                                    {product.stock}
                                                                                </span>
                                                                                <button
                                                                                    className="w-7 h-7 flex items-center justify-center rounded-lg font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-200/80 transition-colors cursor-pointer"
                                                                                    onClick={() => handleStockChange(product._id, product.stock, 1)}
                                                                                    title="Sumar 1"
                                                                                >
                                                                                    +
                                                                                </button>
                                                                            </div>

                                                                            {/* Botón sumar 10 rápido */}
                                                                            <button
                                                                                className="h-8 px-2.5 rounded-xl bg-gray-100 hover:bg-gray-200/80 text-[11px] font-bold text-gray-700 transition-colors cursor-pointer"
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
                                        ))}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            )}

            {/* VISTA 2: DISPONIBILIDAD DE SABORES POR CATEGORÍA */}
            {activeTab === 'flavors' && (
                <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                    {/* Barra Superior: Formulario para añadir sabor con Select de Categoría */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="font-bold text-base text-gray-900">Añadir Sabor</h2>
                            <p className="text-xs text-gray-500 font-normal">
                                Asignale un nombre y una categoría para catalogarlo.
                            </p>
                        </div>

                        {/* Formulario con Input de Nombre + Select de Categoría + Botón */}
                        <form onSubmit={handleAddFlavor} className="flex flex-wrap items-center gap-2">
                            <input
                                type="text"
                                placeholder="Nombre del sabor..."
                                value={newFlavorName}
                                onChange={(e) => setNewFlavorName(e.target.value)}
                                className="input input-sm rounded-xl border border-gray-200 bg-white text-xs px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-neutral w-44 sm:w-52 font-normal"
                            />

                            {/* Select de Categoría */}
                            <select
                                value={newFlavorCategory}
                                onChange={(e) => setNewFlavorCategory(e.target.value)}
                                className="select select-sm rounded-xl border border-gray-200 bg-white text-xs px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-neutral font-medium cursor-pointer"
                            >
                                {FLAVOR_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="submit"
                                disabled={!newFlavorName.trim()}
                                className="btn btn-sm rounded-xl bg-neutral text-white hover:bg-neutral-800 border-none font-medium text-xs px-3.5 gap-1.5 disabled:bg-gray-200 shadow-2xs cursor-pointer"
                            >
                                <FaPlus size={10} />
                                <span>Agregar</span>
                            </button>
                        </form>
                    </div>

                    {/* Barra de Filtros de Categorías de Sabores (Estilo Historial de Pedidos) */}
                    <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-200 w-fit overflow-x-auto">
                        <button
                            type="button"
                            onClick={() => setSelectedFlavorCategoryFilter('ALL')}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${selectedFlavorCategoryFilter === 'ALL'
                                    ? 'bg-gray-100 text-black'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Todas ({flavors.length})
                        </button>
                        {FLAVOR_CATEGORIES.map((cat) => {
                            const count = flavors.filter((f) => (f.category || 'Cremas') === cat).length
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedFlavorCategoryFilter(cat)}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${selectedFlavorCategoryFilter === cat
                                            ? 'bg-gray-100 text-black'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {cat} ({count})
                                </button>
                            )
                        })}
                    </div>


                    {/* Listado de Sabores Agrupados por Categoría */}
                    <div className="flex flex-col gap-5">
                        {flavorsByCategory.map(({ category, flavors: catFlavors, availableCount, totalCount }) => (
                            <div
                                key={category}
                                className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden"
                            >
                                {/* Cabecera de la Categoría de Sabor */}
                                <div className="bg-gray-50/70 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <h3 className="font-bold text-sm text-gray-900">
                                            {category}
                                        </h3>

                                    </div>
                                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                                        {availableCount} de {totalCount} disponibles
                                    </span>
                                </div>

                                {catFlavors.length === 0 ? (
                                    <div className="p-6 text-center text-gray-400 text-xs">
                                        No hay sabores cargados en {category}.
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-gray-100 text-[10px] font-normal text-gray-400 uppercase tracking-wider bg-gray-50/30">
                                                    <th className="py-2.5 px-4 font-medium">Sabor</th>
                                                    <th className="py-2.5 px-4 font-medium text-center w-36">Estado Online</th>
                                                    <th className="py-2.5 px-4 font-medium text-right w-24">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {catFlavors.map((flavor) => (
                                                    <tr
                                                        key={flavor._id}
                                                        className="hover:bg-gray-50/60 transition-colors group"
                                                    >
                                                        <td className="py-2.5 px-4">
                                                            <span className={`text-xs sm:text-sm ${flavor.available
                                                                ? 'font-medium text-gray-900'
                                                                : 'font-normal text-gray-400 line-through'
                                                                }`}>
                                                                {flavor.name}
                                                            </span>
                                                        </td>

                                                        <td className="py-2.5 px-4 text-center">
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

                                                        <td className="py-2.5 px-4 text-right">
                                                            <button
                                                                type="button"
                                                                className="w-7 h-7 inline-flex items-center justify-center rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                                                onClick={() => setDeletingFlavor(flavor)}
                                                                title="Eliminar sabor permanentemente"
                                                            >
                                                                <TbTrash size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal de confirmación para eliminar sabor */}
            <ConfirmModal
                isOpen={Boolean(deletingFlavor)}
                title="Eliminar sabor"
                message={`¿Estás seguro de que deseas eliminar el sabor "${deletingFlavor?.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                confirmVariant="danger"
                iconType="trash"
                isLoading={isDeletingFlavor}
                onConfirm={handleConfirmDeleteFlavor}
                onClose={() => setDeletingFlavor(null)}
            />
        </div>
    )
}

export default AdminInventory
