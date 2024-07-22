'use client'

import Swal from 'sweetalert2'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Card, CardBody, Chip } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import { fetchUploadItemFile } from '@/services/api-fetch'
import {
  BaseDefenceGear,
  DefenceGearType,
  ItemGradeKind,
  MiscTypeCategoryKind,
} from '@/interfaces/item.interface'
import toAPIHostURL from '@/services/image-name-parser'
import { translate } from '@/services/util'
import {
  fetchGetBaseDefenceGearOne,
  fetchPostBaseDefenceGear,
  fetchPutBaseDefenceGear,
} from '@/services/api-admin-fetch'
import { BaseItemType } from '@/interfaces/drop-table.interface'

export default function Page({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const router = useRouter()
  const imageUploadRef = useRef<any>(null)
  const isCreateMode = params?.id === 'create'
  const [baseDefenceGear, setBaseDefenceGear] = useState<BaseDefenceGear | any>(
    {
      name: '',
      iType: BaseItemType.BaseDefenceGear,
      gearType: DefenceGearType.BodyArmor,
      armor: [0, 0],
      evasion: [0, 0],
      energyShield: [0, 0],
      gold: 0,
      requiredEquipmentLevel: 0,
      requiredEquipmentStr: 0,
      requiredEquipmentDex: 0,
      requiredEquipmentLuk: 0,
      maxStarForce: 0,
    },
  )

  const onClickThumbnailUploadButton = () => {
    imageUploadRef.current.click()
  }

  const onChangeThumbnail = async (event: any) => {
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    const { path } = await fetchUploadItemFile(formData)
    setBaseDefenceGear({ ...baseDefenceGear, thumbnail: path })
  }

  const onSubmit = useCallback(async () => {
    const error = {
      message: '',
    }

    if (baseDefenceGear.armor[0] > baseDefenceGear.armor[1]) {
      error.message = '방어력의 최소는 최대보다 클 수 없음.'
    }

    if (baseDefenceGear.evasion[0] > baseDefenceGear.evasion[1]) {
      error.message = '방어력의 최소는 최대보다 클 수 없음.'
    }

    if (!baseDefenceGear.name) {
      error.message = '이름없음'
    }

    if (!baseDefenceGear.thumbnail) {
      error.message = '썸넬없음'
    }

    if (!baseDefenceGear.gold) {
      baseDefenceGear.gold = 0
    }

    if (error.message) {
      return Swal.fire({
        title: '실패',
        text: error.message || '알 수 없는 에러',
        icon: 'error',
        confirmButtonText: '닫기',
      })
    }

    if (isCreateMode) await fetchPostBaseDefenceGear(baseDefenceGear)
    else await fetchPutBaseDefenceGear(baseDefenceGear)
    return Swal.fire({
      title: '생성 또는 수정됨.',
      icon: 'success',
      confirmButtonText: '닫기',
    })
    // router.push('/admindooboo/item/defence-gear')
  }, [baseDefenceGear, isCreateMode])

  const loadBaseDefenceGear = useCallback(async (baseDefenceGearId: string) => {
    const result = await fetchGetBaseDefenceGearOne(baseDefenceGearId)
    setBaseDefenceGear(result.baseDefenceGear)
  }, [])

  useEffect(() => {
    if (params.id !== 'create') loadBaseDefenceGear(params.id)
  }, [loadBaseDefenceGear, params.id])

  return (
    <div>
      <div>방어구 {isCreateMode ? '생성' : '수정'} 페이지</div>
      <div className="flex gap-5">
        <Card className="overflow-auto min-w-[800px]">
          <CardBody>
            <Chip
              variant="outlined"
              size="lg"
              value={`${isCreateMode ? '아이템 옵션' : '수정 옵션'}`}
              className="mb-5 text-[16px] pt-2.5"
            />
            <form onSubmit={onSubmit}>
              <div className="[&>*]:flex [&>*]:items-center [&>*]:gap-1 [&>*>:first-child]:min-w-[150px] flex flex-col gap-2">
                <div>
                  <div>아이템 명</div>
                  <div>
                    <input
                      className="border p-[4px]"
                      value={baseDefenceGear.name}
                      onChange={(e) =>
                        setBaseDefenceGear({
                          ...baseDefenceGear,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <div>이미지</div>
                  <input
                    onChange={onChangeThumbnail}
                    ref={imageUploadRef}
                    type="file"
                    placeholder="name@mail.com"
                    className="hidden absolute"
                  />
                  {baseDefenceGear?.thumbnail && (
                    <div className="flex items-center gap-[10px]">
                      <img
                        src={toAPIHostURL(baseDefenceGear.thumbnail)}
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

                  {!baseDefenceGear?.thumbnail && (
                    <div
                      className="ff-ba ff-skew cursor-pointer bg-green-500 px-[5px] rounded flex items-center text-[16px] text-white"
                      onClick={() => onClickThumbnailUploadButton()}
                    >
                      이미지 업로드
                    </div>
                  )}
                </div>

                <div>
                  <div>gearType</div>
                  <select
                    className="border p-[4px]"
                    value={baseDefenceGear.gearType}
                    onChange={(e) => {
                      setBaseDefenceGear({
                        ...baseDefenceGear,
                        gearType: e.target.value,
                      })
                    }}
                  >
                    {Object.values(DefenceGearType).map(
                      (baseDefenceGearType) => {
                        return (
                          <option
                            key={`option_${baseDefenceGearType}`}
                            value={baseDefenceGearType}
                          >
                            {translate(baseDefenceGearType)}
                          </option>
                        )
                      },
                    )}
                  </select>
                </div>

                <div>
                  <div>방어력</div>
                  <div className="w-full flex items-center">
                    <input
                      type="number"
                      className="border p-[5px] w-[100px]"
                      value={baseDefenceGear.armor[0]}
                      onChange={(e) =>
                        setBaseDefenceGear({
                          ...baseDefenceGear,
                          armor: [
                            parseInt(e.target.value, 10),
                            baseDefenceGear.armor[1],
                          ],
                        })
                      }
                    />
                    <div>~</div>
                    <input
                      type="number"
                      className="border w-[100px] p-[5px]"
                      value={baseDefenceGear.armor[1]}
                      onChange={(e) =>
                        setBaseDefenceGear({
                          ...baseDefenceGear,
                          armor: [
                            baseDefenceGear.armor[0],
                            parseInt(e.target.value, 10),
                          ],
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <div>회피</div>
                  <div className="w-full flex items-center">
                    <input
                      type="number"
                      className="border p-[5px] w-[100px]"
                      value={baseDefenceGear.evasion[0]}
                      onChange={(e) =>
                        setBaseDefenceGear({
                          ...baseDefenceGear,
                          evasion: [
                            parseInt(e.target.value, 10),
                            baseDefenceGear.evasion[1],
                          ],
                        })
                      }
                    />
                    <div>~</div>
                    <input
                      type="number"
                      className="border w-[100px] p-[5px]"
                      value={baseDefenceGear.evasion[1]}
                      onChange={(e) =>
                        setBaseDefenceGear({
                          ...baseDefenceGear,
                          evasion: [
                            baseDefenceGear.evasion[0],
                            parseInt(e.target.value, 10),
                          ],
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <div>에너지 쉴드</div>
                  <div className="w-full flex items-center">
                    <input
                      type="number"
                      className="border p-[5px] w-[100px]"
                      value={baseDefenceGear.energyShield[0]}
                      onChange={(e) =>
                        setBaseDefenceGear({
                          ...baseDefenceGear,
                          energyShield: [
                            parseInt(e.target.value, 10),
                            baseDefenceGear.energyShield[1],
                          ],
                        })
                      }
                    />
                    <div>~</div>
                    <input
                      type="number"
                      className="border w-[100px] p-[5px]"
                      value={baseDefenceGear.energyShield[1]}
                      onChange={(e) =>
                        setBaseDefenceGear({
                          ...baseDefenceGear,
                          energyShield: [
                            baseDefenceGear.energyShield[0],
                            parseInt(e.target.value, 10),
                          ],
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <div>gold</div>
                  <div className="w-full">
                    <input
                      type="number"
                      className="border w-full p-[5px]"
                      value={baseDefenceGear.gold}
                      onChange={(e) =>
                        setBaseDefenceGear({
                          ...baseDefenceGear,
                          gold: parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <div>iLevel</div>
                  <div className="w-full">
                    <input
                      type="number"
                      className="border w-full p-[5px]"
                      value={baseDefenceGear.iLevel}
                      onChange={(e) =>
                        setBaseDefenceGear({
                          ...baseDefenceGear,
                          iLevel: parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <div>최대 스타포스</div>
                  <div className="w-full">
                    <input
                      type="number"
                      className="border w-full p-[5px]"
                      value={baseDefenceGear.maxStarForce}
                      onChange={(e) =>
                        setBaseDefenceGear({
                          ...baseDefenceGear,
                          maxStarForce: parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <div>착용 제한 레벨</div>
                  <div className="w-full">
                    <input
                      type="number"
                      className="border w-[100px] p-[5px]"
                      value={baseDefenceGear.requiredEquipmentLevel}
                      onChange={(e) =>
                        setBaseDefenceGear({
                          ...baseDefenceGear,
                          requiredEquipmentLevel: parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <div>착용 제한 힘</div>
                  <div className="w-full">
                    <input
                      type="number"
                      className="border w-[100px] p-[5px]"
                      value={baseDefenceGear.requiredEquipmentStr}
                      onChange={(e) =>
                        setBaseDefenceGear({
                          ...baseDefenceGear,
                          requiredEquipmentStr: parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <div>착용 제한 민첩</div>
                  <div className="w-full">
                    <input
                      type="number"
                      className="border w-[100px] p-[5px]"
                      value={baseDefenceGear.requiredEquipmentDex}
                      onChange={(e) =>
                        setBaseDefenceGear({
                          ...baseDefenceGear,
                          requiredEquipmentDex: parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <div>착용 제한 행운</div>
                  <div className="w-full">
                    <input
                      type="number"
                      className="border w-[100px] p-[5px]"
                      value={baseDefenceGear.requiredEquipmentLuk}
                      onChange={(e) =>
                        setBaseDefenceGear({
                          ...baseDefenceGear,
                          requiredEquipmentLuk: parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>
                </div>

                {/* ================================================================= */}
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
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
