import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPasswordService, resetPasswordService } from '../services/authServices'
import { FaEye, FaEyeSlash, FaArrowLeft, FaKey } from 'react-icons/fa'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
    const navigate = useNavigate()
    const [step, setStep] = useState('request') // 'request' o 'reset'
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const inputClass = `
        w-full rounded-2xl border border-base-content/10 bg-base-100/80 px-4 py-3 text-sm
        backdrop-blur-sm transition-all duration-300 outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10
    `

    // Paso 1: Solicitar código
    const handleRequestCode = async (e) => {
        e.preventDefault()
        if (!email.trim()) return

        try {
            setLoading(true)
            const result = await forgotPasswordService(email.trim())
            if (result.success) {
                toast.success('¡Código enviado! Revisá tu correo.')
                setStep('reset')
            } else {
                toast.error(result.message || 'Error al enviar código')
            }
        } finally {
            setLoading(false)
        }
    }

    // Paso 2: Cambiar contraseña
    const handleResetPassword = async (e) => {
        e.preventDefault()

        if (code.trim().length !== 6) {
            toast.error('El código debe tener 6 dígitos')
            return
        }

        if (newPassword.length < 8) {
            toast.error('La contraseña debe tener al menos 8 caracteres')
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error('Las contraseñas no coinciden')
            return
        }

        try {
            setLoading(true)
            const result = await resetPasswordService({
                email: email.trim(),
                code: code.trim(),
                newPassword,
            })

            if (result.success) {
                toast.success('¡Contraseña actualizada con éxito!')
                navigate('/login')
            } else {
                toast.error(result.message || 'Código incorrecto o expirado')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-16 px-4">
            <div className="mx-auto max-w-md rounded-[28px] border border-base-content/10 bg-base-100/70 p-8 shadow-[0_10px_35px_rgba(0,0,0,0.08)] backdrop-blur-sm">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 mb-4 transition-colors font-semibold">
                    <FaArrowLeft /> Volver al Login
                </Link>

                <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center mb-3 text-xl">
                        <FaKey />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {step === 'request' ? 'Recuperar Contraseña' : 'Nueva Contraseña'}
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                        {step === 'request'
                            ? 'Ingresá tu correo para recibir un código de restablecimiento.'
                            : `Ingresá el código enviado a ${email} y tu nueva clave.`}
                    </p>
                </div>

                {step === 'request' ? (
                    <form onSubmit={handleRequestCode} className="flex flex-col gap-4">
                        <div>
                            <label className="label text-xs font-bold text-gray-600">Correo Electrónico</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@correo.com"
                                className={inputClass}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 rounded-full bg-neutral py-3 font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
                        >
                            {loading ? 'Enviando...' : 'Enviar Código'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                        <div>
                            <label className="label text-xs font-bold text-gray-600">Código de 6 dígitos</label>
                            <input
                                type="text"
                                maxLength={6}
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                placeholder="123456"
                                className="w-full text-center text-2xl font-mono tracking-[0.3em] py-2 px-3 rounded-xl border border-base-content/20 bg-base-100 font-bold focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="label text-xs font-bold text-gray-600">Nueva Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Mínimo 8 caracteres"
                                    className={`${inputClass} pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50"
                                >
                                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="label text-xs font-bold text-gray-600">Confirmar Nueva Contraseña</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repetí la contraseña"
                                className={inputClass}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 rounded-full bg-neutral py-3 font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
                        >
                            {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword
