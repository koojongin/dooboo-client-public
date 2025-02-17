'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, CardBody, Chip } from '@material-tailwind/react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { fetchDeleteMap, fetchGetMaps } from '@/services/api-fetch'
import { DbMap } from '@/interfaces/map.interface'
import { fetchAdminGetMaps } from '@/services/api-admin-fetch'

export default function MapPage({
  searchParams,
}: {
  searchParams: { type: 'raid' | 'normal' | 'string' | undefined }
}) {
  const router = useRouter()
  const [maps, setMaps] = useState<(DbMap & { totalWeight: number })[]>([])
  const loadMapList = useCallback(async (type?: string) => {
    const condition: any = {}
    if (type === 'raid') {
      condition.isRaid = true
    }
    if (type === 'normal') {
      condition.isRaid = { $in: [false, null] }
    }
    const { maps: rMaps } = await fetchAdminGetMaps(condition, {
      sort: { level: -1 },
    })
    const newMaps: (DbMap & { totalWeight: number })[] = rMaps.map((map) => {
      const newMap: any = { ...map }

      newMap.totalWeight = newMap.monsters.reduce(
        (prev: any, next: any) => prev + next.weight,
        0,
      )
      newMap.monsters = newMap.monsters.sort(
        (a: any, b: any) => b.weight - a.weight,
      )

      return newMap
    })
    setMaps(newMaps)
  }, [])

  const goToEditMonster = (monsterId: string) => {
    router.push(`/admindooboo/monster/edit/${monsterId}`)
  }

  const editMap = (map: DbMap) => {
    router.push(`/admindooboo/map/${map._id}`)
    return
  }
  const deleteMap = async (map: DbMap) => {
    const id = map._id
    const { isConfirmed } = await Swal.fire({
      title: '정말로 삭제하시겠습니까?',
      text: map.name,
      icon: 'question',
      confirmButtonText: '예',
      denyButtonText: `닫기`,
      showDenyButton: true,
    })

    if (isConfirmed) {
      const response = await fetchDeleteMap(id!)
      await Swal.fire({
        title: '삭제되었습니다.',
        text: '삭제되었습니다.',
        icon: 'success',
        confirmButtonText: '확인',
      })
      await loadMapList()
    }
  }

  useEffect(() => {
    loadMapList(searchParams.type)
  }, [loadMapList, searchParams.type])
  return (
    <div>
      <div className="flex flex-col gap-1">
        {maps &&
          maps.map((map) => {
            return (
              <div key={map._id}>
                <Card className="rounded shadow-none border p-[5px] ff-score-all font-bold">
                  <div className="flex gap-[10px] items-center">
                    <div className="w-[40px]">{map.level}</div>
                    <div className="w-[150px]">{map.name}</div>
                    <div
                      className={`w-[20px] flex items-center gap-[2px] ${!map.isHide ? 'text-green-500' : 'text-gray-300'}`}
                    >
                      {!map.isHide ? (
                        <i className="fa-solid fa-eye" />
                      ) : (
                        <i className="fa-solid fa-eye-slash" />
                      )}
                    </div>
                    <div
                      className={`w-[70px] flex items-center gap-[2px] ${map.isRaid ? 'text-green-500' : 'text-gray-300'}`}
                    >
                      isRaid
                      <input type="checkbox" checked={map.isRaid} disabled />
                    </div>
                    <div className="flex gap-1">
                      <div
                        className="cursor-pointer bg-green-500 px-[10px] rounded-lg flex items-center text-[16px] text-white"
                        onClick={() => editMap(map)}
                      >
                        수정
                      </div>
                      <div
                        className="cursor-pointer bg-red-700 px-[10px] rounded-lg flex items-center text-[16px] text-white"
                        onClick={() => deleteMap(map)}
                      >
                        삭제
                      </div>
                    </div>
                  </div>
                  {/* <hr className="m-1" />
                    <div className="flex flex-col gap-1 items-start w-full">
                      <div className="">총 무게 {map.totalWeight}</div>
                      <div className="flex gap-1">
                        {map?.monsters!.map((monster) => {
                          return (
                            <div
                              className="cursor-pointer"
                              key={monster._id}
                              onClick={() => goToEditMonster(monster._id!)}
                            >
                              <Chip
                                className="bg-gray-100 font-thin text-dark-blue rounded-sm p-[4px] border border-dark-blue"
                                value={
                                  <div>
                                    <div>
                                      {monster.name}({monster.weight}) :{' '}
                                      {(
                                        (monster.weight / map.totalWeight) *
                                        100
                                      ).toFixed(1)}
                                      %
                                    </div>
                                    <div>HP:{monster.hp}</div>
                                  </div>
                                }
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div> */}
                </Card>
              </div>
            )
          })}
      </div>
    </div>
  )
}
