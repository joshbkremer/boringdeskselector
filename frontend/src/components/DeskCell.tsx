import { DeskConfig, Reservation } from '../types'

interface DeskCellProps {
  desk: DeskConfig
  reservation?: Reservation
  onClick: (desk: DeskConfig, reservation?: Reservation) => void
}

export function DeskCell({ desk, reservation, onClick }: DeskCellProps) {
  if (!desk.reservable) {
    return (
      <div className="
        flex items-center justify-center
        w-20 h-20 border border-matrix-border
        bg-matrix-black text-matrix-border
        select-none cursor-not-allowed rounded-sm
        desk-cell desk-blocked
      ">
        <span className="text-2xl font-bold opacity-30">✕</span>
      </div>
    )
  }

  if (reservation) {
    return (
      <button
        onClick={() => onClick(desk, reservation)}
        className="
          relative flex flex-col items-center justify-center
          w-20 h-20 border border-matrix-green
          bg-matrix-surface shadow-glow
          text-matrix-green rounded-sm
          desk-cell desk-reserved
          hover:shadow-glow-lg transition-all duration-150
          group
        "
        title={`${desk.label} — ${reservation.name} (click to edit)`}
      >
        <span className="text-[9px] tracking-widest text-matrix-mid mb-1 group-hover:text-matrix-green transition-colors">
          {desk.label}
        </span>
        <div className="w-8 h-8 rounded-full border border-matrix-green bg-matrix-dim flex items-center justify-center mb-1 shadow-glow-sm">
          <span className="text-matrix-green text-xs font-bold">
            {reservation.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-[8px] text-matrix-bright font-bold tracking-wide px-1 text-center leading-tight max-w-full truncate w-full text-center">
          {reservation.name}
        </span>

        {/* Edit indicator */}
        <span className="absolute top-1 right-1 text-[7px] text-matrix-mid group-hover:text-matrix-green transition-colors opacity-0 group-hover:opacity-100">
          EDIT
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={() => onClick(desk)}
      className="
        relative flex flex-col items-center justify-center
        w-20 h-20 border border-matrix-border
        bg-matrix-surface text-matrix-mid rounded-sm
        desk-cell
        hover:border-matrix-green hover:text-matrix-green
        hover:shadow-glow hover:bg-matrix-surface
        transition-all duration-150 group
      "
      title={`Reserve ${desk.label}`}
    >
      <span className="text-[10px] tracking-widest mb-2 text-matrix-mid group-hover:text-matrix-green transition-colors">
        {desk.label}
      </span>
      <span className="text-xl text-matrix-border group-hover:text-matrix-green group-hover:text-glow transition-all">
        +
      </span>
      <span className="text-[8px] tracking-widest text-matrix-border group-hover:text-matrix-mid transition-colors mt-1">
        CLAIM
      </span>
    </button>
  )
}
