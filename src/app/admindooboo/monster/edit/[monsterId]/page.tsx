'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  Input,
  Typography,
} from '@material-tailwind/react'
import Swal from 'sweetalert2'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import {
  fetchGetMonster,
  fetchPostMonster,
  fetchPutMonster,
  fetchUploadItemFile,
  fetchUploadMonsterFile,
} from '@/services/api-fetch'
import { Monster } from '@/interfaces/monster.interface'
import toAPIHostURL from '@/services/image-name-parser'

export default function Page({
  params,
  searchParams,
}: {
  params: { monsterId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const router = useRouter()
  const { monsterId } = params
  const isCreateMode = params.monsterId === 'create'
  const imageUploadRef = useRef<any>(null)

  const [monster, setMonster] = useState<Monster | any>({
    level: 1,
    armor: 0,
    isHide: true,
    speed: 30,
    collisionDamage: 30,
    collisionTrueDamage: 0,
    name: '',
    hp: 1,
    gold: 1,
    experience: 1,
    weight: 1,
    resist: 30,
  })

  const checkValidation = () => {
    let validationMessage = ''
    if (monster.name.length < 2) {
      validationMessage = '이름을 입력하세요. 최소 2자'
      return validationMessage
    }
    if (monster.hp <= 0) {
      validationMessage = '체력을 0보다 높게 설정하세요.'
      return validationMessage
    }
    if (monster.gold < 0) {
      validationMessage = '0골드 아래로 입력 불가'
      return validationMessage
    }
    if (monster.experience < 1) {
      validationMessage = '경험치는 최소 1이어야합니다'
      return validationMessage
    }
    if (monster.weight < 1) {
      validationMessage = '무게는 최소 1이어야 합니다.'
      return validationMessage
    }

    return validationMessage
  }

  const loadMonster = useCallback(
    async (id: string) => {
      if (!isCreateMode) {
        const result = await fetchGetMonster(id)
        setMonster(result.monster)
      }
    },
    [isCreateMode],
  )

  const onSubmit = async () => {
    const validationMessage = checkValidation()

    if (validationMessage) {
      return Swal.fire({
        title: validationMessage,
        text: '모든 정보를 입력하세요.',
        icon: 'error',
        confirmButtonText: '확인',
      })
    }

    if (isCreateMode) {
      await fetchPostMonster(monster)
    } else {
      await fetchPutMonster(monster)
    }

    await Swal.fire({
      title: '수정되었습니다',
      icon: 'success',
      confirmButtonText: '확인',
    })

    await loadMonster(monsterId)
  }

  const onChangeThumbnail = async (event: any) => {
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    const { path } = await fetchUploadMonsterFile(formData)
    setMonster({ ...monster!, thumbnail: path })
  }

  const goToDropSetting = () => {
    if (!monster) return
    if (!monster.drop) {
      router.push(`/admindooboo/drop/create`)
      return
    }
    router.push(`/admindooboo/drop/${monster.drop._id!}`)
  }

  const onClickThumbnailUploadButton = () => {
    imageUploadRef.current.click()
  }

  useEffect(() => {
    loadMonster(monsterId)
  }, [loadMonster, monsterId])

  return (
    <div>
      {monster && (
        <Card className="flex">
          <CardBody>
            <div className="flex items-center">
              <div>
                몬스터 {isCreateMode ? '생성' : '수정'}
                {!isCreateMode &&
                  ` ${moment(monster.updatedAt).format('YYYY-MM-DD HH:mm:ss')}`}
              </div>
              {!isCreateMode && (
                <div
                  className="bg-green-500 text-white px-[10px] py-[4px] cursor-pointer"
                  onClick={() => {
                    goToDropSetting()
                  }}
                >
                  드랍세팅
                </div>
              )}
            </div>
            <div className="flex items-center gap-[10px] py-[10px]">
              <div>이미지</div>
              <input
                onChange={onChangeThumbnail}
                ref={imageUploadRef}
                type="file"
                placeholder="name@mail.com"
                className="hidden absolute"
              />
              {monster?.thumbnail && (
                <div className="flex items-center gap-[10px]">
                  <img
                    src={toAPIHostURL(monster.thumbnail)}
                    className="w-[60px] h-[60px] border-dark-blue border"
                  />
                  <div
                    className="ff-ba ff-skew cursor-pointer bg-green-500 px-[5px] rounded flex items-center text-[16px] text-white"
                    onClick={() => onClickThumbnailUploadButton()}
                  >
                    이미지 변경
                  </div>
                </div>
              )}

              {!monster?.thumbnail && (
                <div
                  className="ff-ba ff-skew cursor-pointer bg-green-500 px-[5px] rounded flex items-center text-[16px] text-white"
                  onClick={() => onClickThumbnailUploadButton()}
                >
                  이미지 업로드
                </div>
              )}
            </div>
            <form onSubmit={onSubmit}>
              <div className="mb-1 flex flex-col [&_div]:flex [&_div:nth-child(1)]:min-w-[100px] [&_div:nth-child(1)]:flex [&_div:nth-child(1)]:items-center gap-[10px]">
                <div>
                  <div>몬스터 이름</div>
                  <Input
                    onChange={(event: any) =>
                      setMonster({ ...monster, name: event?.target?.value })
                    }
                    value={monster.name}
                    size="md"
                    placeholder="몬스터이름..."
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: 'before:content-none after:content-none',
                    }}
                  />
                </div>
                <div>
                  <div>체력</div>
                  <Input
                    // disabled
                    value={monster.hp}
                    onChange={(event: any) =>
                      setMonster({
                        ...monster,
                        hp: parseInt(event?.target?.value, 10),
                      })
                    }
                    type="number"
                    size="md"
                    placeholder="100"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: 'before:content-none after:content-none',
                    }}
                  />
                </div>
                <div>
                  <div>획득 경험치</div>
                  <Input
                    // disabled
                    onChange={(event: any) =>
                      setMonster({
                        ...monster,
                        experience: parseInt(event?.target?.value, 10),
                      })
                    }
                    value={monster.experience}
                    type="number"
                    size="md"
                    placeholder="5"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: 'before:content-none after:content-none',
                    }}
                  />
                </div>
                <div>
                  <div>획득 골드</div>
                  <Input
                    // disabled
                    onChange={(event: any) =>
                      setMonster({
                        ...monster,
                        gold: parseInt(event?.target?.value, 10),
                      })
                    }
                    value={monster.gold}
                    type="number"
                    size="md"
                    placeholder="10"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: 'before:content-none after:content-none',
                    }}
                  />
                </div>
                <div>
                  <div>무게</div>
                  <Input
                    // disabled
                    value={monster.weight}
                    onChange={(event: any) =>
                      setMonster({
                        ...monster,
                        weight: parseInt(event?.target?.value, 10),
                      })
                    }
                    size="md"
                    type="number"
                    placeholder="100"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: 'before:content-none after:content-none',
                    }}
                  />
                </div>
                <div>
                  <div>레벨</div>
                  <div>
                    <input
                      className="border p-[4px]"
                      type="number"
                      value={monster.level}
                      onChange={(e) =>
                        setMonster({
                          ...monster,
                          level: parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <div>방어력</div>
                  <div>
                    <input
                      className="border p-[4px]"
                      type="number"
                      value={monster.armor}
                      onChange={(e) =>
                        setMonster({
                          ...monster,
                          armor: parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <div>저항</div>
                  <div>
                    <input
                      className="border p-[4px]"
                      type="number"
                      value={monster.resist}
                      onChange={(e) =>
                        setMonster({
                          ...monster,
                          resist: parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <div>inRaid</div>
                  <div>
                    <input
                      className="border p-[4px]"
                      type="checkbox"
                      checked={monster.inRaid}
                      onChange={(e) =>
                        setMonster({
                          ...monster,
                          inRaid: e.target.checked,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <div>isHide</div>
                  <div>
                    <input
                      className="border p-[4px]"
                      type="checkbox"
                      checked={monster.isHide}
                      onChange={(e) =>
                        setMonster({
                          ...monster,
                          isHide: e.target.checked,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <div>speed</div>
                  <div>
                    <input
                      className="border p-[4px]"
                      type="number"
                      value={monster.speed}
                      onChange={(e) =>
                        setMonster({
                          ...monster,
                          speed: parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <div>collisionDamage</div>
                  <div>
                    <input
                      className="border p-[4px]"
                      type="number"
                      value={monster.collisionDamage}
                      onChange={(e) =>
                        setMonster({
                          ...monster,
                          collisionDamage: parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <div>collisionTrueDamage</div>
                  <div>
                    <input
                      className="border p-[4px]"
                      type="number"
                      value={monster.collisionTrueDamage}
                      onChange={(e) =>
                        setMonster({
                          ...monster,
                          collisionTrueDamage: parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <Button
                className="mt-6 text-md"
                size="sm"
                fullWidth
                onClick={() => onSubmit()}
              >
                수정
              </Button>
            </form>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
