import { format } from 'date-fns'
import { useState, useEffect } from 'react'

interface HeaderProps {
  onRefresh: () => void
  loading: boolean
}

export function Header({ onRefresh, loading }: HeaderProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="border-b border-matrix-border bg-matrix-black px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo / Title */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-matrix-green text-xl font-black tracking-widest text-glow">
                BORING
              </span>
              <span className="text-matrix-mid text-xl font-black tracking-widest">
                DESK
              </span>
              <span className="text-matrix-green text-xl font-black tracking-widest text-glow">
                SELECTOR
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[8px] text-matrix-border tracking-widest">
                ▸ DESK RESERVATION SYSTEM
              </span>
              <span className="text-[8px] text-matrix-border">|</span>
              <span className="text-[8px] text-matrix-green tracking-wider">v1.0.0</span>
              <span className="text-[8px] text-matrix-border">|</span>
              <span className="text-[8px] text-matrix-mid tracking-wider cursor">READY</span>
            </div>
          </div>
        </div>

        {/* Right side: clock + refresh */}
        <div className="flex items-center gap-6">
          {/* Live clock */}
          <div className="text-right hidden sm:block">
            <div className="text-matrix-green text-sm font-bold tracking-widest text-glow-sm">
              {format(time, 'HH:mm:ss')}
            </div>
            <div className="text-[9px] text-matrix-mid tracking-widest">
              {format(time, 'EEE dd MMM yyyy').toUpperCase()}
            </div>
          </div>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="
              flex items-center gap-2 px-4 py-2
              border border-matrix-border text-matrix-mid text-xs tracking-widest
              hover:border-matrix-green hover:text-matrix-green hover:shadow-glow-sm
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-150 rounded-sm
            "
          >
            <span className={loading ? 'animate-spin' : ''}>↻</span>
            <span>{loading ? 'SYNCING' : 'REFRESH'}</span>
          </button>
        </div>
      </div>

      {/* System status bar */}
      <div className="max-w-6xl mx-auto mt-3 flex items-center gap-4 text-[9px] text-matrix-border tracking-widest">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-matrix-green animate-pulse" />
          <span className="text-matrix-mid">SYS_STATUS: ONLINE</span>
        </span>
        <span>|</span>
        <span>BOOKING_WINDOW: T+0 to T+7</span>
        <span>|</span>
        <span>boringdeskselector.com</span>
      </div>
    </header>
  )
}
