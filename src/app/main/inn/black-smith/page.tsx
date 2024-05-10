'use client'

import { Card } from '@material-tailwind/react'
import { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import {
  fetchEnhanceWeapon,
  fetchGetEnhancePrice,
  fetchGetMyInventory,
} from '@/services/api-fetch'
import {
  EnhancedResultDialogRef,
  InnItem,
  ItemTypeKind,
} from '@/interfaces/item.interface'
import createKey from '@/services/key-generator'
import EnhancedResultDialog from './enhanced-result-dialog'
import ItemBoxComponent from '@/components/item/item-box'

export default function BlackSmithPage() {
  const enhancedResultDialogRef = useRef<EnhancedResultDialogRef>()
  const [items, setItems] = useState<InnItem[]>([])
  const [maxItemSlots, setMaxItemSlots] = useState<number>(0)
  const [gold, setGold] = useState<number>(0)
  const [isFulledInventory, setIsFulledInventory] = useState<boolean>()
  const [selectedWeapons, setSelectedWeapons] = useState<InnItem[]>([])
  const [enhancePrice, setEnhancePrice] = useState<{
    price: number
    successRate: number
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
    setIsFulledInventory(isFulled)
  }

  const enhanceWeapon = async () => {
    const weapons = selectedWeapons.filter((d) => !!d)
    if (weapons.length !== 4) {
      await Swal.fire({
        title: '강화 재료를 모두 선택하세요',
        text: '-' || '?',
        icon: 'error',
        denyButtonText: `닫기`,
      })
      return
    }

    const { isConfirmed } = await Swal.fire({
      title: '정말로 강화하시겠습니까?',
      text: '-' || '?',
      icon: 'question',
      confirmButtonText: '예',
      denyButtonText: `닫기`,
      showDenyButton: true,
    })

    if (isConfirmed) {
      const result = await fetchEnhanceWeapon(selectedWeapons[0]._id!, {
        itemIds: [
          selectedWeapons[1]._id!,
          selectedWeapons[2]._id!,
          selectedWeapons[3]._id!,
        ],
      })
      await initialRefresh()

      if (result.isSuccess) {
        setEnhancedResult(result)
      } else {
        setEnhancedResult(undefined)
      }
      enhancedResultDialogRef.current?.open()
    }
  }
  const onSelectItem = async (item: InnItem) => {
    const maxItemSelectableCount = 4
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

  const updateEnhancePrice = async () => {
    setEnhancePrice(undefined)
    if (!selectedWeapons[0]) return
    const result = await fetchGetEnhancePrice(selectedWeapons[0]._id!)
    if (selectedWeapons[0]) setEnhancePrice(result)
  }

  const initialRefresh = async () => {
    await refreshInventory()
    setSelectedWeapons([])
    setEnhancePrice(undefined)
  }

  useEffect(() => {
    if (selectedWeapons?.length <= 0) return
    updateEnhancePrice()
  }, [selectedWeapons])

  useEffect(() => {
    initialRefresh()
  }, [])
  return (
    <div>
      <EnhancedResultDialog
        ref={enhancedResultDialogRef}
        result={enhancedResult}
      />
      <Card className="rounded p-[8px]">
        <div className="flex items-center">
          <img src="/images/icon_currency.png" className="w-[30px]" />
          <div>{gold.toLocaleString()}</div>
        </div>
        <div className="flex items-stretch gap-[10px]">
          <div className="grow basis-1 border flex flex-col gap-[2px] p-[8px] justify-center">
            <div className="w-full text-[16px] flex justify-center mb-[20px]">
              오른쪽의 인벤토리에서 강화할 아이템과 재료 아이템을 선택하세요
            </div>

            <div className="flex items-center justify-center gap-[2px]">
              <div>원본</div>
              <div className="bg-white relative flex border-[1px] border-r rounded-md w-[50px] h-[50px] items-center justify-center flex">
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
            <div className="flex items-center justify-center gap-[2px]">
              <div>재료</div>
              <div className="bg-white relative flex border-[1px] border-r rounded-md w-[50px] h-[50px] items-center justify-center flex">
                {selectedWeapons[1] && (
                  <ItemBoxComponent
                    className="p-[2px]"
                    item={selectedWeapons[1]}
                    onShowTotalDamage
                    actionCallback={() => {}}
                    // onSelect={onSelectItem}
                  />
                )}
              </div>
              <div className="bg-white relative flex border-[1px] border-r rounded-md w-[50px] h-[50px] items-center justify-center flex">
                {selectedWeapons[2] && (
                  <ItemBoxComponent
                    className="p-[2px]"
                    item={selectedWeapons[2]}
                    onShowTotalDamage
                    actionCallback={() => {}}
                    // onSelect={onSelectItem}
                  />
                )}
              </div>
              <div className="bg-white relative flex border-[1px] border-r rounded-md w-[50px] h-[50px] items-center justify-center flex">
                {selectedWeapons[3] && (
                  <ItemBoxComponent
                    className="p-[2px]"
                    item={selectedWeapons[3]}
                    onShowTotalDamage
                    actionCallback={() => {}}
                    // onSelect={onSelectItem}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-center items-center w-full border rounded">
              <div className="text-[20px] min-h-[30px] flex justify-center items-center">
                {enhancePrice && (
                  <div className="flex items-center gap-[2px]">
                    <div className="text-green-500">
                      성공률: {enhancePrice.successRate}%
                    </div>
                    <div className="flex items-center text-amber-600">
                      <div>{enhancePrice.price.toLocaleString()}</div>
                      <img
                        src="/images/icon_currency.png"
                        className="w-[30px]"
                      />
                    </div>
                  </div>
                )}
                {!enhancePrice && <div>알수없음</div>}
              </div>
            </div>

            <div className="flex justify-center">
              <div
                className="text-[24px] bg-green-500 text-white px-[6px] py-[4px] rounded cursor-pointer"
                onClick={() => enhanceWeapon()}
              >
                강화하기
              </div>
            </div>

            <div className="flex flex-col gap-[2px] text-[16px] mt-[20px]">
              <div className="text-[20px]">강화</div>
              <div>재료 아이템 3개를 소모하여, 원본 아이템을 강화합니다.</div>
              <div>
                원본과 재료는 동일한 아이템 이어야하며, 소모된 아이템은
                삭제됩니다.
              </div>
              <div>강화 성공 확률은 현재 강화레벨에 따라 변동됩니다.</div>
              <div>
                강화 성공 시, 아이템의 [1 ~ (총 물리+화염+냉기+번개 데미지)의
                10% ] 값이 랜덤한 데미지로 추가 됩니다.
              </div>
            </div>
          </div>

          <div className="grow basis-1 border flex justify-center">
            <div className="flex  flex-col">
              <div>인벤토리</div>
              <div className="">
                <div>
                  <div className="flex flex-wrap max-w-[514px] bg-gray-100 p-[2px] rounded shadow-md gap-[1px]">
                    {new Array(100).fill(1).map((value, index) => {
                      const item = items[index] || {}
                      const disableSlotClass = 'bg-gray-800'
                      const isOveredSlot =
                        index >= maxItemSlots ||
                        item?.iType === ItemTypeKind.Misc
                      return (
                        <div
                          key={`black_smith_${item?._id || createKey()}`}
                          className={`bg-white relative flex border-[1px] border-r rounded-md w-[50px] h-[50px] ${isOveredSlot ? disableSlotClass : ''} ${item?.isSelected ? 'border-red-300' : ''}`}
                        >
                          {isOveredSlot && (
                            <div className="absolute z-10 bg-gray-800 bg-opacity-60 w-[50px] h-[50px] rounded" />
                          )}
                          {item && (
                            <ItemBoxComponent
                              className="p-[2px]"
                              item={item}
                              onShowTotalDamage
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
    </div>
  )
}
