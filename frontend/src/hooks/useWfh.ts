import { useState, useEffect, useCallback } from 'react'

const API = import.meta.env.VITE_API_URL || '/api'

export interface WfhEntry {
  id: string
  date: string
  name: string
  created_at: string
}

export function useWfh(selectedDate: string | null) {
  const [entries, setEntries] = useState<WfhEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEntries = useCallback(async () => {
    if (!selectedDate) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/wfh?date=${selectedDate}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: WfhEntry[] = await res.json()
      setEntries(data)
    } catch (e) {
      setError('NETWORK ERROR: Failed to fetch WFH entries')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [selectedDate])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const addEntry = async (date: string, name: string): Promise<WfhEntry> => {
    const res = await fetch(`${API}/wfh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, name }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || 'Failed to add WFH entry')
    }
    const created: WfhEntry = await res.json()
    setEntries((prev) => [...prev, created])
    return created
  }

  const removeEntry = async (id: string): Promise<void> => {
    const res = await fetch(`${API}/wfh/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || 'Failed to remove WFH entry')
    }
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return { entries, loading, error, addEntry, removeEntry, refresh: fetchEntries }
}
