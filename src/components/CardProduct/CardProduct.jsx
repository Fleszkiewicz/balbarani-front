import { useNavigate } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import { useCart } from '../../context/cartContextData.js'
import { useUser } from '../../context/userContextData.ts'
import { getProductCardType } from '../../utils/artisanIceCream.js'
import { PRODUCT_CARD_TYPES } from '../../constants/categories.js'
import ArtisanIceCreamCard from '../ArtisanIceCream/ArtisanIceCreamCard.jsx'
import toast from 'react-hot-toast'

const CardProduct = ({ product, categorySlug }) => {
    const cardType = getProductCardType(product, categorySlug)

    // Si es producto de helado artesanal, renderiza su tarjeta con modal de sabores
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
        <div className="bg-white w-48 min-w-48 shrink-0 shadow-sm rounded-[1.5rem] p-2.5 flex flex-col gap-2 transition-transform hover:scale-[1.02] border border-gray-100">
            {/* Imagen del producto */}
            <div className="relative w-full aspect-square rounded-[1rem] overflow-hidden bg-gray-50">
                <img
                    className="w-full h-full object-cover"
                    src={imageUrl}
                    alt={name}
                />
            </div>

            {/* Contenido: Nombre + Descripción */}
            <div className="px-1 flex flex-col flex-1 pb-1">
                <p className="font-bold text-sm leading-tight text-gray-900 line-clamp-1" title={name}>
                    {name}
                </p>
                {description && (
                    <p className="text-xs font-medium text-gray-400 line-clamp-2 mt-0.5">
                        {description}
                    </p>
                )}

                {/* Espaciador flexible para empujar el precio y botón al fondo */}
                <div className="flex-1 min-h-3"></div>

                {/* Fila inferior: Precio a la izquierda y Botón Redondo (+) a la derecha */}
                <div className="flex justify-between items-center pt-2">
                    <div className="flex flex-col">
                        <span className="font-black text-base text-gray-900 tracking-tight">
                            ${price}
                        </span>
                        {stock === 0 && !isFlavorProduct && (
                            <span className="text-[10px] font-bold text-red-500 leading-none">
                                Sin stock
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={isAddDisabled}
                        className="w-8 h-8 rounded-full bg-neutral text-white hover:bg-neutral-800 flex items-center justify-center transition-all shadow-xs hover:shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                        title={stock === 0 && !isFlavorProduct ? 'Sin stock' : 'Añadir al carrito'}
                        aria-label={`Añadir ${name} al carrito`}
                    >
                        <FiPlus size={16} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CardProduct
