import { Navigate } from 'react-router-dom'
import { useUser } from '../../context/userContextData'

const AdminRoute = ({ children }) => {
    const { userInfo, loading, isAuthenticated } = useUser()

    if (loading) {
        return (
            <div className="loading loading-spinner mx-auto block mt-10"></div>
        )
    }

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />
    }

    if (!userInfo.isAdmin) {
        return <Navigate to="/" replace />
    }

    return children
}

export default AdminRoute
