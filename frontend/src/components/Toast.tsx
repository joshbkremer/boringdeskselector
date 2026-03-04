import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: number
  message: string
  type: ToastType
}

interface ToastProps {
  toasts: ToastMessage[]
  onDismiss: (id: number) => void
}

export function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: number) => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss(toast.id), 300)
    }, 3500)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  const colors = {
    success: 'border-matrix-green text-matrix-green shadow-glow',
    error: 'border-red-500 text-red-400 shadow-[0_0_8px_#ef4444]',
    info: 'border-matrix-bright text-matrix-bright',
  }

  const prefix = {
    success: '[ OK ]',
    error: '[ ERR ]',
    info: '[ INFO ]',
  }

  return (
    <div
      className={`
        pointer-events-auto
        px-4 py-3 border bg-matrix-black rounded-sm
        text-xs font-mono tracking-wide
        transition-all duration-300
        flex items-center gap-3
        ${colors[toast.type]}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      <span className="font-bold">{prefix[toast.type]}</span>
      <span>{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
      >
        ×
      </button>
    </div>
  )
}

let _toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = ++_toastId
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toasts, addToast, dismiss }
}
