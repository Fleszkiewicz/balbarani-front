import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { TbLogin2, TbUserPlus, TbEye, TbEyeOff } from 'react-icons/tb'
import { loginService } from '../../services/authServices'
import { useUser } from '../../context/userContextData'
import { Navigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'

type LoginFormValues = {
    email: string
    password: string
}

const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LoginFormValues>({ mode: 'onChange' })

    const { setUserInfo, userInfo } = useUser()
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

    const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
        const result = await loginService(data, reset, setRedirect, setUserInfo)

        if (result?.success) {
            toast.success(result?.message || 'Inicio de sesión exitoso')
        } else {
            toast.error(result?.message || 'Error al iniciar sesión')
        }
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
        mb-20
    "
        >
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
                    className={`${inputClass} ${errors.email
                        ? 'border-red-500 focus:ring-red-500/10'
                        : 'border-base-content/10'
                        }
`}
                    autoComplete="email"
                    name="email"
                    placeholder="Correo electrónico"
                    type="email"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-2 ml-1">
                        {typeof errors.email.message === 'string'
                            ? errors.email.message
                            : ''}
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
                        className={`${inputClass}${errors.password
                            ? 'border-red-500 focus:ring-red-500/10'
                            : 'border-base-content/10'
                            }
`}
                        autoComplete="current-password"
                        name="password"
                        placeholder="Contraseña"
                        type={showPassword ? 'text' : 'password'}
                    />
                    <button
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                            showPassword
                                ? 'Ocultar contraseña'
                                : 'Mostrar contraseña'
                        }
                        type="button"
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
                            <TbEyeOff size={18} />
                        ) : (
                            <TbEye size={18} />
                        )}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-red-500 text-sm mt-2 ml-1 ">
                        {typeof errors.password.message === 'string'
                            ? errors.password.message
                            : ''}
                    </p>
                )}
            </div>
            {/* Link ¿Olvidaste tu contraseña? */}
            <div className="flex justify-center -mt-2">
                <Link
                    to="/forgot-password"
                    className="text-xs text-gray-500 hover:text-neutral hover:underline transition-colors"
                >
                    ¿Olvidaste tu contraseña?
                </Link>
            </div>

            {/* Botón Principal: Iniciar sesión */}
            <button
                type="submit"
                className="
                    justify-center rounded-xl bg-neutral hover:bg-black/90 px-4 py-2 gap-1.5 text-md font-normal text-white flex items-center 
                "
            >
                <TbLogin2 size={18} className='text-white' />
                Iniciar sesión
            </button>

            {/* Separador */}
            <div className="relative my-1 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-base-content/10"></div>
                </div>
                <span className="relative bg-base-100/90 px-3 text-xs text-base-content/50">
                    ¿No tienes cuenta?
                </span>
            </div>

            {/* Botón Secundario: Crear cuenta */}
            <Link
                to="/register"
                className="
                    justify-center rounded-xl bg-gray-300/60 hover:bg-gray-400/40 px-4 py-2 gap-1.5 text-md font-normal text-gray-800 flex items-center 
                "
            >
                <TbUserPlus size={18} className='text-gray-800' />
                Crear cuenta
            </Link>

        </form>
    )
}

export default LoginForm
