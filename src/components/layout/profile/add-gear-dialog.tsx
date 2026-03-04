'use client'

import { useState, useEffect, useTransition, useCallback, useRef } from 'react'
import { Command } from 'cmdk'
import { Plus, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui_shadcn/select'
import { createUserGearAction, searchMasters, getMasterFilterOptions } from '@/actions/user-gear.actions'
import type { MasterSearchResult, FilterOptions } from '@/types/master'
import type { GearStatus, GearType, FocusType } from '@/db/validation'
import { HighlightMatch } from '@/lib/highlight-match'

interface AddGearDialogProps {
  gearType: GearType
  status: GearStatus
  userId: string
}

const ALL_VALUE = '__all__'

export function AddGearDialog({ gearType, status, userId }: AddGearDialogProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const [isSearching, setIsSearching] = useState(false)

  const [results, setResults] = useState<MasterSearchResult[]>([])
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)

  // フィルタ状態
  const [makerId, setMakerId] = useState<string>('')
  const [lensMount, setLensMount] = useState<string>('')
  const [sensorSize, setSensorSize] = useState<string>('')
  const [isCompact, setIsCompact] = useState<string>('')
  const [focalLength, setFocalLength] = useState<string>('')
  const [maxAperture, setMaxAperture] = useState<string>('')
  const [focusType, setFocusType] = useState<string>('')

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const doSearch = useCallback(async (searchQuery?: string) => {
    setIsSearching(true)
    try {
      const data = await searchMasters({
        gearType,
        query: (searchQuery ?? query) || undefined,
        makerId: makerId || undefined,
        lensMount: lensMount || undefined,
        sensorSize: sensorSize || undefined,
        isCompact: isCompact === '' ? undefined : isCompact === 'true',
        focalLength: focalLength || undefined,
        maxAperture: maxAperture || undefined,
        focusType: (focusType || undefined) as FocusType | undefined,
      })
      setResults(data)
    }
    finally {
      setIsSearching(false)
    }
  }, [gearType, query, makerId, lensMount, sensorSize, isCompact, focalLength, maxAperture, focusType])

  // ダイアログ open 時にフィルタ選択肢と初期結果を取得
  useEffect(() => {
    if (!open) return
    getMasterFilterOptions(gearType).then(setFilterOptions)
    doSearch('')
  }, [open, gearType]) // eslint-disable-line react-hooks/exhaustive-deps

  // フィルタ変更時に即検索
  useEffect(() => {
    if (!open) return
    doSearch()
  }, [makerId, lensMount, sensorSize, isCompact, focalLength, maxAperture, focusType]) // eslint-disable-line react-hooks/exhaustive-deps

  // テキスト入力時にデバウンス検索
  function handleQueryChange(value: string) {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      doSearch(value)
    }, 300)
  }

  function handleSelect(id: string) {
    startTransition(async () => {
      await createUserGearAction({
        userId,
        gearType,
        masterId: id,
        status,
      })
      setOpen(false)
      resetState()
    })
  }

  function resetState() {
    setQuery('')
    setResults([])
    setFilterOptions(null)
    setMakerId('')
    setLensMount('')
    setSensorSize('')
    setIsCompact('')
    setFocalLength('')
    setMaxAperture('')
    setFocusType('')
  }

  // メーカー別グルーピング
  const grouped = results.reduce<Record<string, MasterSearchResult[]>>((acc, item) => {
    const key = item.makerName
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) resetState()
      }}
    >
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus />
        追加
      </Button>
      <DialogContent className="sm:max-w-140">
        <DialogHeader>
          <DialogTitle>
            {gearType === 'camera' ? 'カメラ' : 'レンズ'}
            を追加
          </DialogTitle>
          <DialogDescription>名前やメーカーで検索、またはフィルタで絞り込み</DialogDescription>
        </DialogHeader>

        {/* フィルタ行 */}
        {filterOptions && (
          <div className="flex flex-wrap gap-2">
            <Select value={makerId || ALL_VALUE} onValueChange={v => setMakerId(v === ALL_VALUE ? '' : v)}>
              <SelectTrigger size="sm">
                <SelectValue placeholder="メーカー" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>全メーカー</SelectItem>
                {filterOptions.makers.map(m => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                    {m.nameJa ? ` (${m.nameJa})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={lensMount || ALL_VALUE} onValueChange={v => setLensMount(v === ALL_VALUE ? '' : v)}>
              <SelectTrigger size="sm">
                <SelectValue placeholder="マウント" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>全マウント</SelectItem>
                {filterOptions.lensMounts.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {gearType === 'camera' && filterOptions.sensorSizes && (
              <>
                <Select value={sensorSize || ALL_VALUE} onValueChange={v => setSensorSize(v === ALL_VALUE ? '' : v)}>
                  <SelectTrigger size="sm">
                    <SelectValue placeholder="センサー" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_VALUE}>全サイズ</SelectItem>
                    {filterOptions.sensorSizes.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={isCompact || ALL_VALUE} onValueChange={v => setIsCompact(v === ALL_VALUE ? '' : v)}>
                  <SelectTrigger size="sm">
                    <SelectValue placeholder="タイプ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_VALUE}>全タイプ</SelectItem>
                    <SelectItem value="false">一眼</SelectItem>
                    <SelectItem value="true">コンパクト</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}

            {gearType === 'lens' && (
              <>
                {filterOptions.focalLengths && (
                  <Select value={focalLength || ALL_VALUE} onValueChange={v => setFocalLength(v === ALL_VALUE ? '' : v)}>
                    <SelectTrigger size="sm">
                      <SelectValue placeholder="焦点距離" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_VALUE}>全焦点距離</SelectItem>
                      {filterOptions.focalLengths.map(f => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {filterOptions.maxApertures && (
                  <Select value={maxAperture || ALL_VALUE} onValueChange={v => setMaxAperture(v === ALL_VALUE ? '' : v)}>
                    <SelectTrigger size="sm">
                      <SelectValue placeholder="開放F値" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_VALUE}>全F値</SelectItem>
                      {filterOptions.maxApertures.map(a => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {filterOptions.focusTypes && (
                  <Select value={focusType || ALL_VALUE} onValueChange={v => setFocusType(v === ALL_VALUE ? '' : v)}>
                    <SelectTrigger size="sm">
                      <SelectValue placeholder="AF/MF" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_VALUE}>全タイプ</SelectItem>
                      {filterOptions.focusTypes.map(f => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </>
            )}
          </div>
        )}

        {/* cmdk コマンドメニュー */}
        <Command shouldFilter={false} className="border rounded-lg">
          <Command.Input
            placeholder="検索..."
            value={query}
            onValueChange={handleQueryChange}
            className="w-full border-b px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <Command.List className="max-h-60 overflow-y-auto p-1">
            {isSearching && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            )}
            {!isSearching && results.length === 0 && (
              <Command.Empty className="px-3 py-4 text-center text-sm text-muted-foreground">
                該当する
                {gearType === 'camera' ? 'カメラ' : 'レンズ'}
                が見つかりません
              </Command.Empty>
            )}
            {!isSearching && Object.entries(grouped).map(([makerName, items]) => (
              <Command.Group
                key={makerName}
                heading={makerName}
                className="**:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground"
              >
                {items.map(item => (
                  <Command.Item
                    key={item.id}
                    value={item.id}
                    onSelect={() => handleSelect(item.id)}
                    disabled={isPending}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors data-[selected=true]:bg-foreground/5 aria-disabled:opacity-50"
                  >
                    <div>
                      <span className="font-medium">
                        <HighlightMatch text={item.name} query={query} />
                      </span>
                      {item.lensMount && (
                        <span className="ml-2 text-xs text-muted-foreground">{item.lensMount}</span>
                      )}
                    </div>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      {item.sensorSize && <span>{item.sensorSize}</span>}
                      {item.focalLength && <span>{item.focalLength}</span>}
                      {item.maxAperture && <span>{item.maxAperture}</span>}
                      {item.focusType && <span>{item.focusType}</span>}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
