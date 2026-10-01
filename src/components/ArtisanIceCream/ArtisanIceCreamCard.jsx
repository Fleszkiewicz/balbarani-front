import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import { useUser } from '../../context/userContextData.ts'
import toast from 'react-hot-toast'
import ArtisanIceCreamConfigModal from './ArtisanIceCreamConfigModal.jsx'

const ArtisanIceCreamCard = ({ product, categorySlug }) => {
    const { name, price, imageUrl, description } = product
    const [isConfigOpen, setIsConfigOpen] = useState(false)
    const { userInfo } = useUser()
    const navigate = useNavigate()

    const handleOpenConfig = () => {
        if (!userInfo?.id) {
            toast.error('Para añadir productos a tu carrito, debes iniciar sesión')
            navigate('/login')
            return
        }
        setIsConfigOpen(true)
    }

    return (
        <>
            <div className="bg-white w-48 min-w-48 shrink-0 shadow-sm rounded-[1.5rem] p-2.5 flex flex-col gap-2 transition-transform hover:scale-[1.02] border border-gray-100">
                {/* Imagen */}
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
                    {description ? (
                        <p className="text-xs font-medium text-gray-400 line-clamp-2 mt-0.5">
                            {description}
                        </p>
                    ) : (
                        <p className="text-xs font-medium text-gray-400 line-clamp-2 mt-0.5">
                            Helado artesanal
                        </p>
                    )}

                    {/* Espaciador flexible */}
                    <div className="flex-1 min-h-3"></div>

                    {/* Fila inferior: Precio a la izquierda y Botón Redondo (+) a la derecha */}
                    <div className="flex justify-between items-center pt-2">
                        <span className="font-black text-base text-gray-900 tracking-tight">
                            ${price}
                        </span>

                        <button
                            type="button"
                            onClick={handleOpenConfig}
                            className="w-8 h-8 rounded-full bg-neutral text-white hover:bg-neutral-800 flex items-center justify-center transition-all shadow-xs hover:shadow-md active:scale-95 cursor-pointer shrink-0"
                            title="Elegir sabores"
                            aria-label={`Elegir sabores para ${name}`}
                        >
                            <FiPlus size={16} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal para configurar los sabores del helado */}
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
