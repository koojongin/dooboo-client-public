'use client'

import Swal from 'sweetalert2'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button, Card, CardBody, Chip, Input } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import {
  fetchGetBaseWeapon,
  fetchPostBaseWeapon,
  fetchPutBaseWeapon,
  fetchUploadItemFile,
} from '@/services/api-fetch'
import { BaseWeapon } from '@/interfaces/item.interface'
import createKey from '@/services/key-generator'
import toAPIHostURL from '@/services/image-name-parser'
import { MonsterListRef } from '@/interfaces/monster.interface'

export default function Page({
  params,
  searchParams,
}: {
  params: { weaponId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const router = useRouter()
  const imageUploadRef = useRef<any>(null)
  const isCreateMode = params?.weaponId === 'create'
  const [weapon, setWeapon] = useState<BaseWeapon | any>()
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      name: '',
      damageOfPhysicalMin: 0,
      damageOfPhysicalMax: 0,
      damageOfFireMin: 0,
      damageOfFireMax: 0,
      damageOfColdMin: 0,
      damageOfColdMax: 0,
      damageOfLightningMin: 0,
      damageOfLightningMax: 0,
      criticalMultiplierMin: 0,
      criticalMultiplierMax: 0,
      criticalRateMin: 0,
      criticalRateMax: 0,
      gold: 0,
      maxStarForce: 5,
      iLevel: 1,
    },
  })

  const onClickThumbnailUploadButton = () => {
    imageUploadRef.current.click()
  }

  const onChangeThumbnail = async (event: any) => {
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    const { path } = await fetchUploadItemFile(formData)
    setWeapon({ ...weapon, thumbnail: path })
  }

  const loadWeapon = async (weaponId: string) => {
    const { weapon: rWeapon } = await fetchGetBaseWeapon(weaponId)
    if (!rWeapon) {
      return Swal.fire({
        title: '아이템을 찾을 수 없습니다.',
        text: '문제가 계속되면 관리자에게 문의해주세요',
        icon: 'error',
        confirmButtonText: '확인',
      })
    }

    setWeapon(rWeapon)
    setValue('name', rWeapon.name)
    setValue('damageOfPhysicalMin', rWeapon.damageOfPhysical[0])
    setValue('damageOfPhysicalMax', rWeapon.damageOfPhysical[1])
    setValue('damageOfFireMin', rWeapon.damageOfFire[0])
    setValue('damageOfFireMax', rWeapon.damageOfFire[1])
    setValue('damageOfColdMin', rWeapon.damageOfCold[0])
    setValue('damageOfColdMax', rWeapon.damageOfCold[1])
    setValue('damageOfLightningMin', rWeapon.damageOfLightning[0])
    setValue('damageOfLightningMax', rWeapon.damageOfLightning[1])

    setValue('criticalRateMin', rWeapon.criticalRate[0])
    setValue('criticalRateMax', rWeapon.criticalRate[1])

    setValue('criticalMultiplierMin', rWeapon.criticalMultiplier[0])
    setValue('criticalMultiplierMax', rWeapon.criticalMultiplier[1])

    setValue('gold', rWeapon.gold)
    setValue('iLevel', rWeapon.iLevel)
    setValue('maxStarForce', rWeapon.maxStarForce)
  }

  const checkValidation = (formData: any) => {
    const error = {
      message: '',
      invalid: false,
    }

    if (!formData.name) {
      error.invalid = true
      error.message = '아이템 명이 없습니다.'
    }

    if (!weapon.thumbnail) {
      error.invalid = true
      error.message = '아이템 이미지가 없습니다.'
    }

    if (formData.damageOfPhysicalMin > formData.damageOfPhysicalMax) {
      error.invalid = true
      error.message = '물리 피해 최소는 최대보다 클 수 없음'
    }

    if (formData.damageOfFireMin > formData.damageOfFireMax) {
      error.invalid = true
      error.message = '화염 피해 최소는 최대보다 클 수 없음'
    }
    if (formData.damageOfColdMin > formData.damageOfColdMax) {
      error.invalid = true
      error.message = '냉기 피해 최소는 최대보다 클 수 없음'
    }
    if (formData.damageOfLightningMin > formData.damageOfLightningMax) {
      error.invalid = true
      error.message = '번개 피해 최소는 최대보다 클 수 없음'
    }
    if (formData.criticalRateMin > formData.criticalRateMax) {
      error.invalid = true
      error.message = '치명타 확률 최소는 최대보다 클 수 없음'
    }
    if (formData.criticalMultiplierMin > formData.criticalMultiplierMax) {
      error.invalid = true
      error.message = '치명타 배율 최소는 최대보다 클 수 없음'
    }

    return error
  }

  const updateNumberString = () => {
    setValue(
      'damageOfPhysicalMin',
      parseFloat(`${getValues('damageOfPhysicalMin')}`),
    )
    setValue(
      'damageOfPhysicalMax',
      parseFloat(`${getValues('damageOfPhysicalMax')}`),
    )
    setValue('damageOfFireMin', parseFloat(`${getValues('damageOfFireMin')}`))
    setValue('damageOfFireMax', parseFloat(`${getValues('damageOfFireMax')}`))
    setValue('damageOfColdMin', parseFloat(`${getValues('damageOfColdMin')}`))
    setValue('damageOfColdMax', parseFloat(`${getValues('damageOfColdMax')}`))
    setValue(
      'damageOfLightningMin',
      parseFloat(`${getValues('damageOfLightningMin')}`),
    )
    setValue(
      'damageOfLightningMax',
      parseFloat(`${getValues('damageOfLightningMax')}`),
    )

    setValue('criticalRateMin', parseFloat(`${getValues('criticalRateMin')}`))
    setValue('criticalRateMax', parseFloat(`${getValues('criticalRateMax')}`))

    setValue(
      'criticalMultiplierMin',
      parseFloat(`${getValues('criticalMultiplierMin')}`),
    )
    setValue(
      'criticalMultiplierMax',
      parseFloat(`${getValues('criticalMultiplierMax')}`),
    )
  }
  const onSubmit = async () => {
    updateNumberString()
    const { message, invalid } = checkValidation(getValues())

    if (invalid) {
      Swal.fire({
        title: '실패',
        text: message || '알 수 없는 에러',
        icon: 'error',
        confirmButtonText: '닫기',
      })
      return
    }

    const newWeapon = {
      ...weapon,
      gold: getValues('gold'),
      name: getValues('name'),
      iLevel: getValues('iLevel'),
      maxStarForce: getValues('maxStarForce'),
      damageOfPhysical: [
        getValues('damageOfPhysicalMin'),
        getValues('damageOfPhysicalMax'),
      ],
      damageOfCold: [
        getValues('damageOfColdMin'),
        getValues('damageOfColdMax'),
      ],
      damageOfFire: [
        getValues('damageOfFireMin'),
        getValues('damageOfFireMax'),
      ],
      damageOfLightning: [
        getValues('damageOfLightningMin'),
        getValues('damageOfLightningMax'),
      ],
      criticalRate: [
        getValues('criticalRateMin'),
        getValues('criticalRateMax'),
      ],
      criticalMultiplier: [
        getValues('criticalMultiplierMin'),
        getValues('criticalMultiplierMax'),
      ],
    }
    setWeapon(newWeapon)

    if (isCreateMode) {
      const result = await fetchPostBaseWeapon(newWeapon)
    } else {
      const result = await fetchPutBaseWeapon(newWeapon)
    }

    await Swal.fire({
      title: '성공',
      text: `아이템이 ${isCreateMode ? '생성' : '수정'} 되었습니다.`,
      icon: 'success',
      confirmButtonText: '닫기',
    })
    router.push('/admindooboo/item/weapon')
  }

  const convertWeaponValueForElement = (value: any) => {
    // eslint-disable-next-line default-case
    switch (typeof value) {
      case 'string':
        return value
      case 'object':
        if (Array.isArray(value)) {
          return value.join('~')
        }
        return value
    }
    return value
  }

  useEffect((): any => {
    if (!params?.weaponId) {
      return Swal.fire({
        title: '잘못된 접근입니다.',
        text: '아이템 아이디를 확인할 수 없습니다.',
        icon: 'error',
        confirmButtonText: '확인',
      })
      return
    }

    if (isCreateMode) {
      return
    }
    loadWeapon(params.weaponId)
  }, [])

  return (
    <div>
      <div>아이템 {isCreateMode ? '생성' : '수정'} 페이지</div>
      <div className="flex gap-5">
        <Card className="overflow-auto">
          <CardBody>
            <Chip
              variant="outlined"
              size="lg"
              value={`${isCreateMode ? '아이템 옵션' : '수정 옵션'}`}
              className="mb-5 text-[16px] pt-2.5"
            />
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="[&>*]:flex [&>*]:items-center [&>*]:gap-1 [&>*>:first-child]:min-w-[150px] flex flex-col gap-2">
                <div>
                  <div>아이템 명</div>
                  <div>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Input label="이름" {...field} value={field.value} />
                      )}
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
                  {weapon?.thumbnail && (
                    <div>
                      <img
                        src={toAPIHostURL(weapon.thumbnail)}
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

                  {!weapon?.thumbnail && (
                    <div
                      className="ff-ba ff-skew cursor-pointer bg-green-500 px-[5px] rounded flex items-center text-[16px] text-white"
                      onClick={() => onClickThumbnailUploadButton()}
                    >
                      이미지 업로드
                    </div>
                  )}
                </div>

                <div>
                  <div>+물리 피해</div>
                  <div className="flex">
                    <Controller
                      name="damageOfPhysicalMin"
                      control={control}
                      render={({ field }) => (
                        <Input
                          label="물리 피해 최소"
                          {...field}
                          type="number"
                        />
                      )}
                    />
                    <div>~</div>
                    <Controller
                      name="damageOfPhysicalMax"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          label="물리 피해 최대"
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>

                <div>
                  <div>+화염 피해</div>
                  <div className="flex">
                    <Controller
                      name="damageOfFireMin"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          label="화염 피해 최소"
                          {...field}
                        />
                      )}
                    />
                    <div>~</div>
                    <Controller
                      name="damageOfFireMax"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          label="화염 피해 최대"
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>

                <div>
                  <div>+냉기 피해</div>
                  <div className="flex">
                    <Controller
                      name="damageOfColdMin"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          label="냉기 피해 최소"
                          {...field}
                        />
                      )}
                    />
                    <div>~</div>
                    <Controller
                      name="damageOfColdMax"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          label="냉기 피해 최대"
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>
                {/*--------------------------------*/}
                <div>
                  <div>+번개 피해</div>
                  <div className="flex">
                    <Controller
                      name="damageOfLightningMin"
                      control={control}
                      render={({ field }) => (
                        <Input label="번개 피해 최소" {...field} />
                      )}
                    />
                    <div>~</div>
                    <Controller
                      name="damageOfLightningMax"
                      control={control}
                      render={({ field }) => (
                        <Input label="번개 피해 최대" {...field} />
                      )}
                    />
                  </div>
                </div>

                {/*--------------------------------*/}
                <div>
                  <div>추가 치명타 확률</div>
                  <div className="flex">
                    <Controller
                      name="criticalRateMin"
                      control={control}
                      render={({ field }) => (
                        <Input label="치명타 확률 최소" {...field} />
                      )}
                    />
                    <div>~</div>
                    <Controller
                      name="criticalRateMax"
                      control={control}
                      render={({ field }) => (
                        <Input label="치명타 확률 최대" {...field} />
                      )}
                    />
                  </div>
                </div>

                {/*--------------------------------*/}
                <div>
                  <div>추가 치명타 배율</div>
                  <div className="flex">
                    <Controller
                      name="criticalMultiplierMin"
                      control={control}
                      render={({ field }) => (
                        <Input label="치명타 배율 최소" {...field} />
                      )}
                    />
                    <div>~</div>
                    <Controller
                      name="criticalMultiplierMax"
                      control={control}
                      render={({ field }) => (
                        <Input label="치명타 배율 최대" {...field} />
                      )}
                    />
                  </div>
                </div>
                {/* ================================================================= */}

                <div>
                  <div>판매가</div>
                  <div className="flex">
                    <Controller
                      name="gold"
                      control={control}
                      render={({ field }) => <Input label="gold" {...field} />}
                    />
                  </div>
                </div>
                {/* ================================================================= */}

                <div>
                  <div>아이템 레벨</div>
                  <div className="flex">
                    <Controller
                      name="iLevel"
                      control={control}
                      render={({ field }) => (
                        <Input label="iLevel" {...field} />
                      )}
                    />
                  </div>
                </div>
                {/* ================================================================= */}

                <div>
                  <div>최대 강화</div>
                  <div className="flex">
                    <Controller
                      name="maxStarForce"
                      control={control}
                      render={({ field }) => (
                        <Input label="maxStarForce" {...field} />
                      )}
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
                  onClick={handleSubmit(onSubmit)}
                >
                  {isCreateMode ? '생성' : '수정'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
        {!isCreateMode && (
          <Card>
            <CardBody>
              <Chip
                variant="outlined"
                size="lg"
                value="원본 옵션"
                className="mb-5 text-[16px] pt-2.5"
              />
              <div>
                {weapon &&
                  Object.entries(weapon).map(([key, value]) => {
                    return (
                      <div key={createKey()} className="flex gap-1">
                        <div className="min-w-[250px]">{key}</div>
                        <div>{convertWeaponValueForElement(value)}</div>
                      </div>
                    )
                  })}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  )
}
