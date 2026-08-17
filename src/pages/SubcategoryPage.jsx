import { useParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid/ProductGrid.jsx'

const SubcategoryPage = () => {
    const { categorySlug, subcategorySlug } = useParams()

    return (
        <div>
            <h1 className="text-3xl font-bold text-center mt-7 mb-2 uppercase">
                {subcategorySlug.replace(/-/g, ' ')}
            </h1>
            <p className="text-center mb-4">Elegí tu producto</p>
            <ProductGrid
                categorySlug={categorySlug}
                subcategorySlug={subcategorySlug}
            />
        </div>
    )
}

export default SubcategoryPage