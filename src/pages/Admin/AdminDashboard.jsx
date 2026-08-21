import { Routes, Route } from 'react-router'
import AdminLayout from '../../layout/AdminLayout.jsx'
import AdminPlaceholder from '../Admin/AdminPlaceholder.jsx'
import CreateProduct from '../CreateProduct.jsx'
import UpdateProduct from '../UpdateProduct.jsx'
import TableProductDashboard from '../../components/AdminDashboard/TableProductDashboard/TableProductDashboard.jsx'

const AdminDashboard = () => {
    return (
        <section>
            <Routes>
                <Route element={<AdminLayout />}>
                    <Route
                        index
                        element={
                            <AdminPlaceholder
                                title="Dashboard"
                                description="Acá va a ir el resumen: ventas de hoy, pedidos pendientes y productos sin stock."
                            />
                        }
                    />
                    <Route
                        path="catalogo"
                        element={
                            <AdminPlaceholder
                                title="Catálogo"
                                description="Acá vas a gestionar categorías, subcategorías y productos sobre la misma vista del catálogo."
                            />
                        }
                    />
                    <Route
                        path="inventario"
                        element={
                            <AdminPlaceholder
                                title="Inventario"
                                description="Acá vas a ajustar stock con [-] [+] y disponibilidad de sabores."
                            />
                        }
                    />
                    <Route
                        path="pedidos"
                        element={
                            <AdminPlaceholder
                                title="Pedidos"
                                description="Acá vas a ver el listado y el detalle de pedidos."
                            />
                        }
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
