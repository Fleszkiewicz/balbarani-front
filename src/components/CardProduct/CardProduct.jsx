import { useNavigate } from 'react-router-dom'
import { FaShoppingCart } from 'react-icons/fa'
import { useCart } from '../../context/cartContextData.js'
import { useUser } from '../../context/userContextData.ts'
import { getProductCardType } from '../../utils/artisanIceCream.js'
import { PRODUCT_CARD_TYPES } from '../../constants/categories.js'
import ArtisanIceCreamCard from '../ArtisanIceCream/ArtisanIceCreamCard.jsx'
import toast from 'react-hot-toast'

const CardProduct = ({ product, categorySlug }) => {
    const cardType = getProductCardType(product, categorySlug)

    if (cardType === PRODUCT_CARD_TYPES.ARTISAN_ICE_CREAM) {
        return (
            <ArtisanIceCreamCard
                product={product}
                categorySlug={categorySlug}
            />
        )
    }

    return <DefaultProductCard product={product} />
}

const DefaultProductCard = ({ product }) => {
    const {
        _id,
        name,
        price,
        imageUrl,
        description,
        stock,
        inventoryType,
    } = product

    const { addToCart, loading } = useCart()
    const { userInfo } = useUser()
    const navigate = useNavigate()

    const isFlavorProduct = inventoryType === 'flavor'
    const isAddDisabled = loading || (!isFlavorProduct && stock === 0)

    const handleAddToCart = async () => {
        if (!userInfo?.id) {
            toast.error('Para añadir productos a tu carrito, debes iniciar sesión')
            navigate('/login')
            return
        }

        await addToCart({
            _id,
            name,
            price,
            imageUrl,
            description,
            stock,
            inventoryType,
        })
    }

    return (
        <div className="bg-white w-48 min-w-48 shrink-0 shadow-sm rounded-[1.5rem] p-2 flex flex-col gap-2 transition-transform hover:scale-[1.02] border border-gray-100">
            <div className="relative w-full aspect-square rounded-[1rem] overflow-hidden bg-gray-50">
                <img
                    className="w-full h-full object-cover"
                    src={imageUrl}
                    alt={name}
                />
            </div>

            <div className="px-1 flex flex-col flex-1 gap-1 pb-1">
                <p className="font-bold text-sm leading-tight text-gray-900 line-clamp-2">
                    {name}
                </p>
                <p className="text-xs font-medium text-gray-400 line-clamp-3">
                    {description}
                </p>
                <div className="flex justify-between items-center mt-1">
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
                        ${price}
                    </span>
                </div>

                <div className="flex-1"></div>

                <button
                    onClick={handleAddToCart}
                    disabled={isAddDisabled}
                    className="h-8 w-full rounded-full bg-[#4a3f35] hover:bg-[#362e26] text-white transition-colors mt-2 text-xs font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {stock === 0 && !isFlavorProduct ? 'Sin Stock' : 'Añadir'}
                </button>
            </div>
        </div>
    )
}

export default CardProduct