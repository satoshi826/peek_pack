/**
 * 検索文字正規化ユーティリティ
 * "a7" → "α7 IV" や "voigtlander" → "Voigtländer" のような
 * ドメイン固有のあいまい検索を実現する
 */

/** ドメイン固有の文字置換マップ（正規化後の形式 → 検索対象の正規化形式） */
const DOMAIN_REPLACEMENTS: [RegExp, string][] = [
  [/α/g, 'a'],
  [/ä/g, 'a'],
  [/ö/g, 'o'],
  [/ü/g, 'u'],
  [/é/g, 'e'],
  [/ë/g, 'e'],
]

/**
 * 検索用に文字列を正規化する
 * - ドメイン固有の文字置換（α→a, ä→a 等）
 * - Unicode NFD によるアクセント除去
 * - 小文字化
 */
export function normalizeForSearch(input: string): string {
  let result = input.toLowerCase()

  // ドメイン固有の置換
  for (const [pattern, replacement] of DOMAIN_REPLACEMENTS) {
    result = result.replace(pattern, replacement)
  }

  // Unicode NFD + アクセント記号除去
  result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  return result
}

/**
 * スペース区切りの AND トークンマッチ
 * すべてのトークンが対象テキストに含まれる場合に true
 */
export function matchTokens(text: string, query: string): boolean {
  if (!query.trim()) return true

  const normalizedText = normalizeForSearch(text)
  const tokens = query.trim().split(/\s+/).map(normalizeForSearch)

  return tokens.every(token => normalizedText.includes(token))
}
