'use client'

import { Card, Tooltip } from '@material-tailwind/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import {
  fetchEnhanceWeapon,
  fetchGetEnhancePrice,
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
import EnhancedResultDialog from '../enhanced-result-dialog'
import { InventoryActionKind } from '@/components/item/item.interface'
import { CurrencyResponse } from '@/interfaces/currency.interface'
import { formatNumber } from '@/services/util'

export default function BlackSmithEnhancePage() {
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
  const [currencyRes, setCurrencyRes] = useState<CurrencyResponse>()

  const [scrollOption, setScrollOption] = useState<{ percent: number }>()

  const [enhanceData, setEnhanceData] = useState<{
    randomFlatDamageRange: number
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
      title: '정말로 강화하시겠습니까?',
      icon: 'question',
      confirmButtonText: '예',
      denyButtonText: `닫기`,
      showDenyButton: true,
    })

    if (isConfirmed) {
      const result = await fetchEnhanceWeapon(selectedWeapons[0]._id!, {
        scrollPercent: scrollOption?.percent || 0,
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

  const updateEnhancePrice = useCallback(async () => {
    setEnhancePrice(undefined)
    if (!selectedWeapons[0]) return
    if (selectedWeapons[0].weapon.iLevel > 30 && !scrollOption?.percent) return
    const result = await fetchGetEnhancePrice(selectedWeapons[0]._id!, {
      scrollPercent: scrollOption?.percent || 0,
    })
    if (selectedWeapons[0]) setEnhancePrice(result)
    setEnhanceData(result.data)
  }, [scrollOption?.percent, selectedWeapons])

  const loadMyCurrency = useCallback(async () => {
    const result = await fetchGetMyCurrency()
    setCurrencyRes(result)
  }, [])

  const initialRefresh = useCallback(async () => {
    await refreshInventory()
    await loadMyCurrency()
    setSelectedWeapons([])
    setEnhancePrice(undefined)
  }, [loadMyCurrency])

  const onClickScroll = useCallback(async (percent: number) => {
    setScrollOption({ percent })
  }, [])

  useEffect(() => {
    if (selectedWeapons?.length <= 0) return
    updateEnhancePrice()
  }, [selectedWeapons, updateEnhancePrice])

  useEffect(() => {
    initialRefresh()
  }, [initialRefresh])
  return (
    <div>
      <EnhancedResultDialog
        ref={enhancedResultDialogRef}
        result={enhancedResult}
      />
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
              <div className="flex justify-center items-center">
                스타포스는 무기 상단에 표시되어있는{' '}
                <img
                  className="mb-[4px] w-[24px] h-[24px]"
                  src="/images/star_on.png"
                />
                입니다.
              </div>
              <div className="w-full text-[16px] flex justify-center">
                오른쪽의 인벤토리에서 제련할 아이템을 선택하세요
              </div>
              <div className="flex flex-wrap items-center justify-center text-[16px]">
                아이템 레벨*3 만큼의{' '}
                <div className="py-[2px] flex items-center border border-gray-200 px-[4px] rounded bg-cyan-900 text-white gap-[4px]">
                  <div
                    style={{
                      backgroundImage: `url("/images/item/salvage_crystal_normal.png")`,
                    }}
                    className="w-[30px] h-[30px] bg-contain bg-no-repeat bg-center bg-white rounded"
                  />
                  <div>아이템 결정</div>
                </div>
                을 사용하여 제련합니다.
              </div>
            </div>

            {selectedWeapons[0]?.weapon.iLevel > 30 && (
              <>
                <div className="text-center text-[16px]">
                  아래 주문서 중 하나를 선택하세요.
                </div>
                <div className="flex justify-center gap-[4px] mb-[20px]">
                  {[
                    { value: 2, percent: 100 },
                    { value: 6, percent: 60 },
                    { value: 15, percent: 10 },
                  ].map((data) => {
                    return (
                      <Tooltip
                        key={createKey()}
                        content={
                          <div>
                            <div>{data.percent}% 확률로 성공</div>
                            <div>
                              성공 시 무작위 기본 피해 속성 +{data.value} 추가
                              및 동일한 수치의 스타포스 파워 추가
                            </div>
                            <div>실패하더라도 스타포스 레벨 +1 추가</div>
                          </div>
                        }
                      >
                        <div
                          className={`flex flex-col border p-[4px] pb-[2px] rounded cursor-pointer 
                          ${scrollOption?.percent === data.percent ? 'border-2 border-green-800' : 'border-gray-200'}`}
                          onClick={() => onClickScroll(data.percent)}
                        >
                          <img
                            className="w-[40px]"
                            src={`/images/black-smith/scroll${data.percent}.png`}
                          />
                          <div className="text-[14px] text-center">
                            {data.percent}%
                          </div>
                          <div className="text-center text-[14px]">
                            +{data.value}
                          </div>
                        </div>
                      </Tooltip>
                    )
                  })}
                </div>
              </>
            )}

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
            <div className="flex justify-center items-center w-full border rounded">
              <div className="text-[20px] min-h-[30px] flex justify-center items-center">
                {!enhancePrice && <div>알수없음</div>}
                {enhancePrice && selectedWeapons[0]?.weapon.iLevel <= 30 && (
                  <EnhancePriceInformation
                    weapon={selectedWeapons[0].weapon}
                    enhanceData={enhanceData}
                    enhancePrice={enhancePrice}
                  />
                )}
                {enhancePrice && selectedWeapons[0]?.weapon.iLevel > 30 && (
                  <EnhancePriceScrollInformation
                    weapon={selectedWeapons[0].weapon}
                    enhanceData={enhanceData}
                    enhancePrice={enhancePrice}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <div
                className="text-[24px] bg-green-500 text-white px-[6px] py-[4px] rounded cursor-pointer"
                onClick={() => enhanceWeapon()}
              >
                제련하기
              </div>
            </div>

            {/* Information----------------------*/}
            {!selectedWeapons[0] && (
              <>
                <EnhanceBaseInformation />
                <EnhanceScrollInformation />
              </>
            )}
            {selectedWeapons[0] && (
              <>
                {selectedWeapons[0].weapon.iLevel > 30 && (
                  <EnhanceScrollInformation />
                )}
                {selectedWeapons[0].weapon.iLevel <= 30 && (
                  <EnhanceBaseInformation />
                )}
              </>
            )}
          </div>

          <div className="border flex justify-center p-[10px]">
            <div className="flex flex-col">
              <div>인벤토리</div>
              <div className="flex flex-wrap min-w-[514px] max-w-[514px] bg-gray-100 p-[2px] rounded shadow-md gap-[1px]">
                {new Array(100).fill(1).map((value, index) => {
                  const item = items[index] || {}
                  const disableSlotClass = 'bg-gray-800'
                  const isOveredSlot =
                    index >= maxItemSlots || item?.iType === ItemTypeKind.Misc
                  return (
                    <div
                      key={`black_smith_${item?._id || createKey()}`}
                      className={`bg-white relative flex border-[1px] border-r rounded-md w-[50px] h-[50px] ${isOveredSlot ? disableSlotClass : ''}`}
                    >
                      {isOveredSlot && (
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

function EnhanceBaseInformation() {
  return (
    <div className="flex flex-col gap-[2px] text-[16px] mt-[20px]">
      <div className="text-[20px]">
        일반 제련(아이템 레벨 30
        <i className="fa-solid fa-arrow-down" />)
      </div>
      <div>제련 성공 확률은 현재 스타포스 레벨에 따라 변동됩니다.</div>
      <div>
        제련 성공 시, 아이템의 [1 ~ (총 기본속성 물리+화염+냉기+번개 데미지의
        10%) ] 값이 무작위 수치로 추가 됩니다.
      </div>
    </div>
  )
}

function EnhanceScrollInformation() {
  return (
    <div className="flex flex-col gap-[2px] text-[16px] mt-[20px]">
      <div className="text-[20px]">
        주문서 제련(아이템 레벨 31
        <i className="fa-solid fa-arrow-up" />)
      </div>
      <div>
        제련 성공 시, 사용되는 주문서에 따라 무작위 기본 피해
        속성(물리/화염/냉기/번개 중 하나)이 추가 됩니다.
      </div>
      <div className="text-red-500">
        제련에 실패하더라도 스타포스 레벨이 +1 추가 됩니다.
      </div>
      <div className="flex flex-wrap items-center justify-start gap-[4px]">
        <div>주문서 제련을 성공하면</div>
        <div className="flex flex-wrap border border-blue-900 px-[3px] rounded items-center bg-blue-900 text-white gap-[4px]">
          <div
            className="bg-contain bg-no-repeat bg-center w-[20px] h-[20px]"
            style={{
              backgroundImage: `url('/images/black-smith/scroll.png')`,
            }}
          />
          <div>스타포스 파워</div>
        </div>
        <div>가 주문서 수치에 따라 증가합니다.</div>
      </div>
      <div className="flex flex-wrap items-center justify-start gap-[4px]">
        <div className="flex flex-wrap border border-blue-900 px-[3px] rounded items-center bg-blue-900 text-white gap-[4px]">
          <div
            className="bg-contain bg-no-repeat bg-center w-[20px] h-[20px]"
            style={{
              backgroundImage: `url('/images/black-smith/scroll.png')`,
            }}
          />
          <div>스타포스 파워</div>
        </div>
        <div className="flex flex-wrap items-center gap-[2px]">
          +1 당{' '}
          <div className="bg-cyan-900 text-white px-[4px] rounded">
            치명타 배율 +2%
          </div>
          ,{' '}
          <div className="bg-cyan-900 text-white px-[4px] rounded">
            피해 +2%
          </div>
          가 증가합니다.
        </div>
      </div>
      <div>
        <img src="/images/black-smith/scroll-example.png" />
      </div>
    </div>
  )
}

function EnhancePriceInformation({
  weapon,
  enhanceData,
  enhancePrice,
}: {
  weapon: Weapon
  enhanceData: any
  enhancePrice: any
}) {
  return (
    <div className="flex flex-col items-center gap-[2px]">
      <div className="flex items-center gap-[2px]">
        <div className="text-green-500">
          성공률: {enhancePrice.successRate}%
        </div>
        <Tooltip content="골드">
          <div className="text-[18px] p-[2px] flex items-center border border-gray-200 rounded bg-cyan-900 text-white gap-[4px] cursor-pointer">
            <img
              src="/images/icon_currency.png"
              className="w-[30px] h-[30px] bg-contain bg-no-repeat bg-center bg-white rounded"
            />
            <div>{enhancePrice.price.toLocaleString()}</div>
          </div>
        </Tooltip>
        <Tooltip content="아이템 결정">
          <div className="text-[18px] p-[2px] flex items-center border border-gray-200 rounded bg-cyan-900 text-white gap-[4px] cursor-pointer">
            <div
              style={{
                backgroundImage: `url("/images/item/salvage_crystal_normal.png")`,
              }}
              className="w-[30px] h-[30px] bg-contain bg-no-repeat bg-center bg-white rounded"
            />
            <div>아이템 결정 x{formatNumber(enhancePrice.crystal)}</div>
          </div>
        </Tooltip>
      </div>
      {enhanceData && (
        <div className="text-[16px] flex flex-col items-center justify-center text-center ff-score-all font-bold">
          <div className="flex items-center">
            <span className="text-[20px] bg-red-700 p-[4px] rounded text-white ff-ba">
              1~
              {parseInt(`${enhanceData.randomFlatDamageRange}`, 10)}
            </span>
            <span className="">중 무작위 수치가</span>
          </div>
          <span>무작위 속성(물리,화염,번개,냉기)으로 기본 속성에 추가됨.</span>
        </div>
      )}
    </div>
  )
}

function EnhancePriceScrollInformation({
  enhanceData,
  enhancePrice,
  weapon,
}: {
  weapon: Weapon
  enhanceData: any
  enhancePrice: any
}) {
  return (
    <div className="flex flex-col items-center gap-[2px]">
      <div className="flex items-center gap-[2px]">
        <div className="text-green-500">
          성공률: {enhancePrice.successRate}%
        </div>
        <Tooltip content="골드">
          <div className="text-[18px] p-[2px] flex items-center border border-gray-200 rounded bg-cyan-900 text-white gap-[4px] cursor-pointer">
            <img
              src="/images/icon_currency.png"
              className="w-[30px] h-[30px] bg-contain bg-no-repeat bg-center bg-white rounded"
            />
            <div>{enhancePrice.price.toLocaleString()}</div>
          </div>
        </Tooltip>
        <Tooltip content="아이템 결정">
          <div className="text-[18px] p-[2px] flex items-center border border-gray-200 rounded bg-cyan-900 text-white gap-[4px] cursor-pointer">
            <div
              style={{
                backgroundImage: `url("/images/item/salvage_crystal_normal.png")`,
              }}
              className="w-[30px] h-[30px] bg-contain bg-no-repeat bg-center bg-white rounded"
            />
            <div>아이템 결정 x{formatNumber(enhancePrice.crystal)}</div>
          </div>
        </Tooltip>
      </div>
    </div>
  )
}
