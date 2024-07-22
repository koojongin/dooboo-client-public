'use client'

import { Card } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import { fetchGetBaseWeaponList } from '@/services/api-fetch'
import { BaseWeapon, WeaponType } from '@/interfaces/item.interface'
import createKey from '@/services/key-generator'
import toAPIHostURL from '@/services/image-name-parser'
import { translate } from '@/services/util'
import { Pagination } from '@/interfaces/common.interface'

export default function CollectionItemsPage() {
  const [weapons, setWeapons] = useState<BaseWeapon[]>([])
  const [pagination, setPagination] = useState<Pagination>()
  const [isAllWeaponTypeChecked, setIsAllWeaponTypeChecked] =
    useState<boolean>(true)
  const [selectedWeaponTypes, setSelectedWeaponTypes] = useState<
    { name: string; isSelected: boolean }[]
  >(
    Object.values(WeaponType).map((w) => ({
      name: w,
      isSelected: true,
    })),
  )

  const loadWeapons = useCallback(
    async (selectedPage?: number) => {
      const {
        weapons: rWeapons,
        page,
        total,
        totalPages,
      } = await fetchGetBaseWeaponList(
        {
          weaponType: {
            $in: selectedWeaponTypes
              .filter((i) => i.isSelected)
              .map((i) => i.name),
          },
        },
        { page: selectedPage || 1 },
      )
      setWeapons(rWeapons)
      setPagination({ page, total, totalPages })
    },
    [selectedWeaponTypes],
  )

  const onChangeWeaponType = (e: any, index: number) => {
    const newSelected = [...selectedWeaponTypes]
    newSelected[index].isSelected = e.target.checked
    setSelectedWeaponTypes(newSelected)
  }

  const onChangeAllWeaponCheck = () => {
    setSelectedWeaponTypes([
      ...selectedWeaponTypes.map((w) => {
        const nW = { ...w }
        nW.isSelected = !isAllWeaponTypeChecked
        return nW
      }),
    ])
    setIsAllWeaponTypeChecked(!isAllWeaponTypeChecked)
  }

  useEffect(() => {
    loadWeapons()
  }, [loadWeapons])
  return (
    <div className="w-full">
      <Card className="rounded p-[10px]">
        <div className="flex flex-col overflow-x-scroll">
          {/* Conditions Start */}
          {pagination && (
            <div className="flex items-center gap-[2px]">
              <div>{pagination.total}개의 아이템 검색됨</div>
              <div>
                [페이지 {pagination.page}/{pagination.totalPages}]
              </div>
            </div>
          )}
          <div className="flex items-center gap-[8px]">
            <label
              className="flex items-center cursor-pointer"
              key={createKey()}
            >
              <input
                type="checkbox"
                defaultChecked={isAllWeaponTypeChecked}
                onChange={() => onChangeAllWeaponCheck()}
              />
              전체
            </label>
            {selectedWeaponTypes.map((weaponType, index) => {
              return (
                <label
                  className="flex items-center cursor-pointer"
                  key={createKey()}
                >
                  <input
                    type="checkbox"
                    defaultChecked={weaponType.isSelected}
                    onChange={(e) => onChangeWeaponType(e, index)}
                  />
                  {translate(weaponType.name)}
                </label>
              )
            })}
          </div>
          {/* Conditions End */}

          {/* List Start */}
          <div className="flex">
            <div className="flex flex-row items-center text-[16px] font-bold border-cyan-800 border-b border-t border-dashed min-h-[40px]">
              <div className="min-w-[36px]" />
              <div className="ff-score min-w-[120px]">이름</div>
              <div className="ff-score min-w-[100px]">합산 피해</div>
              <div className="ff-score min-w-[80px]">평균 값</div>
              <div className="ff-score min-w-[80px]">타입</div>
              <div className="ff-score min-w-[50px]">iLv</div>
              <div className="ff-score min-w-[50px]">강화</div>
              <div className="ff-score min-w-[100px]">물리 피해</div>
              <div className="ff-score min-w-[100px]">냉기 피해</div>
              <div className="ff-score min-w-[100px]">화염 피해</div>
              <div className="ff-score min-w-[100px]">번개 피해</div>
              <div className="ff-score min-w-[100px]">치명타 확률</div>
              <div className="ff-score min-w-[100px]">치명타 배율</div>
              <div className="ff-score min-w-[100px]">판매가</div>
            </div>
          </div>
          {weapons.map((weapon) => {
            return (
              <div className="flex" key={createKey()}>
                <WeaponRow weapon={weapon} />
              </div>
            )
          })}
          {/* List End */}
        </div>
        {/* PAGINATION START */}
        {pagination && (
          <div className="w-full flex justify-center mt-[15px]">
            <div className="flex gap-[4px]">
              {new Array(pagination.totalPages).fill(1).map((value, index) => {
                return (
                  <div
                    onClick={() => loadWeapons(index + 1)}
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
        {/* PAGINATION END */}
      </Card>
    </div>
  )
}

function WeaponRow({ weapon }: { weapon: BaseWeapon }) {
  const minFlatDamage =
    weapon.damageOfPhysical[0] +
    weapon.damageOfCold[0] +
    weapon.damageOfFire[0] +
    weapon.damageOfLightning[0]

  const maxFlatDamage =
    weapon.damageOfPhysical[1] +
    weapon.damageOfCold[1] +
    weapon.damageOfFire[1] +
    weapon.damageOfLightning[1]
  const isZeroRange = (range: number[]) => {
    return range[0] + range[1] === 0
  }

  return (
    <div className="flex flex-row items-stretch text-[16px] font-bold [&>div]:border-r [&>div]:border-dark-blue border-b-cyan-800 border-b border-dashed">
      <div className="w-[36px] min-w-[36px] h-[36px] border border-dark-blue rounded flex items-center justify-center p-[2px] my-[2px]">
        <img src={toAPIHostURL(weapon.thumbnail)} />
      </div>
      <div className="ff-score min-w-[120px] flex items-center">
        {weapon.name}
      </div>
      <div className="ff-score min-w-[100px] flex items-center relative bg-blue-gray-500 text-white">
        {minFlatDamage} ~ {maxFlatDamage}
      </div>
      <div className="ff-score min-w-[80px] flex items-center relative bg-blue-gray-300 text-white">
        {((minFlatDamage + maxFlatDamage) / 2).toFixed(1)}
      </div>
      <div className="ff-score min-w-[80px] flex items-center relative">
        {translate(weapon.weaponType)}
      </div>
      <div className="ff-score min-w-[50px] flex items-center relative">
        {weapon.iLevel}
      </div>
      <div className="ff-score min-w-[50px] flex items-center relative">
        {weapon.maxStarForce}
      </div>
      <div className="ff-score min-w-[100px] flex items-center relative">
        {weapon.damageOfPhysical[0]} ~ {weapon.damageOfPhysical[1]}
        {isZeroRange(weapon.damageOfPhysical) && (
          <div className="w-full min-h-full bg-white z-20 absolute left-0 top-0 bg-opacity-90" />
        )}
      </div>
      <div className="ff-score min-w-[100px] flex items-center relative">
        {weapon.damageOfCold[0]} ~ {weapon.damageOfCold[1]}
        {isZeroRange(weapon.damageOfCold) && (
          <div className="w-full min-h-full bg-white z-20 absolute left-0 top-0 bg-opacity-90" />
        )}
      </div>
      <div className="ff-score min-w-[100px] flex items-center relative">
        {weapon.damageOfFire[0]} ~ {weapon.damageOfFire[1]}
        {isZeroRange(weapon.damageOfFire) && (
          <div className="w-full min-h-full bg-white z-20 absolute left-0 top-0 bg-opacity-90" />
        )}
      </div>
      <div className="ff-score min-w-[100px] flex items-center relative">
        {weapon.damageOfLightning[0]} ~ {weapon.damageOfLightning[1]}
        {isZeroRange(weapon.damageOfLightning) && (
          <div className="w-full min-h-full bg-white z-20 absolute left-0 top-0 bg-opacity-90" />
        )}
      </div>{' '}
      <div className="ff-score min-w-[100px] flex items-center relative">
        {weapon.criticalRate[0]} ~ {weapon.criticalRate[1]}
        {isZeroRange(weapon.criticalRate) && (
          <div className="w-full min-h-full bg-white z-20 absolute left-0 top-0 bg-opacity-90" />
        )}
      </div>{' '}
      <div className="ff-score min-w-[100px] flex items-center relative">
        {weapon.criticalMultiplier[0]} ~ {weapon.criticalMultiplier[1]}
        {isZeroRange(weapon.criticalMultiplier) && (
          <div className="w-full min-h-full bg-white z-20 absolute left-0 top-0 bg-opacity-90" />
        )}
      </div>
      <div className="ff-score min-w-[100px] flex items-center relative">
        {weapon.gold.toLocaleString()}
      </div>
    </div>
  )
}
