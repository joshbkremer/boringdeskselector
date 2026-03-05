import { useState, useRef, useEffect } from 'react'
import { WfhEntry } from '../hooks/useWfh'

interface WfhSectionProps {
  entries: WfhEntry[]
  loading: boolean
  onAdd: (name: string) => Promise<void>
  onRemove: (id: string) => Promise<void>
}

export function WfhSection({ entries, loading, onAdd, onRemove }: WfhSectionProps) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Clear error when typing
  useEffect(() => { setError(null) }, [name])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setSubmitting(true)
    setError(null)
    try {
      await onAdd(trimmed)
      setName('')
      inputRef.current?.focus()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemove = async (id: string) => {
    setRemovingId(id)
    try {
      await onRemove(id)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="border border-matrix-border bg-matrix-surface rounded-sm p-4 animate-slide-up">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-matrix-green text-lg text-glow">⌂</span>
          <div>
            <h2 className="text-matrix-green font-bold tracking-widest text-sm text-glow-sm">
              WORK_FROM_HOME
            </h2>
            <p className="text-[10px] text-matrix-mid tracking-wider mt-0.5">
              {entries.length} REMOTE TODAY
            </p>
          </div>
        </div>

        {/* Count badge */}
        {entries.length > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-1 border border-matrix-border rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-matrix-green animate-pulse" />
            <span className="text-[10px] text-matrix-mid tracking-widest">{entries.length} WFH</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Add form */}
        <form onSubmit={handleAdd} className="flex flex-col gap-2 sm:w-64 shrink-0">
          <label className="text-[10px] text-matrix-mid tracking-widest">
            &gt; ADD YOURSELF:
          </label>
          <div className="flex gap-2">
            <div className={`
              flex items-center flex-1 border bg-matrix-black rounded-sm px-2 py-1.5
              transition-all duration-150
              ${error ? 'border-red-700' : 'border-matrix-border focus-within:border-matrix-green focus-within:shadow-glow-sm'}
            `}>
              <span className="text-matrix-green mr-1.5 text-xs">$</span>
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="your_name"
                maxLength={40}
                disabled={submitting}
                className="
                  flex-1 bg-transparent outline-none
                  text-matrix-green placeholder-matrix-border
                  font-mono text-xs tracking-wide caret-matrix-green
                "
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="
                px-3 py-1.5 border border-matrix-border text-matrix-mid text-xs tracking-widest rounded-sm
                hover:border-matrix-green hover:text-matrix-green hover:shadow-glow-sm
                disabled:opacity-30 disabled:cursor-not-allowed
                transition-all duration-150 whitespace-nowrap
              "
            >
              {submitting ? '...' : '+ ADD'}
            </button>
          </div>
          {error && (
            <p className="text-[10px] text-red-400 tracking-wide">{error}</p>
          )}
        </form>

        {/* WFH list */}
        <div 
        style={{ marginLeft: '20px' }}
        className="flex-1 min-h-[48px] sm:border-l sm:border-matrix-border sm:pl-4 border-t border-matrix-border pt-4 sm:border-t-0 sm:pt-0">
          {loading ? (
            <div className="flex items-center gap-2 text-matrix-mid text-xs tracking-widest py-2">
              <span className="animate-spin">◌</span>
              <span>LOADING...</span>
            </div>
          ) : entries.length === 0 ? (
            <div className="flex items-center gap-2 text-matrix-border text-xs tracking-widest py-2 italic">
              <span>—</span>
              <span>No one is working from home</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="
                    flex items-center gap-2 px-2.5 py-1.5
                    border border-matrix-dim bg-matrix-black rounded-sm
                    group transition-all duration-150
                    hover:border-matrix-border
                  "
                >
                  {/* Avatar initial */}
                  <div className="w-5 h-5 rounded-full border border-matrix-dim bg-matrix-surface flex items-center justify-center shrink-0">
                    <span className="text-[9px] text-matrix-mid font-bold group-hover:text-matrix-green transition-colors">
                      {entry.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-matrix-mid text-xs tracking-wide group-hover:text-matrix-bright transition-colors">
                    {entry.name}
                  </span>
                  <button
                    onClick={() => handleRemove(entry.id)}
                    disabled={removingId === entry.id}
                    title={`Remove ${entry.name}`}
                    className="
                      text-matrix-border text-xs ml-0.5
                      hover:text-red-400 transition-colors
                      disabled:opacity-30 leading-none
                    "
                  >
                    {removingId === entry.id ? '·' : '×'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
