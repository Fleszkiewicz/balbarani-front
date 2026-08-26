import { useState, useEffect } from 'react'
import { getAllProductsService, updateProductService } from '../../services/productServices'
import { getFlavorsService, createFlavorService, updateFlavorService, deleteFlavorService } from '../../services/flavorServices'
import { toast } from 'react-hot-toast'
import { FaPlus, FaTrash } from 'react-icons/fa'

const AdminInventory = () => {
    const [activeTab, setActiveTab] = useState('stock') // 'stock' o 'flavors'

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

    // --- Manejo de Stock ---
    const handleStockChange = async (productId, currentStock, delta) => {
        const newStock = Math.max(0, currentStock + delta)
        if (newStock === currentStock) return

        try {
            // Actualización optimista
            setProducts(prev => prev.map(p =>
                p._id === productId ? { ...p, stock: newStock } : p
            ))

            await updateProductService(productId, { stock: newStock })
        } catch (error) {
            toast.error('Error al actualizar stock')
            loadData() // revertir
        }
    }

    // --- Manejo de Sabores ---
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
            loadData() // revertir
        }
    }

    const handleAddFlavor = async (e) => {
        e.preventDefault()
        if (!newFlavorName.trim()) return

        try {
            const created = await createFlavorService({ name: newFlavorName.trim() })
            setFlavors(prev => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)))
            setNewFlavorName('')
            toast.success('Sabor agregado')
        } catch (error) {
            toast.error(error.message)
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

    if (loading) {
        return <div className="loading loading-spinner mx-auto block mt-10"></div>
    }

    // --- Agrupación de productos por subcategoría ---
    const groupedProducts = products.reduce((acc, product) => {
        // Si no tiene subcategoría, lo mandamos a 'Otros'
        const subcategoryName = product.subcategory?.name || 'Otros'
        if (!acc[subcategoryName]) {
            acc[subcategoryName] = []
        }
        acc[subcategoryName].push(product)
        return acc
    }, {})


    return (
        <div className="p-6 max-w-6xl mx-auto pb-24">
            <h1 className="text-3xl font-bold mb-6">Inventario</h1>

            <div className="flex gap-3 mb-8">
                <button
                    className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                        activeTab === 'stock'
                            ? 'bg-neutral text-white shadow-md'
                            : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('stock')}
                >
                    Stock Físico
                </button>
                <button
                    className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                        activeTab === 'flavors'
                            ? 'bg-neutral text-white shadow-md'
                            : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('flavors')}
                >
                    Disponibilidad de Sabores
                </button>
            </div>

            {/* VISTA STOCK */}
            {/* VISTA STOCK */}
            {activeTab === 'stock' && (
                <div className="flex flex-col gap-8">
                    {Object.keys(groupedProducts).length === 0 && (
                        <div className="bg-base-100 rounded-xl shadow p-4 text-center text-gray-500">
                            No hay productos de tipo stock.
                        </div>
                    )}

                    {Object.entries(groupedProducts).map(([subcategoryName, subcategoryProducts]) => (
                        <div key={subcategoryName} className="bg-white rounded-[28px] border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.04)] overflow-hidden">
                            {/* Título de la Subcategoría */}
                            <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-100">
                                <h2 className="font-bold text-xl text-gray-900">{subcategoryName}</h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Categoría</th>
                                            <th>Stock Actual</th>
                                            <th>Acciones Rápidas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subcategoryProducts.map(product => (
                                            <tr key={product._id} className="hover">
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <div className="avatar">
                                                            <div className="mask mask-squircle w-12 h-12">
                                                                <img src={product.imageUrl} alt={product.name} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-bold">{product.name}</div>
                                                            <div className="text-sm opacity-50">${product.price}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{product.category?.name || '-'}</td>
                                                <td>
                                                    <span className={`badge ${product.stock > 0 ? 'badge-success' : 'badge-error'} font-bold`}>
                                                        {product.stock}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            className="btn btn-sm btn-circle btn-error text-white"
                                                            onClick={() => handleStockChange(product._id, product.stock, -1)}
                                                            disabled={product.stock <= 0}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-8 text-center font-bold">{product.stock}</span>
                                                        <button
                                                            className="btn btn-sm btn-circle btn-success text-white"
                                                            onClick={() => handleStockChange(product._id, product.stock, 1)}
                                                        >
                                                            +
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline ml-4"
                                                            onClick={() => handleStockChange(product._id, product.stock, 10)}
                                                            title="Sumar 10"
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
            )}


            {/* VISTA SABORES */}
            {activeTab === 'flavors' && (
                <div className="bg-white rounded-[28px] border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.04)] p-8">
                    <form onSubmit={handleAddFlavor} className="flex flex-wrap gap-4 mb-8">
                        <input
                            type="text"
                            placeholder="Nuevo sabor..."
                            className="
                                w-full max-w-xs
                                rounded-2xl
                                border border-gray-200
                                bg-gray-50/50
                                px-5 py-3
                                text-sm
                                outline-none
                                transition-all
                                focus:border-primary/40 focus:ring-4 focus:ring-primary/10
                            "
                            value={newFlavorName}
                            onChange={(e) => setNewFlavorName(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            disabled={!newFlavorName.trim()}
                            className="
                                rounded-full
                                bg-neutral
                                px-6 py-3
                                font-medium
                                text-white
                                transition-all
                                hover:-translate-y-0.5 hover:shadow-lg
                                disabled:opacity-50 disabled:cursor-not-allowed
                                flex items-center gap-2
                            "
                        >
                            <FaPlus /> Agregar Sabor
                        </button>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {flavors.map(flavor => (
                            <div 
                                key={flavor._id} 
                                className={`
                                    flex items-center justify-between p-5 rounded-2xl border transition-all duration-300
                                    ${flavor.available 
                                        ? 'border-green-100 bg-green-50/30 hover:border-green-200' 
                                        : 'border-red-100 bg-red-50/30 opacity-75 grayscale-[50%]'}
                                `}
                            >
                                <span className={`font-medium ${!flavor.available && 'line-through text-gray-400'}`}>
                                    {flavor.name}
                                </span>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-success"
                                        checked={flavor.available}
                                        onChange={() => handleToggleFlavor(flavor)}
                                    />
                                    <button
                                        className="w-8 h-8 flex items-center justify-center rounded-full text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                                        onClick={() => handleDeleteFlavor(flavor._id)}
                                        title="Eliminar sabor"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {flavors.length === 0 && (
                        <p className="text-center text-gray-500 mt-8">No hay sabores cargados.</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default AdminInventory
