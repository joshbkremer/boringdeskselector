import { useState, useEffect, useRef } from 'react'
import { DeskConfig, Reservation } from '../types'
import { format } from 'date-fns'

interface ReservationModalProps {
  desk: DeskConfig
  date: Date
  existingReservation?: Reservation
  defaultName?: string
  onConfirm: (name: string) => Promise<void>
  onDelete?: () => Promise<void>
  onClose: () => void
}

export function ReservationModal({
  desk,
  date,
  existingReservation,
  defaultName,
  onConfirm,
  onDelete,
  onClose,
}: ReservationModalProps) {
  const [name, setName] = useState(existingReservation?.name ?? defaultName ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isEdit = !!existingReservation

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('ERR: Name cannot be empty')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await onConfirm(trimmed)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setLoading(true)
    try {
      await onDelete?.()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop bg-black/60"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="
        bg-matrix-dark border border-matrix-green shadow-glow-lg
        w-full max-w-md mx-4 rounded-sm
        animate-slide-up
      ">
        {/* Terminal title bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-matrix-border bg-matrix-black">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-70" />
            <div className="w-2.5 h-2.5 rounded-full bg-matrix-green opacity-70" />
          </div>
          <span className="text-[10px] text-matrix-mid tracking-widest">
            DESK_RESERVATION_SYS v1.0
          </span>
          <button
            onClick={onClose}
            className="text-matrix-mid hover:text-matrix-green text-xs transition-colors"
          >
            [X]
          </button>
        </div>

        <div className="p-6">
          {/* Header info */}
          <div className="mb-5 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-matrix-mid text-xs tracking-wider">DESK_ID:</span>
              <span className="text-matrix-green font-bold text-sm text-glow-sm tracking-widest">
                {desk.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-matrix-mid text-xs tracking-wider">DATE____:</span>
              <span className="text-matrix-bright text-xs tracking-wider">
                {format(date, 'EEEE, MMMM d, yyyy').toUpperCase()}
              </span>
            </div>
            {isEdit && (
              <div className="flex items-center gap-2">
                <span className="text-matrix-mid text-xs tracking-wider">STATUS__:</span>
                <span className="text-yellow-400 text-xs tracking-wider">OCCUPIED → EDIT MODE</span>
              </div>
            )}
            {!isEdit && (
              <div className="flex items-center gap-2">
                <span className="text-matrix-mid text-xs tracking-wider">STATUS__:</span>
                <span className="text-matrix-green text-xs tracking-wider">AVAILABLE → CLAIM</span>
              </div>
            )}
          </div>

          <div className="border-t border-matrix-border mb-5" />

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-[10px] text-matrix-mid tracking-widest mb-2 uppercase">
                &gt; Enter your name:
              </label>
              <div className="flex items-center border border-matrix-border bg-matrix-black rounded-sm px-3 py-2 focus-within:border-matrix-green focus-within:shadow-glow-sm transition-all">
                <span className="text-matrix-green mr-2 text-sm">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(null) }}
                  placeholder="your_name_here"
                  maxLength={40}
                  className="
                    flex-1 bg-transparent outline-none
                    text-matrix-green placeholder-matrix-border
                    font-mono text-sm tracking-wide
                    caret-matrix-green
                  "
                  disabled={loading}
                />
                <span className="text-matrix-border text-[10px] ml-2">{name.length}/40</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 px-3 py-2 border border-red-800 bg-red-950/30 rounded-sm">
                <span className="text-red-400 text-xs tracking-wide">{error}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="
                  flex-1 py-2.5 border border-matrix-green
                  text-matrix-green text-xs font-bold tracking-widest
                  hover:bg-matrix-green hover:text-matrix-black
                  disabled:opacity-30 disabled:cursor-not-allowed
                  transition-all duration-150 rounded-sm
                  hover:shadow-glow
                "
              >
                {loading ? '[ PROCESSING... ]' : isEdit ? '[ UPDATE ]' : '[ CLAIM DESK ]'}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="
                  px-4 py-2.5 border border-matrix-border
                  text-matrix-mid text-xs tracking-widest
                  hover:border-matrix-dim hover:text-matrix-green
                  disabled:opacity-30
                  transition-all duration-150 rounded-sm
                "
              >
                [ ESC ]
              </button>
            </div>

            {isEdit && onDelete && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className={`
                    w-full py-2 border text-xs tracking-widest font-bold
                    transition-all duration-150 rounded-sm
                    ${confirmDelete
                      ? 'border-red-500 text-red-400 hover:bg-red-900/30'
                      : 'border-matrix-border text-matrix-border hover:border-red-800 hover:text-red-500'
                    }
                  `}
                >
                  {confirmDelete ? '[ CONFIRM RELEASE DESK? ]' : '[ RELEASE DESK ]'}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Status bar */}
        <div className="px-4 py-1.5 border-t border-matrix-border bg-matrix-black flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-matrix-green animate-pulse" />
          <span className="text-[9px] text-matrix-mid tracking-widest">
            BORINGDESKSELECTOR.COM // SECURE CONNECTION
          </span>
        </div>
      </div>
    </div>
  )
}
