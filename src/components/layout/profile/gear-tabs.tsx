'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Camera, Aperture, Star, History, Handbag } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Typography } from '@/components/ui_shadcn/typography'
import { Flex, Grid } from '@/components/ui_shadcn/layout'
import { AddGearDialog } from './add-gear-dialog'
import type { UserGearWithDetails } from '@/types/user-gear'
import type { GearStatus } from '@/db/validation'

interface GearTabsProps {
  ownedGears: UserGearWithDetails[]
  wantedGears: UserGearWithDetails[]
  previouslyOwnedGears: UserGearWithDetails[]
  userId: string
  editable?: boolean
}

function GearSection({ icon, label, gears, gearType, status, userId, editable }: {
  icon: React.ReactNode
  label: string
  gears: UserGearWithDetails[]
  gearType: 'camera' | 'lens'
  status: GearStatus
  userId: string
  editable?: boolean
}) {
  return (
    <Card variant="inset" className="p-6">
      <Flex align="center" justify="between">
        <Flex align="center" gap={2}>
          {icon}
          <Typography variant="h4" weight="medium">{label}</Typography>
        </Flex>
        {editable && <AddGearDialog gearType={gearType} status={status} userId={userId} />}
      </Flex>
      {gears.length > 0
        ? (
            <Grid gap={6} mdCols={2}>
              {gears.map(gear => (
                <Card key={gear.id} className="block p-4 hover:bg-accent transition-colors">
                  <Link href={`/gears/${gear.id}`}>
                    <div>
                      <Typography weight="medium">{gear.masterName || gear.customName}</Typography>
                      <Typography variant="muted">
                        {gear.makerName || '不明なメーカー'}
                      </Typography>
                      {gear.comment && <Typography variant="muted" className="mt-2">{gear.comment}</Typography>}
                    </div>
                  </Link>
                </Card>
              ))}
            </Grid>
          )
        : (
            <Typography variant="muted" className="text-center py-4">
              {gearType === 'camera' ? 'カメラ' : 'レンズ'}
              がありません
            </Typography>
          )}
    </Card>
  )
}

function GearList({ gears, status, userId, editable }: {
  gears: UserGearWithDetails[]
  status: GearStatus
  userId: string
  editable?: boolean
}) {
  const cameras = gears.filter(g => g.gearType === 'camera')
  const lenses = gears.filter(g => g.gearType === 'lens')

  return (
    <div className="space-y-8">
      <GearSection icon={<Camera className=" text-zinc-600" scale={5} />} label="カメラ" gears={cameras} gearType="camera" status={status} userId={userId} editable={editable} />
      <GearSection icon={<Aperture className=" text-zinc-600" scale={5} />} label="レンズ" gears={lenses} gearType="lens" status={status} userId={userId} editable={editable} />
    </div>
  )
}

const tabStatusMap = {
  'owned': 'owned',
  'wanted': 'wanted',
  'previously-owned': 'previously-owned',
} as const satisfies Record<string, GearStatus>

export function GearTabs({ ownedGears, wantedGears, previouslyOwnedGears, userId, editable }: GearTabsProps) {
  const [activeTab, setActiveTab] = useState<string>('owned')
  const status = tabStatusMap[activeTab as keyof typeof tabStatusMap] ?? 'owned'

  return (
    <Tabs defaultValue="owned" onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="owned">
          <Handbag />
          もってる
        </TabsTrigger>
        <TabsTrigger value="wanted">
          <Star />
          ほしい
        </TabsTrigger>
        <TabsTrigger value="previously-owned">
          <History />
          もってた
        </TabsTrigger>
      </TabsList>
      <TabsContent value="owned">
        <GearList gears={ownedGears} status={status} userId={userId} editable={editable} />
      </TabsContent>
      <TabsContent value="wanted">
        <GearList gears={wantedGears} status={status} userId={userId} editable={editable} />
      </TabsContent>
      <TabsContent value="previously-owned">
        <GearList gears={previouslyOwnedGears} status={status} userId={userId} editable={editable} />
      </TabsContent>
    </Tabs>
  )
}
