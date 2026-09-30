import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from '../../layout/AdminLayout.jsx'
import AdminPlaceholder from '../Admin/AdminPlaceholder.jsx'
import AdminInventory from './AdminInventory.jsx'
import CreateProduct from '../CreateProduct.jsx'
import UpdateProduct from '../UpdateProduct.jsx'
import TableProductDashboard from '../../components/AdminDashboard/TableProductDashboard/TableProductDashboard.jsx'
import AdminCatalog from './AdminCatalog.jsx'
import AdminCategoryDetail from './AdminCategoryDetail.jsx'
import AdminSubcategoryDetail from './AdminSubcategoryDetail.jsx'
import AdminOrders from './AdminOrders.jsx'

const AdminDashboard = () => {
    return (
        <section>
            <Routes>
                <Route element={<AdminLayout />}>
                    {/* Redirección predeterminada a Pedidos */}
                    <Route
                        index
                        element={<Navigate to="pedidos" replace />}
                    />

                    {/* Ruta de Dashboard conservada para cuando se reactive */}
                    <Route
                        path="dashboard"
                        element={
                            <AdminPlaceholder
                                title="Dashboard"
                                description="Acá va a ir el resumen: ventas de hoy, pedidos pendientes y productos sin stock."
                            />
                        }
                    />

                    <Route
                        path="catalogo"
                        element={<AdminCatalog />}
                    />
                    <Route
                        path="catalogo/:categorySlug"
                        element={<AdminCategoryDetail />}
                    />
                    <Route
                        path="catalogo/:categorySlug/:subcategorySlug"
                        element={<AdminSubcategoryDetail />}
                    />
                    <Route
                        path="inventario"
                        element={<AdminInventory />}
                    />
                    <Route
                        path="pedidos"
                        element={<AdminOrders />}
                    />
                    <Route
                        path="products"
                        element={<TableProductDashboard />}
                    />
                    <Route
                        path="products/createProduct"
                        element={<CreateProduct />}
                    />
                    <Route
                        path="products/updateProduct/:id"
                        element={<UpdateProduct />}
                    />
                </Route>
            </Routes>
        </section>
    )
}

export default AdminDashboard
