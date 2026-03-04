import { format, addDays, isToday, isSameDay } from 'date-fns'

interface CalendarProps {
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
}

export function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
  const today = new Date()
  const days = Array.from({ length: 8 }, (_, i) => addDays(today, i))

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-matrix-green text-xs font-bold tracking-widest text-glow-sm">
          &gt; SELECT_DATE
        </span>
        <span className="text-matrix-mid text-xs">
          [BOOKING WINDOW: TODAY +7 DAYS]
        </span>
      </div>

      <div className="grid grid-cols-8 gap-2">
        {days.map((day) => {
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
          const today_ = isToday(day)

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={`
                relative flex flex-col items-center justify-center p-3 border
                transition-all duration-150 desk-cell rounded-sm
                ${isSelected
                  ? 'border-matrix-green bg-matrix-surface shadow-glow selected-day text-matrix-green'
                  : today_
                  ? 'border-matrix-dim bg-matrix-surface text-matrix-bright hover:border-matrix-bright hover:shadow-glow-sm'
                  : 'border-matrix-border bg-matrix-surface text-matrix-mid hover:border-matrix-green hover:text-matrix-green hover:shadow-glow-sm'
                }
              `}
            >
              {today_ && (
                <span className="absolute top-1 right-1 text-[8px] text-matrix-green text-glow-sm font-bold tracking-wider">
                  NOW
                </span>
              )}
              <span className="text-[10px] tracking-widest uppercase mb-1 opacity-70">
                {format(day, 'EEE')}
              </span>
              <span className={`text-xl font-bold ${isSelected ? 'text-glow' : ''}`}>
                {format(day, 'd')}
              </span>
              <span className="text-[9px] tracking-widest opacity-60 mt-1">
                {format(day, 'MMM')}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
