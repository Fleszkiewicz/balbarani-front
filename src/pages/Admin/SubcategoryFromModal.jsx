import { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
    createSubcategoryService,
    updateSubcategoryService,
} from '../../services/subcategoryServices'

const SubcategoryFormModal = ({ onClose, onCreated, onUpdated, subcategory, categoryId }) => {
    const isEditing = Boolean(subcategory)

    const [form, setForm] = useState({
        name: subcategory?.name ?? '',
        imageUrl: subcategory?.imageUrl ?? '',
    })
    const [saving, setSaving] = useState(false)

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!form.name.trim()) {
            toast.error('El nombre es obligatorio')
            return
        }

        try {
            setSaving(true)
            const payload = {
                name: form.name.trim(),
                imageUrl: form.imageUrl.trim(),
                ...(!isEditing && { category: categoryId }),
            }

            if (isEditing) {
                const updated = await updateSubcategoryService(subcategory._id, payload)
                toast.success('Subcategoría actualizada')
                onUpdated(updated)
            } else {
                const created = await createSubcategoryService(payload)
                toast.success('Subcategoría creada')
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
                        {isEditing ? 'Editar subcategoría' : 'Añadir subcategoría'}
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
                            name="imageUrl"
                            value={form.imageUrl}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="URL de la imagen (opcional)"
                        />
                    </div>
                    
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
                                : 'Crear subcategoría'}
                    </button>
                </form>
            </section>
            <div className="modal-backdrop bg-base-300/40 backdrop-blur-sm" onClick={onClose}></div>
        </div>
    )
}

export default SubcategoryFormModal
