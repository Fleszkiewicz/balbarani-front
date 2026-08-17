import CategoryGrid from '../components/CategoryGrid/CategoryGrid.jsx'

const Home = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold text-center mt-7 mb-2 uppercase">
                Balbarani
            </h1>
            <p className="text-center mb-4">Elegí una categoría</p>
            <CategoryGrid />
        </div>
    )
}

export default Home
