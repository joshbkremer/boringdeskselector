import { useState, useEffect, useCallback } from 'react'
import { Reservation, ReservationMap } from '../types'

const API = import.meta.env.VITE_API_URL || '/api'

export function useReservations(selectedDate: string | null) {
  const [reservations, setReservations] = useState<ReservationMap>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReservations = useCallback(async () => {
    if (!selectedDate) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/reservations?date=${selectedDate}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: Reservation[] = await res.json()
      const map: ReservationMap = {}
      data.forEach((r) => { map[r.desk_id] = r })
      setReservations(map)
    } catch (e) {
      setError('NETWORK ERROR: Failed to fetch reservations')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [selectedDate])

  useEffect(() => {
    fetchReservations()
  }, [fetchReservations])

  const createReservation = async (desk_id: string, date: string, name: string): Promise<Reservation> => {
    const res = await fetch(`${API}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ desk_id, date, name }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || 'Failed to create reservation')
    }
    const created: Reservation = await res.json()
    setReservations((prev) => ({ ...prev, [desk_id]: created }))
    return created
  }

  const updateReservation = async (reservation_id: string, desk_id: string, name: string): Promise<Reservation> => {
    const res = await fetch(`${API}/reservations/${reservation_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || 'Failed to update reservation')
    }
    const updated: Reservation = await res.json()
    setReservations((prev) => ({ ...prev, [desk_id]: updated }))
    return updated
  }

  const deleteReservation = async (reservation_id: string, desk_id: string): Promise<void> => {
    const res = await fetch(`${API}/reservations/${reservation_id}`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || 'Failed to delete reservation')
    }
    setReservations((prev) => {
      const next = { ...prev }
      delete next[desk_id]
      return next
    })
  }

  return {
    reservations,
    loading,
    error,
    refresh: fetchReservations,
    createReservation,
    updateReservation,
    deleteReservation,
  }
}
