import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { getCategoryBySlugService } from '../../services/categoryServices'
import { getSubcategoriesByCategoryService } from '../../services/subcategoryServices'
import { getAllProductsService, deleteProductService } from '../../services/productServices'
import ProductFormModal from './ProductFormModal.jsx'
import ConfirmModal from '../../components/Common/ConfirmModal'
import { FiEdit2 } from "react-icons/fi";
import { FiTrash } from "react-icons/fi";

const AdminSubcategoryDetail = () => {
    const { categorySlug, subcategorySlug } = useParams()

    const [category, setCategory] = useState(null)
    const [subcategory, setSubcategory] = useState(null)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [deletingProduct, setDeletingProduct] = useState(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [categoryData, subcategoriesData, productsData] = await Promise.all([
                    getCategoryBySlugService(categorySlug),
                    getSubcategoriesByCategoryService(categorySlug),
                    getAllProductsService(categorySlug, subcategorySlug),
                ])
                setCategory(categoryData)
                const sub = subcategoriesData.find((s) => s.slug === subcategorySlug)
                setSubcategory(sub ?? null)
                setProducts(productsData)
            } catch (err) {
                setError(err.message || 'Error al cargar los datos')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [categorySlug, subcategorySlug])

    const handleConfirmDelete = async () => {
        try {
            setDeleting(true)
            await deleteProductService(deletingProduct._id)
            setProducts((prev) => prev.filter((p) => p._id !== deletingProduct._id))
            toast.success('Producto eliminado')
            setDeletingProduct(null)
        } catch (err) {
            toast.error(err.message)
        } finally {
            setDeleting(false)
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
                    <li><Link to={`/admin/dashboard/catalogo/${categorySlug}`}>{category?.name}</Link></li>
                    <li>{subcategory?.name}</li>
                </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 className="text-3xl font-bold">{subcategory?.name}</h1>
                <button
                    type="button"
                    className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    onClick={() => setIsCreateOpen(true)}
                >
                    + Añadir producto
                </button>
            </div>

            {products.length === 0 ? (
                <p className="text-center mt-10 text-base-content/60">
                    Esta subcategoría no tiene productos todavía.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table text-center">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Inventario</th>
                                <th>Imagen</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={product._id}>
                                    <th>{index + 1}</th>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>
                                        {product.inventoryType === 'stock'
                                            ? `Stock: ${product.stock}`
                                            : `${product.flavors?.length ?? 0} sabores`}
                                    </td>
                                    <td>
                                        {product.imageUrl && (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded mx-auto"
                                            />
                                        )}
                                    </td>
                                    <td className="flex gap-2 justify-center">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-ghost"
                                            onClick={() => setEditingProduct(product)}
                                        >
                                            <FiEdit2 size={18} />
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-ghost"
                                            onClick={() => setDeletingProduct(product)}
                                        >
                                            <FiTrash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal crear */}
            {isCreateOpen && category && subcategory && (
                <ProductFormModal
                    categoryId={category._id}
                    subcategoryId={subcategory._id}
                    onClose={() => setIsCreateOpen(false)}
                    onCreated={(created) => setProducts((prev) => [...prev, created])}
                />
            )}

            {/* Modal editar */}
            {editingProduct && category && subcategory && (
                <ProductFormModal
                    product={editingProduct}
                    categoryId={category._id}
                    subcategoryId={subcategory._id}
                    onClose={() => setEditingProduct(null)}
                    onUpdated={(updated) => {
                        setProducts((prev) =>
                            prev.map((p) => (p._id === updated._id ? updated : p)),
                        )
                        setEditingProduct(null)
                    }}
                />
            )}

            {/* Modal confirmar eliminación */}
            <ConfirmModal
                isOpen={Boolean(deletingProduct)}
                title="Eliminar producto"
                message={`¿Seguro que deseas eliminar el producto "${deletingProduct?.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                confirmVariant="danger"
                iconType="trash"
                isLoading={deleting}
                onConfirm={handleConfirmDelete}
                onClose={() => setDeletingProduct(null)}
            />
        </div>
    )
}

export default AdminSubcategoryDetail
