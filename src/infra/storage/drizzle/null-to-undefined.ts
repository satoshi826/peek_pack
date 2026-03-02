/**
 * Drizzle の null 値をドメインエンティティの undefined に変換するヘルパー
 */

type NullToUndefined<T> = {
  [K in keyof T]: null extends T[K] ? Exclude<T[K], null> | undefined : T[K]
}

export function nullToUndefined<T extends Record<string, unknown>>(row: T): NullToUndefined<T> {
  const result = { ...row }
  for (const key in result) {
    if (result[key] === null) {
      (result as Record<string, unknown>)[key] = undefined
    }
  }
  return result as NullToUndefined<T>
}
