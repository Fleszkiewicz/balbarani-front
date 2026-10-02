import { FiShoppingCart } from 'react-icons/fi'
import ModalCart from './ModalCart.jsx'
import { useCart } from '../../context/cartContextData.js'
import { TbShoppingCartDollar, TbShoppingCart, TbShoppingCartSearch } from "react-icons/tb";

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
                                <FiShoppingCart size={20} />
                            </div>
                            {itemsQuantity > 0 && (
                                <span className="absolute top-1 -right-1 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-black text-xs font-bold text-white shadow-sm ring-2 ring-pink-500">
                                    {itemsQuantity}
                                </span>
                            )}
                        </div>
                    </div>
                    <div
                        tabIndex={0}
                        className="menu dropdown-content bg-white rounded-[1.5rem] mt-3 z-10 w-64 p-3 shadow-[0_10px_35px_rgba(0,0,0,0.08)] border border-gray-100 gap-1"
                    >
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 px-1 py-2">


                                <div className="flex flex-col">
                                    <span className="text-xl font-bold text-gray-800 -mt-1">


                                        ${total}
                                    </span>
                                    <span className="text-sm text-gray-500 -mt-1">
                                        {itemsQuantity} {itemsQuantity === 1 ? 'producto' : 'productos'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleViewCartClick}
                                className="rounded-xl hover:bg-gray-200 bg-gray-200/60 text-gray-700 font-medium py-2.5 flex items-center gap-2.5 transition-colors -mt-2"
                            >
                                <TbShoppingCartSearch className="text-gray-500 ml-4" size={20} />
                                <span>Ver carrito</span>
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
