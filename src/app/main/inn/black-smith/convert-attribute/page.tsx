'use client'

import { Card } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import ItemBoxComponent from '@/components/item/item-box'
import { InnItem, ItemTypeKind, Weapon } from '@/interfaces/item.interface'
import createKey from '@/services/key-generator'
import {
  fetchConvertWeapon,
  fetchGetEnhancePrice,
  fetchGetMyInventory,
  fetchReRollWeapon,
} from '@/services/api-fetch'
import toAPIHostURL from '@/services/image-name-parser'
import { isWeaponEnhanceable, translate } from '@/services/util'
import { InventoryActionKind } from '@/components/item/item.interface'

export default function BlackSmithConvertAttributePage() {
  const [items, setItems] = useState<InnItem[]>([])
  const [maxItemSlots, setMaxItemSlots] = useState<number>(0)
  const [gold, setGold] = useState<number>(0)
  const [selectedWeapons, setSelectedWeapons] = useState<InnItem[]>([])
  const [selectedConvertType, setSelectedConvertType] = useState<
    | 'damageOfPhysical'
    | 'damageOfFire'
    | 'damageOfCold'
    | 'damageOfLightning'
    | string
  >('damageOfPhysical')

  const refreshInventory = async () => {
    const {
      items: rItems,
      slots,
      isFulled,
      gold: rGold,
    } = await fetchGetMyInventory()
    setGold(rGold)
    setItems(rItems)
    setMaxItemSlots(slots)
  }

  const convertWeapon = async () => {
    if (selectedWeapons?.length === 0) return
    if (!selectedWeapons[0]?.weapon) return
    const { isConfirmed } = await Swal.fire({
      title: `정말로 전환 하시겠습니까?`,
      confirmButtonText: '예',
      denyButtonText: `닫기`,
      showDenyButton: true,
    })

    if (isConfirmed) {
      await fetchConvertWeapon(
        selectedWeapons[0].weapon._id!,
        selectedConvertType,
      )
      await Promise.all([
        Swal.fire({
          title: '전환 되었습니다.',
          icon: 'info',
          confirmButtonText: '확인',
        }),
        refreshInventory(),
      ])
      setSelectedWeapons([])
    }
  }
  const onSelectItem = async (item: InnItem) => {
    const maxItemSelectableCount = 1
    const selectedItems = items.filter((i) => i.isSelected)
    if (maxItemSelectableCount <= selectedItems.length) {
      if (!selectedItems.find((sItem) => sItem._id === item._id)) return
    }
    const selectedItemIndex = items.findIndex((i) => i._id === item._id)
    if (selectedItemIndex < 0) return
    const newItems = items.map((originItem, index) => {
      if (selectedItemIndex === index) {
        const newItem = { ...originItem }
        newItem.isSelected = !newItem.isSelected
        return newItem
      }
      return originItem
    })
    setItems(newItems)

    const attachedWeaponIndex = selectedWeapons.findIndex(
      (sWeapon) => sWeapon?._id === items[selectedItemIndex]._id,
    )

    if (attachedWeaponIndex < 0) {
      const emptyIndex = selectedWeapons.findIndex((data) => !data)
      if (emptyIndex < 0) {
        setSelectedWeapons([
          ...selectedWeapons,
          { ...items[selectedItemIndex] },
        ])
      } else {
        const newWeapons: any = [...selectedWeapons]
        newWeapons[emptyIndex] = { ...items[selectedItemIndex] }
        return setSelectedWeapons(newWeapons)
      }
    } else {
      const newSelectedWeapons: any = [...selectedWeapons]
      newSelectedWeapons[attachedWeaponIndex] = undefined
      setSelectedWeapons(newSelectedWeapons)
    }
  }

  const initialRefresh = useCallback(async () => {
    await refreshInventory()
    setSelectedWeapons([])
  }, [])

  useEffect(() => {
    if (selectedWeapons?.length <= 0) return
    if (!selectedWeapons[0]) return
  }, [selectedWeapons])

  useEffect(() => {
    initialRefresh()
  }, [initialRefresh])
  return (
    <Card className="rounded p-[8px] ff-score-all font-bold">
      <div className="flex items-center">
        <img src="/images/icon_currency.png" className="w-[30px]" />
        <div>{gold.toLocaleString()}</div>
      </div>
      <div className="flex items-stretch gap-[10px]">
        <div className="grow basis-1 border flex flex-col gap-[2px] p-[8px] justify-center">
          <div className="w-full text-[16px] flex justify-center mb-[5px] flex-col items-center gap-[4px]">
            <div>오른쪽의 인벤토리에서 무기를 선택하세요.</div>
            <div className="flex items-center">
              <div className="flex items-center border border-gray-300 p-[2px] rounded gap-[4px]">
                <img src="/images/icon_currency.png" className="w-[30px]" />
                <div className="ff-score font-bold">x100,000</div>
              </div>
              <div>가 소모됩니다.</div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-[2px]">
            <div className="flex items-center justify-center gap-[2px]">
              <div>대상 아이템</div>
              <div className="bg-white relative flex border-[1px] border-r rounded-md w-[50px] h-[50px] items-center justify-center">
                {selectedWeapons[0] && (
                  <ItemBoxComponent
                    className="p-[2px]"
                    item={selectedWeapons[0]}
                    onShowTotalDamage
                    actionCallback={() => {}}
                    // onSelect={onSelectItem}
                  />
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-[2px]">
                <div>변환할 속성</div>
                <div className="flex flex-wrap gap-[4px]">
                  {[
                    'damageOfPhysical',
                    'damageOfFire',
                    'damageOfCold',
                    'damageOfLightning',
                  ].map((convertType) => {
                    return (
                      <div
                        key={createKey()}
                        onClick={() => setSelectedConvertType(convertType)}
                        className={`w-[50px] h-[50px] hover:bg-red-800 cursor-pointer flex items-center justify-center border border-gray-600 rounded text-[16px] 
                        ${
                          convertType === selectedConvertType
                            ? 'bg-red-400 text-white'
                            : ''
                        }`}
                      >
                        {translate(`convert:${convertType}`)}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div
              className="text-[24px] bg-green-500 text-white px-[6px] py-[4px] rounded cursor-pointer"
              onClick={() => convertWeapon()}
            >
              전환하기
            </div>
          </div>

          <div className="flex flex-col gap-[2px] text-[16px] mt-[20px]">
            <div className="flex items-center gap-[5px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div className="text-red-600">
                변환할 속성은 제거할 속성을 의미합니다.
              </div>
            </div>
            <div className="flex items-center gap-[5px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div className="text-red-600">
                변환할 속성도 제거 후 무작위 속성으로 등장할 수 있습니다.
              </div>
            </div>
            <div className="flex items-center gap-[5px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>
                아이템의 기본 옵션(물리,화염,냉기,번개 속성)만 변환됩니다.
              </div>
            </div>
            <div className="flex items-center gap-[5px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>변환할 속성의 수치를 무작위 속성중 하나에 합산합니다.</div>
            </div>
            <div className="flex items-center gap-[5px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>
                아이템의 스타포스와 관계없이 언제든지 전환 할 수 있습니다.
              </div>
            </div>
            <div className="flex items-center gap-[5px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>
                예를들어 [물리5/화염10/냉기15/번개20] 무기에 변환할 속성 [화염]
                선택 후 전환할 경우 화염10이 물리10/화염10/냉기10/번개10 중
                하나로 변환되어 기존 무기 옵션에 추가되고, 기존의 화염수치는
                사라집니다.
              </div>
            </div>
          </div>
        </div>

        <div className="grow basis-1 border flex justify-center">
          <div className="flex  flex-col">
            <div>인벤토리</div>
            <div className="">
              <div>
                <div className="flex flex-wrap min-w-[514px] max-w-[514px] bg-gray-100 p-[2px] rounded shadow-md gap-[1px]">
                  {new Array(100).fill(1).map((value, index) => {
                    const item = items[index] || {}
                    const disableSlotClass = 'bg-gray-800'
                    const isOveredSlot = index >= maxItemSlots
                    const invalidItem = isWeaponEnhanceable(item)
                    const isDisabled = isOveredSlot || invalidItem
                    return (
                      <div
                        key={`black_smith_${item?._id || createKey()}`}
                        className={`bg-white relative flex border-[1px] border-r rounded-md w-[50px] h-[50px] ${isDisabled ? disableSlotClass : ''}`}
                      >
                        {isDisabled && (
                          <div className="absolute z-10 bg-gray-800 bg-opacity-60 w-[50px] h-[50px] rounded" />
                        )}
                        {item && (
                          <ItemBoxComponent
                            className={`p-[2px] ${item?.isSelected ? 'bg-red-500' : ''}`}
                            item={item}
                            onShowTotalDamage
                            actionCallback={() => {}}
                            actions={[InventoryActionKind.Share]}
                            onSelect={onSelectItem}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
