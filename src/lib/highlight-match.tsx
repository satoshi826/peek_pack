import { normalizeForSearch } from './normalize-search'

interface HighlightMatchProps {
  text: string
  query: string
}

/**
 * クエリにマッチした箇所を <mark> でハイライト表示するコンポーネント
 */
export function HighlightMatch({ text, query }: HighlightMatchProps) {
  if (!query.trim()) {
    return <>{text}</>
  }

  const tokens = query.trim().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) {
    return <>{text}</>
  }

  // 正規化されたテキスト上でマッチ位置を見つけ、元テキスト上にマッピング
  const normalizedText = normalizeForSearch(text)
  const ranges: { start: number, end: number }[] = []

  for (const token of tokens) {
    const normalizedToken = normalizeForSearch(token)
    let searchFrom = 0
    while (searchFrom < normalizedText.length) {
      const idx = normalizedText.indexOf(normalizedToken, searchFrom)
      if (idx === -1) break
      ranges.push({ start: idx, end: idx + normalizedToken.length })
      searchFrom = idx + 1
    }
  }

  if (ranges.length === 0) {
    return <>{text}</>
  }

  // 範囲をマージ
  ranges.sort((a, b) => a.start - b.start)
  const merged: { start: number, end: number }[] = [ranges[0]]
  for (let i = 1; i < ranges.length; i++) {
    const last = merged[merged.length - 1]
    if (ranges[i].start <= last.end) {
      last.end = Math.max(last.end, ranges[i].end)
    }
    else {
      merged.push(ranges[i])
    }
  }

  // 元テキストの文字位置にマッピング（正規化で文字数が変わる場合への対応）
  // NFD正規化でアクセント記号が分離するため、元テキストの各文字が正規化テキスト上でどの位置に対応するかを計算
  const charMap: number[] = [] // charMap[normalizedIdx] = originalIdx
  let normalizedIdx = 0
  for (let i = 0; i < text.length; i++) {
    const originalChar = text[i]
    const normalizedChar = normalizeForSearch(originalChar)
    for (let j = 0; j < normalizedChar.length; j++) {
      charMap[normalizedIdx + j] = i
    }
    normalizedIdx += normalizedChar.length
  }

  const parts: React.ReactNode[] = []
  let lastEnd = 0

  for (const { start, end } of merged) {
    const origStart = charMap[start] ?? start
    const origEnd = (charMap[end - 1] ?? end - 1) + 1

    if (origStart > lastEnd) {
      parts.push(text.slice(lastEnd, origStart))
    }
    parts.push(
      <mark key={`${origStart}-${origEnd}`} className="bg-yellow-200 dark:bg-yellow-800 rounded-sm">
        {text.slice(origStart, origEnd)}
      </mark>,
    )
    lastEnd = origEnd
  }

  if (lastEnd < text.length) {
    parts.push(text.slice(lastEnd))
  }

  return <>{parts}</>
}
