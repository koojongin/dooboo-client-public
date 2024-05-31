'use client'

import Swal from 'sweetalert2'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Card, CardBody, Chip } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import { fetchUploadItemFile } from '@/services/api-fetch'
import {
  BaseMisc,
  ItemGradeKind,
  MiscTypeCategoryKind,
} from '@/interfaces/item.interface'
import toAPIHostURL from '@/services/image-name-parser'
import { translate } from '@/services/util'
import {
  fetchGetBaseMiscOne,
  fetchPostBaseMisc,
  fetchPutBaseMisc,
} from '@/services/api-admin-fetch'

export default function Page({
  params,
  searchParams,
}: {
  params: { baseMiscId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const router = useRouter()
  const imageUploadRef = useRef<any>(null)
  const isCreateMode = params?.baseMiscId === 'create'
  const [baseMisc, setBaseMisc] = useState<BaseMisc | any>({
    name: '',
    category: MiscTypeCategoryKind.Etc,
  })

  const onClickThumbnailUploadButton = () => {
    imageUploadRef.current.click()
  }

  const onChangeThumbnail = async (event: any) => {
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    const { path } = await fetchUploadItemFile(formData)
    setBaseMisc({ ...baseMisc, thumbnail: path })
  }

  const onSubmit = useCallback(async () => {
    const error = {
      message: '',
    }

    if (!baseMisc.name) {
      error.message = '이름없음'
    }

    if (!baseMisc.thumbnail) {
      error.message = '썸넬없음'
    }

    if (!baseMisc.desc) {
      error.message = '설명없음'
    }

    if (!baseMisc.maxStack) {
      error.message = 'maxStack없음'
    }

    if (!baseMisc.gold) {
      error.message = 'gold없음'
    }

    if (error.message) {
      return Swal.fire({
        title: '실패',
        text: error.message || '알 수 없는 에러',
        icon: 'error',
        confirmButtonText: '닫기',
      })
    }

    if (isCreateMode) await fetchPostBaseMisc(baseMisc)
    else await fetchPutBaseMisc(baseMisc)
    router.push('/admindooboo/item/etc')
  }, [baseMisc, isCreateMode, router])

  const loadMisc = useCallback(async (baseMiscId: string) => {
    const result = await fetchGetBaseMiscOne(baseMiscId)
    setBaseMisc(result.baseMisc)
  }, [])

  useEffect(() => {
    if (params.baseMiscId !== 'create') loadMisc(params.baseMiscId)
  }, [loadMisc, params.baseMiscId])

  return (
    <div>
      <div>아이템 {isCreateMode ? '생성' : '수정'} 페이지</div>
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
                      value={baseMisc.name}
                      onChange={(e) =>
                        setBaseMisc({ ...baseMisc, name: e.target.value })
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
                  {baseMisc?.thumbnail && (
                    <div className="flex items-center gap-[10px]">
                      <img
                        src={toAPIHostURL(baseMisc.thumbnail)}
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

                  {!baseMisc?.thumbnail && (
                    <div
                      className="ff-ba ff-skew cursor-pointer bg-green-500 px-[5px] rounded flex items-center text-[16px] text-white"
                      onClick={() => onClickThumbnailUploadButton()}
                    >
                      이미지 업로드
                    </div>
                  )}
                </div>

                <div>
                  <div>category</div>
                  <select
                    className="border p-[4px]"
                    value={baseMisc.category}
                    onChange={(e) => {
                      setBaseMisc({ ...baseMisc, category: e.target.value })
                    }}
                  >
                    {Object.values(MiscTypeCategoryKind).map((baseMiscType) => {
                      return (
                        <option
                          key={`option_${baseMiscType}`}
                          value={baseMiscType}
                        >
                          {translate(baseMiscType)}
                        </option>
                      )
                    })}
                  </select>
                </div>

                <div>
                  <div>설명</div>
                  <div className="w-full">
                    <textarea
                      className="border w-full p-[5px] min-h-[150px]"
                      value={baseMisc.desc}
                      onChange={(e) =>
                        setBaseMisc({ ...baseMisc, desc: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <div>maxStack</div>
                  <div className="w-full">
                    <input
                      type="number"
                      className="border w-full p-[5px]"
                      value={baseMisc.maxStack}
                      onChange={(e) =>
                        setBaseMisc({ ...baseMisc, maxStack: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <div>iGrade</div>
                  <select
                    className="border p-[4px]"
                    value={baseMisc.iGrade}
                    onChange={(e) => {
                      setBaseMisc({ ...baseMisc, iGrade: e.target.value })
                    }}
                  >
                    {Object.values(ItemGradeKind).map((baseMiscType) => {
                      return (
                        <option
                          key={`iGrade_${baseMiscType}`}
                          value={baseMiscType}
                        >
                          {translate(baseMiscType)}
                        </option>
                      )
                    })}
                  </select>
                </div>

                <div>
                  <div>gold</div>
                  <div className="w-full">
                    <input
                      type="number"
                      className="border w-full p-[5px]"
                      value={baseMisc.gold}
                      onChange={(e) =>
                        setBaseMisc({ ...baseMisc, gold: e.target.value })
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
