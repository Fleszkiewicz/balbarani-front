import { useState } from 'react'
import { FiTrash, FiUser } from "react-icons/fi";
import { FaMinus, FaPlus } from 'react-icons/fa'
import { useCart } from '../../context/cartContextData.js'
import { Spinner, EmptyState } from '../ui'
import { Link } from 'react-router-dom'
import ConfirmModal from '../Common/ConfirmModal'
import { createPortal } from 'react-dom'
import {
    formatExtrasSummary,
    formatFlavorSummary,
} from '../../utils/artisanIceCream.js'
import { TbShoppingCartSearch, TbShoppingCartExclamation, TbBuildingStore, TbTrash, TbCreditCardPay, TbShoppingCartX } from 'react-icons/tb'

const ModalCart = () => {
    const [isClearModalOpen, setIsClearModalOpen] = useState(false)
    const {
        cart,
        closeModal,
        isModalOpen,
        total,
        itemsQuantity,
        updateQuantity,
        removeFromCart,
        clearCart,
        loading,
    } = useCart()

    if (!isModalOpen) return null

    return createPortal(
        <>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm" onClick={(e) => {
                if (e.target === e.currentTarget) closeModal();
            }}>
                <section className="bg-white w-full max-w-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col max-h-full animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="flex justify-between items-center p-3 ml-3 border-b border-gray-100">
                        <div className="flex items-center gap-2 px-1 py-2">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                <TbShoppingCartSearch size={20} className="text-gray-600" />
                            </div>

                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-800 -mt-1 text-xl">
                                    Detalles de tu carrito
                                </span>
                                <span className="text-sm text-gray-500 -mt-1">
                                    Puedes modificar tu pedido antes de finalizar la compra
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={closeModal}
                            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors mr-3"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto p-4 sm:p-6 flex-1 bg-gray-50">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <span className="loading loading-spinner loading-lg text-gray-300"></span>
                                <p className="text-gray-500 mt-4 font-medium">Actualizando carrito...</p>
                            </div>
                        ) : cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <TbShoppingCartExclamation size={40} className="text-gray-600" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 mb-1">Tu carrito está vacío</h4>
                                <p className="text-gray-500 -mt-2">Parece que aún no agregaste ningún producto.</p>
                                <Link
                                    to="/"
                                    onClick={closeModal}
                                    className="flex items-center gap-2 mt-10 px-6 py-1.5 rounded-full bg-gray-200/60 text-gray-800 font-normal transition-all hover:bg-gray-200 "
                                >
                                    <TbBuildingStore size={20} className="text-gray-600" />
                                    Ir a la tienda
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {cart.map((item) => {
                                    const flavorSummary = formatFlavorSummary(item.configuration)
                                    const extrasSummary = formatExtrasSummary(item.configuration)
                                    const linePrice = (item.unitTotal ?? item.price) * item.quantity

                                    return (
                                        <div
                                            key={item.cartLineKey}
                                            className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-[1.5rem] border border-gray-100"
                                        >
                                            <div className="w-20 h-20 sm:w-20 sm:h-20 aspect-square rounded-[1rem] bg-gray-50 overflow-hidden shrink-0">
                                                {item.imageUrl ? (
                                                    <img
                                                        className="w-full h-full object-cover"
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">Sin foto</div>
                                                )}
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between gap-3">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                        <h4 className="font-bold text-gray-800 leading-tight">
                                                            {item.name}
                                                        </h4>
                                                        <p className="text-sm font-normal text-gray-500 mt-1">
                                                            ${item.unitTotal ?? item.price} c/u
                                                        </p>
                                                        {flavorSummary && (
                                                            <p className="text-xs  text-gray-400 mt-1 line-clamp-2">
                                                                <span className="font-normal text-gray-500">Sabores:</span> {flavorSummary}
                                                            </p>
                                                        )}
                                                        {extrasSummary && (
                                                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                                                                <span className="font-normal text-gray-500">Extras:</span> {extrasSummary}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.cartLineKey)}
                                                        disabled={loading}
                                                        className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors shrink-0"
                                                    >
                                                        <TbTrash size={16} />
                                                    </button>
                                                </div>

                                                <div className="flex justify-between items-end">
                                                    <div className="flex items-center bg-gray-200/60 rounded-lg ">
                                                        <button
                                                            onClick={() => item.quantity > 1 && updateQuantity(item.cartLineKey, item.quantity - 1)}
                                                            disabled={loading || item.quantity <= 1}
                                                            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors"
                                                        >
                                                            <FaMinus size={10} />
                                                        </button>
                                                        <span className="w-6 text-center text-sm font-bold text-gray-900 select-none">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.cartLineKey, item.quantity + 1)}
                                                            disabled={loading || (!item.configuration && item.quantity >= (item.stock || 999))}
                                                            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors"
                                                        >
                                                            <FaPlus size={10} />
                                                        </button>
                                                    </div>
                                                    <span className="font-semibold text-lg text-gray-800">
                                                        ${linePrice}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {cart.length > 0 && (
                        <div className="p-4 sm:p-6 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] z-10">
                            <div className="flex justify-between items-center mb-2 px-2 -mt-2">
                                <span className="text-gray-500 font-normal">Total ({itemsQuantity} {itemsQuantity === 1 ? 'artículo' : 'artículos'})</span>
                                <span className="text-2xl font-bold text-gray-800">${total}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setIsClearModalOpen(true)}
                                    disabled={loading}
                                    className="flex items-center px-6 h-10 rounded-2xl font-normal text-red-700 hover:bg-red-200 transition-colors flex-1 sm:flex-none bg-red-100 cursor-pointer"
                                >
                                    <TbShoppingCartX size={20} className='text-red-700 mr-2' />
                                    Vaciar carrito
                                </button>
                                <Link
                                    onClick={closeModal}
                                    to="/checkout"
                                    className="flex-1 h-10 rounded-2xl bg-gray-200/60 hover:bg-gray-200 text-gray-800 font-normal flex items-center justify-center transition-all "
                                >
                                    <TbCreditCardPay size={20} className='text-gray-500 mr-2' />
                                    Proceder al pago
                                </Link>
                            </div>
                        </div>
                    )}
                </section>
            </div>
            {/* Modal de confirmación para vaciar carrito */}
            <ConfirmModal
                isOpen={isClearModalOpen}
                title="Vaciar carrito"
                message="¿Estás seguro de que quieres eliminar todos los artículos de tu carrito de compras?"
                confirmText="Vaciar carrito"
                cancelText="Continuar comprando"
                confirmVariant="danger"
                iconType="trash"
                onConfirm={() => {
                    clearCart()
                    setIsClearModalOpen(false)
                }}
                onClose={() => setIsClearModalOpen(false)}
            />
        </>,
        document.body
    )
}

export default ModalCart
