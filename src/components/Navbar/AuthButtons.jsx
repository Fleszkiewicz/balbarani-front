import { Link } from 'react-router-dom'

const AuthButtons = () => {
    return (
        <div className="flex flex-wrap items-center justify-center gap-3 py-5">
            <Link
                to="/register"
                className="
                    rounded-full
                    bg-neutral
                    px-6
                    py-2.5
                    text-sm
                    font-medium
                    text-neutral-content
                    shadow-sm
                    transition-all
                    duration-300
                    ease-out
                    hover:-translate-y-0.5
                    hover:shadow-md
                    active:translate-y-0
                "
            >
                Crear cuenta
            </Link>

            <Link
                to="/login"
                className="
                    rounded-full
                    border
                    border-base-content/15
                    bg-base-100/60
                    px-6
                    py-2.5
                    text-sm
                    font-medium
                    text-base-content
                    backdrop-blur-sm
                    transition-all
                    duration-300
                    ease-out
                    hover:-translate-y-0.5
                    hover:border-base-content/25
                    hover:bg-base-200/70
                    hover:shadow-sm
                    active:translate-y-0
                "
            >
                Iniciar sesión
            </Link>
        </div>
    )
}

export default AuthButtons