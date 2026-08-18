import { FaMinus, FaPlus } from 'react-icons/fa'

const QuantityStepper = ({
    value,
    onDecrease,
    onIncrease,
    disabledDecrease = false,
    disabledIncrease = false,
    unavailable = false,
}) => {
    return (
        <div
            className={`flex items-center gap-2 ${unavailable ? 'opacity-40 pointer-events-none' : ''}`}
        >
            <button
                type="button"
                onClick={onDecrease}
                disabled={disabledDecrease || unavailable}
                className="btn btn-xs btn-outline btn-square"
                aria-label="Disminuir cantidad"
            >
                <FaMinus size={10} />
            </button>
            <span className="w-6 text-center font-medium">{value}</span>
            <button
                type="button"
                onClick={onIncrease}
                disabled={disabledIncrease || unavailable}
                className="btn btn-xs btn-outline btn-square"
                aria-label="Aumentar cantidad"
            >
                <FaPlus size={10} />
            </button>
        </div>
    )
}

export default QuantityStepper
