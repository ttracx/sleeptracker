'use client'

import { Sparkles } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { isAfter, subDays } from 'date-fns'

export default function SleepScore() {
  const { sleepLogs } = useStore()

  // Calculate average score from last 7 days
  const recentLogs = sleepLogs.filter(log => 
    isAfter(new Date(log.bedTime), subDays(new Date(), 7))
  )

  const avgScore = recentLogs.length > 0
    ? Math.round(recentLogs.reduce((sum, log) => sum + log.sleepScore, 0) / recentLogs.length)
    : 0

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', message: 'Exceptional!', color: 'from-green-400 to-emerald-500' }
    if (score >= 80) return { grade: 'A', message: 'Excellent sleep!', color: 'from-green-500 to-teal-500' }
    if (score >= 70) return { grade: 'B', message: 'Good work!', color: 'from-blue-400 to-indigo-500' }
    if (score >= 60) return { grade: 'C', message: 'Room to improve', color: 'from-yellow-400 to-orange-500' }
    if (score >= 50) return { grade: 'D', message: 'Needs attention', color: 'from-orange-400 to-red-500' }
    return { grade: 'F', message: 'Focus on sleep!', color: 'from-red-400 to-red-600' }
  }

  const { grade, message, color } = getScoreGrade(avgScore)

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (avgScore / 100) * circumference

  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 shadow-lg text-white`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          Sleep Score
        </h2>
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
          Last 7 days
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">{avgScore}</span>
            <span className="text-sm opacity-80">/100</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="text-5xl font-black mb-1">{grade}</div>
          <p className="text-lg font-medium opacity-90">{message}</p>
          <p className="text-sm opacity-70 mt-2">
            {recentLogs.length} nights tracked
          </p>
        </div>
      </div>

      {recentLogs.length === 0 && (
        <p className="text-center text-sm opacity-80 mt-4">
          Start logging to see your sleep score!
        </p>
      )}
    </div>
  )
}
