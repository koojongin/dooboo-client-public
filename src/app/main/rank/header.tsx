'use client'

import { Card, CardBody } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'

export default function RankHeader({ children }: any) {
  const router = useRouter()
  const goToIndex = () => {
    router.push('/main/community')
  }
  return (
    <Card className="w-full">
      <CardBody>
        <div className="rounded w-full flex flex-col justify-between gap-1">
          {children}
        </div>
      </CardBody>
    </Card>
  )
}
