import type { TFunction } from 'i18next'

export function tArray<T = string>(t: TFunction, key: string): T[] {
  const result = t(key, { returnObjects: true })
  return Array.isArray(result) ? (result as T[]) : []
}
