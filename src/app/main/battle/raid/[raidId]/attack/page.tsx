'use client'

import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(
  () => import('@/app/main/battle/raid/[raidId]/attack/raid-attack-scene'),
  { ssr: false },
)
export default function RaidAttackPage() {
  return <DynamicComponent />
}
