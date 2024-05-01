'use client'

import { Card } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'

export default function TradeCreatePage() {
  const router = useRouter()
  return (
    <div>
      <Card className="rounded">
        <div>거래등록페이지</div>
      </Card>
    </div>
  )
}
