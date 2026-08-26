import { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
    createProductService,
    updateProductService,
} from '../../services/productServices'

const EMPTY_FLAVOR = { name: '', available: true }

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

    const inputClass = `
        w-full
        rounded-2xl
        border
        border-base-content/10
        bg-base-100/80
        px-4
        py-3
        text-sm
        backdrop-blur-sm
        transition-all
        duration-300
        outline-none
        focus:border-primary/40
        focus:ring-4
        focus:ring-primary/10
    `

    return (
        <div className="modal modal-open px-4">
            <section
                className="
                    modal-box
                    relative
                    mx-auto
                    flex
                    w-full
                    max-w-md
                    flex-col
                    gap-5
                    rounded-[28px]
                    border
                    border-gray-100
                    bg-white
                    p-8
                    shadow-[0_10px_35px_rgba(0,0,0,0.08)]
                "
            >
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-2xl text-base-content">
                        {isEditing ? 'Editar producto' : 'Añadir producto'}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-sm btn-circle btn-ghost"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Nombre"
                        />
                    </div>
                    <div>
                        <input
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Descripción"
                        />
                    </div>
                    <div>
                        <input
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Precio"
                            type="number"
                            min="0"
                        />
                    </div>
                    <div>
                        <input
                            name="imageUrl"
                            value={form.imageUrl}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="URL de la imagen"
                        />
                    </div>

                    {!isArtisanIceCream && (
                        <div>
                            <input
                                name="stock"
                                value={form.stock}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Stock"
                                type="number"
                                min="0"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="
                            mt-2
                            w-full
                            rounded-full
                            bg-neutral
                            px-6
                            py-3
                            font-medium
                            text-neutral-content
                            transition-all
                            duration-300
                            hover:-translate-y-0.5
                            hover:shadow-lg
                        "
                    >
                        {saving
                            ? 'Guardando...'
                            : isEditing
                                ? 'Guardar cambios'
                                : 'Crear producto'}
                    </button>
                </form>
            </section>
            <div className="modal-backdrop bg-base-300/40 backdrop-blur-sm" onClick={onClose}></div>
        </div>
    )
}

export default ProductFormModal
