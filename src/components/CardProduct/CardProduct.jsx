import { Link } from 'react-router'
import { FaShoppingCart } from 'react-icons/fa'
import { useCart } from '../../context/cartContextData.js'
import { getProductCardType } from '../../utils/artisanIceCream.js'
import { PRODUCT_CARD_TYPES } from '../../constants/categories.js'
import ArtisanIceCreamCard from '../ArtisanIceCream/ArtisanIceCreamCard.jsx'

const CardProduct = ({ product, categorySlug }) => {
    const cardType = getProductCardType(product, categorySlug)

    if (cardType === PRODUCT_CARD_TYPES.ARTISAN_ICE_CREAM) {
        return (
            <ArtisanIceCreamCard product={product} categorySlug={categorySlug} />
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
        flavors = [],
    } = product

    const { addToCart, loading, openModal } = useCart()

    const isFlavorProduct = inventoryType === 'flavor'
    const isAddDisabled = loading || (!isFlavorProduct && stock === 0)

    const handleAddToCart = async () => {
        await addToCart({
            _id,
            name,
            price,
            imageUrl,
            description,
            stock,
            inventoryType,
        })
        openModal()
    }

    return (
        <div className="card bg-base-100 w-80 lg:w-[30%] shadow-lg">
            <figure>
                <img
                    className="aspect-[9/9] object-cover w-full"
                    src={imageUrl}
                    alt={name}
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{name}</h2>
                <div className="badge badge-warning">${price}</div>
                <p>{description}</p>

                {isFlavorProduct && flavors.length > 0 && (
                    <p className="text-sm text-gray-500">
                        {flavors.filter((f) => f.available).length} sabores
                        disponibles
                    </p>
                )}

                <div className="card-actions justify-between mt-4">
                    <Link
                        to={`/detailProduct/${_id}`}
                        className="btn btn-info btn-sm md:btn-md"
                    >
                        Ver Detalles
                    </Link>
                    <button
                        onClick={handleAddToCart}
                        disabled={isAddDisabled}
                        className="btn btn-success btn-sm md:btn-md"
                    >
                        <FaShoppingCart size={16} />
                        {stock === 0 ? 'Sin Stock' : 'Agregar'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CardProduct
