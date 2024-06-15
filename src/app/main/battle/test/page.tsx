'use client'

import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(
  () => import('@/app/main/battle/test/game-scene'),
  { ssr: false },
)
export default function TestBattlePage() {
  return <DynamicComponent />
}
