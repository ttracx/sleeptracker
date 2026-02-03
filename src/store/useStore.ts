import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SleepLog {
  id: string
  bedTime: string
  wakeTime: string
  quality: number
  notes: string
  duration: number
  sleepScore: number
}

interface UserSettings {
  targetSleepHours: number
  bedtimeReminder: string | null
  darkMode: boolean
  timezone: string
}

interface AppState {
  userId: string | null
  sleepLogs: SleepLog[]
  settings: UserSettings
  isLoading: boolean
  
  setUserId: (id: string) => void
  setSleepLogs: (logs: SleepLog[]) => void
  addSleepLog: (log: SleepLog) => void
  updateSettings: (settings: Partial<UserSettings>) => void
  toggleDarkMode: () => void
  setLoading: (loading: boolean) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      userId: null,
      sleepLogs: [],
      settings: {
        targetSleepHours: 8,
        bedtimeReminder: '22:00',
        darkMode: true,
        timezone: 'America/Chicago',
      },
      isLoading: false,
      
      setUserId: (id) => set({ userId: id }),
      setSleepLogs: (logs) => set({ sleepLogs: logs }),
      addSleepLog: (log) => set((state) => ({ 
        sleepLogs: [log, ...state.sleepLogs] 
      })),
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      toggleDarkMode: () => set((state) => ({
        settings: { ...state.settings, darkMode: !state.settings.darkMode }
      })),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'sleeptracker-storage',
    }
  )
)
