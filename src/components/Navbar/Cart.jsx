import { FiShoppingCart } from 'react-icons/fi'
import ModalCart from './ModalCart.jsx'
import { useCart } from '../../context/cartContextData.js'

const Cart = () => {
    const { total, itemsQuantity, openModal, isModalOpen } = useCart()

    const handleViewCartClick = () => {
        //cerrar el dropdown quitandi el focus
        document.activeElement.blur()
        //abrir el modal
        openModal()
    }

    return (
        <>
            <div className="flex-none">
                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        className="transition-transform hover:scale-105 active:scale-95"
                    >
                        <div className="indicator relative">
                            <div className="w-11 h-11 rounded-full  flex items-center justify-center text-white shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:text-pink-400">
                                <FiShoppingCart size={20} strokeWidth={2.5} />
                            </div>
                            {itemsQuantity > 0 && (
                                <span className="absolute  -right-1 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-black text-xs font-bold text-white shadow-sm ring-2 ring-white">
                                    {itemsQuantity}
                                </span>
                            )}
                        </div>
                    </div>
                    <div
                        tabIndex={0}
                        className="dropdown-content bg-white rounded-[1.5rem] mt-3 z-[1000] w-64 p-4 shadow-[0_10px_35px_rgba(0,0,0,0.08)] border border-gray-100"
                    >
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center px-1">
                                <span className="text-gray-500 font-medium text-sm">
                                    {itemsQuantity} {itemsQuantity === 1 ? 'producto' : 'productos'}
                                </span>
                                <span className="font-bold text-lg text-gray-900">
                                    ${total}
                                </span>
                            </div>
                            <button
                                onClick={handleViewCartClick}
                                className="w-full rounded-full bg-black hover:bg-neutral-800 text-white transition-colors mt-1 font-semibold h-11 flex items-center justify-center shadow-sm"
                            >
                                Ver Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && <ModalCart />}
        </>
    )
}

export default Cart
