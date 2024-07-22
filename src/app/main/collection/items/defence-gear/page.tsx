'use client'

import { Card, Tooltip } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import {
  fetchGetBaseDefenceGearList,
  fetchGetBaseWeaponList,
} from '@/services/api-fetch'
import {
  BaseDefenceGear,
  BaseWeapon,
  DefenceGearType,
  WeaponType,
} from '@/interfaces/item.interface'
import createKey from '@/services/key-generator'
import toAPIHostURL from '@/services/image-name-parser'
import { translate } from '@/services/util'
import { Pagination } from '@/interfaces/common.interface'
import { BaseDefenceGearBoxTooltipComponent } from '@/app/main/collection/maps/base-defence-gear-box-tooltip.component'
import { DropTableItem } from '@/interfaces/drop-table.interface'

export default function CollectionItemsPage() {
  const [defenceGears, setDefenceGears] = useState<BaseDefenceGear[]>([])
  const [pagination, setPagination] = useState<Pagination>()
  const [isAllWeaponTypeChecked, setIsAllWeaponTypeChecked] =
    useState<boolean>(true)
  const [selectedGearTypes, setSelectedGearTypes] = useState<
    { name: string; isSelected: boolean }[]
  >(
    Object.values(DefenceGearType).map((w) => ({
      name: w,
      isSelected: true,
    })),
  )

  const loadDefenceGears = useCallback(
    async (selectedPage?: number) => {
      const result = await fetchGetBaseDefenceGearList(
        {
          gearType: {
            $in: selectedGearTypes
              .filter((i) => i.isSelected)
              .map((i) => i.name),
          },
        },
        { page: selectedPage || 1 },
      )
      setDefenceGears(result.baseDefenceGears)
      setPagination(result)
    },
    [selectedGearTypes],
  )

  const onChangeWeaponType = (e: any, index: number) => {
    const newSelected = [...selectedGearTypes]
    newSelected[index].isSelected = e.target.checked
    setSelectedGearTypes(newSelected)
  }

  const onChangeAllWeaponCheck = () => {
    setSelectedGearTypes([
      ...selectedGearTypes.map((w) => {
        const nW = { ...w }
        nW.isSelected = !isAllWeaponTypeChecked
        return nW
      }),
    ])
    setIsAllWeaponTypeChecked(!isAllWeaponTypeChecked)
  }

  useEffect(() => {
    loadDefenceGears()
  }, [loadDefenceGears])
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
            {selectedGearTypes.map((weaponType, index) => {
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
              <div className="ff-score min-w-[200px]">이름</div>
              <div className="ff-score min-w-[100px]">방어력</div>
              <div className="ff-score min-w-[100px]">타입</div>
              <div className="ff-score min-w-[50px]">iLv</div>
              <div className="ff-score min-w-[100px]">착용 레벨</div>
              <div className="ff-score-all min-w-[80px] flex flex-col font-bold">
                <div>최대</div>
                <div>스타포스</div>
              </div>
              <div className="ff-score min-w-[100px]">판매가</div>
            </div>
          </div>
          {defenceGears.map((defenceGear) => {
            return (
              <div className="flex" key={createKey()}>
                <DefenceGearRow defenceGear={defenceGear} />
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
                    onClick={() => loadDefenceGears(index + 1)}
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

function DefenceGearRow({ defenceGear }: { defenceGear: BaseDefenceGear }) {
  const { gearType } = defenceGear
  return (
    <Tooltip
      className="bg-transparent"
      content={
        <BaseDefenceGearBoxTooltipComponent
          item={{ item: defenceGear } as DropTableItem}
        />
      }
    >
      <div className="cursor-pointer flex flex-row items-stretch text-[16px] font-bold [&>div]:border-r [&>div]:border-dark-blue border-b-cyan-800 border-b border-dashed">
        <div className="w-[36px] min-w-[36px] h-[36px] border border-dark-blue rounded flex items-center justify-center p-[2px] my-[2px]">
          <img src={toAPIHostURL(defenceGear.thumbnail)} />
        </div>
        <div className="flex items-center max-w-[200px] min-w-[200px]">
          <div className="ff-score w-full truncate overflow-ellipsis">
            {defenceGear.name}
          </div>
        </div>
        <div className="ff-score min-w-[100px] flex items-center relative bg-blue-gray-500 text-white">
          {defenceGear.armor[0]} ~ {defenceGear.armor[1]}
        </div>
        <div className="ff-score min-w-[100px] flex items-center relative">
          {translate(gearType)}
        </div>
        <div className="ff-score min-w-[50px] flex items-center relative">
          {defenceGear.iLevel}
        </div>
        <div className="ff-score min-w-[100px] flex items-center relative">
          {defenceGear.requiredEquipmentLevel}
        </div>
        <div className="ff-score min-w-[80px] flex items-center relative">
          {defenceGear.maxStarForce}
        </div>
        <div className="ff-score min-w-[100px] flex items-center relative">
          {defenceGear.gold.toLocaleString()}
        </div>
      </div>
    </Tooltip>
  )
}
