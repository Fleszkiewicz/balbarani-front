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
        return <div className="loading loading-spinner mx-auto block mt-10" />
    }

    if (error) {
        return <p className="text-center mt-10 text-error">{error}</p>
    }

    return (
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 pb-12 sm:grid-cols-2">
            {categories.map((category) => (
                <Link
                    key={category._id}
                    to={`/categoria/${category.slug}`}
                    className="
                        group
                        relative
                        h-64
                        overflow-hidden
                        rounded-[28px]
                        bg-base-200
                        shadow-[0_10px_35px_rgba(0,0,0,0.10)]
                        ring-1
                        ring-black/5
                        transition-shadow
                        duration-500
                        ease-out
                        hover:shadow-[0_18px_45px_rgba(0,0,0,0.15)]
                    "
                >
                    {/* Imagen */}
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
                            group-hover:scale-[1.02]
                        "
                    />

                    {/* Blur / degradado inferior */}
                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-x-0
                            bottom-0
                            h-[40%]
                            backdrop-blur-md
                            [mask-image:linear-gradient(to_top,black_0%,black_25%,transparent_100%)]
                            [-webkit-mask-image:linear-gradient(to_top,black_0%,black_35%,transparent_100%)]
                        "
                    />

                    {/* Contenido */}
                    <div
                        className="
                            absolute
                            inset-x-0
                            bottom-0
                            p-6
                            sm:p-7
                        "
                    >
                        <h2
                            className="
                                font-serif
                                text-3xl
                                font-semibold
                                tracking-tight
                                text-white
                                drop-shadow-[0_1px_4px_rgba(0,0,0,0.1)]
                                transition-transform
                                duration-500
                                group-hover:translate-x-1
                            "
                        >
                            {category.name}
                        </h2>

                        {category.description && (
                            <p
                                className="
                                    -mb-3
                                    max-w-[90%]
                                    text-sm
                                    leading-relaxed
                                    text-white/85
                                    drop-shadow-[0_1px_4px_rgba(0,0,0,0.1)]
                                    line-clamp-2
                                    transition-transform
                                duration-500
                                    group-hover:translate-x-1
                                "
                            >
                                {category.description}
                            </p>
                        )}
                    </div>

                    {/* Borde sutil */}
                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            rounded-[28px]
                            ring-1
                            ring-white/20
                        "
                    />
                </Link>
            ))}
        </div>
    )
}

export default CategoryGrid
