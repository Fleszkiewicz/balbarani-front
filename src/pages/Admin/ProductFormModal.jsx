import { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
    createProductService,
    updateProductService,
} from '../../services/productServices'
import { TbPackage, TbPencil } from 'react-icons/tb'

const ProductFormModal = ({
    onClose,
    onCreated,
    onUpdated,
    product,
    categoryId,
    subcategoryId,
    isArtisanIceCream,
}) => {
    const isEditing = Boolean(product)

    const [form, setForm] = useState({
        name: product?.name ?? '',
        description: product?.description ?? '',
        price: product?.price ?? '',
        imageUrl: product?.imageUrl ?? '',
        stock: product?.stock ?? '',
    })
    const [saving, setSaving] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.name.trim() || !form.imageUrl.trim() || !form.price) {
            toast.error('Nombre, imagen y precio son obligatorios')
            return
        }

        try {
            setSaving(true)

            const payload = {
                name: form.name.trim(),
                description: form.description.trim(),
                price: Number(form.price),
                imageUrl: form.imageUrl.trim(),
                inventoryType: isArtisanIceCream ? 'flavor' : 'stock',
                category: categoryId,
                ...(subcategoryId && { subcategory: subcategoryId }),
                ...(isArtisanIceCream
                    ? { flavors: [] }
                    : { stock: Number(form.stock) || 0 }),
            }

            if (isEditing) {
                const updated = await updateProductService(product._id, payload)
                toast.success('Producto actualizado')
                onUpdated(updated)
            } else {
                const { product: created } = await createProductService(payload)
                toast.success('Producto creado')
                onCreated(created)
            }

            onClose()
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            {/* Click afuera para cerrar */}
            <div className="absolute inset-0" onClick={!saving ? onClose : undefined} />

            <div className="relative bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-gray-100 shadow-xl z-10 animate-in fade-in zoom-in-95 duration-200">
                {/* Cabecera */}
                <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 shrink-0">
                            {isEditing ? <TbPencil size={20} /> : <TbPackage size={20} />}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                {isEditing ? 'Editar producto' : 'Añadir producto'}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {isEditing ? 'Modificá los datos del producto' : 'Ingresá los datos del nuevo producto'}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer text-sm"
                    >
                        ✕
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre</label>
                        <input
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-neutral text-gray-900 font-normal transition-all"
                            placeholder="Ej: 1 Kg de Helado"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Descripción</label>
                        <input
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-neutral text-gray-900 font-normal transition-all"
                            placeholder="Descripción breve..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Precio ($)</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-gray-400">$</span>
                                <input
                                    name="price"
                                    required
                                    type="number"
                                    min="0"
                                    value={form.price}
                                    onChange={handleChange}
                                    className="w-full pl-7 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-neutral text-gray-900 font-normal transition-all"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {!isArtisanIceCream ? (
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Stock disponible</label>
                                <input
                                    name="stock"
                                    type="number"
                                    min="0"
                                    value={form.stock}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-neutral text-gray-900 font-normal transition-all"
                                    placeholder="0"
                                />
                            </div>
                        ) : (
                            <div>

                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">URL de la imagen</label>
                        <input
                            name="imageUrl"
                            required
                            value={form.imageUrl}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-neutral text-gray-900 font-normal transition-all"
                            placeholder="https://ejemplo.com/foto.jpg"
                        />
                    </div>

                    {/* Botones de Acción (2 Columnas) */}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-xl bg-gray-200 hover:bg-gray-300 px-4 py-2 text-sm font-medium text-gray-800 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-neutral hover:bg-black/90 px-4 py-2 text-sm font-medium text-white flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {saving ? 'Guardando...' : isEditing ? 'Guardar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProductFormModal
