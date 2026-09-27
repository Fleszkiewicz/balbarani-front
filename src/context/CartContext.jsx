import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from './userContextData.js'
import { CartContext } from './cartContextData.js'
import {
    addToCartService,
    getCartService,
    updateCartService,
    deleteCartService,
    clearCartService,
} from '../services/cartServices'
import {
    calculateConfiguredUnitTotal,
    getCartLineKey,
} from '../utils/artisanIceCream.js'
import { toast } from 'react-hot-toast'

const mapCartItemFromBackend = (item) => {
    const configuration = item.configuration || null
    const basePrice = item.productId.price

    return {
        _id: item.productId._id,
        name: item.productId.name,
        price: basePrice,
        imageUrl: item.productId.imageUrl,
        description: item.productId.description,
        stock: item.productId.stock,
        inventoryType: item.productId.inventoryType,
        quantity: item.quantity,
        configuration,
        unitTotal: configuration
            ? calculateConfiguredUnitTotal(basePrice, configuration)
            : basePrice,
        cartLineKey: getCartLineKey(item.productId._id, configuration),
    }
}

export const CartContextProvider = ({ children }) => {
    const [cart, setCart] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const { loading: userLoading, userInfo } = useUser()
    const authenticated = !!userInfo?.id
    const userId = userInfo?.id || null

    const loadLocalCart = useCallback(() => {
        try {
            const localCart = localStorage.getItem('cart')
            const parsed = localCart ? JSON.parse(localCart) : []

            return parsed.map((item) => {
                const configuration = item.configuration || null
                const unitTotal =
                    item.unitTotal ??
                    (configuration
                        ? calculateConfiguredUnitTotal(
                              item.price,
                              configuration,
                          )
                        : item.price)

                return {
                    ...item,
                    configuration,
                    unitTotal,
                    cartLineKey:
                        item.cartLineKey ||
                        getCartLineKey(item._id, configuration),
                }
            })
        } catch (error) {
            console.error('Error al cargar carrito local:', error)
            return []
        }
    }, [])

    const saveLocalCart = useCallback((cartItems) => {
        try {
            localStorage.setItem('cart', JSON.stringify(cartItems))
        } catch (error) {
            console.error('Error al guardar carrito local:', error)
        }
    }, [])

    const loadCart = useCallback(async () => {
        if (authenticated && userId) {
            try {
                setLoading(true)
                const response = await getCartService(userId)

                const cartItems =
                    response.cart?.products?.map(mapCartItemFromBackend) || []

                setCart(cartItems)
            } catch (error) {
                console.log(
                    'Error al cargar carrito del backend:',
                    error.message,
                )
                setCart(loadLocalCart())
            } finally {
                setLoading(false)
            }
        } else {
            setCart(loadLocalCart())
        }
    }, [authenticated, loadLocalCart, userId])

    const syncCartWithBackend = useCallback(async () => {
        const localCart = loadLocalCart()

        if (localCart.length > 0 && authenticated && userId) {
            try {
                setLoading(true)

                for (const item of localCart) {
                    try {
                        await addToCartService(
                            userId,
                            item._id,
                            item.quantity,
                            item.configuration || null,
                        )
                    } catch (error) {
                        console.log(
                            `Error al sincronizar producto ${item.name}:`,
                            error.message,
                        )
                    }
                }

                localStorage.removeItem('cart')
                await loadCart()
                toast.success('Carrito sincronizado correctamente')
            } catch (error) {
                console.error('Error al sincronizar carrito:', error)
            } finally {
                setLoading(false)
            }
        }
    }, [authenticated, loadCart, loadLocalCart, userId])

    useEffect(() => {
        if (userLoading) return

        let isMounted = true

        const initializeCart = async () => {
            if (!isMounted) return

            const previousAuthState =
                localStorage.getItem('wasAuthenticated') === 'true'
            const currentAuthState = authenticated

            if (!previousAuthState && currentAuthState) {
                await syncCartWithBackend()
            } else {
                await loadCart()
            }

            localStorage.setItem(
                'wasAuthenticated',
                currentAuthState.toString(),
            )

            if (isMounted) {
                setLoading(false)
            }
        }

        initializeCart()

        return () => {
            isMounted = false
        }
    }, [authenticated, loadCart, syncCartWithBackend, userLoading])

    useEffect(() => {
        const previousAuthState =
            localStorage.getItem('wasAuthenticated') === 'true'
        const currentAuthState = authenticated

        const handleAuthChange = async () => {
            if (previousAuthState !== currentAuthState && cart.length === 0) {
                await loadCart()
                localStorage.setItem(
                    'wasAuthenticated',
                    currentAuthState.toString(),
                )
            }
        }

        handleAuthChange()
    }, [authenticated, cart.length, loadCart])

    useEffect(() => {
        if (userLoading) return

        if (userInfo?.id) {
            const syncOrLoadCart = async () => {
                try {
                    const localCart = loadLocalCart()
                    if (localCart.length > 0) {
                        await syncCartWithBackend()
                    } else {
                        await loadCart()
                    }
                } catch (error) {
                    console.error(
                        'Error al sincronizar/cargar carrito tras login',
                        error,
                    )
                }
            }

            syncOrLoadCart()
        } else {
            Promise.resolve().then(() => {
                setCart(loadLocalCart())
            })
        }
    }, [
        loadCart,
        loadLocalCart,
        syncCartWithBackend,
        userInfo?.id,
        userLoading,
    ])

    const total = useMemo(
        () =>
            cart.reduce(
                (acc, item) =>
                    acc + (item.unitTotal ?? item.price) * (item.quantity || 1),
                0,
            ),
        [cart],
    )

    const itemsQuantity = useMemo(
        () => cart.reduce((acc, item) => acc + (item.quantity || 1), 0),
        [cart],
    )

    const isSameCartItem = (item, product) => {
        const lineKey = product.cartLineKey ||
            getCartLineKey(product._id, product.configuration || null)
        return item.cartLineKey === lineKey
    }

    const addToCart = async (product, quantity = 1) => {
        if (!authenticated || !userId) {
            toast.error('Para añadir productos a tu carrito, debes iniciar sesión')
            navigate('/login')
            return false
        }
        const configuration = product.configuration || null
        const cartLineKey =
            product.cartLineKey ||
            getCartLineKey(product._id, configuration)
        const unitTotal =
            product.unitTotal ??
            (configuration
                ? calculateConfiguredUnitTotal(product.price, configuration)
                : product.price)

        const cartProduct = {
            ...product,
            configuration,
            unitTotal,
            cartLineKey,
        }

        if (authenticated && userId) {
            try {
                setLoading(true)
                await addToCartService(
                    userId,
                    product._id,
                    quantity,
                    configuration,
                )
                await loadCart()
                toast.success('Producto agregado al carrito')
            } catch (error) {
                console.error('Error al agregar al carrito:', error)
                toast.error(
                    error.message || 'Error al agregar producto al carrito',
                )
            } finally {
                setLoading(false)
            }
        } else {
            try {
                const currentCart = [...cart]
                const existingIndex = currentCart.findIndex((item) =>
                    isSameCartItem(item, cartProduct),
                )

                if (existingIndex > -1) {
                    currentCart[existingIndex].quantity += quantity
                } else {
                    currentCart.push({ ...cartProduct, quantity })
                }

                setCart(currentCart)
                saveLocalCart(currentCart)
                toast.success('Producto agregado al carrito')
            } catch (error) {
                console.error('Error al agregar al carrito local:', error)
                toast.error('Error al agregar producto al carrito')
            }
        }
    }

    const removeFromCart = async (cartLineKey) => {
        const targetItem = cart.find((item) => item.cartLineKey === cartLineKey)

        if (!targetItem) return

        if (authenticated && userId) {
            try {
                setLoading(true)
                await deleteCartService(
                    userId,
                    targetItem._id,
                    targetItem.configuration || null,
                )
                await loadCart()
                toast.success('Producto eliminado del carrito')
            } catch (error) {
                console.error('Error al eliminar del carrito:', error)
                toast.error(
                    error.message || 'Error al eliminar producto del carrito',
                )
            } finally {
                setLoading(false)
            }
        } else {
            try {
                const currentCart = cart.filter(
                    (item) => item.cartLineKey !== cartLineKey,
                )
                setCart(currentCart)
                saveLocalCart(currentCart)
                toast.success('Producto eliminado del carrito')
            } catch (error) {
                console.error('Error al eliminar del carrito local:', error)
                toast.error('Error al eliminar producto del carrito')
            }
        }
    }

    const updateQuantity = async (cartLineKey, newQuantity) => {
        if (newQuantity < 1) {
            toast.error('La cantidad debe ser al menos 1')
            return
        }

        const targetItem = cart.find((item) => item.cartLineKey === cartLineKey)

        if (!targetItem) return

        if (authenticated && userId) {
            try {
                setLoading(true)
                await updateCartService(
                    userId,
                    targetItem._id,
                    newQuantity,
                    targetItem.configuration || null,
                )
                await loadCart()
                toast.success('Cantidad actualizada')
            } catch (error) {
                console.error('Error al actualizar cantidad:', error)
                toast.error(error.message || 'Error al actualizar cantidad')
            } finally {
                setLoading(false)
            }
        } else {
            try {
                const currentCart = cart.map((item) =>
                    item.cartLineKey === cartLineKey
                        ? { ...item, quantity: newQuantity }
                        : item,
                )
                setCart(currentCart)
                saveLocalCart(currentCart)
                toast.success('Cantidad actualizada')
            } catch (error) {
                console.error('Error al actualizar cantidad local:', error)
                toast.error('Error al actualizar cantidad')
            }
        }
    }

    const clearCart = async () => {
        if (authenticated && userId) {
            try {
                setLoading(true)
                await clearCartService(userId)
                setCart([])
                toast.success('Carrito limpiado')
            } catch (error) {
                console.error('Error al limpiar carrito:', error)
                toast.error(error.message || 'Error al limpiar carrito')
            } finally {
                setLoading(false)
            }
        } else {
            try {
                setCart([])
                saveLocalCart([])
                toast.success('Carrito limpiado')
            } catch (error) {
                console.error('Error al limpiar carrito local:', error)
                toast.error('Error al limpiar carrito')
            }
        }
    }

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    return (
        <CartContext.Provider
            value={{
                cart,
                total,
                itemsQuantity,
                loading,
                isModalOpen,
                openModal,
                closeModal,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}
