'use client'

import { Card, CardBody } from '@material-tailwind/react'
import { useRef } from 'react'
import CreateMonsterForm from '@/app/admindooboo/monster/create-monster'
import MonsterListComponent from '@/app/admindooboo/monster/list-monster'
import { MonsterListRef } from '@/interfaces/monster.interface'

export default function MonsterPage() {
  const monsterListRef = useRef<MonsterListRef>(null)
  const handleRefreshMonsterList = () => {
    monsterListRef?.current?.refresh()
  }
  return (
    <Card>
      <CardBody>
        <div className="flex flex-col">
          <MonsterListComponent customCss="col-span-7" ref={monsterListRef} />
          <Card className="col-span-3">
            <CardBody>
              <CreateMonsterForm
                handleRefreshMonsterList={handleRefreshMonsterList}
              />
            </CardBody>
          </Card>
        </div>
      </CardBody>
    </Card>
  )
}
