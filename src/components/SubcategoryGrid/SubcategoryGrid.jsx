 import { Link } from 'react-router-dom'

const SubcategoryGrid = ({ categorySlug, subcategories }) => {
    return (
        <div className="flex flex-wrap gap-5 justify-center px-4 pb-10">
            {subcategories.map((subcategory) => (
                <div
                    key={subcategory._id}
                    className="card bg-base-100 w-80 lg:w-[30%] shadow-lg"
                >
                    <div className="card-body">
                        <h2 className="card-title">{subcategory.name}</h2>
                        <div className="card-actions justify-end mt-4">
                            <Link
                                to={`/categoria/${categorySlug}/${subcategory.slug}`}
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

export default SubcategoryGrid