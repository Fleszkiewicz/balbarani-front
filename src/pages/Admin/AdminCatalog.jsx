import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { getAllCategoriesService, deleteCategoryService } from '../../services/categoryServices'
import CategoryFormModal from './CategoryFormModal.jsx'
import ConfirmModal from '../../components/Common/ConfirmModal'
import { FiEdit2, FiTrash, FiGrid } from 'react-icons/fi'
import { LuArrowDownUp } from 'react-icons/lu'
import ManageCatalogView from './ManageCatalogView.jsx'

const AdminCatalog = () => {
    const [categories, setCategories] = useState([])
    const [viewMode, setViewMode] = useState('catalog') // 'catalog' (tarjetas) | 'manage' (ordenar)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [deletingCategory, setDeletingCategory] = useState(null)
    const [deleting, setDeleting] = useState(false)

    // Carga de categorías desde la API
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

    useEffect(() => {
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
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <span className="loading loading-spinner loading-lg text-neutral"></span>
                <p className="text-gray-400 text-xs font-semibold mt-3">Cargando catálogo...</p>
            </div>
        )
    }

    if (error) {
        return <p className="text-center mt-10 text-error">{error}</p>
    }

    return (
        <div className="pb-16">
            {/* Cabecera Superior: Idéntica a Inventario de Stock / Sabores (abarca todo el ancho) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    {viewMode === 'catalog' ? (
                        <>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                Catálogo
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-normal">
                                Gestioná las categorías de tu tienda o administrá el orden de visualización de tus productos.
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                Administrar Catálogo
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-normal">
                                Organizá las categorías, subcategorías y productos arrastrándolos según cómo querés que se vean en la tienda.
                            </p>
                        </>
                    )}
                </div>

                {/* Botón Alternador de Vistas */}
                <div className="flex items-center gap-2">
                    {viewMode === 'catalog' ? (
                        <>
                            {/* Botón blanco para pasar a Administrar Catálogo */}
                            <button
                                type="button"
                                onClick={() => setViewMode('manage')}
                                className="btn btn-sm bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-xs gap-1.5 text-gray-800 shadow-xs cursor-pointer font-medium"
                                title="Administrar orden del catálogo"
                            >
                                <LuArrowDownUp className="text-neutral-700 text-xs" />
                                <span>Administrar Catálogo</span>
                            </button>

                            {/* Botón negro para Añadir categoría */}
                            <button
                                type="button"
                                className="rounded-full bg-neutral px-4 py-1.5 text-sm font-semibold text-neutral-content shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                                onClick={() => setIsCreateOpen(true)}
                            >
                                + Añadir categoría
                            </button>
                        </>
                    ) : (
                        /* Botón blanco para volver a Catálogo */
                        <button
                            type="button"
                            onClick={() => {
                                setViewMode('catalog')
                                fetchCategories()
                            }}
                            className="btn btn-sm bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-xs gap-1.5 text-gray-800 shadow-xs cursor-pointer font-medium"
                            title="Volver al catálogo"
                        >
                            <FiGrid className="text-neutral-700 text-xs" />
                            <span>Catálogo</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Contenido dinámico según el modo de vista */}
            {viewMode === 'catalog' ? (
                <>
                    {/* Grilla de Tarjetas de Categorías */}
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
                                                className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200 flex items-center justify-center transition-colors"
                                                aria-label={`Editar ${category.name}`}
                                                onClick={() => setEditingCategory(category)}
                                            >
                                                <FiEdit2 size={18} />
                                            </button>
                                            <button
                                                type="button"
                                                className="w-10 h-10 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center transition-colors"
                                                aria-label={`Eliminar ${category.name}`}
                                                onClick={() => setDeletingCategory(category)}
                                            >
                                                <FiTrash size={18} />
                                            </button>
                                        </div>
                                        <Link
                                            to={`/admin/dashboard/catalogo/${category.slug}`}
                                            className="px-4 py-2.5 rounded-full bg-black text-white font-medium transition-colors text-sm"
                                        >
                                            Ver más
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

                    {/* Modal Confirmar Eliminación */}
                    <ConfirmModal
                        isOpen={Boolean(deletingCategory)}
                        title="Eliminar categoría"
                        message={`¿Seguro que deseas eliminar la categoría "${deletingCategory?.name}"? Esta acción no se puede deshacer.`}
                        confirmText="Eliminar"
                        cancelText="Cancelar"
                        confirmVariant="danger"
                        iconType="trash"
                        isLoading={deleting}
                        onConfirm={handleConfirmDelete}
                        onClose={() => setDeletingCategory(null)}
                    />
                </>
            ) : (
                /* Pantalla de Administrar Catálogo con Drag & Drop */
                <ManageCatalogView
                    onBackToCatalog={() => {
                        setViewMode('catalog')
                        fetchCategories()
                    }}
                />
            )}
        </div>
    )
}

export default AdminCatalog
