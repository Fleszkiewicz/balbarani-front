import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getCategoryBySlugService } from '../services/categoryServices.js'
import { getSubcategoriesByCategoryService } from '../services/subcategoryServices.js'
import { getAllProductsService } from '../services/productServices.js'
import CardProduct from '../components/CardProduct/CardProduct.jsx'
import ProductGrid from '../components/ProductGrid/ProductGrid.jsx'

const CategoryPage = () => {
    const { categorySlug } = useParams()

    const [category, setCategory] = useState(null)
    const [subcategories, setSubcategories] = useState([])
    const [productsBySubcategory, setProductsBySubcategory] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const loadProductsForSubcategories = useCallback(async (subs, catSlug) => {
        const entries = await Promise.all(
            subs.map(async (sub) => {
                try {
                    const data = await getAllProductsService(catSlug, sub.slug)
                    return [sub._id, data]
                } catch {
                    return [sub._id, []]
                }
            }),
        )
        return Object.fromEntries(entries)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)

                const [categoryData, subcategoriesData] = await Promise.all([
                    getCategoryBySlugService(categorySlug),
                    getSubcategoriesByCategoryService(categorySlug),
                ])

                setCategory(categoryData)
                setSubcategories(subcategoriesData)

                if (subcategoriesData.length > 0) {
                    const productsMap = await loadProductsForSubcategories(
                        subcategoriesData,
                        categorySlug,
                    )
                    setProductsBySubcategory(productsMap)
                }
            } catch (err) {
                setError(err.message || 'Error al cargar la categoría')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [categorySlug, loadProductsForSubcategories])

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
        <div className="pb-16">
            {/* Header de Categoría */}
            <div className={`relative mx-4 mt-8 mb-12 rounded-[2.5rem] overflow-hidden p-8 md:p-16 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] flex flex-col items-center text-center max-w-5xl md:mx-auto ${!category?.imageUrl ? 'bg-white border border-gray-100' : ''}`}>
                {category?.imageUrl && (
                    <>
                        <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40"></div>
                    </>
                )}

                <div className={`relative z-10 flex flex-col items-center ${category?.imageUrl ? 'text-white' : 'text-gray-900'}`}>
                    <span className={`px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 ${category?.imageUrl ? 'bg-white/20 text-white backdrop-blur-md' : 'bg-gray-100 text-gray-500'}`}>
                        Categoría
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase mb-4 drop-shadow-lg">
                        {category?.name}
                    </h1>
                    {category?.description && (
                        <p className={`text-lg md:text-xl max-w-2xl leading-relaxed drop-shadow-md ${category?.imageUrl ? 'text-gray-200' : 'text-gray-500'}`}>
                            {category.description}
                        </p>
                    )}
                    {!category?.description && (
                        <div className={`w-12 h-1 rounded-full mt-4 ${category?.imageUrl ? 'bg-white/30' : 'bg-gray-200'}`}></div>
                    )}
                </div>
            </div>

            {/* Categoría SIN subcategorías → grilla normal de productos */}
            {!hasSubcategories && (
                <ProductGrid categorySlug={categorySlug} />
            )}

            {/* Categoría CON subcategorías → banner por sección */}
            {hasSubcategories && (
                <div className="flex flex-col gap-14 px-4 max-w-7xl mx-auto">
                    {subcategories.map((sub) => {
                        const products = productsBySubcategory[sub._id] ?? []

                        return (
                            <section key={sub._id}>

                                {/* Nombre */}
                                <div className="flex items-center gap-3 mb-3 border-b pb-2">
                                    <h2 className="text-2xl font-semibold flex-1">{sub.name}</h2>

                                </div>


                                {/* Fila de productos */}
                                {products.length === 0 ? (
                                    <p className="text-sm text-base-content/50 pl-2">
                                        Sin productos en esta sección todavía.
                                    </p>
                                ) : (
                                    <div className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory">
                                        {products.map((product) => (
                                            <div
                                                key={product._id}
                                                className="snap-start shrink-0"
                                            >
                                                <CardProduct
                                                    product={product}
                                                    categorySlug={categorySlug}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default CategoryPage
