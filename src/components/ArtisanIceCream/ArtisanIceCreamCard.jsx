import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import ArtisanIceCreamConfigModal from './ArtisanIceCreamConfigModal.jsx'

const ArtisanIceCreamCard = ({ product, categorySlug }) => {
    const { name, price, imageUrl, description } = product
    const [isConfigOpen, setIsConfigOpen] = useState(false)

    return (
        <>
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
                    <div className="flex justify-between items-center mt-1">
                        <span className="bg-[#4a3f35] text-white px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
                            ${price}
                        </span>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            Artesanal
                        </span>
                    </div>
                    
                    <div className="flex-1"></div>

                    <button
                        onClick={() => setIsConfigOpen(true)}
                        className="h-8 w-full rounded-full bg-[#4a3f35] hover:bg-[#362e26] text-white transition-colors mt-2 text-xs font-semibold flex items-center justify-center"
                    >
                        Añadir
                    </button>
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
