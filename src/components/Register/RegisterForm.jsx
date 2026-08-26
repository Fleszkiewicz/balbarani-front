import { useState } from 'react'
import { useUser } from '../../context/userContextData'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { registerService } from '../../services/authServices'
import { Navigate } from 'react-router'
import { toast } from 'react-hot-toast'

const RegisterForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        mode: 'onChange', //validacion en tiempo real
    })

    const { userInfo, checkSession } = useUser()
    //const { userInfo, checkSession } = useContext(UserContext)
    const [showPassword, setShowPassword] = useState(false)
    const [redirect, setRedirect] = useState(false)

    const inputClass = `
    w-full
    rounded-2xl
    border
    border-base-content/10
    bg-base-100/80
    px-4
    py-3
    text-sm
    backdrop-blur-sm
    transition-all
    duration-300
    outline-none
    focus:border-primary/40
    focus:ring-4
    focus:ring-primary/10
`

    const onSubmit = async (data) => {
        //registrando al user
        const result = await registerService(
            data,
            reset,
            setRedirect,
            checkSession,
        )

        if (result.message) {
            toast.success('Registro exitoso')
        } else {
            toast.error('Intente mas tarde')
        }

        console.log(result)
    }

    if (redirect && userInfo.isAdmin) {
        return <Navigate to="/admin/dashboard" replace />
    }

    if (redirect && !userInfo.isAdmin) {
        return <Navigate to="/" replace />
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="
        mx-auto
        mt-8
        flex
        max-w-md
        flex-col
        gap-5
        rounded-[28px]
        border
        border-base-content/10
        bg-base-100/70
        p-8
        shadow-[0_10px_35px_rgba(0,0,0,0.08)]
        backdrop-blur-sm
    "
        >
            {/* Formulario de registro de usuario */}
            <div>
                <input
                    {...register('username', {
                        required: 'El nombre de usuario es requerido',
                        minLength: {
                            value: 3,
                            message: 'Minimo 3 caracteres',
                        },
                        maxLength: {
                            value: 20,
                            message: 'Máximo 20 caracteres',
                        },
                    })}
                    className={`${inputClass} ${
                        errors.username
                            ? 'border-red-500 focus:ring-red-500/10'
                            : ''
                    }`}
                    type="text"
                    placeholder="Nombre de Usuario"
                    name="username"
                    autoComplete="usernames"
                />
                {errors.username && (
                    <p className="text-red-500 text-sm mt-2 ml-1">
                        {errors.username.message}
                    </p>
                )}
            </div>

            {/* Formulario de registro de email */}
            <div>
                <input
                    {...register('email', {
                        required: 'El email es requerido',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email invalido',
                        },
                        minLength: {
                            value: 6,
                            message: 'Minimo 6 caracteres',
                        },
                        maxLength: {
                            value: 254,
                            message: 'Máximo 254 caracteres',
                        },
                    })}
                    className={`${inputClass} ${
                        errors.email
                            ? 'border-red-500 focus:ring-red-500/10'
                            : ''
                    }`}
                    autoComplete="email"
                    name="email"
                    placeholder="Correo electrónico"
                    type="email"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-2 ml-1">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Formulario de registro de contraseña */}
            <div>
                <div className="relative">
                    <input
                        {...register('password', {
                            required: 'La contraseña es requerida',
                            minLength: {
                                value: 8,
                                message: 'Minimo 8 caracteres',
                            },
                            maxLength: {
                                value: 254,
                                message: 'Máximo 254 caracteres',
                            },
                        })}
                        className={`${inputClass} pr-12 ${
                            errors.password
                                ? 'border-red-500 focus:ring-red-500/10'
                                : ''
                        }`}
                        placeholder="Contraseña"
                        type={showPassword ? 'text' : 'password'}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                            showPassword
                                ? 'Ocultar contraseña'
                                : 'Mostrar contraseña'
                        }
                        className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-base-content/50
                transition-colors
                hover:text-base-content
            "
                    >
                        {showPassword ? (
                            <FaEyeSlash size={18} />
                        ) : (
                            <FaEye size={18} />
                        )}
                    </button>
                </div>

                {errors.password && (
                    <p className="mt-2 ml-1 text-sm text-red-500">
                        {errors.password.message}
                    </p>
                )}
            </div>
            <button
                type="submit"
                className="
        mt-2
        rounded-full
        bg-neutral
        px-6
        py-3
        font-medium
        text-neutral-content
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-lg
    "
            >
                Registrarse
            </button>
        </form>
    )
}

export default RegisterForm
