import { useMemo, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/userContextData.ts'
import { toast } from 'react-hot-toast'
import { useCart } from '../../context/cartContextData.js'
import {
    buildConfigurationPayload,
    buildFlavorQuantities,
    getMaxFlavorPortions,
    getTotalSelectedPortions,
    isFlavorConfigurationValid,
} from '../../utils/artisanIceCream.js'
import { getFlavorsService } from '../../services/flavorServices.js'
import QuantityStepper from './QuantityStepper.jsx'

const ArtisanIceCreamConfigModal = ({ product, categorySlug, onClose }) => {
    const { addToCart, loading } = useCart()
    const { userInfo } = useUser()
    const navigate = useNavigate()
    const { _id, name, price, imageUrl, description, stock } = product

    const maxPortions = getMaxFlavorPortions(name)

    const [globalFlavors, setGlobalFlavors] = useState([])
    const [flavorQuantities, setFlavorQuantities] = useState({})
    const [loadingFlavors, setLoadingFlavors] = useState(true)

    useEffect(() => {
        const fetchFlavors = async () => {
            try {
                const data = await getFlavorsService()
                setGlobalFlavors(data)
                setFlavorQuantities(buildFlavorQuantities(data))
            } catch (error) {
                toast.error('Error al cargar sabores')
            } finally {
                setLoadingFlavors(false)
            }
        }
        fetchFlavors()
    }, [])

    const totalPortions = getTotalSelectedPortions(flavorQuantities)
    const isConfigurationValid = isFlavorConfigurationValid(
        name,
        flavorQuantities,
    )

    const configuration = useMemo(
        () => buildConfigurationPayload(flavorQuantities),
        [flavorQuantities],
    )

    const handleFlavorChange = (flavorName, delta) => {
        setFlavorQuantities((prev) => {
            const current = prev[flavorName] || 0
            const nextValue = current + delta
            if (nextValue < 0) return prev
            if (delta > 0 && totalPortions >= maxPortions) return prev
            return { ...prev, [flavorName]: nextValue }
        })
    }

    const handleAddToCart = async () => {
        if (!userInfo?.id) {
            toast.error('Para añadir productos a tu carrito, debes iniciar sesión')
            navigate('/login')
            onClose()
            return
        }
        if (!isConfigurationValid) {
            toast.error(
                `Debés completar ${maxPortions} porciones de sabor para este producto`,
            )
            return
        }

        await addToCart({
            _id,
            name,
            price,
            imageUrl,
            description,
            stock,
            inventoryType: 'flavor',
            configuration,
            unitTotal: price,
            categorySlug,
        })

        onClose()
    }

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm" onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <section className="bg-white w-full max-w-lg rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm border border-amber-200/50 mb-3 inline-block">
                            Elegí tus sabores
                        </span>
                        <h3 className="font-black text-2xl text-gray-900 tracking-tight leading-tight">{name}</h3>
                        <p className="text-sm text-gray-500 mt-1 font-medium">
                            Máximo {maxPortions} porciones
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors shadow-sm"
                        aria-label="Cerrar"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 overflow-y-auto">
                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm font-semibold mb-2">
                            <span className={totalPortions === maxPortions ? "text-green-600" : "text-gray-600"}>
                                {totalPortions === maxPortions ? "¡Listo!" : "Porciones seleccionadas"}
                            </span>
                            <span className={totalPortions === maxPortions ? "text-green-600" : "text-gray-900"}>
                                {totalPortions} / {maxPortions}
                            </span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${totalPortions === maxPortions ? 'bg-green-500' : 'bg-amber-500'}`}
                                style={{ width: `${(totalPortions / maxPortions) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {loadingFlavors ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <span className="loading loading-spinner loading-lg text-amber-500"></span>
                            <p className="text-gray-500 mt-4 font-medium">Cargando sabores...</p>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {globalFlavors.map((flavor) => {
                                const qty = flavorQuantities[flavor.name] || 0
                                const unavailable = !flavor.available

                                return (
                                    <li
                                        key={flavor._id || flavor.name}
                                        className={`flex items-center justify-between gap-3 rounded-2xl transition-colors ${qty > 0 ? 'bg-amber-50/50 border border-amber-100/50' : 'bg-white border border-transparent hover:bg-gray-50'} ${unavailable ? 'opacity-50 grayscale pointer-events-none' : ''}`}
                                    >
                                        <span className={`flex-1 font-medium ${qty > 0 ? 'text-amber-900' : 'text-gray-700'}`}>
                                            {flavor.name}
                                        </span>
                                        <QuantityStepper
                                            value={qty}
                                            unavailable={unavailable}
                                            disabledDecrease={qty <= 0}
                                            disabledIncrease={
                                                unavailable ||
                                                totalPortions >= maxPortions
                                            }
                                            onDecrease={() =>
                                                handleFlavorChange(flavor.name, -1)
                                            }
                                            onIncrease={() =>
                                                handleFlavorChange(flavor.name, 1)
                                            }
                                        />
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 p-6 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.02)] z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
                        <p className="text-sm text-gray-500 font-medium">Precio final</p>
                        <p className="text-3xl font-black text-gray-900">${price}</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={loading || !isConfigurationValid}
                        className={`w-full sm:w-auto px-8 h-12 rounded-full font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${!isConfigurationValid
                            ? 'bg-gray-100 text-gray-400'
                            : 'bg-neutral text-white hover:bg-neutral-800 hover:-translate-y-0.5 hover:shadow-md'
                            }`}
                    >
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Agregar al carrito'}
                    </button>
                </div>
            </section>
        </div>,
        document.body
    )
}

export default ArtisanIceCreamConfigModal
