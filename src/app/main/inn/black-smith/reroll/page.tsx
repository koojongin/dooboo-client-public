'use client'

import { Card } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import ItemBoxComponent from '@/components/item/item-box'
import {
  BaseDefenceGear,
  BaseWeapon,
  InnItem,
  ItemTypeKind,
} from '@/interfaces/item.interface'
import createKey from '@/services/key-generator'
import {
  fetchGetBaseDefenceGearByName,
  fetchGetBaseWeaponByName,
  fetchGetMyInventory,
  fetchReRollWeapon,
} from '@/services/api-fetch'
import toAPIHostURL from '@/services/image-name-parser'
import { InventoryActionKind } from '@/components/item/item.interface'
import WeaponBoxDetailComponent from '@/components/item/item-box/weapon-box-detail.component'
import { BaseWeaponBoxComponent } from '@/app/main/collection/maps/base-weapon-box-tooltip.component'
import {
  getReRollPrice,
  isBaseOptionReRollable,
  ValidReRollItemTypes,
} from '@/services/util'
import { BaseDefenceGearBoxComponent } from '@/app/main/collection/maps/base-defence-gear-box-tooltip.component'
import DefenceGearBoxDetailComponent from '@/components/item/item-box/defence-gear-box-detail.component'

export default function BlackSmithRerollPage() {
  const [items, setItems] = useState<InnItem[]>([])
  const [maxItemSlots, setMaxItemSlots] = useState<number>(0)
  const [gold, setGold] = useState<number>(0)
  const [selectedCraftItems, setSelectedCraftItems] = useState<InnItem[]>([])
  const [enhancePrice, setEnhancePrice] = useState<{
    price: number
  }>()

  const [baseItem, setBaseItem] = useState<BaseWeapon | BaseDefenceGear>()

  const [enhancedResult, setEnhancedResult] = useState<any>()

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

  const enhanceWeapon = async () => {
    if (selectedCraftItems?.length === 0) return
    if (
      !ValidReRollItemTypes.includes(
        selectedCraftItems[0].iType as ItemTypeKind,
      )
    )
      return
    const { isConfirmed } = await Swal.fire({
      title: `정말로 재설정하시겠습니까?`,
      confirmButtonText: '예',
      denyButtonText: `닫기`,
      showDenyButton: true,
    })

    if (isConfirmed) {
      await fetchReRollWeapon(selectedCraftItems[0]._id!)
      await Promise.all([
        Swal.fire({
          title: '재설정 되었습니다.',
          icon: 'info',
          confirmButtonText: '확인',
        }),
        refreshInventory(),
      ])
      setSelectedCraftItems([])
    }
  }
  const onSelectItem = useCallback(
    async (item: InnItem) => {
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

      const attachedWeaponIndex = selectedCraftItems.findIndex(
        (sWeapon) => sWeapon?._id === items[selectedItemIndex]._id,
      )

      if (attachedWeaponIndex < 0) {
        const emptyIndex = selectedCraftItems.findIndex((data) => !data)
        if (emptyIndex < 0) {
          setSelectedCraftItems([
            ...selectedCraftItems,
            { ...items[selectedItemIndex] },
          ])
        } else {
          const newWeapons: any = [...selectedCraftItems]
          newWeapons[emptyIndex] = { ...items[selectedItemIndex] }
          return setSelectedCraftItems(newWeapons)
        }
      } else {
        const newSelectedWeapons: any = [...selectedCraftItems]
        newSelectedWeapons[attachedWeaponIndex] = undefined
        setSelectedCraftItems(newSelectedWeapons)
      }
    },
    [items, selectedCraftItems],
  )

  const initialRefresh = useCallback(async () => {
    await refreshInventory()
    setSelectedCraftItems([])
    setEnhancePrice(undefined)
  }, [])

  const loadBaseWeapon = useCallback(async (name: string) => {
    const result = await fetchGetBaseWeaponByName(name)
    setBaseItem(result.baseWeapon)
  }, [])

  const loadBaseDefenceGear = useCallback(async (name: string) => {
    const result = await fetchGetBaseDefenceGearByName(name)
    setBaseItem(result.baseDefenceGear)
  }, [])

  useEffect(() => {
    if (selectedCraftItems?.length <= 0) {
      setBaseItem(undefined)
      return
    }
    if (!selectedCraftItems[0]) return
    if (selectedCraftItems[0].iType === ItemTypeKind.Weapon) {
      loadBaseWeapon(selectedCraftItems[0].weapon.name)
    }
    if (selectedCraftItems[0].iType === ItemTypeKind.DefenceGear) {
      loadBaseDefenceGear(selectedCraftItems[0].defenceGear.name)
    }
    setEnhancePrice({
      price: getReRollPrice(
        selectedCraftItems[0].weapon || selectedCraftItems[0].defenceGear,
      ),
    })
  }, [loadBaseDefenceGear, loadBaseWeapon, selectedCraftItems])

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
                <img
                  className="w-[50px] border border-gray-600 p-[2px] rounded"
                  src={toAPIHostURL(
                    'public/upload/items/66113b5c-4bcd-426a-90e7-c9c1bd6b9063.png',
                  )}
                />
                <div className="ff-score font-bold">[변화의 두루마리] x1</div>
              </div>
              <div>가 인벤토리에 있어야합니다.</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-[2px]">
            <div>대상 아이템</div>
            <div className="bg-white relative flex border-[1px] border-r rounded-md w-[50px] h-[50px] items-center justify-center">
              {selectedCraftItems[0] && (
                <ItemBoxComponent
                  className="p-[2px]"
                  item={selectedCraftItems[0]}
                  onShowTotalDamage
                  actionCallback={() => {}}
                  // onSelect={onSelectItem}
                />
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <div
              className="text-[24px] bg-green-500 text-white px-[6px] py-[4px] rounded cursor-pointer"
              onClick={() => enhanceWeapon()}
            >
              재설정하기
            </div>
          </div>

          {enhancePrice && (
            <div className="flex items-center gap-[4px] justify-center mb-[10px]">
              <div>소모 비용 :</div>
              <img src="/images/icon_currency.png" className="w-[30px]" />
              <div>{enhancePrice.price.toLocaleString()}</div>
            </div>
          )}
          {selectedCraftItems[0]?.iType === ItemTypeKind.Weapon && (
            <div className="flex flex-col justify-center items-center gap-[4px] mb-[10px]">
              {baseItem && (
                <div className="text-[14px] ff-score-all">
                  <BaseWeaponBoxComponent baseWeapon={baseItem as BaseWeapon} />
                </div>
              )}
              <div className="font-bold flex h-full items-center px-[10px] text-white text-[24px]">
                <div className="rounded bg-green-500 w-[40px] h-[40px] flex items-center justify-center border-2 border-green-800 border-dashed p-[4px]">
                  <i className="fa-solid fa-arrows-rotate" />
                </div>
              </div>

              <div className="w-[300px] text-[14px]">
                <WeaponBoxDetailComponent item={selectedCraftItems[0]} />
              </div>
            </div>
          )}

          {selectedCraftItems[0]?.iType === ItemTypeKind.DefenceGear && (
            <div className="flex flex-col justify-center items-center gap-[4px] mb-[10px]">
              {baseItem && (
                <div className="text-[14px] ff-score-all">
                  <BaseDefenceGearBoxComponent
                    baseDefenceGear={baseItem as BaseDefenceGear}
                  />
                </div>
              )}
              <div className="font-bold flex h-full items-center px-[10px] text-white text-[24px]">
                <div className="rounded bg-green-500 w-[40px] h-[40px] flex items-center justify-center border-2 border-green-800 border-dashed p-[4px]">
                  <i className="fa-solid fa-arrows-rotate" />
                </div>
              </div>

              <div className="w-[300px] text-[14px]">
                <DefenceGearBoxDetailComponent item={selectedCraftItems[0]} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-[2px] text-[16px] mt-[20px]">
            <div className="flex items-center gap-[5px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>아이템의 기본 옵션만 재설정됩니다.</div>
            </div>
            <div className="flex items-center gap-[5px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>
                재설정되는 랜덤 수치는 도감에 공개된 값에 의해 결정됩니다.
              </div>
            </div>
            <div className="flex items-center gap-[5px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div className="text-red-600">
                강화된 무기는 재설정 할 수 없습니다.
              </div>
            </div>
          </div>
        </div>

        <div className="grow basis-1 border flex justify-center">
          <div className="flex flex-col">
            <div>인벤토리</div>
            <div className="">
              <div>
                <div className="flex flex-wrap min-w-[514px] max-w-[514px] bg-gray-100 p-[2px] rounded shadow-md gap-[1px]">
                  {new Array(100).fill(1).map((value, index) => {
                    const item = items[index] || {}
                    const disableSlotClass = 'bg-gray-800'
                    const isOveredSlot = index >= maxItemSlots
                    const invalidItem = !isBaseOptionReRollable(item)
                    const isDisabled = isOveredSlot || (item?.id && invalidItem)
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
                            actions={[InventoryActionKind.Share]}
                            actionCallback={() => {}}
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
