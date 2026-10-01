import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { getCategoryBySlugService } from '../../services/categoryServices'
import {
    getSubcategoriesByCategoryService,
    deleteSubcategoryService,
} from '../../services/subcategoryServices'
import { getAllProductsService, deleteProductService } from '../../services/productServices'
import { CATEGORY_SLUGS } from '../../constants/categories.js'
import SubcategoryFormModal from './SubcategoryFromModal.jsx'
import ProductFormModal from './ProductFormModal.jsx'
import { FiEdit2 } from "react-icons/fi";
import { FiTrash } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import ConfirmModal from '../../components/Common/ConfirmModal.jsx'

const AdminCategoryDetail = () => {
    const { categorySlug } = useParams()

    const [category, setCategory] = useState(null)
    const [subcategories, setSubcategories] = useState([])
    // products por subcategoryId: { [id]: Product[] }
    const [productsBySubcategory, setProductsBySubcategory] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Modales subcategoría
    const [isCreateSubcategoryOpen, setIsCreateSubcategoryOpen] = useState(false)
    const [editingSubcategory, setEditingSubcategory] = useState(null)
    const [deletingSubcategory, setDeletingSubcategory] = useState(null)
    const [deletingSubcategory_loading, setDeletingSubcategoryLoading] = useState(false)

    // Modales producto
    const [createProductFor, setCreateProductFor] = useState(null) // subcategory object
    const [editingProduct, setEditingProduct] = useState(null)     // { product, subcategory }
    const [deletingProduct, setDeletingProduct] = useState(null)   // { product, subcategoryId }
    const [deletingProduct_loading, setDeletingProductLoading] = useState(false)

    const loadProducts = useCallback(async (subs, catSlug) => {
        const entries = await Promise.all(
            subs.map(async (sub) => {
                try {
                    const data = await getAllProductsService(catSlug, sub.slug)
                    return [sub._id, data]
                } catch {
                    return [sub._id, []]
                }
            }),
        )
        return Object.fromEntries(entries)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [categoryData, subcategoriesData] = await Promise.all([
                    getCategoryBySlugService(categorySlug),
                    getSubcategoriesByCategoryService(categorySlug),
                ])
                setCategory(categoryData)
                setSubcategories(subcategoriesData)
                const productsMap = await loadProducts(subcategoriesData, categorySlug)
                setProductsBySubcategory(productsMap)
            } catch (err) {
                setError(err.message || 'Error al cargar los datos')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [categorySlug, loadProducts])

    // ── Handlers subcategoría ──────────────────────────────────
    const handleSubcategoryCreated = async (created) => {
        setSubcategories((prev) => [...prev, created])
        setProductsBySubcategory((prev) => ({ ...prev, [created._id]: [] }))
    }

    const handleSubcategoryUpdated = (updated) => {
        setSubcategories((prev) =>
            prev.map((s) => (s._id === updated._id ? updated : s)),
        )
        setEditingSubcategory(null)
    }

    const handleConfirmDeleteSubcategory = async () => {
        try {
            setDeletingSubcategoryLoading(true)
            await deleteSubcategoryService(deletingSubcategory._id)
            setSubcategories((prev) =>
                prev.filter((s) => s._id !== deletingSubcategory._id),
            )
            setProductsBySubcategory((prev) => {
                const next = { ...prev }
                delete next[deletingSubcategory._id]
                return next
            })
            toast.success('Subcategoría eliminada')
            setDeletingSubcategory(null)
        } catch (err) {
            toast.error(err.message)
        } finally {
            setDeletingSubcategoryLoading(false)
        }
    }

    // ── Handlers producto ──────────────────────────────────────
    const handleProductCreated = (subcategoryId, created) => {
        setProductsBySubcategory((prev) => ({
            ...prev,
            [subcategoryId]: [...(prev[subcategoryId] ?? []), created],
        }))
    }

    const handleProductUpdated = (subcategoryId, updated) => {
        setProductsBySubcategory((prev) => ({
            ...prev,
            [subcategoryId]: prev[subcategoryId].map((p) =>
                p._id === updated._id ? updated : p,
            ),
        }))
        setEditingProduct(null)
    }

    const handleConfirmDeleteProduct = async () => {
        const { product, subcategoryId } = deletingProduct
        try {
            setDeletingProductLoading(true)
            await deleteProductService(product._id)
            setProductsBySubcategory((prev) => ({
                ...prev,
                [subcategoryId]: prev[subcategoryId].filter((p) => p._id !== product._id),
            }))
            toast.success('Producto eliminado')
            setDeletingProduct(null)
        } catch (err) {
            toast.error(err.message)
        } finally {
            setDeletingProductLoading(false)
        }
    }

    if (loading) return <div className="loading loading-spinner mx-auto block mt-10"></div>
    if (error) return <p className="text-center mt-10 text-error">{error}</p>

    return (
        <div>
            {/* Breadcrumb */}
            <div className="text-sm breadcrumbs mb-4">
                <ul>
                    <li><Link to="/admin/dashboard/catalogo">Catálogo</Link></li>
                    <li>{category?.name}</li>
                </ul>
            </div>

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h1 className="text-4xl font-bold">{category?.name}</h1>
                <button
                    type="button"
                    className="rounded-full bg-neutral px-4 py-2.5 text-sm font-semibold text-neutral-content shadow-sm transition-all hover:-translate-y-0.5 "
                    onClick={() => setIsCreateSubcategoryOpen(true)}
                >
                    <div className="flex items-center gap-1">
                        <FiPlus size={16} strokeWidth={3} />
                        Añadir Subcategoría
                    </div>
                </button>
            </div>

            {/* Secciones por subcategoría */}
            <div className="flex flex-col gap-10">
                {subcategories.length === 0 && (
                    <p className="text-center text-base-content/60">
                        Esta categoría no tiene Subcategorías todavía.
                    </p>
                )}

                {subcategories.map((sub) => {
                    const products = productsBySubcategory[sub._id] ?? []
                    return (
                        <section key={sub._id}>
                            {/* Título de subcategoría */}
                            <div className="flex items-center gap-3 mb-3 border-b pb-2">
                                <h2 className="text-2xl font-semibold flex-1">{sub.name}</h2>
                                <button
                                    type="button"
                                    className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200 flex items-center justify-center transition-colors"
                                    onClick={() => setEditingSubcategory(sub)}
                                    aria-label={`Editar ${sub.name}`}
                                >
                                    <FiEdit2 size={16} />
                                </button>
                                <button
                                    type="button"
                                    className="w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center transition-colors "
                                    onClick={() => setDeletingSubcategory(sub)}
                                    aria-label={`Eliminar ${sub.name}`}
                                >
                                    <FiTrash size={16} />
                                </button>
                                <button
                                    type="button"
                                    className="rounded-full bg-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-300 transition-colors"
                                    onClick={() => setCreateProductFor(sub)}
                                >
                                    <div className="flex items-center gap-1">
                                        <FiPlus strokeWidth={3} />
                                        Añadir Producto
                                    </div>
                                </button>
                            </div>

                            {/* Fila de productos */}
                            {products.length === 0 ? (
                                <p className="text-sm text-base-content/50 pl-1">
                                    Sin productos aún.
                                </p>
                            ) : (
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {products.map((product) => (
                                        <div
                                            key={product._id}
                                            className="bg-white w-48 min-w-48 shrink-0 shadow-sm rounded-[1.5rem] p-2 flex flex-col gap-2 transition-transform hover:scale-[1.02] border border-gray-100"
                                        >
                                            <div className="relative w-full aspect-square rounded-[1rem] overflow-hidden bg-gray-50">
                                                {product.imageUrl ? (
                                                    <img
                                                        className="w-full h-full object-cover"
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">Sin imagen</div>
                                                )}
                                            </div>
                                            <div className="px-1 flex flex-col flex-1 gap-1 pb-1">
                                                <p className="font-bold text-sm leading-tight text-gray-900 line-clamp-2">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {product.description}
                                                </p>
                                                <div className="flex-1"></div>

                                                <div className="flex gap-3 justify-between">
                                                    <div className='flex items-center'>
                                                        <span className="bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap">
                                                            ${product.price}
                                                        </span>
                                                    </div>
                                                    <div className='justify-end flex gap-2'>
                                                        <button
                                                            type="button"
                                                            className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200 flex items-center justify-center transition-colors"
                                                            onClick={() =>
                                                                setEditingProduct({ product, subcategory: sub })
                                                            }
                                                        >
                                                            <FiEdit2 size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center transition-colors"
                                                            onClick={() =>
                                                                setDeletingProduct({
                                                                    product,
                                                                    subcategoryId: sub._id,
                                                                })
                                                            }
                                                        >
                                                            <FiTrash size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )
                })}
            </div>

            {/* ── Modales subcategoría ── */}
            {isCreateSubcategoryOpen && (
                <SubcategoryFormModal
                    categoryId={category._id}
                    onClose={() => setIsCreateSubcategoryOpen(false)}
                    onCreated={handleSubcategoryCreated}
                />
            )}
            {editingSubcategory && (
                <SubcategoryFormModal
                    subcategory={editingSubcategory}
                    categoryId={category._id}
                    onClose={() => setEditingSubcategory(null)}
                    onUpdated={handleSubcategoryUpdated}
                />
            )}
            <ConfirmModal
                isOpen={Boolean(deletingSubcategory)}
                title="Eliminar subcategoría"
                message={`¿Seguro que deseas eliminar la subcategoría "${deletingSubcategory?.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                confirmVariant="danger"
                iconType="trash"
                isLoading={deletingSubcategory_loading}
                onConfirm={handleConfirmDeleteSubcategory}
                onClose={() => setDeletingSubcategory(null)}
            />

            {/* ── Modales producto ── */}
            {createProductFor && (
                <ProductFormModal
                    categoryId={category._id}
                    subcategoryId={createProductFor._id}
                    isArtisanIceCream={category?.slug === CATEGORY_SLUGS.HELADO_ARTESANAL}
                    onClose={() => setCreateProductFor(null)}
                    onCreated={(created) => {
                        handleProductCreated(createProductFor._id, created)
                        setCreateProductFor(null)
                    }}
                />
            )}
            {editingProduct && (
                <ProductFormModal
                    product={editingProduct.product}
                    categoryId={category._id}
                    subcategoryId={editingProduct.subcategory._id}
                    isArtisanIceCream={category?.slug === CATEGORY_SLUGS.HELADO_ARTESANAL}
                    onClose={() => setEditingProduct(null)}
                    onUpdated={(updated) =>
                        handleProductUpdated(editingProduct.subcategory._id, updated)
                    }
                />
            )}
            <ConfirmModal
                isOpen={Boolean(deletingProduct)}
                title="Eliminar producto"
                message={`¿Seguro que deseas eliminar el producto "${deletingProduct?.product?.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                confirmVariant="danger"
                iconType="trash"
                isLoading={deletingProduct_loading}
                onConfirm={handleConfirmDeleteProduct}
                onClose={() => setDeletingProduct(null)}
            />
        </div>
    )
}

export default AdminCategoryDetail
