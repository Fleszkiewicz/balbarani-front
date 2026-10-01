import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllCategoriesService } from '../../services/categoryServices'
import { FaArrowRight } from 'react-icons/fa'

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
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <span className="loading loading-spinner loading-lg text-neutral"></span>
                <p className="text-gray-400 text-xs font-semibold mt-3">Cargando categorías...</p>
            </div>
        )
    }

    if (error) {
        return <p className="text-center py-10 text-error text-sm">{error}</p>
    }

    return (
        <div className="mx-auto grid w-full max-w-md sm:max-w-2xl md:max-w-2xl lg:max-w-6xl grid-cols-2 sm:grid-cols-2 gap-6 pb-6">
            {categories.map((category) => (
                <Link
                    key={category._id}
                    to={`/categoria/${category.slug}`}
                    className="
                        group
                        relative
                        h-72
                        overflow-hidden
                        rounded-3xl
                        bg-gray-900
                        border border-gray-200/80
                        shadow-sm
                        hover:shadow-xl
                        transition-all
                        duration-500
                    "
                >
                    {/* Imagen de Fondo con Zoom Suave */}
                    {category.imageUrl && (
                        <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="
                                absolute
                                inset-0
                                h-full
                                w-full
                                object-cover
                                transition-transform
                                duration-700
                                ease-out
                                group-hover:scale-105
                            "
                        />
                    )}

                    {/* Degradado Oscuro para Legibilidad */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300 group-hover:opacity-90"></div>

                    {/* Badge Superior: Explorar */}
                    <div className="absolute top-4 right-4 z-10">
                        <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 group-hover:bg-white group-hover:text-gray-900 transition-colors shadow-2xs">
                            <span>Ver productos</span>
                            <FaArrowRight size={9} />
                        </span>
                    </div>

                    {/* Contenido Inferior */}
                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end z-10">
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
                            {category.name}
                        </h2>

                        {category.description && (
                            <p className="text-xs sm:text-sm text-gray-200/90 font-normal leading-relaxed mt-1 line-clamp-2 drop-shadow-sm">
                                {category.description}
                            </p>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default CategoryGrid
