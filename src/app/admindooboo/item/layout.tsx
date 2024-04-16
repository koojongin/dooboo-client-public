'use client'

import { Breadcrumbs, Card, CardBody } from '@material-tailwind/react'
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
    <Card>
      <CardBody>
        <div className="mb-2 flex items-center gap-1">
          <Breadcrumbs>
            <div onClick={() => navigate('/admindooboo/item')}>홈</div>
          </Breadcrumbs>
          <Breadcrumbs>
            <div onClick={() => navigate('/admindooboo/item/weapon')}>
              무기 목록
            </div>
            <div onClick={() => navigate('/admindooboo/item/weapon/create')}>
              생성
            </div>
          </Breadcrumbs>

          <Breadcrumbs>
            <div onClick={() => navigate('/admindooboo/item/etc')}>
              기타 목록
            </div>
            <div onClick={() => navigate('/admindooboo/item/etc/create')}>
              생성
            </div>
          </Breadcrumbs>
        </div>
        {children}
      </CardBody>
    </Card>
  )
}
