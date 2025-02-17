'use client'

import { Button, ButtonGroup } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'

export default function AdminLayoutHeader() {
  const router = useRouter()
  const navigate = (uri: string) => {
    router.push(`${uri}`)
  }
  return (
    <ButtonGroup>
      {/* <Button onClick={() => navigate('/')}>홈</Button> */}
      <Button onClick={() => navigate('/admindooboo/monster')}>몬스터</Button>
      <Button onClick={() => navigate('/admindooboo/drop')}>드랍</Button>
      <Button onClick={() => navigate('/admindooboo/item')}>아이템</Button>
      <Button onClick={() => navigate('/admindooboo/map')}>맵</Button>
      <Button onClick={() => navigate('/admindooboo/db/weapon')}>DB</Button>
      <Button onClick={() => navigate('/admindooboo/db/chat')}>Chat</Button>
      <Button onClick={() => navigate('/admindooboo/db/character')}>
        캐릭
      </Button>
      <Button onClick={() => navigate('/admindooboo/db/stash')}>stash</Button>
      <Button onClick={() => navigate('/admindooboo/shop')}>shop</Button>
      <Button onClick={() => navigate('/admindooboo/rank')}>rank</Button>
    </ButtonGroup>
  )
}
