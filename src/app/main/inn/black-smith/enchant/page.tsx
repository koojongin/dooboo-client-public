'use client'

import { Card, Tooltip } from '@material-tailwind/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import {
  fetchEnhanceWeapon,
  fetchGetMyCurrency,
  fetchGetMyInventory,
} from '@/services/api-fetch'
import {
  EnhancedResultDialogRef,
  InnItem,
  ItemTypeKind,
  Weapon,
} from '@/interfaces/item.interface'
import createKey from '@/services/key-generator'
import ItemBoxComponent from '@/components/item/item-box'
import { InventoryActionKind } from '@/components/item/item.interface'
import { CurrencyResponse } from '@/interfaces/currency.interface'
import { formatNumber, isWeaponEnhanceable, translate } from '@/services/util'
import {
  fetchEnchantWeapon,
  fetchGetEnchantData,
} from '@/services/api/api.craft'

export default function BlackSmithEnchantPage() {
  const [items, setItems] = useState<InnItem[]>([])
  const [maxItemSlots, setMaxItemSlots] = useState<number>(0)
  const [gold, setGold] = useState<number>(0)
  const [isFulledInventory, setIsFulledInventory] = useState<boolean>()
  const [selectedWeapons, setSelectedWeapons] = useState<InnItem[]>([])
  const [currencyRes, setCurrencyRes] = useState<CurrencyResponse>()
  const [enchantData, setEnchantData] = useState<any>()
  const [selectedAttribute, setSelectedAttribute] = useState<any>()

  const selectAttribute = useCallback(async (attributeName: any) => {
    setSelectedAttribute(attributeName)
  }, [])

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

  const enchantWeapon = async () => {
    const weapons = selectedWeapons.filter((d) => !!d)
    if (weapons.length !== 1) {
      await Swal.fire({
        title: '강화 재료를 모두 선택하세요',
        text: '-' || '?',
        icon: 'error',
        denyButtonText: `닫기`,
      })
      return
    }

    const { isConfirmed } = await Swal.fire({
      title: '정말로 마법 부여 하시겠습니까?',
      icon: 'question',
      confirmButtonText: '예',
      denyButtonText: `닫기`,
      showDenyButton: true,
    })

    if (isConfirmed) {
      const result = await fetchEnchantWeapon(
        selectedWeapons[0].weapon._id!,
        selectedAttribute,
      )
      await initialRefresh()
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

  const updateEnchantData = useCallback(async () => {
    setEnchantData(undefined)
    if (!selectedWeapons[0]) {
      return
    }
    const result = await fetchGetEnchantData(
      selectedWeapons[0].weapon._id!,
      selectedAttribute,
    )
    setEnchantData(result)
  }, [selectedWeapons, selectedAttribute])

  const loadMyCurrency = useCallback(async () => {
    const result = await fetchGetMyCurrency()
    setCurrencyRes(result)
  }, [])

  const initialRefresh = useCallback(async () => {
    await refreshInventory()
    await loadMyCurrency()
    setSelectedWeapons([])
  }, [loadMyCurrency])

  useEffect(() => {
    if (selectedWeapons?.filter((d) => !!d).length <= 0) {
      setSelectedAttribute(undefined)
      setEnchantData(undefined)
      return
    }
    updateEnchantData()
  }, [selectedWeapons, updateEnchantData])

  useEffect(() => {
    initialRefresh()
  }, [initialRefresh])
  return (
    <div>
      <Card className="rounded p-[8px] ff-score-all font-bold">
        <div className="ff-wavve-all font-thin flex items-center gap-[10px] pb-[8px]">
          <div className="flex items-center">
            <img src="/images/icon_currency.png" className="w-[30px]" />
            <div>{gold.toLocaleString()}</div>
          </div>
          {currencyRes && (
            <Tooltip content="아이템 결정">
              <div className="flex items-center gap-[2px]">
                <div
                  style={{
                    backgroundImage: `url("/images/item/salvage_crystal_normal.png")`,
                  }}
                  className="w-[30px] h-[30px] bg-contain bg-no-repeat bg-center"
                />

                <div className="text-[20px] cursor-pointer">
                  {formatNumber(currencyRes.currency.itemCrystalOfNormal)}
                </div>
              </div>
            </Tooltip>
          )}
        </div>
        <div className="flex items-stretch gap-[10px]">
          <div className="border flex flex-col gap-[2px] p-[8px] justify-center w-[650px]">
            <div className="mb-[20px]">
              <div className="w-full text-[16px] flex justify-center">
                오른쪽의 인벤토리에서 마법 부여할 아이템을 선택하세요
              </div>
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
            <div className="flex justify-center">
              {enchantData &&
                selectedAttribute &&
                Object.keys(enchantData.weapon?.additionalAttributes || {})
                  .length > 0 && (
                  <div
                    className="text-[24px] bg-green-500 text-white px-[6px] py-[4px] rounded cursor-pointer"
                    onClick={() => enchantWeapon()}
                  >
                    마법 부여 하기
                  </div>
                )}
            </div>
            <div className="flex justify-center items-center w-full border rounded">
              <div className="text-[20px] min-h-[30px] flex justify-center items-center w-full">
                {!enchantData && <div>알수없음</div>}
                {enchantData && (
                  <EnchantDataBox
                    selectedAttribute={selectedAttribute}
                    enchantData={enchantData}
                    onClick={selectAttribute}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-[2px] text-[16px] mt-[20px]">
              <div className="flex items-center gap-[5px]">
                <i className="text-[4px] fa-solid fa-circle" />
                <div>추가 속성 중 하나를 무작위로 변환합니다.</div>
              </div>
              <div className="flex items-center gap-[5px]">
                <i className="text-[4px] fa-solid fa-circle" />
                <div>마법 부여를 거듭할 수록 비용이 증가합니다.</div>
              </div>
            </div>
          </div>

          <div className="border flex justify-center p-[10px]">
            <div className="flex flex-col">
              <div>인벤토리</div>
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
      </Card>
    </div>
  )
}

function EnchantDataBox({
  enchantData,
  selectedAttribute,
  onClick,
}: {
  enchantData: { price: number; weapon: Weapon; changeableAttributes: any[] }
  selectedAttribute: any
  onClick: (attributeName: string) => void
}) {
  const attributeKeys = Object.keys(
    enchantData?.weapon?.additionalAttributes || {},
  )
  if (attributeKeys.length === 0) {
    return <div>마법 부여를 할 수 없는 아이템</div>
  }

  const isExistEnchanted = Object.keys(
    enchantData.weapon.additionalAttributes || {},
  ).includes(enchantData.weapon.enchants.fixedAttributeName || '')
  return (
    <div className="flex flex-col w-full items-center p-[5px] gap-[5px]">
      <div className="flex flex-row gap-[2px] items-center">
        <div>소모 비용</div>
        <img src="/images/icon_currency.png" className="w-[24px]" />
        <div>{enchantData.price.toLocaleString()}</div>
      </div>
      <div>변경할 속성을 선택하세요</div>
      <div className="w-full p-[10px] flex flex-col border border-blue-950 rounded">
        {Object.keys(enchantData.weapon?.additionalAttributes || {}).map(
          (attributeName) => {
            const attributes = enchantData.weapon?.additionalAttributes || {}
            const attribute = attributes[attributeName]
            const isEnchanted =
              enchantData.weapon.enchants.fixedAttributeName === attributeName
            if (isEnchanted) {
              onClick(attributeName)
            }
            return (
              <div
                key={createKey()}
                onClick={() => {
                  if (!isExistEnchanted) onClick(attributeName)
                }}
                className={`flex justify-between w-full text-[16px] hover:bg-gray-100 p-[4px] cursor-pointer
                ${selectedAttribute === attributeName ? 'border border-blue-950 bg-blue-gray-400 text-white hover:bg-blue-gray-500' : ''}`}
              >
                <div
                  className={`flex items-center gap-[4px] ${isEnchanted ? 'text-green-500' : ''}`}
                >
                  {isEnchanted && <i className="fa-solid fa-wrench" />}
                  {!isEnchanted && (
                    <i className="text-[4px] fa-solid fa-circle" />
                  )}
                  <div>{translate(attributeName)}</div>
                </div>
                <div>{attribute}</div>
              </div>
            )
          },
        )}
      </div>
      {selectedAttribute && (
        <>
          <i className="fa-solid fa-arrow-down" />
          <div>[추가 속성]이 다음 속성 중 하나로 무작위 변환됩니다.</div>
          <div className="w-full p-[10px] flex flex-col border border-blue-950 rounded">
            {enchantData.changeableAttributes.map((attribute) => {
              return (
                <div
                  key={createKey()}
                  className="text-[16px] flex justify-between items-center"
                >
                  <div>{translate(attribute.name)}</div>
                  <div>{attribute.range.join('-')}</div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
