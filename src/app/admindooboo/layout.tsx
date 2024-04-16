'use client'

import { Button, ButtonGroup } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const navigate = (uri: string) => {
    router.push(`${uri}`)
  }
  return (
    <div className="p-10">
      <div className="mb-5">
        <div>관리자페이지</div>
        <ButtonGroup>
          <Button onClick={() => navigate('/')}>홈</Button>
          <Button onClick={() => navigate('/admindooboo/monster')}>
            몬스터
          </Button>
          <Button onClick={() => navigate('/admindooboo/item')}>아이템</Button>
          <Button onClick={() => navigate('/admindooboo/map')}>맵</Button>
        </ButtonGroup>
      </div>
      {children}
    </div>
  )
}
