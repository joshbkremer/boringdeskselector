import { useState, useCallback, useRef } from 'react'
import { format } from 'date-fns'
import { Header } from './components/Header'
import { Calendar } from './components/Calendar'
import { DeskArea } from './components/DeskArea'
import { PresenceSection } from './components/PresenceSection'
import { MyWeekSection } from './components/MyWeekSection'
import { ReservationModal } from './components/ReservationModal'
import { Toast, useToast } from './components/Toast'
import { useReservations } from './hooks/useReservations'
import { usePresenceList } from './hooks/usePresenceList'
import { useMyWeek } from './hooks/useMyWeek'
import { useUserName } from './hooks/useUserName'
import { DESK_LAYOUT } from './data/deskLayout'
import { DeskConfig, Reservation } from './types'

const API = import.meta.env.VITE_API_URL || '/api'

interface ModalState {
  desk: DeskConfig
  reservation?: Reservation
}

export default function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [modal, setModal] = useState<ModalState | null>(null)
  const { toasts, addToast, dismiss } = useToast()
  const floorPlanRef = useRef<HTMLElement>(null)

  const [userName, setUserName] = useUserName()

  const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null

  const {
    reservations,
    loading,
    error,
    refresh,
    createReservation,
    updateReservation,
    deleteReservation,
  } = useReservations(dateStr)

  const {
    entries: wfhEntries,
    loading: wfhLoading,
    addEntry: addWfh,
    removeEntry: removeWfh,
    refresh: refreshWfh,
  } = usePresenceList('wfh', dateStr)

  const {
    entries: oooEntries,
    loading: oooLoading,
    addEntry: addOoo,
    removeEntry: removeOoo,
    refresh: refreshOoo,
  } = usePresenceList('ooo', dateStr)

  const { days: weekDays, loading: weekLoading, refresh: refreshWeek } = useMyWeek(userName)

  // --- Date selection ---

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date)
    setModal(null)
  }, [])

  const handleNavigateToDate = useCallback((date: Date) => {
    setSelectedDate(date)
    setModal(null)
    setTimeout(() => {
      floorPlanRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }, [])

  // --- Desk reservations ---

  const handleDeskClick = useCallback((desk: DeskConfig, reservation?: Reservation) => {
    if (!selectedDate) return
    setModal({ desk, reservation })
  }, [selectedDate])

  const handleConfirm = useCallback(async (name: string) => {
    if (!modal || !dateStr) return
    const { desk, reservation } = modal
    if (reservation) {
      await updateReservation(reservation.id, desk.id, name)
      addToast(`${desk.label} updated → ${name}`, 'success')
    } else {
      await createReservation(desk.id, dateStr, name)
      addToast(`${desk.label} claimed by ${name}`, 'success')
    }
    refreshWeek()
  }, [modal, dateStr, createReservation, updateReservation, addToast, refreshWeek])

  const handleDelete = useCallback(async () => {
    if (!modal?.reservation) return
    const { desk, reservation } = modal
    await deleteReservation(reservation.id, desk.id)
    addToast(`${desk.label} released`, 'info')
    refreshWeek()
  }, [modal, deleteReservation, addToast, refreshWeek])

  // --- WFH / OOO (date-scoped for PresenceSection) ---

  const handleWfhAdd = useCallback(async (name: string) => {
    if (!dateStr) return
    await addWfh(dateStr, name)
    addToast(`${name} → WFH`, 'success')
    refreshWeek()
  }, [dateStr, addWfh, addToast, refreshWeek])

  const handleWfhRemove = useCallback(async (id: string) => {
    await removeWfh(id)
    addToast('WFH entry removed', 'info')
    refreshWeek()
  }, [removeWfh, addToast, refreshWeek])

  const handleOooAdd = useCallback(async (name: string) => {
    if (!dateStr) return
    await addOoo(dateStr, name)
    addToast(`${name} → OOO`, 'success')
    refreshWeek()
  }, [dateStr, addOoo, addToast, refreshWeek])

  const handleOooRemove = useCallback(async (id: string) => {
    await removeOoo(id)
    addToast('OOO entry removed', 'info')
    refreshWeek()
  }, [removeOoo, addToast, refreshWeek])

  // --- MyWeek quick-actions (any date, uses stored userName) ---

  const handleMyWeekWfhAdd = useCallback(async (dateStr: string) => {
    if (!userName) return
    const res = await fetch(`${API}/wfh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: dateStr, name: userName }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || 'Failed to add WFH')
    }
    addToast(`${userName} → WFH (${dateStr})`, 'success')
    refreshWeek()
    refreshWfh()
  }, [userName, addToast, refreshWeek, refreshWfh])

  const handleMyWeekOooAdd = useCallback(async (dateStr: string) => {
    if (!userName) return
    const res = await fetch(`${API}/ooo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: dateStr, name: userName }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || 'Failed to add OOO')
    }
    addToast(`${userName} → OOO (${dateStr})`, 'success')
    refreshWeek()
    refreshOoo()
  }, [userName, addToast, refreshWeek, refreshOoo])

  const handleMyWeekWfhRemove = useCallback(async (id: string, _dateStr: string) => {
    await fetch(`${API}/wfh/${id}`, { method: 'DELETE' })
    addToast('WFH removed', 'info')
    refreshWeek()
    refreshWfh()
  }, [addToast, refreshWeek, refreshWfh])

  const handleMyWeekOooRemove = useCallback(async (id: string, _dateStr: string) => {
    await fetch(`${API}/ooo/${id}`, { method: 'DELETE' })
    addToast('OOO removed', 'info')
    refreshWeek()
    refreshOoo()
  }, [addToast, refreshWeek, refreshOoo])

  const handleMyWeekReservationRemove = useCallback(async (id: string, _dateStr: string) => {
    await fetch(`${API}/reservations/${id}`, { method: 'DELETE' })
    addToast('Desk released', 'info')
    refreshWeek()
    refresh()
  }, [addToast, refreshWeek, refresh])

  // --- Global refresh ---

  const handleRefresh = useCallback(() => {
    refresh()
    refreshWfh()
    refreshOoo()
    refreshWeek()
  }, [refresh, refreshWfh, refreshOoo, refreshWeek])

  return (
    <div className="min-h-screen bg-matrix-dark scanlines crt-noise flex flex-col">
      <Header onRefresh={handleRefresh} loading={loading} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-8">

        {/* My Week */}
        <section>
          <MyWeekSection
            userName={userName}
            days={weekDays}
            loading={weekLoading}
            onSetName={setUserName}
            onClearName={() => setUserName(null)}
            onAddWfh={handleMyWeekWfhAdd}
            onAddOoo={handleMyWeekOooAdd}
            onRemoveWfh={handleMyWeekWfhRemove}
            onRemoveOoo={handleMyWeekOooRemove}
            onRemoveReservation={handleMyWeekReservationRemove}
            onNavigateToDate={handleNavigateToDate}
          />
        </section>

        {/* Calendar */}
        <section>
          <Calendar selectedDate={selectedDate} onSelectDate={handleSelectDate} />
        </section>

        {/* WFH + OOO */}
        {selectedDate && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PresenceSection
              title="WORK_FROM_HOME"
              icon="⌂"
              badge="WFH"
              emptyText="No one is working from home"
              entries={wfhEntries}
              loading={wfhLoading}
              onAdd={handleWfhAdd}
              onRemove={handleWfhRemove}
            />
            <PresenceSection
              title="OUT_OF_OFFICE"
              icon="✈"
              badge="OOO"
              emptyText="No one is out of office"
              entries={oooEntries}
              loading={oooLoading}
              onAdd={handleOooAdd}
              onRemove={handleOooRemove}
            />
          </section>
        )}

        {/* Error display */}
        {error && (
          <div className="border border-red-800 bg-red-950/20 px-4 py-3 rounded-sm text-red-400 text-xs tracking-wide animate-slide-up">
            ⚠ {error}
          </div>
        )}

        {/* Floor plan */}
        {selectedDate ? (
          <section ref={floorPlanRef}>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-matrix-border" />
              <span className="text-[10px] text-matrix-mid tracking-widest px-2">
                FLOOR_PLAN // {format(selectedDate, 'EEEE, MMMM d').toUpperCase()}
              </span>
              <div className="h-px flex-1 bg-matrix-border" />
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="text-matrix-green text-4xl animate-spin">◌</div>
                <div className="text-matrix-mid text-xs tracking-widest">FETCHING_RESERVATIONS...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {DESK_LAYOUT.map((area) => (
                  <DeskArea
                    key={area.id}
                    area={area}
                    reservations={reservations}
                    onDeskClick={handleDeskClick}
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-6 border border-dashed border-matrix-border rounded-sm">
            <div className="text-matrix-border text-5xl">⬡</div>
            <div className="text-center space-y-1">
              <p className="text-matrix-mid text-sm tracking-widest">SELECT A DATE TO VIEW DESK AVAILABILITY</p>
              <p className="text-matrix-border text-xs tracking-wider">Booking window: today through the next 7 days</p>
            </div>
            <div className="flex items-center gap-2 text-[9px] text-matrix-border tracking-widest">
              <span className="animate-blink">▸</span>
              <span>AWAITING INPUT...</span>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-matrix-border bg-matrix-black px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[9px] text-matrix-border tracking-widest">
          <span>BORINGDESKSELECTOR.COM // DESK RESERVATION SYSTEM</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-matrix-green animate-pulse" />
            ALL SYSTEMS NOMINAL
          </span>
        </div>
      </footer>

      {modal && selectedDate && (
        <ReservationModal
          desk={modal.desk}
          date={selectedDate}
          existingReservation={modal.reservation}
          defaultName={userName ?? undefined}
          onConfirm={handleConfirm}
          onDelete={modal.reservation ? handleDelete : undefined}
          onClose={() => setModal(null)}
        />
      )}

      <Toast toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}
