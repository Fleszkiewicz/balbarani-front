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
            className={`flex items-center bg-gray-50 rounded-full border border-gray-200 p-0.5 ${unavailable ? 'opacity-40 pointer-events-none' : ''}`}
        >
            <button
                type="button"
                onClick={onDecrease}
                disabled={disabledDecrease || unavailable}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                aria-label="Disminuir cantidad"
            >
                <FaMinus size={10} />
            </button>
            <span className="w-6 text-center font-bold text-gray-900 select-none text-sm">{value}</span>
            <button
                type="button"
                onClick={onIncrease}
                disabled={disabledIncrease || unavailable}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                aria-label="Aumentar cantidad"
            >
                <FaPlus size={10} />
            </button>
        </div>
    )
}

export default QuantityStepper
