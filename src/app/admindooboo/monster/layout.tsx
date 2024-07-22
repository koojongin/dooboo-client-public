'use client'

import { Card } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const goToRoute = useCallback(
    (path: string) => {
      router.push(path)
    },
    [router],
  )
  return (
    <div className="flex flex-col gap-[10px]">
      <div>
        <div
          className="bg-gray-800 text-white inline-flex py-[5px] px-[10px] rounded ff-score font-bold"
          onClick={() => {
            goToRoute('/admindooboo/monster/edit/create')
          }}
        >
          생성
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}
