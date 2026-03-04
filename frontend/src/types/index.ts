export interface DeskConfig {
  id: string
  label: string
  reservable: boolean
  row: number
  col: number
}

export interface PodConfig {
  id: string
  rows: number
  cols: number
  desks: DeskConfig[]
}

export interface AreaConfig {
  id: string
  name: string
  pods: PodConfig[]
}

export interface Reservation {
  id: string
  desk_id: string
  date: string
  name: string
  created_at: string
  updated_at: string
}

export type ReservationMap = Record<string, Reservation>
