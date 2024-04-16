'use client'

import Swal from 'sweetalert2'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button, Card, CardBody, Chip, Input } from '@material-tailwind/react'
import _ from 'lodash'
import { fetchGetBaseWeapon } from '@/services/api-fetch'
import { BaseWeapon } from '@/interfaces/item.interface'
import createKey from '@/services/key-generator'

export default function Page({
  params,
  searchParams,
}: {
  params: { weaponId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const [weapon, setWeapon] = useState<BaseWeapon>()
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
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
    },
  })

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
  }

  const onSubmit = async (data: any) => {
    console.log(data)
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
    loadWeapon(params.weaponId)
  }, [])

  return (
    <div>
      <div>아이템 수정 페이지</div>
      <div className="flex gap-5">
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
        <Card className="overflow-auto">
          <CardBody>
            <Chip
              variant="outlined"
              size="lg"
              value="수정 옵션"
              className="mb-5 text-[16px] pt-2.5"
            />
            <form onSubmit={handleSubmit(onSubmit)}>
              {weapon && (
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
                    <div>+물리 피해</div>
                    <div className="flex">
                      <Controller
                        name="damageOfPhysicalMin"
                        control={control}
                        render={({ field }) => (
                          <Input label="물리 피해 최소" {...field} />
                        )}
                      />
                      <div>~</div>
                      <Controller
                        name="damageOfPhysicalMax"
                        control={control}
                        render={({ field }) => (
                          <Input label="물리 피해 최대" {...field} />
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
                          <Input label="화염 피해 최소" {...field} />
                        )}
                      />
                      <div>~</div>
                      <Controller
                        name="damageOfFireMax"
                        control={control}
                        render={({ field }) => (
                          <Input label="화염 피해 최대" {...field} />
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
                          <Input label="냉기 피해 최소" {...field} />
                        )}
                      />
                      <div>~</div>
                      <Controller
                        name="damageOfColdMax"
                        control={control}
                        render={({ field }) => (
                          <Input label="냉기 피해 최대" {...field} />
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
                    <div>획득 골드</div>
                    <div className="flex">
                      <Controller
                        name="gold"
                        control={control}
                        render={({ field }) => (
                          <Input label="gold" {...field} />
                        )}
                      />
                    </div>
                  </div>
                  {/* ================================================================= */}
                </div>
              )}
              <div className="flex justify-center mt-5">
                <Button
                  className="w-full"
                  size="md"
                  color="blue"
                  onClick={handleSubmit(onSubmit)}
                >
                  수정
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
