'use client'

import { Battery, BatteryLow, BatteryWarning, TrendingDown, TrendingUp } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { calculateSleepDebt, formatDuration } from '@/lib/utils'
import { subDays, isAfter } from 'date-fns'

export default function SleepDebtCalculator() {
  const { sleepLogs, settings } = useStore()

  // Calculate sleep debt for last 7 days
  const last7Days = sleepLogs
    .filter(log => isAfter(new Date(log.bedTime), subDays(new Date(), 7)))
    .map(log => log.duration)

  const sleepDebt = calculateSleepDebt(last7Days, settings.targetSleepHours)
  
  // Calculate trend (comparing this week to last week)
  const last14to7Days = sleepLogs
    .filter(log => {
      const date = new Date(log.bedTime)
      return isAfter(date, subDays(new Date(), 14)) && !isAfter(date, subDays(new Date(), 7))
    })
    .map(log => log.duration)

  const lastWeekDebt = calculateSleepDebt(last14to7Days, settings.targetSleepHours)
  const trend = lastWeekDebt - sleepDebt // Positive = improving

  const recommendations: Record<'low' | 'moderate' | 'high', string> = {
    low: "Great job! Your sleep is on track. Keep up the healthy habits!",
    moderate: "Consider going to bed 30 minutes earlier this week to catch up.",
    high: "You have significant sleep debt. Try to add an extra hour of sleep each night."
  }

  const getDebtLevel = (): { level: 'low' | 'moderate' | 'high', color: string, bg: string, icon: typeof Battery } => {
    if (sleepDebt < 2) return { level: 'low', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30', icon: Battery }
    if (sleepDebt < 5) return { level: 'moderate', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: BatteryLow }
    return { level: 'high', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30', icon: BatteryWarning }
  }

  const { level, color, bg, icon: BatteryIcon } = getDebtLevel()

  return (
    <div className={`${bg} rounded-2xl p-6 shadow-lg`}>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BatteryIcon className={`w-6 h-6 ${color}`} />
        Sleep Debt
      </h2>

      <div className="flex items-end gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">This Week</p>
          <p className={`text-4xl font-bold ${color}`}>{sleepDebt}h</p>
        </div>
        {last14to7Days.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {trend > 0 ? (
              <>
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">Improving</span>
              </>
            ) : trend < 0 ? (
              <>
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-500">Worsening</span>
              </>
            ) : (
              <span className="text-sm text-gray-500">Stable</span>
            )}
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${
              level === 'low' ? 'bg-green-500' : level === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
            } transition-all duration-500`}
            style={{ width: `${Math.min(100, (sleepDebt / 10) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0h</span>
          <span>10h+</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
        💡 {recommendations[level]}
      </p>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500">
          Based on your target of {settings.targetSleepHours}h/night • Last 7 days
        </p>
      </div>
    </div>
  )
}
