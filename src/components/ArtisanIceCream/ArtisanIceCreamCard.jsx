import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import ArtisanIceCreamConfigModal from './ArtisanIceCreamConfigModal.jsx'

const ArtisanIceCreamCard = ({ product, categorySlug }) => {
    const { name, price, imageUrl, description } = product
    const [isConfigOpen, setIsConfigOpen] = useState(false)

    return (
        <>
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
                    <div className="card-actions justify-end mt-4">
                        <button
                            type="button"
                            onClick={() => setIsConfigOpen(true)}
                            className="btn btn-success btn-circle"
                            aria-label={`Configurar ${name}`}
                        >
                            <FaPlus size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {isConfigOpen && (
                <ArtisanIceCreamConfigModal
                    product={product}
                    categorySlug={categorySlug}
                    onClose={() => setIsConfigOpen(false)}
                />
            )}
        </>
    )
}

export default ArtisanIceCreamCard
