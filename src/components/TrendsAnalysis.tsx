'use client'

import { TrendingUp, TrendingDown, Minus, Clock, Star, Zap } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { format, subDays, isAfter, getDay } from 'date-fns'

export default function TrendsAnalysis() {
  const { sleepLogs, settings } = useStore()

  // Get recent logs (last 30 days)
  const recentLogs = sleepLogs.filter(log => 
    isAfter(new Date(log.bedTime), subDays(new Date(), 30))
  )

  // Best sleep day of the week
  const dayStats: Record<number, { total: number; count: number }> = {}
  recentLogs.forEach(log => {
    const day = getDay(new Date(log.bedTime))
    if (!dayStats[day]) dayStats[day] = { total: 0, count: 0 }
    dayStats[day].total += log.sleepScore
    dayStats[day].count++
  })

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  let bestDay = { day: '', avgScore: 0 }
  Object.entries(dayStats).forEach(([day, { total, count }]) => {
    const avg = total / count
    if (avg > bestDay.avgScore) {
      bestDay = { day: dayNames[parseInt(day)], avgScore: Math.round(avg) }
    }
  })

  // Average bedtime
  const avgBedtimeMinutes = recentLogs.length > 0
    ? recentLogs.reduce((sum, log) => {
        const date = new Date(log.bedTime)
        return sum + date.getHours() * 60 + date.getMinutes()
      }, 0) / recentLogs.length
    : 0

  const avgBedtimeHour = Math.floor(avgBedtimeMinutes / 60)
  const avgBedtimeMin = Math.round(avgBedtimeMinutes % 60)
  const avgBedtime = `${avgBedtimeHour.toString().padStart(2, '0')}:${avgBedtimeMin.toString().padStart(2, '0')}`

  // Quality trend
  const last7Days = recentLogs.slice(0, 7)
  const prev7Days = recentLogs.slice(7, 14)

  const recentAvgQuality = last7Days.length > 0
    ? last7Days.reduce((sum, log) => sum + log.quality, 0) / last7Days.length
    : 0
  const prevAvgQuality = prev7Days.length > 0
    ? prev7Days.reduce((sum, log) => sum + log.quality, 0) / prev7Days.length
    : 0

  const qualityTrend = recentAvgQuality - prevAvgQuality

  // Consistency score (how regular is bedtime)
  const bedtimes = recentLogs.map(log => {
    const date = new Date(log.bedTime)
    return date.getHours() * 60 + date.getMinutes()
  })
  const avgBedtime2 = bedtimes.reduce((a, b) => a + b, 0) / bedtimes.length || 0
  const variance = bedtimes.reduce((sum, bt) => sum + Math.pow(bt - avgBedtime2, 2), 0) / bedtimes.length || 0
  const stdDev = Math.sqrt(variance)
  const consistencyScore = Math.max(0, Math.round(100 - stdDev / 3))

  const insights = [
    {
      icon: Clock,
      title: 'Average Bedtime',
      value: avgBedtime,
      detail: 'Based on last 30 days',
      color: 'text-blue-500',
    },
    {
      icon: Star,
      title: 'Best Sleep Day',
      value: bestDay.day || 'N/A',
      detail: bestDay.avgScore ? `${bestDay.avgScore}/100 avg score` : 'Log more to see',
      color: 'text-yellow-500',
    },
    {
      icon: Zap,
      title: 'Consistency',
      value: `${consistencyScore}%`,
      detail: consistencyScore > 70 ? 'Regular schedule' : 'Try consistent times',
      color: 'text-purple-500',
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-indigo-500" />
        Trends & Insights
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {insights.map((insight, i) => (
          <div key={i} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <insight.icon className={`w-5 h-5 ${insight.color} mb-2`} />
            <p className="text-xs text-gray-500 dark:text-gray-400">{insight.title}</p>
            <p className="text-2xl font-bold">{insight.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{insight.detail}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          {qualityTrend > 0.3 ? (
            <TrendingUp className="w-5 h-5 text-green-500" />
          ) : qualityTrend < -0.3 ? (
            <TrendingDown className="w-5 h-5 text-red-500" />
          ) : (
            <Minus className="w-5 h-5 text-gray-500" />
          )}
          <span className="font-medium">Quality Trend</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {qualityTrend > 0.3 
            ? "Your sleep quality is improving! Keep up the great work."
            : qualityTrend < -0.3
            ? "Sleep quality has dipped. Check your bedtime routine."
            : "Your sleep quality is stable. Aim for consistency."}
        </p>
      </div>

      {recentLogs.length < 7 && (
        <p className="text-xs text-gray-500 mt-4 text-center">
          Log more nights for better insights!
        </p>
      )}
    </div>
  )
}
