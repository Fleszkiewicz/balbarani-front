import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './layout/Layout'
import Register from './pages/Register'
import Login from './pages/Login'
import { UserContextProvider } from '../src/context/UserContext.tsx'
import { Toaster } from 'react-hot-toast'
import { ProductContextProvider } from './context/ProductContext.jsx'
import DetailProduct from './pages/DetailProducts.jsx'
import { CartContextProvider } from './context/CartContext.jsx'
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import SubcategoryPage from './pages/SubcategoryPage.jsx'
import AdminRoute from './components/Admin/AdminRoute.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Contacto from './pages/Contacto.jsx'
import Nosotros from './pages/Nosotros.jsx'
import Franquicias from './pages/Franquicias.jsx'

function App() {
    return (
        <UserContextProvider>
            <ProductContextProvider>
                <CartContextProvider>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/contacto" element={<Contacto />} />
                            <Route path="/nosotros" element={<Nosotros />} />
                            <Route path="/franquicias" element={<Franquicias />} />
                            <Route
                                path="/detailProduct/:id"
                                element={<DetailProduct />}
                            />
                            <Route
                                path="/categoria/:categorySlug"
                                element={<CategoryPage />}
                            />
                            <Route
                                path="/categoria/:categorySlug/:subcategorySlug"
                                element={<SubcategoryPage />}
                            />
                            <Route
                                path="/checkout"
                                element={<CheckoutPage />}
                            />
                        </Route>

                        <Route
                            path="/admin/dashboard/*"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        />
                    </Routes>
                </CartContextProvider>
            </ProductContextProvider>
            <Toaster />
        </UserContextProvider>
    )
}

export default App
