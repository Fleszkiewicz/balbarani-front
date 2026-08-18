import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useCart } from '../../context/cartContextData.js'
import { getAllProductsService } from '../../services/productServices.js'
import { CATEGORY_SLUGS } from '../../constants/categories.js'
import {
    buildConfigurationPayload,
    buildFlavorQuantities,
    calculateConfiguredUnitTotal,
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
    const [extraQuantities, setExtraQuantities] = useState({})
    const [availableExtras, setAvailableExtras] = useState([])
    const [extrasLoading, setExtrasLoading] = useState(true)

    const totalPortions = getTotalSelectedPortions(flavorQuantities)
    const isConfigurationValid = isFlavorConfigurationValid(
        name,
        flavorQuantities,
    )

    useEffect(() => {
        const fetchExtras = async () => {
            try {
                setExtrasLoading(true)
                const data = await getAllProductsService(
                    CATEGORY_SLUGS.EXTRAS,
                )
                setAvailableExtras(data)
                setExtraQuantities(
                    Object.fromEntries(data.map((extra) => [extra._id, 0])),
                )
            } catch {
                setAvailableExtras([])
            } finally {
                setExtrasLoading(false)
            }
        }

        fetchExtras()
    }, [])

    const selectedExtras = useMemo(
        () =>
            availableExtras.map((extra) => ({
                ...extra,
                quantity: extraQuantities[extra._id] || 0,
            })),
        [availableExtras, extraQuantities],
    )

    const configuration = useMemo(
        () => buildConfigurationPayload(flavorQuantities, selectedExtras),
        [flavorQuantities, selectedExtras],
    )

    const unitTotal = calculateConfiguredUnitTotal(price, configuration)

    const handleFlavorChange = (flavorName, delta) => {
        setFlavorQuantities((prev) => {
            const current = prev[flavorName] || 0
            const nextValue = current + delta
            if (nextValue < 0) return prev
            if (delta > 0 && totalPortions >= maxPortions) return prev
            return { ...prev, [flavorName]: nextValue }
        })
    }

    const handleExtraChange = (extraId, delta, extra) => {
        setExtraQuantities((prev) => {
            const current = prev[extraId] || 0
            const nextValue = current + delta
            if (nextValue < 0) return prev
            if (delta > 0 && extra.stock !== undefined && nextValue > extra.stock)
                return prev
            return { ...prev, [extraId]: nextValue }
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
            unitTotal,
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

                <div className="mb-6">
                    <h4 className="font-semibold mb-3">Extras</h4>
                    {extrasLoading ? (
                        <div className="loading loading-spinner loading-sm"></div>
                    ) : availableExtras.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            No hay extras disponibles por ahora.
                        </p>
                    ) : (
                        <ul className="space-y-3">
                            {availableExtras.map((extra) => {
                                const qty = extraQuantities[extra._id] || 0
                                const unavailable =
                                    extra.stock !== undefined &&
                                    extra.stock <= 0

                                return (
                                    <li
                                        key={extra._id}
                                        className={`flex items-center justify-between gap-3 ${unavailable ? 'text-gray-400' : ''}`}
                                    >
                                        <div className="flex-1">
                                            <span>{extra.name}</span>
                                            <span className="text-sm text-gray-500 ml-2">
                                                ${extra.price}
                                            </span>
                                        </div>
                                        <QuantityStepper
                                            value={qty}
                                            unavailable={unavailable}
                                            disabledDecrease={qty <= 0}
                                            disabledIncrease={
                                                unavailable ||
                                                (extra.stock !== undefined &&
                                                    qty >= extra.stock)
                                            }
                                            onDecrease={() =>
                                                handleExtraChange(
                                                    extra._id,
                                                    -1,
                                                    extra,
                                                )
                                            }
                                            onIncrease={() =>
                                                handleExtraChange(
                                                    extra._id,
                                                    1,
                                                    extra,
                                                )
                                            }
                                        />
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>

                <div className="border-t pt-4 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Total unidad</p>
                        <p className="text-xl font-bold">${unitTotal}</p>
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
