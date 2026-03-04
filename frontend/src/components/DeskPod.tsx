import { DeskConfig, PodConfig, ReservationMap } from '../types'
import { DeskCell } from './DeskCell'
import { Reservation } from '../types'

interface DeskPodProps {
  pod: PodConfig
  reservations: ReservationMap
  onDeskClick: (desk: DeskConfig, reservation?: Reservation) => void
}

export function DeskPod({ pod, reservations, onDeskClick }: DeskPodProps) {
  // Build grid
  const grid: (DeskConfig | null)[][] = Array.from({ length: pod.rows }, () =>
    Array(pod.cols).fill(null)
  )

  for (const desk of pod.desks) {
    if (desk.row < pod.rows && desk.col < pod.cols) {
      grid[desk.row][desk.col] = desk
    }
  }

  return (
    <div
      className="inline-grid gap-1 p-2 border border-matrix-border bg-matrix-black rounded-sm"
      style={{ gridTemplateColumns: `repeat(${pod.cols}, auto)` }}
    >
      {grid.flat().map((desk, i) => {
        if (!desk) {
          return <div key={i} className="w-20 h-20" />
        }
        return (
          <DeskCell
            key={desk.id}
            desk={desk}
            reservation={reservations[desk.id]}
            onClick={onDeskClick}
          />
        )
      })}
    </div>
  )
}
