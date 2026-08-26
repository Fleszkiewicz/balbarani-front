import { Link } from 'react-router-dom'

const SubcategoryGrid = ({ categorySlug, subcategories }) => {
    return (
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 pb-10 sm:grid-cols-2 lg:grid-cols-3">
            {subcategories.map((subcategory) => (
                <Link
                    key={subcategory._id}
                    to={`/categoria/${categorySlug}/${subcategory.slug}`}
                    className="
                        group
                        relative
                        h-56
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
                    {subcategory.imageUrl ? (
                        <img
                            src={subcategory.imageUrl}
                            alt={subcategory.name}
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
                    ) : (
                        <div className="absolute inset-0 h-full w-full bg-base-300" />
                    )}


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
                                text-2xl
                                font-semibold
                                tracking-tight
                                text-white
                                drop-shadow-[0_1px_4px_rgba(0,0,0,0.1)]
                                transition-transform
                                duration-500
                                group-hover:translate-x-1
                            "
                        >
                            {subcategory.name}
                        </h2>
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

export default SubcategoryGrid