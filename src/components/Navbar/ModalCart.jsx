import { CgTrash } from 'react-icons/cg'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { useCart } from '../../context/cartContextData.js'
import { Link } from 'react-router-dom'
import {
    formatExtrasSummary,
    formatFlavorSummary,
} from '../../utils/artisanIceCream.js'

const ModalCart = () => {
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

    return (
        <div className="modal modal-open px-4">
            <section className="modal-box w-full max-w-2xl ">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Carrito de compras</h3>
                    <button
                        onClick={closeModal}
                        className="btn btn-sm btn-circle btn-ghost"
                    >
                        X
                    </button>
                </div>
                {loading ? (
                    <div className="text-center py-8">
                        <span className="loading loading-spinner loading-lg"></span>
                        <p className="text-gray-500 mt-2">
                            Actualizando carrito...
                        </p>
                    </div>
                ) : cart.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mt-2">
                            Tu carrito está vacío
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 max-h-96 flex flex-col gap-4 overflow-y-auto rounded">
                            {cart.map((item) => {
                                const flavorSummary = formatFlavorSummary(
                                    item.configuration,
                                )
                                const extrasSummary = formatExtrasSummary(
                                    item.configuration,
                                )
                                const linePrice =
                                    (item.unitTotal ?? item.price) *
                                    item.quantity

                                return (
                                    <div
                                        key={item.cartLineKey}
                                        className="flex items-center flex-wrap md:flex-row md:items-center gap-4 rounded-lg"
                                    >
                                        <img
                                            className="w-20 h-20 object-cover aspect-square"
                                            src={item.imageUrl}
                                            alt={item.name}
                                        />
                                        <div className="flex-1 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                                            <div>
                                                <h4 className="font-semibold">
                                                    {item.name}
                                                </h4>
                                                {flavorSummary && (
                                                    <p className="text-sm text-gray-500">
                                                        Sabores: {flavorSummary}
                                                    </p>
                                                )}
                                                {extrasSummary && (
                                                    <p className="text-sm text-gray-500">
                                                        Extras: {extrasSummary}
                                                    </p>
                                                )}
                                                <p className="text-sm text-gray-600">
                                                    ${item.unitTotal ?? item.price}{' '}
                                                    c/u
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3 mt-2 md:mt-0">
                                                <div className="flex items-center rounded-lg">
                                                    <button
                                                        onClick={async () => {
                                                            if (
                                                                item.quantity > 1
                                                            ) {
                                                                await updateQuantity(
                                                                    item.cartLineKey,
                                                                    item.quantity -
                                                                        1,
                                                                )
                                                            }
                                                        }}
                                                        disabled={
                                                            loading ||
                                                            item.quantity <= 1
                                                        }
                                                        className="p-2 border rounded"
                                                    >
                                                        <FaMinus size={12} />
                                                    </button>
                                                    <span className="px-4 py-2 font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={async () => {
                                                            await updateQuantity(
                                                                item.cartLineKey,
                                                                item.quantity + 1,
                                                            )
                                                        }}
                                                        disabled={
                                                            loading ||
                                                            (!item.configuration &&
                                                                item.quantity >=
                                                                    (item.stock ||
                                                                        999))
                                                        }
                                                        className="p-2 border rounded"
                                                    >
                                                        <FaPlus size={12} />
                                                    </button>
                                                </div>

                                                <span>${linePrice}</span>
                                                <button
                                                    onClick={async () => {
                                                        await removeFromCart(
                                                            item.cartLineKey,
                                                        )
                                                    }}
                                                    disabled={loading}
                                                >
                                                    <CgTrash size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <span>Total de artículos:</span>
                                <span className="font-semibold">
                                    {itemsQuantity}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total:</span>
                                <span>${total}</span>
                            </div>
                        </div>

                        <div className="modal-action mt-4 gap-3 flex flex-col lg:flex-row lg:justify-between">
                            <button
                                onClick={async () => {
                                    if (
                                        window.confirm(
                                            'Estás seguro de que quieres vaciar el carrito?',
                                        )
                                    ) {
                                        await clearCart()
                                    }
                                }}
                                disabled={loading}
                                className="btn btn-outline btn-error btn-ghost"
                            >
                                Vaciar carrito
                            </button>
                            <Link
                                className="btn btn-info btn-outline"
                                onClick={closeModal}
                                to="/"
                            >
                                Seguir comprando
                            </Link>
                            <Link
                                className="btn btn-primary "
                                onClick={closeModal}
                                to="/checkout"
                            >
                                Proceder al pago
                            </Link>
                        </div>
                    </>
                )}
            </section>

            <div className="modal-backdrop" onClick={closeModal}></div>
        </div>
    )
}

export default ModalCart
