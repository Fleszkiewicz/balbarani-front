import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCategoryBySlugService } from '../services/categoryServices.js'
import { getSubcategoriesByCategoryService } from '../services/subcategoryServices.js'
import SubcategoryGrid from '../components/SubcategoryGrid/SubcategoryGrid.jsx'
import ProductGrid from '../components/ProductGrid/ProductGrid.jsx'

const CategoryPage = () => {
    const { categorySlug } = useParams()

    const [category, setCategory] = useState(null)
    const [subcategories, setSubcategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setLoading(true)
                setError(null)

                const [categoryData, subcategoriesData] = await Promise.all([
                    getCategoryBySlugService(categorySlug),
                    getSubcategoriesByCategoryService(categorySlug),
                ])

                setCategory(categoryData)
                setSubcategories(subcategoriesData)
            } catch (err) {
                setError(err.message || 'Error al cargar la categoría')
            } finally {
                setLoading(false)
            }
        }

        fetchCategoryData()
    }, [categorySlug])

    if (loading) {
        return (
            <div className="loading loading-spinner mx-auto block mt-10"></div>
        )
    }

    if (error) {
        return <p className="text-center mt-10 text-error">{error}</p>
    }

    const hasSubcategories = subcategories.length > 0

    return (
        <div>
            <h1 className="text-4xl font-bold text-center mt-7 mb-2 uppercase">
                {category?.name}
            </h1>
            <p className="text-center mb-4">
                {hasSubcategories
                    ? 'Elegí una subcategoría'
                    : 'Elegí tu producto'}
            </p>

            {hasSubcategories ? (
                <SubcategoryGrid
                    categorySlug={categorySlug}
                    subcategories={subcategories}
                />
            ) : (
                <ProductGrid categorySlug={categorySlug} />
            )}
        </div>
    )
}

export default CategoryPage