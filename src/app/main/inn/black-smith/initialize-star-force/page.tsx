'use client'

import { Card } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import ItemBoxComponent from '@/components/item/item-box'
import {
  InnItem,
  Item,
  ItemTypeKind,
  Weapon,
} from '@/interfaces/item.interface'
import createKey from '@/services/key-generator'
import {
  fetchGetEnhancePrice,
  fetchGetMyInventory,
  fetchInitializeStarForce,
  fetchReRollWeapon,
} from '@/services/api-fetch'
import toAPIHostURL from '@/services/image-name-parser'
import { InventoryActionKind } from '@/components/item/item.interface'
import { isInitStarForcable, isWeaponEnhanceable } from '@/services/util'

export default function BlackSmithInitializeStarForcePage() {
  const [items, setItems] = useState<InnItem[]>([])
  const [maxItemSlots, setMaxItemSlots] = useState<number>(0)
  const [gold, setGold] = useState<number>(0)
  const [selectedItems, setSelectedItems] = useState<InnItem[]>([])
  const [enhancePrice, setEnhancePrice] = useState<{
    price: number
  }>()

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
    if (selectedItems?.length === 0) return
    if (!selectedItems[0]?.weapon && !selectedItems[0]?.defenceGear) return
    const { isConfirmed } = await Swal.fire({
      title: `정말로 초기화하시겠습니까?`,
      confirmButtonText: '예',
      denyButtonText: `닫기`,
      showDenyButton: true,
    })

    if (isConfirmed) {
      await fetchInitializeStarForce(selectedItems[0]._id!)
      await Promise.all([
        Swal.fire({
          title: '초기화 되었습니다.',
          icon: 'info',
          confirmButtonText: '확인',
        }),
        refreshInventory(),
      ])
      setSelectedItems([])
    }
  }
  const onSelectItem = async (item: InnItem) => {
    const maxItemSelectableCount = 1
    const _selectedItems = items.filter((i) => i.isSelected)
    if (maxItemSelectableCount <= _selectedItems.length) {
      if (!_selectedItems.find((sItem) => sItem._id === item._id)) return
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

    const attachedWeaponIndex = _selectedItems.findIndex(
      (sWeapon) => sWeapon?._id === items[selectedItemIndex]._id,
    )

    if (attachedWeaponIndex < 0) {
      const emptyIndex = _selectedItems.findIndex((data) => !data)
      if (emptyIndex < 0) {
        setSelectedItems([..._selectedItems, { ...items[selectedItemIndex] }])
      } else {
        const newWeapons: any = [..._selectedItems]
        newWeapons[emptyIndex] = { ...items[selectedItemIndex] }
        return setSelectedItems(newWeapons)
      }
    } else {
      const newSelectedWeapons: any = [..._selectedItems]
      newSelectedWeapons[attachedWeaponIndex] = undefined
      setSelectedItems(newSelectedWeapons)
    }
  }

  const initialRefresh = useCallback(async () => {
    await refreshInventory()
    setSelectedItems([])
    setEnhancePrice(undefined)
  }, [])

  const getReRollPrice = (item: Item) => {
    const originItem = item.defenceGear || item.weapon
    const price = parseInt(String((originItem.iLevel - 1) / 10), 10) * 100000
    return Math.max(price, 0)
  }

  useEffect(() => {
    if (selectedItems?.length <= 0) return
    if (!selectedItems[0]) return
    setEnhancePrice({
      price: getReRollPrice(selectedItems[0]),
    })
  }, [selectedItems])

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
                  src="/images/black-smith/init-star-force.png"
                />
                <div className="ff-score font-bold">
                  [스타포스 초기화 스크롤] x1
                </div>
              </div>
              <div>이 인벤토리에 있어야합니다.</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-[2px]">
            <div>대상 아이템</div>
            <div className="bg-white relative flex border-[1px] border-r rounded-md w-[50px] h-[50px] items-center justify-center">
              {selectedItems[0] && (
                <ItemBoxComponent
                  className="p-[2px]"
                  item={selectedItems[0]}
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
              초기화하기
            </div>
          </div>

          <div className="flex flex-col gap-[2px] text-[16px] mt-[20px]">
            <div className="flex items-center gap-[5px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>아이템의 스타포스 레벨 및 파워가 초기화됩니다.</div>
            </div>
            <div className="flex items-center gap-[5px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>스타포스가 초기화되고, 무기의 기본 속성이 재설정됩니다.</div>
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
                    const invalidItem = !isInitStarForcable(item)
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
