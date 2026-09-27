import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaShoppingCart } from 'react-icons/fa'
import { useProduct } from '../context/productContextData.js'
import { useCart } from '../context/cartContextData.js'
import { isArtisanIceCreamProduct } from '../utils/artisanIceCream.js'
import { CATEGORY_SLUGS } from '../constants/categories.js'
import { useUser } from '../context/userContextData.ts'
import toast from 'react-hot-toast'

const DetailProduct = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getProductById, product, productLoading } = useProduct()
    const { addToCart, loading, openModal } = useCart()
    const { userInfo } = useUser()

    useEffect(() => {
        getProductById(id)
    }, [id, getProductById])

    useEffect(() => {
        if (productLoading || !product?._id) return

        const categorySlug = product.category?.slug
        if (isArtisanIceCreamProduct(product, categorySlug)) {
            navigate(`/categoria/${CATEGORY_SLUGS.HELADO_ARTESANAL}`, {
                replace: true,
            })
        }
    }, [product, productLoading, navigate])

    const handleAddToCart = async () => {
        if (!userInfo?.id) {
            toast.error('Para añadir productos a tu carrito, debes iniciar sesión')
            navigate('/login')
            return
        }

        await addToCart(product)
        openModal()
    }

    if (productLoading) {
        return <div className="loading loading-spinner"></div>
    }

    const categorySlug = product.category?.slug
    if (isArtisanIceCreamProduct(product, categorySlug)) {
        return null
    }

    return (
        <div className="mt-6 md:flex">
            <div className="md:w-1/2">
                <img src={product.imageUrl} alt={product.name} />
            </div>
            <section className="flex flex-col gap-5 pt-2 md:pt-0 md:pl-4 md:w-1/2">
                <h1 className="text-4xl font-bold">{product.name}</h1>
                <p className="mt-2 text-lg font-normal">{product.description}</p>
                <p className="mt-2 text-3xl font-bold badge badge-warning p-4">
                    ${product.price}
                </p>
                <p className="mt-2">Unidades en stock: {product.stock}</p>
                <button
                    onClick={handleAddToCart}
                    disabled={loading || product.stock === 0}
                    className="btn btn-success mt-2 md:mt-auto md:btn-lg"
                >
                    <FaShoppingCart size={16} />
                    {product.stock === 0 ? 'Sin Stock' : 'Agregar al carrito'}
                </button>
            </section>
        </div>
    )
}

export default DetailProduct
