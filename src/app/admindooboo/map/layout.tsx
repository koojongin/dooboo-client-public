'use client'

import {
  Breadcrumbs,
  Button,
  ButtonGroup,
  Card,
  CardBody,
} from '@material-tailwind/react'
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
        <div className="mb-2">
          <Breadcrumbs>
            <div onClick={() => navigate('/admindooboo/map')}>목록</div>
            <div onClick={() => navigate('/admindooboo/map/create')}>생성</div>
          </Breadcrumbs>
        </div>
        {children}
      </CardBody>
    </Card>
  )
}
