import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useCart } from '../../context/cartContextData.js'
import {
    buildConfigurationPayload,
    buildFlavorQuantities,
    getMaxFlavorPortions,
    getTotalSelectedPortions,
    isFlavorConfigurationValid,
} from '../../utils/artisanIceCream.js'
import QuantityStepper from './QuantityStepper.jsx'

const ArtisanIceCreamConfigModal = ({ product, categorySlug, onClose }) => {
    const { addToCart, loading } = useCart()
    const { _id, name, price, imageUrl, description, stock, flavors = [] } =
        product

    const maxPortions = getMaxFlavorPortions(name)

    const [flavorQuantities, setFlavorQuantities] = useState(() =>
        buildFlavorQuantities(flavors),
    )

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

    return (
        <div className="modal modal-open px-4 z-[1100]">
            <section className="modal-box w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4 gap-3">
                    <div>
                        <h3 className="font-bold text-xl">{name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Elegí {maxPortions} porciones de sabor
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-sm btn-circle btn-ghost"
                        aria-label="Cerrar"
                    >
                        ✕
                    </button>
                </div>

                <div className="mb-6">
                    <h4 className="font-semibold mb-3">Sabores:</h4>
                    <ul className="space-y-3">
                        {flavors.map((flavor) => {
                            const qty = flavorQuantities[flavor.name] || 0
                            const unavailable = !flavor.available

                            return (
                                <li
                                    key={flavor._id || flavor.name}
                                    className={`flex items-center justify-between gap-3 ${unavailable ? 'text-gray-400' : ''}`}
                                >
                                    <span className="flex-1">{flavor.name}</span>
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
                    <p className="text-sm mt-3 text-gray-600">
                        Porciones seleccionadas: {totalPortions} / {maxPortions}
                    </p>
                </div>

                <div className="border-t pt-4 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Precio</p>
                        <p className="text-xl font-bold">${price}</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={loading || !isConfigurationValid}
                        className="btn btn-success"
                    >
                        Agregar al carrito
                    </button>
                </div>
            </section>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    )
}

export default ArtisanIceCreamConfigModal
