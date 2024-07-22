'use client'

import { Button, Card, CardBody, Input } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { fetchPostMap } from '@/services/api-fetch'
import { Monster } from '@/interfaces/monster.interface'
import toAPIHostURL from '@/services/image-name-parser'
import {
  fetchAdminPutMap,
  fetchGetMonsters,
  fetchGetMonstersByMap,
} from '@/services/api-admin-fetch'
import { Pagination } from '@/interfaces/common.interface'
import createKey from '@/services/key-generator'
import { DbMap } from '@/interfaces/map.interface'

export default function MapCreateOrEditPage({
  params,
}: {
  params: { mapId: string }
}) {
  const isCreateMode = params.mapId === 'create'
  const router = useRouter()

  const [monsters, setMonsters] = useState<Monster[]>([])
  const [selectedMonsters, setSelectedMonsters] = useState<Monster[]>([])
  const [pagination, setPagination] = useState<Pagination>()
  const [map, setMap] = useState<DbMap | any>({
    name: '',
    isRaid: false,
    isHide: true,
    level: 1000,
    monsters: [],
  })

  const getValidationMessage = (data: any) => {
    let message = ''
    if (data?.name?.length < 2) message = '맵 제목은 최소 2자이상 입력하세요'
    return message
  }
  const onSubmit = async () => {
    const validationMessage = getValidationMessage(map)
    if (validationMessage) {
      await Swal.fire({
        title: validationMessage,
        text: validationMessage,
        icon: 'error',
        confirmButtonText: '확인',
      })
      return
    }

    if (isCreateMode) {
      const newMap = {
        ...map,
        monsterIds: [...selectedMonsters.map((d) => d._id)],
      }
      await fetchPostMap(newMap)
    } else {
      await fetchAdminPutMap(map)
    }

    await Swal.fire({
      title: `${isCreateMode ? '등록' : '수정'} 되었습니다`,
      icon: 'success',
      confirmButtonText: '확인',
    })
    router.back()
  }

  const loadMap = useCallback(async (mapId: string) => {
    const result = await fetchGetMonstersByMap(
      {
        _id: [mapId],
      },
      { sort: { hp: 1 } },
    )
    setMap(result.map)
  }, [])

  const loadMonsters = useCallback(async (selectedPage = 1) => {
    const result = await fetchGetMonsters({}, { page: selectedPage })
    setMonsters(result.monsters)
    setPagination(result)
  }, [])

  const removeMonster = (selectedMonster: Monster) => {
    const selectedIdex = selectedMonsters
      .map((m) => m._id)
      .indexOf(selectedMonster._id)
    if (selectedIdex < 0) return
    selectedMonsters.splice(selectedIdex, 1)
    setSelectedMonsters([...selectedMonsters])
  }

  const selectMonster = (selectedMonster: Monster) => {
    if (selectedMonsters.map((m) => m._id).includes(selectedMonster._id)) return
    setSelectedMonsters([...selectedMonsters, selectedMonster])
  }

  useEffect(() => {
    loadMonsters()
    if (params.mapId !== 'create') loadMap(params.mapId)
  }, [loadMap, loadMonsters, params.mapId])

  useEffect(() => {
    if (!map) return
    if (map.monsters.length >= 0) setSelectedMonsters(map.monsters)
  }, [map])

  return (
    <div className="flex">
      <Card className="overflow-hidden">
        <CardBody>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-[4px]">
              <div className="flex items-center gap-[4px] cursor-pointer p-[10px] hover:bg-gray-100">
                <div>맵 이름</div>
                <input
                  className="border p-[4px]"
                  type="text"
                  value={map.name}
                  onChange={(e) => setMap({ ...map, name: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-[4px] cursor-pointer p-[10px] hover:bg-gray-100">
                <div>지역 레벨</div>
                <input
                  className="border p-[4px]"
                  type="number"
                  value={map.level}
                  onChange={(e) =>
                    setMap({ ...map, level: parseInt(e.target.value, 10) })
                  }
                />
              </div>
              <label className="flex items-center gap-[4px] cursor-pointer p-[10px] hover:bg-gray-100">
                <div>isHide</div>
                <input
                  className="border p-[4px]"
                  type="checkbox"
                  checked={map.isHide}
                  onChange={(e) => setMap({ ...map, isHide: e.target.checked })}
                />
              </label>
              <label className="flex items-center gap-[4px] cursor-pointer p-[10px] hover:bg-gray-100">
                <div>isRaid</div>
                <input
                  className="border p-[4px]"
                  type="checkbox"
                  checked={map.isRaid}
                  onChange={(e) => setMap({ ...map, isRaid: e.target.checked })}
                />
              </label>
              <div className="flex gap-1 mt-2">
                <div>등장 몬스터</div>
                {selectedMonsters?.map((monster) => (
                  <div
                    key={monster._id}
                    className="cursor-pointer"
                    onClick={() => removeMonster(monster)}
                  >
                    <div className="relative grid select-none items-center whitespace-nowrap rounded-lg bg-gray-900 py-1.5 px-3 font-sans text-xs font-bold uppercase text-white">
                      <span className="mr-5 text-[14px]">{monster.name}</span>
                      <button
                        className="!absolute top-2/4 right-1 mx-px h-5 max-h-[32px] w-5 max-w-[32px] -translate-y-2/4 select-none rounded-md text-center align-middle font-sans text-xs font-medium uppercase text-white transition-all hover:bg-white/10 active:bg-white/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button"
                      >
                        <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-4 h-4"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex flex-wrap border border-solid border-blue-gray-200 rounded mt-1">
                  {monsters &&
                    monsters.map((monster) => {
                      return (
                        <div
                          key={monster._id}
                          className="p-1 relative cursor-pointer min-w-20 min-h-20 max-w-32 border border-solid hover:font-bold hover:bg-gray-100"
                          onClick={() => selectMonster(monster)}
                        >
                          <img
                            className=""
                            src={toAPIHostURL(monster.thumbnail)}
                          />
                          <div className="relative flex items-center justify-center">
                            {monster.name}
                          </div>
                        </div>
                      )
                    })}
                </div>
                <div>
                  {pagination && (
                    <div className="w-full flex justify-center mt-[15px]">
                      <div className="flex gap-[4px] flex-wrap">
                        {new Array(pagination.totalPages)
                          .fill(1)
                          .map((value, index) => {
                            return (
                              <div
                                onClick={() => loadMonsters(index + 1)}
                                className={`cursor-pointer flex justify-center items-center w-[24px] h-[24px] text-[14px] font-bold ${index + 1 === pagination.page ? 'border text-[#5795dd]' : ''} hover:text-[#5795dd] hover:border`}
                                key={createKey()}
                              >
                                {index + 1}
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-center mt-5">
                <Button
                  className="w-full"
                  size="md"
                  color="blue"
                  onClick={onSubmit}
                >
                  {isCreateMode ? '생성' : '수정'}
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
