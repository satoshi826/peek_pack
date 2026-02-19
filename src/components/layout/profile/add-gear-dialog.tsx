'use client'

import { useState, useTransition, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui_shadcn/input'
import { createUserGear } from '@/actions/user-gear.actions'
import type { GearStatus, GearType } from '@/domain/gear/user-gear.entity'

export interface MasterItem {
  id: string
  name: string
  makerName: string
}

interface AddGearDialogProps {
  gearType: GearType
  status: GearStatus
  userId: string
  masters: MasterItem[]
}

export function AddGearDialog({ gearType, status, userId, masters }: AddGearDialogProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  const filtered = useMemo(() => {
    if (!query.trim()) return masters
    const q = query.toLowerCase()
    return masters.filter(
      m => m.name.toLowerCase().includes(q) || m.makerName.toLowerCase().includes(q),
    )
  }, [query, masters])

  function handleSelect(master: MasterItem) {
    startTransition(async () => {
      await createUserGear({
        userId,
        gearType,
        masterId: master.id,
        status,
      })
      setOpen(false)
      setQuery('')
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) setQuery('')
      }}
    >
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus />
        追加
      </Button>
      <DialogContent className="sm:max-w-105">
        <DialogHeader>
          <DialogTitle>
            {gearType === 'camera' ? 'カメラ' : 'レンズ'}
            を追加
          </DialogTitle>
          <DialogDescription>名前またはメーカーで検索してください</DialogDescription>
        </DialogHeader>
        <Input
          placeholder="検索..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
        <ul className="max-h-60 overflow-y-auto space-y-1">
          {filtered.length > 0
            ? filtered.map(m => (
                <li key={m.id}>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleSelect(m)}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-foreground/5 disabled:opacity-50"
                  >
                    <span className="font-medium">{m.name}</span>
                    <span className="ml-2 text-muted-foreground">{m.makerName}</span>
                  </button>
                </li>
              ))
            : (
                <li className="px-3 py-4 text-center text-sm text-muted-foreground">
                  該当する
                  {gearType === 'camera' ? 'カメラ' : 'レンズ'}
                  が見つかりません
                </li>
              )}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
