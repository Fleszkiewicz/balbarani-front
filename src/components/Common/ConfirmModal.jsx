import { useEffect } from 'react'
import { FiAlertTriangle, FiLogOut, FiTrash2 } from 'react-icons/fi'

/**
 * Modal de Confirmación Moderno y Reutilizable
 * @param {boolean} isOpen - Estado de visibilidad
 * @param {string} title - Título del diálogo
 * @param {string} message - Descripción o detalle
 * @param {string} confirmText - Texto del botón de confirmación
 * @param {string} cancelText - Texto del botón de cancelación
 * @param {'danger' | 'warning' | 'primary'} confirmVariant - Estilo visual del botón principal
 * @param {boolean} isLoading - Muestra spinner si la acción es asíncrona
 * @param {function} onConfirm - Acción al confirmar
 * @param {function} onClose - Acción al cancelar o cerrar
 */
const ConfirmModal = ({
    isOpen,
    title = '¿Estás seguro?',
    message = 'Esta acción no se puede deshacer.',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    confirmVariant = 'danger',
    isLoading = false,
    iconType = 'trash', // 'trash' | 'logout' | 'alert'
    onConfirm,
    onClose,
}) => {
    // Cerrar con tecla Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen && !isLoading) {
                onClose()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, isLoading, onClose])

    if (!isOpen) return null

    const iconBgColors = {
        danger: 'bg-red-50 text-red-500 border-red-100',
        warning: 'bg-amber-50 text-amber-500 border-amber-100',
        primary: 'bg-neutral-100 text-neutral-800 border-neutral-200',
    }

    const confirmBtnStyles = {
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-red-200',
        warning: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200',
        primary: 'bg-neutral text-white hover:bg-neutral-800 shadow-neutral-200',
    }

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
            {/* Backdrop click */}
            <div className="absolute inset-0" onClick={!isLoading ? onClose : undefined} />

            <div className="relative bg-white rounded-[26px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] max-w-sm w-full p-6 text-center transform transition-all animate-in zoom-in-95 duration-200 z-10">
                {/* Icono de advertencia / acción */}
                <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3.5  ${iconBgColors[confirmVariant] || iconBgColors.danger
                        }`}
                >
                    {iconType === 'logout' ? (
                        <FiLogOut size={22} />
                    ) : iconType === 'alert' ? (
                        <FiAlertTriangle size={22} />
                    ) : (
                        <FiTrash2 size={22} />
                    )}
                </div>

                {/* Título y Mensaje */}
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1.5 font-normal leading-relaxed">
                    {message}
                </p>

                {/* Botones de Acción */}
                <div className="flex items-center gap-2.5 mt-6">
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={onClose}
                        className="flex-1 py-2.5 px-4 rounded-full font-medium text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={onConfirm}
                        className={`flex-1 py-2.5 px-4 rounded-full font-medium text-xs sm:text-sm transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 ${confirmBtnStyles[confirmVariant] || confirmBtnStyles.danger
                            }`}
                    >
                        {isLoading ? 'Procesando...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal
