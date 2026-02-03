'use client'

import { useState } from 'react'
import { Settings as SettingsIcon, Moon, Bell, Clock, X } from 'lucide-react'
import { useStore } from '@/store/useStore'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const { settings, updateSettings } = useStore()
  const [targetHours, setTargetHours] = useState(settings.targetSleepHours)
  const [reminder, setReminder] = useState(settings.bedtimeReminder || '')

  const handleSave = () => {
    updateSettings({
      targetSleepHours: targetHours,
      bedtimeReminder: reminder || null,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-indigo-500" />
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Target Sleep Hours
            </label>
            <input
              type="range"
              min="5"
              max="12"
              step="0.5"
              value={targetHours}
              onChange={(e) => setTargetHours(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>5h</span>
              <span className="font-bold text-indigo-500">{targetHours}h</span>
              <span>12h</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Bedtime Reminder
            </label>
            <input
              type="time"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
            <p className="text-xs text-gray-500 mt-1">
              Get a reminder to start winding down
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-indigo-500" />
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-xs text-gray-500">Easier on your eyes at night</p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className={`w-12 h-6 rounded-full transition ${
                settings.darkMode ? 'bg-indigo-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition transform ${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:opacity-90 transition"
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}
