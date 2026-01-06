/**
 * @param targetDateStr The target date string (e.g., '2026-02-27')
 * @returns The number of days remaining. Returns 0 if the date has passed.
 */
export const getDaysRemaining = (targetDateStr: string): number => {
  const targetDate = new Date(targetDateStr)
  const currentDate = new Date()

  targetDate.setHours(0, 0, 0, 0)
  currentDate.setHours(0, 0, 0, 0)

  const diffTime = targetDate.getTime() - currentDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays > 0 ? diffDays : 0
}
