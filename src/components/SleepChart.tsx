'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { BarChart3, TrendingUp } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { formatDuration, getDayOfWeek } from '@/lib/utils'
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'

type TimeRange = 'week' | 'month'

export default function SleepChart() {
  const { sleepLogs } = useStore()
  const [timeRange, setTimeRange] = useState<TimeRange>('week')
  const [chartType, setChartType] = useState<'duration' | 'score'>('duration')

  const getFilteredLogs = () => {
    const now = new Date()
    let start: Date, end: Date

    if (timeRange === 'week') {
      start = startOfWeek(now)
      end = endOfWeek(now)
    } else {
      start = startOfMonth(now)
      end = endOfMonth(now)
    }

    return sleepLogs
      .filter(log => {
        const logDate = new Date(log.bedTime)
        return isWithinInterval(logDate, { start, end })
      })
      .map(log => ({
        ...log,
        day: getDayOfWeek(new Date(log.bedTime)),
        date: format(new Date(log.bedTime), 'MMM d'),
        hours: Math.round(log.duration / 60 * 10) / 10,
      }))
      .reverse()
  }

  const data = getFilteredLogs()

  const avgDuration = data.length 
    ? Math.round(data.reduce((sum, d) => sum + d.duration, 0) / data.length)
    : 0
  const avgScore = data.length
    ? Math.round(data.reduce((sum, d) => sum + d.sleepScore, 0) / data.length)
    : 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-500" />
          Sleep Analytics
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              timeRange === 'week'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              timeRange === 'month'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl p-4 text-white">
          <p className="text-sm opacity-80">Avg Duration</p>
          <p className="text-2xl font-bold">{formatDuration(avgDuration)}</p>
        </div>
        <div className="flex-1 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white">
          <p className="text-sm opacity-80">Avg Score</p>
          <p className="text-2xl font-bold">{avgScore}/100</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setChartType('duration')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
            chartType === 'duration'
              ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
              : 'text-gray-500'
          }`}
        >
          Duration
        </button>
        <button
          onClick={() => setChartType('score')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
            chartType === 'score'
              ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
              : 'text-gray-500'
          }`}
        >
          Score
        </button>
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          {chartType === 'duration' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey={timeRange === 'week' ? 'day' : 'date'} fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={(value) => [`${value} hours`, 'Sleep']}
                contentStyle={{ 
                  backgroundColor: 'rgb(31, 41, 55)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey={timeRange === 'week' ? 'day' : 'date'} fontSize={12} />
              <YAxis fontSize={12} domain={[0, 100]} />
              <Tooltip 
                formatter={(value) => [`${value}/100`, 'Score']}
                contentStyle={{ 
                  backgroundColor: 'rgb(31, 41, 55)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="sleepScore" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      ) : (
        <div className="h-[250px] flex items-center justify-center text-gray-500">
          <p>No sleep data for this period. Start logging!</p>
        </div>
      )}
    </div>
  )
}
