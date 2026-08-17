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
import AdminDashboard from './pages/AdminDashboard.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import SubcategoryPage from './pages/SubcategoryPage.jsx'

function App() {
    return (
        <UserContextProvider>
            <ProductContextProvider>
                <CartContextProvider>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Home />}></Route>
                            <Route
                                path="/register"
                                element={<Register />}
                            ></Route>
                            <Route path="/login" element={<Login />}></Route>
                            <Route
                                path="/detailProduct/:id"
                                element={<DetailProduct />}
                            />
                            <Route
                                path="/admin/dashboard/*"
                                element={<AdminDashboard />}
                            ></Route>
                            <Route
                                path="/categoria/:categorySlug"
                                element={<CategoryPage />}
                            />
                            <Route
                                path="/categoria/:categorySlug/:subcategorySlug"
                                element={<SubcategoryPage />}
                            />
                        </Route>
                    </Routes>
                </CartContextProvider>
            </ProductContextProvider>
            <Toaster />
        </UserContextProvider>
    )
}

export default App
