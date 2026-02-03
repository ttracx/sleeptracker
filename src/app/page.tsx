'use client'

import { useEffect, useState } from 'react'
import { Moon, Settings as SettingsIcon, Crown, Sparkles } from 'lucide-react'
import { useStore } from '@/store/useStore'
import SleepLogForm from '@/components/SleepLogForm'
import SleepChart from '@/components/SleepChart'
import SleepScore from '@/components/SleepScore'
import SleepDebtCalculator from '@/components/SleepDebtCalculator'
import TrendsAnalysis from '@/components/TrendsAnalysis'
import RecentLogs from '@/components/RecentLogs'
import Settings from '@/components/Settings'

export default function Home() {
  const { settings, toggleDarkMode, setSleepLogs } = useStore()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Fetch sleep logs from API
    fetch('/api/sleep-logs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSleepLogs(data.map((log: any) => ({
            ...log,
            bedTime: log.bedTime,
            wakeTime: log.wakeTime,
          })))
        }
      })
      .catch(console.error)
  }, [setSleepLogs])

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('dark', settings.darkMode)
    }
  }, [settings.darkMode, mounted])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Moon className="w-12 h-12 text-indigo-500 animate-pulse" />
      </div>
    )
  }

  return (
    <main className={`min-h-screen transition-colors duration-300 ${
      settings.darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SleepTracker</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Track • Analyze • Improve</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleDarkMode()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              title="Toggle dark mode"
            >
              <Moon className={`w-5 h-5 ${settings.darkMode ? 'text-indigo-400' : 'text-gray-500'}`} />
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
            <button
              onClick={async () => {
                const res = await fetch('/api/checkout', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: 'demo-user' }),
                })
                const { url } = await res.json()
                if (url) window.location.href = url
              }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl font-medium hover:opacity-90 transition"
            >
              <Crown className="w-4 h-4" />
              Go Pro
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <SleepScore />
          </div>
          <SleepDebtCalculator />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SleepLogForm />
          <SleepChart />
        </div>

        {/* Trends & Recent */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrendsAnalysis />
          <RecentLogs />
        </div>

        {/* Pro Banner (Mobile) */}
        <div className="sm:hidden mt-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Crown className="w-8 h-8" />
            <div>
              <h3 className="font-bold text-lg">Upgrade to Pro</h3>
              <p className="text-sm opacity-90">$3.99/month</p>
            </div>
          </div>
          <ul className="text-sm space-y-1 mb-4 opacity-90">
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Advanced analytics
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Export data
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Priority support
            </li>
          </ul>
          <button
            onClick={async () => {
              const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'demo-user' }),
              })
              const { url } = await res.json()
              if (url) window.location.href = url
            }}
            className="w-full py-3 bg-white text-orange-500 rounded-xl font-bold hover:bg-gray-100 transition"
          >
            Get Pro Now
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} SleepTracker by VibeCaaS. Sleep better, live better.</p>
        </footer>
      </div>

      <Settings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </main>
  )
}
