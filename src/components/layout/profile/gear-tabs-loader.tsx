import { Suspense } from 'react'
import { findUserGearsWithDetails } from '@/db/queries/user-gear'
import { GearTabs } from './gear-tabs'
import { Loading } from '@/components/ui/loading'

type Props = {
  userId: string
  editable?: boolean
}

async function GearTabsContent({ userId, editable }: Props) {
  const allGears = await findUserGearsWithDetails(userId)
  const ownedGears = allGears.filter(g => g.status === 'owned')
  const wantedGears = allGears.filter(g => g.status === 'wanted')
  const previouslyOwnedGears = allGears.filter(g => g.status === 'previously-owned')

  return (
    <GearTabs
      ownedGears={ownedGears}
      wantedGears={wantedGears}
      previouslyOwnedGears={previouslyOwnedGears}
      userId={userId}
      editable={editable}
    />
  )
}

export function GearTabsLoader({ userId, editable }: Props) {
  return (
    <Suspense fallback={<Loading label="ギアを読み込み中..." />}>
      <GearTabsContent userId={userId} editable={editable} />
    </Suspense>
  )
}
