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
                <h1 className="text-3xl font-bold">{category?.name}</h1>
                <button
                    type="button"
                    className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-gray-50"
                    onClick={() => setIsCreateSubcategoryOpen(true)}
                >
                    + Añadir subcategoría
                </button>
            </div>

            {/* Secciones por subcategoría */}
            <div className="flex flex-col gap-10">
                {subcategories.length === 0 && (
                    <p className="text-center text-base-content/60">
                        Esta categoría no tiene subcategorías todavía.
                    </p>
                )}

                {subcategories.map((sub) => {
                    const products = productsBySubcategory[sub._id] ?? []
                    return (
                        <section key={sub._id}>
                            {/* Título de subcategoría */}
                            <div className="flex items-center gap-3 mb-3 border-b pb-2">
                                <h2 className="text-xl font-semibold flex-1">{sub.name}</h2>
                                <button
                                    type="button"
                                    className="btn btn-xs btn-ghost"
                                    onClick={() => setEditingSubcategory(sub)}
                                    aria-label={`Editar ${sub.name}`}
                                >
                                    ✏️
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-xs btn-ghost"
                                    onClick={() => setDeletingSubcategory(sub)}
                                    aria-label={`Eliminar ${sub.name}`}
                                >
                                    🗑️
                                </button>
                                <button
                                    type="button"
                                    className="rounded-full bg-neutral px-4 py-1.5 text-xs font-semibold text-neutral-content shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                                    onClick={() => setCreateProductFor(sub)}
                                >
                                    + Producto
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
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="bg-[#4a3f35] text-white px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
                                                        ${product.price}
                                                    </span>
                                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                        {product.inventoryType === 'stock'
                                                            ? `Stk: ${product.stock}`
                                                            : `${product.flavors?.length ?? 0} sab.`}
                                                    </span>
                                                </div>
                                                <div className="flex-1"></div>
                                                
                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        type="button"
                                                        className="h-8 flex-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors text-xs font-medium"
                                                        onClick={() =>
                                                            setEditingProduct({ product, subcategory: sub })
                                                        }
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors shrink-0"
                                                        onClick={() =>
                                                            setDeletingProduct({
                                                                product,
                                                                subcategoryId: sub._id,
                                                            })
                                                        }
                                                    >
                                                        🗑️
                                                    </button>
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
            {deletingSubcategory && (
                <div className="modal modal-open px-4">
                    <section className="modal-box">
                        <h3 className="font-bold text-lg mb-2">Eliminar subcategoría</h3>
                        <p>
                            ¿Seguro que querés eliminar{' '}
                            <span className="font-semibold">{deletingSubcategory.name}</span>?
                        </p>
                        <div className="modal-action">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setDeletingSubcategory(null)}
                                disabled={deletingSubcategory_loading}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn btn-error"
                                onClick={handleConfirmDeleteSubcategory}
                                disabled={deletingSubcategory_loading}
                            >
                                {deletingSubcategory_loading ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </section>
                    <div className="modal-backdrop" onClick={() => setDeletingSubcategory(null)}></div>
                </div>
            )}

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
            {deletingProduct && (
                <div className="modal modal-open px-4">
                    <section className="modal-box">
                        <h3 className="font-bold text-lg mb-2">Eliminar producto</h3>
                        <p>
                            ¿Seguro que querés eliminar{' '}
                            <span className="font-semibold">{deletingProduct.product.name}</span>?
                        </p>
                        <div className="modal-action">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setDeletingProduct(null)}
                                disabled={deletingProduct_loading}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn btn-error"
                                onClick={handleConfirmDeleteProduct}
                                disabled={deletingProduct_loading}
                            >
                                {deletingProduct_loading ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </section>
                    <div className="modal-backdrop" onClick={() => setDeletingProduct(null)}></div>
                </div>
            )}
        </div>
    )
}

export default AdminCategoryDetail
