'use client'

import { Moon, Sun, Star, ChevronRight } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { formatDuration } from '@/lib/utils'
import { format } from 'date-fns'

export default function RecentLogs() {
  const { sleepLogs } = useStore()
  const recentLogs = sleepLogs.slice(0, 5)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Moon className="w-6 h-6 text-indigo-500" />
        Recent Sleep Logs
      </h2>

      {recentLogs.length > 0 ? (
        <div className="space-y-3">
          {recentLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
            >
              <div className="flex-1">
                <p className="font-medium">
                  {format(new Date(log.bedTime), 'EEE, MMM d')}
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Moon className="w-3 h-3" />
                    {format(new Date(log.bedTime), 'h:mm a')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Sun className="w-3 h-3" />
                    {format(new Date(log.wakeTime), 'h:mm a')}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatDuration(log.duration)}</p>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= log.quality
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-sm font-bold ${getScoreColor(log.sleepScore)}`}>
                    {log.sleepScore}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Moon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No sleep logs yet</p>
          <p className="text-sm">Start tracking your sleep!</p>
        </div>
      )}
    </div>
  )
}
