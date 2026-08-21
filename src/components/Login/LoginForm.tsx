import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { loginService } from '../../services/authServices'
import { useUser } from '../../context/userContextData'
import { Navigate } from 'react-router-dom'
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
            className="mt-8 flex flex-col gap-4 lg:gap-6 max-w-[500px] mx-auto "
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
                    className={`p-2 outline-2 rounded border focus:outline-primary w-full ${
                        errors.email
                            ? 'border-red-500 outline-red-500 focus:outline-red-500'
                            : ''
                    }`}
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
                    className={`p-2 pr-12 outline-2 rounded border focus:outline-primary w-full ${
                        errors.password
                            ? 'border-red-500 outline-red-500 focus:outline-red-500'
                            : ''
                    }`}
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
                    className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                    {showPassword ? (
                        <FaEyeSlash size={18} />
                    ) : (
                        <FaEye size={18} />
                    )}
                </button>
                {errors.password && (
                    <p className="text-red-500 text-sm mt-2 ml-1 ">
                        {typeof errors.password.message === 'string'
                            ? errors.password.message
                            : ''}
                    </p>
                )}
            </div>
            <button className="btn btn-primary" type="submit">
                Iniciar Sesión
            </button>
        </form>
    )
}

export default LoginForm
