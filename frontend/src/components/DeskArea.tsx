import { AreaConfig, DeskConfig, ReservationMap, Reservation } from '../types'
import { DeskPod } from './DeskPod'

interface DeskAreaProps {
  area: AreaConfig
  reservations: ReservationMap
  onDeskClick: (desk: DeskConfig, reservation?: Reservation) => void
}

const AREA_ICONS: Record<string, string> = {
  'onsite-hs': '⬡',
  'onsite-ls': '◈',
  'synergist': '◊',
}

export function DeskArea({ area, reservations, onDeskClick }: DeskAreaProps) {
  const totalDesks = area.pods.flatMap((p) => p.desks).filter((d) => d.reservable).length
  const reservedCount = area.pods
    .flatMap((p) => p.desks)
    .filter((d) => d.reservable && reservations[d.id]).length

  const availability = totalDesks > 0 ? Math.round(((totalDesks - reservedCount) / totalDesks) * 100) : 0

  return (
    <div className="border border-matrix-border bg-matrix-surface rounded-sm p-4 animate-slide-up">
      {/* Area header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-matrix-green text-xl text-glow">{AREA_ICONS[area.id] ?? '□'}</span>
          <div>
            <h2 className="text-matrix-green font-bold tracking-widest text-sm text-glow-sm">
              {area.name.toUpperCase()}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-matrix-mid tracking-wider">
                {reservedCount}/{totalDesks} OCCUPIED
              </span>
            </div>
          </div>
        </div>

        {/* Availability bar */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-matrix-mid tracking-wider">AVAIL</span>
          <div className="w-20 h-2 bg-matrix-border rounded-full overflow-hidden">
            <div
              className="h-full bg-matrix-green rounded-full transition-all duration-500"
              style={{ width: `${availability}%`, boxShadow: availability > 0 ? '0 0 4px #00ff41' : 'none' }}
            />
          </div>
          <span className={`text-[10px] font-bold tracking-wider ${availability > 50 ? 'text-matrix-green' : availability > 20 ? 'text-yellow-400' : 'text-red-400'}`}>
            {availability}%
          </span>
        </div>
      </div>

      {/* Pods */}
      <div className="flex flex-wrap gap-3">
        {area.pods.map((pod) => (
          <DeskPod
            key={pod.id}
            pod={pod}
            reservations={reservations}
            onDeskClick={onDeskClick}
          />
        ))}
      </div>

      {/* Legend inline */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-matrix-border">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 border border-matrix-border bg-matrix-black rounded-sm" />
          <span className="text-[9px] text-matrix-mid tracking-wider">AVAILABLE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 border border-matrix-green bg-matrix-surface rounded-sm shadow-glow-sm" />
          <span className="text-[9px] text-matrix-mid tracking-wider">OCCUPIED</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 border border-matrix-border bg-matrix-black rounded-sm flex items-center justify-center">
            <span className="text-[6px] text-matrix-border">✕</span>
          </div>
          <span className="text-[9px] text-matrix-mid tracking-wider">RESTRICTED</span>
        </div>
      </div>
    </div>
  )
}
