import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateSleepScore(
  durationMinutes: number,
  quality: number,
  targetHours: number = 8
): number {
  const targetMinutes = targetHours * 60
  const durationScore = Math.min(100, (durationMinutes / targetMinutes) * 100)
  const qualityScore = (quality / 5) * 100
  
  // Weight: 60% duration, 40% quality
  const score = Math.round(durationScore * 0.6 + qualityScore * 0.4)
  return Math.min(100, Math.max(0, score))
}

export function calculateSleepDebt(
  actualMinutes: number[],
  targetHours: number = 8
): number {
  const targetMinutes = targetHours * 60
  const totalDebt = actualMinutes.reduce((debt, actual) => {
    return debt + Math.max(0, targetMinutes - actual)
  }, 0)
  return Math.round(totalDebt / 60 * 10) / 10 // Return in hours, 1 decimal
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

export function getDayOfWeek(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}
