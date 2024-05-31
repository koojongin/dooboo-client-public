'use client'

import { Button, Card, CardBody, Input } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { fetchPostMap } from '@/services/api-fetch'
import { Monster } from '@/interfaces/monster.interface'
import toAPIHostURL from '@/services/image-name-parser'
import { fetchGetMonsters } from '@/services/api-admin-fetch'
import { Pagination } from '@/interfaces/common.interface'
import createKey from '@/services/key-generator'

export default function MapCreatePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm({
    defaultValues: {
      name: '',
    },
  })

  const router = useRouter()

  const [monsters, setMonsters] = useState<Monster[]>([])
  const [selectedMonsters, setSelectedMonsters] = useState<Monster[]>([])
  const [pagination, setPagination] = useState<Pagination>()

  const getValidationMessage = (data: any) => {
    let message = ''
    if (data?.name?.length < 2) message = '맵 제목은 최소 2자이상 입력하세요'
    return message
  }
  const onSubmit = async (data: any) => {
    const validationMessage = getValidationMessage(data)
    if (validationMessage) {
      await Swal.fire({
        title: validationMessage,
        text: validationMessage,
        icon: 'error',
        confirmButtonText: '확인',
      })
      return
    }

    const map = { ...data, monsterIds: [...selectedMonsters.map((d) => d._id)] }
    const { map: rMap } = await fetchPostMap(map)

    await Swal.fire({
      title: '등록되었습니다',
      text: validationMessage,
      icon: 'success',
      confirmButtonText: '확인',
    })
    router.push('/admindooboo/map')
  }

  const loadMonsters = async (selectedPage = 1) => {
    const result = await fetchGetMonsters({}, { page: selectedPage })
    setMonsters(result.monsters)
    setPagination(result)
  }

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
  }, [])

  return (
    <div className="flex">
      <Card className="overflow-hidden">
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="items-center">
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input label="맵이름" {...field} />}
              />
            </div>
            <div className="flex gap-1 mt-2">
              <div>등장 몬스터</div>
              {selectedMonsters.map((monster) => (
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
                onClick={handleSubmit(onSubmit)}
              >
                생성
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
