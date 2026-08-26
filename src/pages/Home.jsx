import CategoryGrid from '../components/CategoryGrid/CategoryGrid.jsx'

const Home = () => {
    return (
        <div className="pb-16">

            {/* Hero Section */}
            <div className="relative w-full flex flex-col items-center text-center px-6 pt-16 pb-28 mb-8 overflow-hidden">
                {/* Nubes difuminadas (Glow) detrás del título */}
                <div className="absolute top-[10%] left-1/2 -translate-x-[60%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-amber-200/60 blur-[100px] md:blur-[140px] rounded-full pointer-events-none"></div>
                <div className="absolute top-[20%] left-1/2 -translate-x-[40%] w-[350px] h-[350px] md:w-[500px] md:h-[500px] bg-orange-200/50 blur-[90px] md:blur-[120px] rounded-full pointer-events-none"></div>

                <div className="relative z-10 max-w-4xl flex flex-col items-center mt-8">
                    <span className="bg-amber-100/80 text-amber-800 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 shadow-sm border border-amber-200/50">
                        Premium Quality
                    </span>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
                        Balbarani
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-400">
                            Helados Artesanales
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed font-medium">
                        Descubrí la verdadera experiencia del helado artesanal.
                        Sabores únicos creados con los mejores ingredientes para acompañar tus mejores momentos.
                    </p>

                    <button
                        onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold shadow-md hover:-translate-y-1 hover:shadow-xl hover:bg-black transition-all duration-300 text-sm tracking-wide uppercase"
                    >
                        Ver nuestro menú
                    </button>
                </div>
            </div>

            {/* Sección de categorías */}
            <div id="categories" className="text-center mb-10 scroll-mt-28">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">¿Qué tenés ganas de probar hoy?</h2>
                <div className="w-16 h-1 bg-gray-200 rounded-full mx-auto mt-6 mb-2"></div>
            </div>

            <CategoryGrid />
        </div>
    )
}

export default Home
