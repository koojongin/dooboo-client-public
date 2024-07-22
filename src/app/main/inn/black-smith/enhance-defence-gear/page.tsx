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
import { EnhancedResultDialogRef, InnItem } from '@/interfaces/item.interface'
import createKey from '@/services/key-generator'
import ItemBoxComponent from '@/components/item/item-box'
import EnhancedResultDialog from '../enhanced-result-dialog'
import { InventoryActionKind } from '@/components/item/item.interface'
import { CurrencyResponse } from '@/interfaces/currency.interface'
import {
  formatNumber,
  isDefenceGearEnhanceable,
  translate,
} from '@/services/util'
import {
  fetchEnhanceDefenceGear,
  fetchGetEnhanceData,
} from '@/services/api/api.craft'
import {
  DefenceGearEnhanceDataResponse,
  IEnhanceOption,
} from '@/services/craft/enhance.enum'
import { EnhanceOptionBoxComponent } from '@/app/main/inn/black-smith/enhance-defence-gear/enhance-option-box.component'

export default function BlackSmithEnhanceDefenceGearPage() {
  const enhancedResultDialogRef = useRef<EnhancedResultDialogRef>()
  const [items, setItems] = useState<InnItem[]>([])
  const [maxItemSlots, setMaxItemSlots] = useState<number>(0)
  const [gold, setGold] = useState<number>(0)
  const [isFulledInventory, setIsFulledInventory] = useState<boolean>()
  const [selectedDefenceGears, setSelectedWeapons] = useState<InnItem[]>([])
  const [enhancePrice, setEnhancePrice] = useState<{
    price: number
    successRate: number
  }>()
  const [currencyRes, setCurrencyRes] = useState<CurrencyResponse>()

  const [scrollOption, setScrollOption] = useState<{ percent: number }>()
  const [selectedEnhanceScroll, setSelectedEnhanceScroll] =
    useState<IEnhanceOption>()
  const [isEnableBlackSmithScroll, setIsEnableBlackSmithScroll] =
    useState<boolean>(false)
  const [enhanceData, setEnhanceData] =
    useState<DefenceGearEnhanceDataResponse>()

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

  const enhanceDefenceGear = async () => {
    // await Swal.fire({
    //   title: '준비중',
    //   icon: 'error',
    //   denyButtonText: `닫기`,
    // })
    // return
    const [defenceGearItem] = selectedDefenceGears.filter((d) => !!d)
    if (!defenceGearItem) {
      await Swal.fire({
        title: '제련할 아이템이 없습니다.',
        icon: 'error',
        denyButtonText: `닫기`,
      })
      return
    }
    if (!selectedEnhanceScroll || !scrollOption) {
      await Swal.fire({
        title: '주문서를 선택하세요',
        icon: 'info',
        denyButtonText: `닫기`,
      })
      return
    }

    const { isConfirmed } = await Swal.fire({
      title: '정말로 제련하시겠습니까?',
      text: `${translate(selectedEnhanceScroll.name)} 주문서 - ${scrollOption.percent}%`,
      icon: 'question',
      confirmButtonText: '예',
      denyButtonText: `닫기`,
      showDenyButton: true,
    })

    if (isConfirmed) {
      const result = await fetchEnhanceDefenceGear({
        id: selectedDefenceGears[0]._id!,
        scrollPercent: scrollOption?.percent || 0,
        isEnableBlackSmithScroll,
        enhanceOption: selectedEnhanceScroll.name,
      })
      await initialRefresh()

      if (result.isSuccess) {
        // setEnhancedResult(result)
        await Swal.fire({
          title: '성공!',
          confirmButtonText: '확인',
        })
      } else {
        // setEnhancedResult(undefined)
        await Swal.fire({
          title: '실패!',
          confirmButtonText: '확인',
        })
      }
      // enhancedResultDialogRef.current?.open()
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

    const attachedWeaponIndex = selectedDefenceGears.findIndex(
      (sWeapon) => sWeapon?._id === items[selectedItemIndex]._id,
    )

    if (attachedWeaponIndex < 0) {
      const emptyIndex = selectedDefenceGears.findIndex((data) => !data)
      if (emptyIndex < 0) {
        setSelectedWeapons([
          ...selectedDefenceGears,
          { ...items[selectedItemIndex] },
        ])
      } else {
        const newWeapons: any = [...selectedDefenceGears]
        newWeapons[emptyIndex] = { ...items[selectedItemIndex] }
        return setSelectedWeapons(newWeapons)
      }
    } else {
      const newSelectedWeapons: any = [...selectedDefenceGears]
      newSelectedWeapons[attachedWeaponIndex] = undefined
      setSelectedWeapons(newSelectedWeapons)
    }
  }

  const updateEnhanceData = useCallback(async () => {
    setEnhancePrice(undefined)
    setEnhanceData(undefined)
    setScrollOption(undefined)
    setSelectedEnhanceScroll(undefined)
    if (!selectedDefenceGears[0]) return
    const { defenceGear } = selectedDefenceGears[0]
    const result = await fetchGetEnhanceData({
      iLevel: defenceGear.iLevel,
      gearType: defenceGear.gearType,
    })
    setEnhanceData(result)
  }, [selectedDefenceGears])

  const updateEnhancePrice = useCallback(async () => {
    if (!scrollOption) return
    if (!selectedDefenceGears[0]) {
      setScrollOption(undefined)
      return
    }
    const result = await fetchGetEnhancePrice(selectedDefenceGears[0]._id!, {
      scrollPercent: scrollOption?.percent || 0,
      isEnableBlackSmithScroll,
    })
    setEnhancePrice(result)
  }, [isEnableBlackSmithScroll, scrollOption, selectedDefenceGears])

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

  const onClickScroll = useCallback(
    async (enhanceOption: IEnhanceOption, percent: number) => {
      setScrollOption({ percent })
      setSelectedEnhanceScroll(enhanceOption)
    },
    [],
  )

  useEffect(() => {
    if (!scrollOption) return
    updateEnhancePrice()
  }, [scrollOption, updateEnhancePrice])

  useEffect(() => {
    if (selectedDefenceGears?.length <= 0) return
    updateEnhanceData()
  }, [selectedDefenceGears, updateEnhanceData])

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
            <EnhanceInformationBox />

            <>
              {enhanceData?.list && (
                <div className="flex items-center flex-col border rounded gap-[4px] p-[10px]">
                  <EnhanceOptionBoxComponent
                    scrollOption={scrollOption}
                    selectedEnhanceScroll={selectedEnhanceScroll}
                    onSelectScroll={onClickScroll}
                    enhanceData={enhanceData}
                  />
                </div>
              )}

              <div className="flex flex-col border border-gray-500 p-[10px] text-[16px] justify-center rounded">
                <label className="cursor-pointer flex items-center gap-[4px] text-[20px] justify-center">
                  <input
                    type="checkbox"
                    className="w-[24px] h-[24px]"
                    checked={isEnableBlackSmithScroll}
                    onChange={(e) => {
                      setIsEnableBlackSmithScroll(e.target.checked)
                    }}
                  />
                  <div>제련 확률 보정하기</div>
                </label>
                <div className="flex items-center justify-center">
                  <div className="py-[2px] flex items-center border border-gray-200 px-[4px] rounded bg-cyan-900 text-white gap-[4px]">
                    <div
                      style={{
                        backgroundImage: `url("/images/black-smith/black-smith-scroll.png")`,
                      }}
                      className="w-[30px] h-[30px] bg-contain bg-no-repeat bg-center bg-white rounded"
                    />
                    <div>블랙 스미스 스크롤</div>
                  </div>
                  <div>이 인벤토리에 있어야 합니다.</div>
                </div>
              </div>
            </>

            <div className="flex items-center justify-center gap-[2px]">
              <div>원본</div>
              <div className="bg-white relative flex border-[1px] border-r rounded-md w-[50px] h-[50px] items-center justify-center">
                {selectedDefenceGears[0] && (
                  <ItemBoxComponent
                    className="p-[2px]"
                    item={selectedDefenceGears[0]}
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
                {enhancePrice && (
                  <EnhancePriceScrollInformation
                    enhanceData={enhanceData}
                    enhancePrice={enhancePrice}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <div
                className="text-[24px] bg-green-500 text-white px-[6px] py-[4px] rounded cursor-pointer"
                onClick={() => enhanceDefenceGear()}
              >
                제련하기
              </div>
            </div>

            {/* Information----------------------*/}
            {!selectedDefenceGears[0] && <EnhanceScrollInformation />}
          </div>

          <div className="border flex justify-center p-[10px]">
            <div className="flex flex-col">
              <div>인벤토리</div>
              <div className="flex flex-wrap min-w-[514px] max-w-[514px] bg-gray-100 p-[2px] rounded shadow-md gap-[1px]">
                {new Array(100).fill(1).map((value, index) => {
                  const item = items[index] || {}
                  const disableSlotClass = 'bg-gray-800'
                  const isOveredSlot = index >= maxItemSlots
                  const invalidItem = isDefenceGearEnhanceable(item)
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

function EnhanceScrollInformation() {
  return (
    <div className="flex flex-col gap-[2px] text-[16px] mt-[20px]">
      <div>장비 부위 별로 선택할 수 있는 주문서가 다릅니다.</div>
    </div>
  )
}

function EnhancePriceInformation({
  enhanceData,
  enhancePrice,
}: {
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
}: {
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

function EnhanceInformationBox() {
  return (
    <div className="">
      <div className="flex justify-center items-center">
        스타포스는 아이템 상단에 표시 되어 있는{' '}
        <img className="mb-[4px] w-[24px] h-[24px]" src="/images/star_on.png" />
        입니다.
      </div>
      <div className="w-full text-[16px] flex justify-center">
        오른쪽의 인벤토리에서 제련할 아이템을 선택하세요
      </div>
      <div className="flex flex-wrap items-center justify-center text-[15px]">
        아이템 레벨*3 만큼의{' '}
        <div className="py-[2px] flex items-center border border-gray-200 px-[4px] rounded bg-cyan-900 text-white gap-[4px]">
          <div
            style={{
              backgroundImage: `url("/images/item/salvage_crystal_normal.png")`,
            }}
            className="w-[24px] h-[24px] bg-contain bg-no-repeat bg-center bg-white rounded"
          />
          <div>아이템 결정</div>
        </div>
        을 사용하여 제련합니다.
      </div>
      <div className="flex flex-wrap items-center justify-center text-[15px]">
        <div className="py-[2px] flex items-center border border-gray-200 px-[4px] rounded bg-cyan-900 text-white gap-[4px]">
          <div
            style={{
              backgroundImage: `url("/images/black-smith/defence-scroll.png")`,
            }}
            className="w-[24px] h-[24px] bg-contain bg-no-repeat bg-center bg-white rounded"
          />
          <div>방어구 제련 스크롤 x1</div>
        </div>
        을 사용하여 제련합니다.
      </div>
    </div>
  )
}
