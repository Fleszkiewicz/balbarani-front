import { Link } from 'react-router-dom'
import { FaIceCream, FaHeart, FaAward, FaSeedling, FaArrowRight } from 'react-icons/fa'
import { Badge, Card, Divider } from '../components/ui'

const Nosotros = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            {/* Hero */}
            <div className="text-center max-w-2xl mx-auto mb-14">
                <div className="flex justify-center mb-4">
                    <Badge variant="warning" className="px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full">
                        Tradición Artesanal
                    </Badge>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
                    Nuestra Pasión por el Helado
                </h1>
                <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
                    Nacidos en Baradero con el sueño de ofrecer un helado auténtico, cremoso y elaborado todos los días con materias primas nobles.
                </p>
            </div>

            {/* Historia en Card Elegante de Astryx */}
            <Card className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaHeart className="text-red-500 text-xl" /> De Baradero a tu mesa
                </h2>
                <div className="flex flex-col gap-4 text-gray-600 leading-relaxed text-sm sm:text-base">
                    <p>
                        En <strong>Balbarani</strong> creemos que un buen helado no es un producto industrial más: es un momento de encuentro, una pausa en el día y una sonrisa compartida con los que más querés.
                    </p>
                    <p>
                        Desde nuestro inicio en la ciudad de Baradero, apostamos a la receta artesanal tradicional: sin premezclas artificiales ni conservantes innecesarios. Cada crema, chocolate y dulce de leche nace del balance perfecto entre leche pura, frutas frescas de estación y una paciencia infinita.
                    </p>
                    <p>
                        Con el tiempo incorporamos tecnología para que puedas armar tus potes favoritos desde la web y recibirlos en minutos en tu domicilio, manteniendo intacta la frescura de nuestro mostrador.
                    </p>
                </div>
            </Card>

            <Divider className="my-10" />

            {/* 3 Pilares en Cards de Astryx */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <Card className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 text-xl">
                        <FaSeedling />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Ingredientes Reales</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Chocolates de primera línea, dulce de leche repostero y pulpas de frutas naturales seleccionadas.
                    </p>
                </Card>

                <Card className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 text-xl">
                        <FaIceCream />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Elaboración Diaria</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Cuidamos la textura y cremosidad en cada bacha para que siempre llegue fresco a tu mesa.
                    </p>
                </Card>

                <Card className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-xl">
                        <FaAward />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Identidad Baraderense</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Orgullosos de ser parte de nuestra comunidad y de endulzar cada momento especial de la ciudad.
                    </p>
                </Card>
            </div>

            {/* CTA para pedir online */}
            <div className="bg-neutral text-white rounded-3xl p-8 sm:p-10 text-center flex flex-col items-center">
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">¿Querés probar la diferencia?</h3>
                <p className="text-gray-300 text-sm max-w-md mb-6">
                    Explorá nuestros sabores artesanales y hacé tu pedido online ahora mismo.
                </p>
                <Link
                    to="/"
                    className="btn bg-white text-gray-900 hover:bg-gray-100 rounded-full px-8 font-bold border-none flex items-center gap-2"
                >
                    Ir a la tienda <FaArrowRight />
                </Link>
            </div>
        </div>
    )
}

export default Nosotros