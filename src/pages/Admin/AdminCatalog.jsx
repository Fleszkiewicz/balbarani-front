import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { getAllCategoriesService, deleteCategoryService } from '../../services/categoryServices'
import CategoryFormModal from './CategoryFormModal.jsx'
import ConfirmModal from '../../components/Common/ConfirmModal'
import { FiEdit2, FiTrash, FiGrid } from 'react-icons/fi'
import { LuArrowDownUp } from 'react-icons/lu'
import ManageCatalogView from './ManageCatalogView.jsx'
import { FaArrowRight } from 'react-icons/fa'
import { TbPlus, TbCategory, TbCategoryPlus, TbPencil, TbTrash } from 'react-icons/tb'


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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 mt-6">
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
                                className="rounded-xl bg-neutral hover:bg-black/90 px-4 py-1.5 gap-1.5 text-sm font-normal text-white flex items-center"
                                title="Administrar orden del catálogo"
                            >
                                <LuArrowDownUp size={16} className="text-white" />
                                <span>Administrar Catálogo</span>
                            </button>

                            {/* Botón negro para Añadir categoría */}
                            <button
                                type="button"
                                className="rounded-xl bg-neutral hover:bg-black/90 px-4 py-1.5 gap-1.5 text-sm font-normal text-white flex items-center"
                                onClick={() => setIsCreateOpen(true)}
                            >
                                <TbCategoryPlus size={16} className="text-white" />
                                Añadir categoría
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
                            className="rounded-xl bg-neutral hover:bg-black/90 px-4 py-1.5 gap-1.5 text-sm font-normal text-white flex items-center"
                        >
                            <TbCategory size={16} className="text-white" />
                            <span>Volver al Catálogo</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Contenido dinámico según el modo de vista */}
            {viewMode === 'catalog' ? (
                <>
                    {/* Grilla de Tarjetas de Categorías (Idéntica a la Tienda Online) */}
                    <div className="mx-auto grid w-full max-w-md sm:max-w-2xl md:max-w-2xl lg:max-w-6xl grid-cols-2 sm:grid-cols-2 gap-6 pb-6">
                        {categories.map((category) => (
                            <div
                                key={category._id}
                                className="
                                    group
                                    relative
                                    h-72
                                    overflow-hidden
                                    rounded-3xl
                                    bg-gray-900
                                    border border-gray-200/80
                                    shadow-sm
                                    hover:shadow-xl
                                    transition-all
                                    duration-500
                                "
                            >
                                {/* Imagen de Fondo con Zoom Suave en hover */}
                                {category.imageUrl && (
                                    <img
                                        src={category.imageUrl}
                                        alt={category.name}
                                        className="
                                            absolute
                                            inset-0
                                            h-full
                                            w-full
                                            object-cover
                                            transition-transform
                                            duration-700
                                            ease-out
                                            group-hover:scale-105
                                        "
                                    />
                                )}

                                {/* Degradado Oscuro para Legibilidad */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300 group-hover:opacity-90 pointer-events-none"></div>

                                {/* Enlace de fondo para que al hacer clic en la tarjeta navegue a la categoría */}
                                <Link
                                    to={`/admin/dashboard/catalogo/${category.slug}`}
                                    className="absolute inset-0 z-0"
                                    aria-label={`Ver ${category.name}`}
                                />

                                {/* Barra Superior: Botones Editar / Eliminar a la izquierda y 'Ver productos' a la derecha */}
                                <div className="absolute top-4 inset-x-4 flex justify-between items-center z-10 pointer-events-auto">
                                    {/* Botones de acción rápida */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            className="w-9 h-9 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200 flex items-center justify-center transition-colors"
                                            aria-label={`Editar ${category.name}`}
                                            title="Editar categoría"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setEditingCategory(category)
                                            }}
                                        >
                                            <TbPencil size={18} />
                                        </button>
                                        <button
                                            type="button"
                                            className="w-9 h-9 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center transition-colors"
                                            aria-label={`Eliminar ${category.name}`}
                                            title="Eliminar categoría"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setDeletingCategory(category)
                                            }}
                                        >
                                            <TbTrash size={18} />
                                        </button>
                                    </div>

                                    {/* Badge Superior: Ver productos */}
                                    <Link
                                        to={`/admin/dashboard/catalogo/${category.slug}`}
                                        className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 hover:bg-white hover:text-gray-900 transition-colors shadow-2xs"
                                    >
                                        <span>Ver productos</span>
                                        <FaArrowRight size={9} />
                                    </Link>
                                </div>

                                {/* Contenido Inferior: Nombre y Descripción */}
                                <Link
                                    to={`/admin/dashboard/catalogo/${category.slug}`}
                                    className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end z-10 pointer-events-auto cursor-pointer"
                                >
                                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
                                        {category.name}
                                    </h2>

                                    {category.description && (
                                        <p className="text-xs sm:text-sm text-gray-200/90 font-normal leading-relaxed mt-1 line-clamp-2 drop-shadow-sm">
                                            {category.description}
                                        </p>
                                    )}
                                </Link>
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
