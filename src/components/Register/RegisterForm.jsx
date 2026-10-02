import { useState, useEffect } from 'react'
import { useUser } from '../../context/userContextData'
import { useForm } from 'react-hook-form'
import { FaEnvelopeOpenText } from 'react-icons/fa'
import { TbEye, TbEyeOff, TbUserPlus, TbMailOpened, TbLoader } from 'react-icons/tb'
import { registerService, verifyEmailService, resendCodeService } from '../../services/authServices'
import { Navigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const RegisterForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ mode: 'onChange' })

    const { userInfo, checkSession, setUserInfo } = useUser()
    const [showPassword, setShowPassword] = useState(false)
    const [redirect, setRedirect] = useState(false)

    // Estados para la verificación por código
    const [step, setStep] = useState('form') // 'form' o 'verify'
    const [emailToVerify, setEmailToVerify] = useState('')
    const [code, setCode] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)

    // Temporizador de reenvío de 60 segundos
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [resendCooldown])

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

    // Enviar formulario de registro
    const onSubmit = async (data) => {
        const result = await registerService(data, reset)

        if (result.success) {
            if (result.requiresVerification) {
                setEmailToVerify(result.email)
                setStep('verify')
                setResendCooldown(60)
                toast.success('¡Te enviamos un código a tu correo!')
            } else {
                // Si es el primer usuario (admin)
                await checkSession()
                setRedirect(true)
                toast.success('Registro exitoso')
            }
        } else {
            toast.error(result.message || 'Error al registrarse')
        }
    }

    // Verificar el código de 6 dígitos
    const handleVerifyCode = async (e) => {
        e.preventDefault()
        if (code.trim().length !== 6) {
            toast.error('El código debe tener 6 dígitos')
            return
        }

        try {
            setIsVerifying(true)
            const result = await verifyEmailService({ email: emailToVerify, code: code.trim() })

            if (result.success) {
                toast.success('¡Cuenta verificada con éxito!')
                if (setUserInfo) setUserInfo(result.data)
                await checkSession()
                setRedirect(true)
            } else {
                toast.error(result.message || 'Código incorrecto o vencido')
            }
        } catch (error) {
            toast.error('Error al verificar el código')
        } finally {
            setIsVerifying(false)
        }
    }

    // Reenviar código
    const handleResend = async () => {
        if (resendCooldown > 0) return
        const result = await resendCodeService(emailToVerify)
        if (result.success) {
            toast.success('Nuevo código enviado')
            setResendCooldown(60)
        } else {
            toast.error(result.message || 'Error al reenviar código')
        }
    }

    if (redirect && userInfo.isAdmin) {
        return <Navigate to="/admin/dashboard" replace />
    }

    if (redirect && !userInfo.isAdmin) {
        return <Navigate to="/" replace />
    }

    // --- PANTALLA 2: INGRESAR CÓDIGO ---
    if (step === 'verify') {
        return (
            <div className="mx-auto mt-8 max-w-md rounded-[28px] border border-base-content/10 bg-base-100/70 p-8 shadow-[0_10px_35px_rgba(0,0,0,0.08)] backdrop-blur-sm text-center mb-20">
                <div className="w-16 h-16 rounded-full bg-gray-200 text-primary mx-auto flex items-center justify-center mb-4 text-2xl">
                    <TbMailOpened size={32} className='text-gray-800' />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Verificá tu correo</h2>
                <p className="text-[14px] text-gray-500 mb-6">
                    Ingresá el código de 6 dígitos que enviamos a: <br />
                    <strong className="text-gray-800">{emailToVerify}</strong>
                </p>

                <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
                    <input
                        type="text"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="_ _ _ _ _ _"
                        className="w-full text-center text-3xl tracking-[0.4em] py-3 px-4 rounded-2xl border border-base-content/20 bg-base-100 font-normal focus:outline-none focus:ring-4 focus:ring-primary/10"
                        autoFocus
                    />

                    <button
                        type="submit"
                        disabled={isVerifying || code.length !== 6}
                        className="justify-center rounded-xl bg-neutral hover:bg-black/90 px-4 py-2 gap-1.5 text-md font-normal text-white flex items-center disabled:opacity-50"
                    >
                        {isVerifying ? <TbLoading /> : <TbUserPlus />}
                        {isVerifying ? 'Verificando...' : 'Activar Cuenta'}
                    </button>
                </form>

                <div className="mt-6 flex flex-col gap-2 text-xs text-gray-500">
                    <button
                        onClick={handleResend}
                        disabled={resendCooldown > 0}
                        className="font-semibold text-primary hover:underline disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
                    >
                        {resendCooldown > 0 ? `Reenviar código en ${resendCooldown}s` : '¿No te llegó? Reenviar código'}
                    </button>
                    <button
                        onClick={() => setStep('form')}
                        className="text-gray-400 hover:text-gray-600 underline cursor-pointer mt-1"
                    >
                        Volver a ingresar datos
                    </button>
                </div>
            </div>
        )
    }

    // --- PANTALLA 1: FORMULARIO DE REGISTRO ---
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto mt-8 mb-20 flex max-w-md flex-col gap-5 rounded-[28px] border border-base-content/10 bg-base-100/70 p-8 shadow-[0_10px_35px_rgba(0,0,0,0.08)] backdrop-blur-sm"
        >
            <div>
                <input
                    {...register('username', {
                        required: 'El nombre de usuario es requerido',
                        minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                        maxLength: { value: 20, message: 'Máximo 20 caracteres' },
                    })}
                    className={`${inputClass} ${errors.username ? 'border-red-500 focus:ring-red-500/10' : ''}`}
                    type="text"
                    placeholder="Nombre de Usuario"
                />
                {errors.username && <p className="text-red-500 text-sm mt-2 ml-1">{errors.username.message}</p>}
            </div>

            <div>
                <input
                    {...register('email', {
                        required: 'El email es requerido',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email inválido',
                        },
                    })}
                    className={`${inputClass} ${errors.email ? 'border-red-500 focus:ring-red-500/10' : ''}`}
                    placeholder="Correo electrónico"
                    type="email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-2 ml-1">{errors.email.message}</p>}
            </div>

            <div>
                <div className="relative">
                    <input
                        {...register('password', {
                            required: 'La contraseña es requerida',
                            minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                        })}
                        className={`${inputClass} pr-12 ${errors.password ? 'border-red-500 focus:ring-red-500/10' : ''}`}
                        placeholder="Contraseña"
                        type={showPassword ? 'text' : 'password'}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                    >
                        {showPassword ? <TbEyeOff size={18} /> : <TbEye size={18} />}
                    </button>
                </div>
                {errors.password && <p className="mt-2 ml-1 text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <button
                type="submit"
                className="justify-center rounded-xl bg-neutral hover:bg-black/90 px-4 py-2 gap-1.5 text-md font-normal text-white flex items-center"
            >
                <TbUserPlus size={18} className='text-white' />
                Continuar
            </button>
        </form>
    )
}

export default RegisterForm
