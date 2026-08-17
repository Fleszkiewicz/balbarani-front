import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllCategoriesService } from '../../services/categoryServices'

const CategoryGrid = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true)
                const data = await getAllCategoriesService()
                setCategories(data)
            } catch (err) {
                setError(err.message || 'Error al cargar las categorías')
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    if (loading) {
        return <div className="loading loading-spinner mx-auto block mt-10"></div>
    }

    if (error) {
        return <p className="text-center mt-10 text-error">{error}</p>
    }

    return (
        <div className="flex flex-wrap gap-5 justify-center px-4 pb-10">
            {categories.map((category) => (
                <div
                    key={category._id}
                    className="card bg-base-100 w-80 lg:w-[30%] shadow-lg"
                >
                    <figure>
                        <img
                            className="aspect-[9/9] object-cover w-full"
                            src={category.imageUrl}
                            alt={category.name}
                        />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">{category.name}</h2>
                        {category.description && <p>{category.description}</p>}
                        <div className="card-actions justify-end mt-4">
                            <Link
                                to={`/categoria/${category.slug}`}
                                className="btn btn-primary"
                            >
                                Ver productos
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CategoryGrid