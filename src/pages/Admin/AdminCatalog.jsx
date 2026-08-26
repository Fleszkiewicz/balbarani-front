import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { getAllCategoriesService, deleteCategoryService } from '../../services/categoryServices'
import CategoryFormModal from './CategoryFormModal.jsx'

const AdminCatalog = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [deletingCategory, setDeletingCategory] = useState(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true)
                const data = await getAllCategoriesService()
                setCategories(data)
            } catch (err) {
                setError(err.message || 'Error al cargar las categorías')
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    const handleConfirmDelete = async () => {
        try {
            setDeleting(true)
            await deleteCategoryService(deletingCategory._id)
            setCategories((prev) => prev.filter((c) => c._id !== deletingCategory._id))
            toast.success('Categoría eliminada')
            setDeletingCategory(null)
        } catch (err) {
            toast.error(err.message)
        } finally {
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <div className="loading loading-spinner mx-auto block mt-10"></div>
        )
    }

    if (error) {
        return <p className="text-center mt-10 text-error">{error}</p>
    }

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 className="text-3xl font-bold">Catálogo</h1>
                <button
                    type="button"
                    className="rounded-full bg-neutral px-6 py-2.5 text-sm font-semibold text-neutral-content shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    onClick={() => setIsCreateOpen(true)}
                >
                    + Añadir categoría
                </button>
            </div>

            <div className="flex flex-wrap gap-5 justify-center pb-10">
                {categories.map((category) => (
                    <div
                        key={category._id}
                        className="bg-white w-80 lg:w-[30%] shadow-sm rounded-[2rem] p-3 flex flex-col gap-3 transition-transform hover:scale-[1.02] border border-gray-100"
                    >
                        <div className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-gray-50">
                            <img
                                className="w-full h-full object-cover"
                                src={category.imageUrl}
                                alt={category.name}
                            />
                        </div>
                        <div className="px-1 flex flex-col flex-1 gap-2 pb-1">
                            <h2 className="font-bold text-xl leading-tight text-gray-900">{category.name}</h2>
                            {category.description && (
                                <p className="text-sm text-gray-500 line-clamp-2">{category.description}</p>
                            )}
                            
                            <div className="flex-1"></div>
                            
                            <div className="flex justify-between items-center mt-2">
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                        aria-label={`Editar ${category.name}`}
                                        onClick={() => setEditingCategory(category)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        type="button"
                                        className="w-10 h-10 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                                        aria-label={`Eliminar ${category.name}`}
                                        onClick={() => setDeletingCategory(category)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                                <Link
                                    to={`/admin/dashboard/catalogo/${category.slug}`}
                                    className="px-6 py-2 rounded-full bg-[#4a3f35] text-white font-medium hover:bg-[#362e26] transition-colors"
                                >
                                    Ver
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Crear */}
            {isCreateOpen && (
                <CategoryFormModal
                    onClose={() => setIsCreateOpen(false)}
                    onCreated={(created) =>
                        setCategories((prev) => [...prev, created])
                    }
                />
            )}

            {/* Modal Editar */}
            {editingCategory && (
                <CategoryFormModal
                    category={editingCategory}
                    onClose={() => setEditingCategory(null)}
                    onUpdated={(updated) =>
                        setCategories((prev) =>
                            prev.map((c) =>
                                c._id === updated._id ? updated : c,
                            ),
                            setEditingCategory(null)
                        )
                    }
                />
            )}

            {/* Modal confirmar eliminación */}
            {deletingCategory && (
                <div className="modal modal-open px-4">
                    <section className="modal-box">
                        <h3 className="font-bold text-lg mb-2">Eliminar categoría</h3>
                        <p>
                            ¿Seguro que querés eliminar{' '}
                            <span className="font-semibold">{deletingCategory.name}</span>?
                            Esta acción no se puede deshacer.
                        </p>
                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => setDeletingCategory(null)}
                                disabled={deleting}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="btn btn-error"
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </section>
                    <div className="modal-backdrop" onClick={() => setDeletingCategory(null)}></div>
                </div>
            )}
        </div>
    )
}

export default AdminCatalog
