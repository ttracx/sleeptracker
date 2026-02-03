'use client'

import { useState } from 'react'
import { Moon, Sun, Star, Save } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { calculateSleepScore } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid'

export default function SleepLogForm() {
  const { addSleepLog, settings } = useStore()
  const [bedTime, setBedTime] = useState('')
  const [wakeTime, setWakeTime] = useState('')
  const [quality, setQuality] = useState(3)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bedTime || !wakeTime) return

    setSaving(true)

    const bedDate = new Date(bedTime)
    const wakeDate = new Date(wakeTime)
    let duration = Math.round((wakeDate.getTime() - bedDate.getTime()) / 60000)
    if (duration < 0) duration += 24 * 60 // Handle overnight sleep

    const sleepScore = calculateSleepScore(duration, quality, settings.targetSleepHours)

    const newLog = {
      id: uuidv4(),
      bedTime,
      wakeTime,
      quality,
      notes,
      duration,
      sleepScore,
    }

    try {
      await fetch('/api/sleep-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog),
      })
      addSleepLog(newLog)
      setBedTime('')
      setWakeTime('')
      setQuality(3)
      setNotes('')
    } catch (error) {
      console.error('Failed to save sleep log:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Moon className="w-6 h-6 text-indigo-500" />
        Log Your Sleep
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Moon className="w-4 h-4" /> Bedtime
          </label>
          <input
            type="datetime-local"
            value={bedTime}
            onChange={(e) => setBedTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Sun className="w-4 h-4" /> Wake Time
          </label>
          <input
            type="datetime-local"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          <Star className="w-4 h-4" /> Sleep Quality
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => setQuality(rating)}
              className={`flex-1 py-3 rounded-xl font-medium transition ${
                quality === rating
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {rating}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Poor</span>
          <span>Excellent</span>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did you feel? Any dreams?"
          className="w-full px-4 py-3 rounded-xl border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={saving || !bedTime || !wakeTime}
        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
      >
        <Save className="w-5 h-5" />
        {saving ? 'Saving...' : 'Save Sleep Log'}
      </button>
    </form>
  )
}
