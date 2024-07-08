'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import { fetchGetMonstersByMap } from '@/services/api-admin-fetch'
import { DbMap } from '@/interfaces/map.interface'
import createKey from '@/services/key-generator'
import toAPIHostURL from '@/services/image-name-parser'
import { Monster } from '@/interfaces/monster.interface'

export default function AdminMonsterByMapPage({
  params,
}: {
  params: { mapId: string }
}) {
  const router = useRouter()
  const [map, setMap] = useState<DbMap & { totalWeight: number }>()

  const loadMap = useCallback(async () => {
    const result = await fetchGetMonstersByMap(
      {
        _id: [params.mapId],
      },
      { sort: { hp: 1 } },
    )
    setMap({
      ...result.map,
      totalWeight: result.map?.monsters.reduce(
        (prev: number, next: Monster) => {
          return prev + next.weight
        },
        0,
      ),
    })
  }, [params.mapId])

  const editMonster = (monster: Monster) => {
    // handleOpenUpdateMonsterDialog(monster)
    router.push(`/admindooboo/monster/edit/${monster._id}`)
  }

  useEffect(() => {
    loadMap()
  }, [loadMap])

  return (
    <div>
      <Card className="p-[10px] rounded ff-score-all font-bold">
        {!map && <div>Loading...</div>}
        {map && (
          <div>
            <div>{map.name}</div>
            <table className="min-w-[800px]">
              <thead>
                <tr className="bg-gray-100">
                  {[
                    '%',
                    '',
                    '이름',
                    'hp',
                    'weight',
                    'level',
                    'gold',
                    'exp',
                    'armor',
                    'resist',
                    'speed',
                    'collisionDamage',
                    'drop',
                  ].map((head) => {
                    return <th key={createKey()}>{head}</th>
                  })}
                </tr>
              </thead>
              <tbody>
                {map.monsters?.map((monster) => {
                  return (
                    <tr
                      className="text-center hover:bg-gray-100 cursor-pointer"
                      key={createKey()}
                      onClick={() => editMonster(monster)}
                    >
                      <td className="w-[60px]">
                        {((monster.weight / map.totalWeight) * 100).toFixed(2)}
                      </td>
                      <td className="w-[40px]">
                        <div
                          className="w-[40px] h-[40px] bg-cover"
                          style={{
                            backgroundImage: `url('${toAPIHostURL(monster.thumbnail)}')`,
                          }}
                        />
                      </td>
                      <td>{monster.name}</td>
                      <td>{monster.hp}</td>
                      <td>{monster.weight}</td>
                      <td>{monster.level}</td>
                      <td>{monster.gold}</td>
                      <td>{monster.experience}</td>
                      <td>{monster.armor}</td>
                      <td>{monster.resist}</td>
                      <td>{monster.speed}</td>
                      <td>{monster.collisionDamage}</td>
                      <td>{monster.drop ? monster.drop.items.length : ''}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
