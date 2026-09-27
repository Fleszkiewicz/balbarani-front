import { useEffect, useState } from 'react'
import CardProduct from '../CardProduct/CardProduct.jsx'
import { getAllProductsService } from '../../services/productServices'
import { Spinner, EmptyState } from '../ui'

const ProductGrid = ({ categorySlug, subcategorySlug }) => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await getAllProductsService(
                    categorySlug,
                    subcategorySlug,
                )
                setProducts(data)
            } catch (err) {
                setError(err.message || 'Error al cargar los productos')
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [categorySlug, subcategorySlug])

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Spinner size="lg" />
            </div>
        )
    }

    if (error) {
        return <p className="text-center mt-10 text-error">{error}</p>
    }

    if (products.length === 0) {
        return (
            <div className="max-w-md mx-auto py-12">
                <EmptyState
                    title="No hay productos disponibles"
                    description="No se encontraron productos en esta sección todavía."
                />
            </div>
        )
    }

    return (
        <div className="flex flex-wrap gap-5 justify-center px-4 pb-10">
            {products.map((product) => (
                <CardProduct
                    key={product._id}
                    product={product}
                    categorySlug={categorySlug}
                />
            ))}
        </div>
    )
}

export default ProductGrid