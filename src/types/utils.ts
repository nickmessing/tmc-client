/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
export type DePromise<T extends Promise<any>> = T extends Promise<infer R> ? R : any
export type EmptyObject = Record<string, never>
export type AnyObject = {}
export type ExcludeDb<T extends { id: string; createdAt: string; updatedAt: string }> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt'
>
