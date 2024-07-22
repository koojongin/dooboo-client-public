'use client'

import { Card } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import ItemBoxComponent from '@/components/item/item-box'
import { InnItem, ItemTypeKind } from '@/interfaces/item.interface'
import createKey from '@/services/key-generator'
import { fetchGetMyInventory, fetchReRollWeapon } from '@/services/api-fetch'
import { InventoryActionKind } from '@/components/item/item.interface'
import { isImprintable, translate, ValidReRollItemTypes } from '@/services/util'
import {
  fetchGetImprintingOptions,
  fetchImprinting,
} from '@/services/api/api.craft'

export default function BlackSmithImprintingPage() {
  const [items, setItems] = useState<InnItem[]>([])
  const [maxItemSlots, setMaxItemSlots] = useState<number>(0)
  const [gold, setGold] = useState<number>(0)
  const [selectedCraftItems, setSelectedCraftItems] = useState<InnItem[]>([])
  const [enhancePrice, setEnhancePrice] = useState<{
    price: number
  }>()

  const [imprintingOptions, setImprintingOptions] = useState<{
    [key: string]: { value: [number, number] }
  }>()

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

  const action = async () => {
    // return Swal.fire({
    //   title: '준비중',
    //   icon: 'info',
    // })
    if (selectedCraftItems?.length === 0) return
    if (
      !ValidReRollItemTypes.includes(
        selectedCraftItems[0].iType as ItemTypeKind,
      )
    )
      return
    const { isConfirmed } = await Swal.fire({
      title: `정말로 명품화하시겠습니까?`,
      confirmButtonText: '예',
      denyButtonText: `닫기`,
      showDenyButton: true,
    })

    if (isConfirmed) {
      await fetchImprinting(selectedCraftItems[0]._id!)
      await Promise.all([
        Swal.fire({
          title: '제련 되었습니다.',
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

  const loadImprintingOptions = useCallback(async (itemId: string) => {
    const result = await fetchGetImprintingOptions(itemId)
    setImprintingOptions(result.list)
  }, [])

  useEffect(() => {
    setImprintingOptions(undefined)
    if (!selectedCraftItems[0]) return
    if (selectedCraftItems[0].iType === ItemTypeKind.Weapon) {
      loadImprintingOptions(selectedCraftItems[0]._id!)
    }
  }, [loadImprintingOptions, selectedCraftItems])

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
        <div className="border flex flex-col gap-[2px] p-[8px] justify-center">
          <div className="w-full text-[16px] flex justify-center mb-[5px] flex-col items-center gap-[4px]">
            <div>오른쪽의 인벤토리에서 아이템을 선택하세요.</div>
            <div className="border p-[10px] rounded shadow-md bg-gray-200">
              <div className="flex justify-center items-center gap-[4px] text-gray-800">
                <div>필요한 재료</div>
                <div className="flex items-center flex-wrap gap-[1px] flex-col border p-[4px] rounded shadow bg-white text-gray-900">
                  {[
                    {
                      name: '레테의 강물',
                      amount: 5,
                      href: '/images/black-smith/lethes-water.png',
                    },
                    {
                      name: '골드',
                      amount: 10000000,
                      href: '/images/icon_currency.png',
                    },
                    {
                      name: '스타포스 파워 100 이상 아이템',
                      amount: 1,
                      href: '/images/black-smith/scroll.png',
                    },
                  ].map((item) => {
                    return (
                      <div
                        className="flex items-center border border-gray-300 p-[2px] rounded gap-[4px]"
                        key={createKey()}
                      >
                        <img
                          className="w-[30px] border border-gray-600 p-[2px] rounded"
                          src={item.href}
                        />
                        <div className="ff-score font-bold">
                          [{item.name}] x{item.amount.toLocaleString()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="flex justify-center text-red-500 mt-[10px] text-[14px]">
                * 필요한 재료는 인벤토리에 보유하고 있어야 합니다.
              </div>
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
              className="text-[24px] bg-green-500 text-white px-[6px] py-[4px] rounded cursor-pointer flex items-center justify-center gap-[4px]"
              onClick={() => action()}
            >
              <div className="p-[2px] bg-blueGray-600/70 rounded border border-blue-950 border-dotted">
                <div
                  className="w-[30px] h-[30px] bg-contain bg-center"
                  style={{
                    backgroundImage: `url('/images/black-smith/imprinting.png')`,
                  }}
                />
              </div>
              명품화하기
            </div>
          </div>

          {imprintingOptions && (
            <div className="mt-[10px] border p-[4px] rounded shadow">
              <div className="flex justify-center items-center text-[18px] my-[4px]">
                아래 옵션중 하나가 무작위로 추가됩니다.
              </div>
              <div className="border p-[5px] flex flex-col gap-[1px] max-w-[400px]">
                {Object.keys(imprintingOptions).map((imprintingKey) => {
                  const imprintinOption = imprintingOptions[imprintingKey]
                  const { value } = imprintinOption
                  return (
                    <div key={createKey()} className="flex flex-col">
                      <div className="flex items-center justify-between text-[16px] ff-score-all font-bold">
                        <div>{translate(`imprinting:${imprintingKey}`)}</div>
                        <div className="flex items-center justify-center gap-[2px]">
                          <div className="underline">{value[0]}</div>
                          <div>~</div>
                          <div className="underline">{value[1]}</div>
                        </div>
                      </div>
                      {imprintingKey === 'AddedFlatDamageBySummedPercent' && (
                        <div className="flex items-center gap-[4px] text-red-600">
                          <i className="fa-solid fa-arrow-turn-up fa-rotate-90 ml-[10px] text-[14px] font-bold" />
                          <div className="text-[14px] break-words">
                            무기 기본 피해의 총합을 해당(%) 만큼 증가 시킨 후
                            무작위 속성으로 추가, [xx 피해 추가(+)] 명품화
                            속성으로 변환됨.
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-[2px] text-[16px] mt-[20px]">
            <div className="flex items-center gap-[5px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>제련 시 새로운 명품화 옵션 카테고리가 추가됩니다.</div>
            </div>
            <div className="flex items-center gap-[5px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>제련 시 교환 불가 아이템으로 변합니다.</div>
            </div>
            <div className="flex items-center gap-[5px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>
                스타포스 초기화로 스타포스 파워가 0이 되어도 다시 제련을 통해
                100 이상을 만들면 시도 할 수 있습니다.
              </div>
            </div>
            <div className="flex items-center gap-[5px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div className="text-red-600">
                계속해서 명품화 제련을 재시도 할 수 있습니다.
              </div>
            </div>
          </div>
        </div>

        <div className="border flex justify-center p-[10px]">
          <div className="flex flex-col">
            <div>인벤토리</div>
            <div className="">
              <div>
                <div className="flex flex-wrap min-w-[514px] max-w-[514px] bg-gray-100 p-[2px] rounded shadow-md gap-[1px]">
                  {new Array(100).fill(1).map((value, index) => {
                    const item = items[index] || {}
                    const disableSlotClass = 'bg-gray-800'
                    const isOveredSlot = index >= maxItemSlots
                    const invalidItem = !isImprintable(item)
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
