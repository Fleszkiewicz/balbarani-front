import { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
    createCategoryService,
    updateCategoryService,
} from '../../services/categoryServices'
import { TbCategoryPlus, TbPencil } from 'react-icons/tb'

const CategoryFormModal = ({ onClose, onCreated, onUpdated, category }) => {
    const isEditing = Boolean(category)

    const [form, setForm] = useState({
        name: category?.name ?? '',
        description: category?.description ?? '',
        imageUrl: category?.imageUrl ?? '',
    })
    const [saving, setSaving] = useState(false)

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!form.name.trim() || !form.imageUrl.trim()) {
            toast.error('Nombre e imagen son obligatorios')
            return
        }

        try {
            setSaving(true)
            const payload = {
                name: form.name.trim(),
                description: form.description.trim(),
                imageUrl: form.imageUrl.trim(),
            }

            if (isEditing) {
                const updated = await updateCategoryService(category._id, payload)
                toast.success('Categoría actualizada')
                onUpdated(updated)
            } else {
                const created = await createCategoryService(payload)
                toast.success('Categoría creada')
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
                            {isEditing ? <TbPencil size={20} /> : <TbCategoryPlus size={20} />}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                {isEditing ? 'Editar categoría' : 'Añadir categoría'}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {isEditing ? 'Modificá los datos de la categoría' : 'Completá los datos para la nueva categoría'}
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
                            placeholder="Ej: Helados"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Descripción (opcional)</label>
                        <input
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-neutral text-gray-900 font-normal transition-all"
                            placeholder="Breve descripción..."
                        />
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

export default CategoryFormModal
