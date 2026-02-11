'use client'

import Link from 'next/link'
import { Camera, Aperture } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui_shadcn/badge'
import { Typography } from '@/components/ui_shadcn/typography'
import { Flex, Grid } from '@/components/ui_shadcn/layout'
import type { UserGearWithDetails } from '@/repositories/user-gear.repository'

interface GearTabsProps {
  ownedGears: UserGearWithDetails[]
  wantedGears: UserGearWithDetails[]
  previouslyOwnedGears: UserGearWithDetails[]
}

function GearList({ gears, emptyMessage }: { gears: UserGearWithDetails[], emptyMessage: string }) {
  if (gears.length === 0) {
    return <Typography variant="muted" className="text-center py-8">{emptyMessage}</Typography>
  }

  return (
    <Grid gap={6} mdCols={2}>
      {gears.map(gear => (
        <Card key={gear.id} className="block p-4 hover:bg-accent transition-colors">
          <Link href={`/gears/${gear.id}`}>
            <Flex align="start" gap={3}>
              <div className="mt-1">
                {gear.gearType === 'camera'
                  ? <Camera className="h-5 w-5 text-zinc-600" />
                  : <Aperture className="h-5 w-5 text-zinc-600" />}
              </div>
              <div className="flex-1">
                <Flex align="start" justify="between">
                  <div>
                    <Typography variant="large" className="text-base">{gear.masterName || gear.customName}</Typography>
                    <Typography variant="muted">
                      {gear.makerName || '不明なメーカー'}
                    </Typography>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {gear.gearType === 'camera' ? 'カメラ' : 'レンズ'}
                  </Badge>
                </Flex>
                {gear.comment && <Typography variant="muted" className="mt-2">{gear.comment}</Typography>}
              </div>
            </Flex>
          </Link>
        </Card>
      ))}
    </Grid>
  )
}

export function GearTabs({ ownedGears, wantedGears, previouslyOwnedGears }: GearTabsProps) {
  return (
    <Tabs defaultValue="owned">
      <TabsList>
        <TabsTrigger value="owned">もっている</TabsTrigger>
        <TabsTrigger value="wanted">ほしい</TabsTrigger>
        <TabsTrigger value="previously-owned">もっていた</TabsTrigger>
      </TabsList>
      <TabsContent value="owned">
        <GearList gears={ownedGears} emptyMessage="所有ギアがありません" />
      </TabsContent>
      <TabsContent value="wanted">
        <GearList gears={wantedGears} emptyMessage="ほしいギアがありません" />
      </TabsContent>
      <TabsContent value="previously-owned">
        <GearList gears={previouslyOwnedGears} emptyMessage="以前所有していたギアがありません" />
      </TabsContent>
    </Tabs>
  )
}
