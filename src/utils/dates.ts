import { DateTime } from 'luxon'

export type FixedDates<T extends { createdAt: string; updatedAt: string }> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt: DateTime
  updatedAt: DateTime
}

export const fixDates = <T extends { createdAt: string; updatedAt: string }>(
  entry: T,
): Omit<T, 'createdAt' | 'updatedAt'> & { createdAt: DateTime; updatedAt: DateTime } => ({
  ...entry,
  createdAt: DateTime.fromISO(entry.createdAt),
  updatedAt: DateTime.fromISO(entry.updatedAt),
})
