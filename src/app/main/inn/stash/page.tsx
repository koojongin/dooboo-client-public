'use client'

import { Card, Tooltip } from '@material-tailwind/react'
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import Swal from 'sweetalert2'
import _ from 'lodash'
import withReactContent from 'sweetalert2-react-content'
import {
  fetchGetMyCurrency,
  fetchGetMyInventory,
  fetchGetMyStash,
  fetchGetMyStashes,
  fetchItemToInventory,
  fetchItemToStash,
  fetchMe,
  fetchMergeStackedItemInInventory,
  fetchMergeStackedItemInStash,
  fetchSalvageItems,
  fetchSellItems,
} from '@/services/api-fetch'
import { InnItem, ItemTypeKind } from '@/interfaces/item.interface'
import createKey from '@/services/key-generator'
import { formatNumber, getItemByType } from '@/services/util'
import { MeResponse } from '@/interfaces/user.interface'
import { InventoryActionKind } from '@/components/item/item.interface'
import ItemBoxComponent from '@/components/item/item-box'
import { Stash } from '@/interfaces/stash.interface'
import { CurrencyResponse } from '@/interfaces/currency.interface'
import { ItemEquipmentBoxComponent } from '@/app/main/inn/stash/item-equipment-box.component'
import { CharacterStatBoxComponent } from '@/app/main/inn/stash/character-stat-box.component'
import CharacterStatusDeckListComponent from '@/components/battle/character-status-deck-list.component'
import { fetchGetAllCardSet } from '@/services/api/api.card'
import { GatchaCard } from '@/interfaces/gatcha.interface'
import { fetchPostAddToAuction } from '@/services/api/api.auction'
import { DivideItemDialogComponent } from '@/app/main/inn/stash/divide-item-dialog.component'
import { fetchDivideItem } from '@/services/api/api.item'

export default function StashPage() {
  const [items, setItems] = useState<InnItem[]>([])
  const [characterData, setCharacterData] = useState<MeResponse>()
  const [maxItemSlots, setMaxItemSlots] = useState<number>(0)
  const [isFulledInventory, setIsFulledInventory] = useState<boolean>()
  const [stashes, setStashes] = useState<Stash[]>([])
  const [selectedStash, setSelectedStash] = useState<Stash>()
  const [currencyRes, setCurrencyRes] = useState<CurrencyResponse>()

  const refreshInventory = useCallback(async () => {
    const { items: rItems, slots, isFulled } = await fetchGetMyInventory()
    setItems(rItems)
    setMaxItemSlots(slots)
    setIsFulledInventory(isFulled)
  }, [])

  const loadStash = useCallback(async (stashId: string) => {
    const result = await fetchGetMyStash(stashId)
    setSelectedStash({
      ...result.stash,
      items: [..._.sortBy(result.stash.items, 'updatedAt')],
    })
  }, [])

  const loadMyCurrency = useCallback(async () => {
    const result = await fetchGetMyCurrency()
    setCurrencyRes(result)
  }, [])

  const loadStashes = useCallback(async () => {
    const result = await fetchGetMyStashes()
    setStashes(result.stashes)

    if (result.stashes.length > 0) {
      loadStash(result.stashes[0]._id!)
    }
  }, [loadStash])

  const refreshCharacterData = useCallback(async () => {
    const result = await fetchMe()
    setCharacterData(result)
  }, [])

  const syncData = useCallback(async () => {
    refreshInventory()
    refreshCharacterData()
    loadMyCurrency()
    loadStashes()
  }, [loadMyCurrency, loadStashes, refreshCharacterData, refreshInventory])

  const loadAllCardSet = useCallback(async () => {
    const result = await fetchGetAllCardSet()
    setAllCardSet(result.cardSet)
  }, [])

  const [allCardSet, setAllCardSet] = useState<GatchaCard[]>()
  useEffect(() => {
    loadAllCardSet()
  }, [loadAllCardSet])

  useEffect(() => {
    syncData()
  }, [syncData])

  return (
    <div className="rounded w-full min-h-[500px]">
      <Card className="rounded border p-[8px]">
        <Card className="rounded shadow-none mb-[4px]">
          {!!characterData?.character && (
            <div className="flex items-center gap-[14px]">
              <Tooltip content="골드">
                <div className="flex items-center gap-[2px] cursor-pointer">
                  <img src="/images/icon_currency.png" className="w-[30px]" />
                  <div className="text-[20px] ff-ba">
                    {characterData.character.gold.toLocaleString()}
                  </div>
                </div>
              </Tooltip>
              {currencyRes && (
                <>
                  <Tooltip content="청휘석">
                    <div className="flex items-center gap-[2px]">
                      <img
                        src="/images/icon_diamond.webp"
                        className="w-[22px] mr-[2px] mb-[2px]"
                      />

                      <div className="text-[20px] ff-ba cursor-pointer">
                        {formatNumber(currencyRes.currency.diamond)}
                      </div>
                    </div>
                  </Tooltip>
                  <Tooltip
                    content={`아이템 결정 ${currencyRes.currency.itemCrystalOfNormal.toLocaleString()}`}
                  >
                    <div className="flex items-center gap-[2px]">
                      <div
                        style={{
                          backgroundImage: `url("/images/item/salvage_crystal_normal.png")`,
                        }}
                        className="w-[30px] h-[30px] bg-contain bg-no-repeat bg-center"
                      />

                      <div className="text-[20px] ff-ba cursor-pointer">
                        {formatNumber(currencyRes.currency.itemCrystalOfNormal)}
                      </div>
                    </div>
                  </Tooltip>
                </>
              )}
            </div>
          )}
        </Card>
        {characterData && (
          <div className="flex flex-wrap gap-[10px]">
            <CharacterStatBoxComponent
              meResponse={characterData}
              refresh={syncData}
            />
            <div className="flex flex-col gap-[4px]">
              <div className="flex items-center gap-[4px]">
                <div className="text-[16px] ff-score font-bold">
                  사용중인 덱
                </div>
              </div>
              <div>
                {characterData.deck && (
                  <CharacterStatusDeckListComponent
                    deck={characterData.deck}
                    allCardSet={allCardSet || []}
                  />
                )}
              </div>
              <hr className="my-[4px]" />
              <ItemEquipmentBoxComponent
                meResponse={characterData}
                refresh={syncData}
              />
            </div>
          </div>
        )}
        <hr className="my-[4px]" />
        <InnInventory
          items={items}
          setItems={setItems}
          syncData={syncData}
          maxItemSlots={maxItemSlots}
          isFulledInventory={isFulledInventory}
          stashes={stashes}
          selectedStash={selectedStash}
          setSelectedStash={setSelectedStash}
          loadStash={loadStash}
        />
      </Card>
    </div>
  )
}

function InnInventory({
  items,
  setItems,
  stashes,
  selectedStash,
  setSelectedStash,
  loadStash,
  syncData = async () => {},
  maxItemSlots = 0,
  isFulledInventory = false,
}: {
  items: Array<InnItem>
  stashes: Stash[]
  selectedStash: Stash | undefined
  loadStash: (stashId: string) => Promise<void>
  setItems: Dispatch<SetStateAction<InnItem[]>>
  setSelectedStash: Dispatch<SetStateAction<Stash | undefined>>
  syncData?: () => Promise<void>
  maxItemSlots?: number
  isFulledInventory?: boolean
}) {
  const [maxInventorySize] = useState(new Array(100).fill(1))
  const leftInventoryRef = useRef<any>()

  const mergeStackableItems = useCallback(async () => {
    await fetchMergeStackedItemInInventory()
    await syncData()
  }, [syncData])

  const mergeStackableItemsInStash = useCallback(async () => {
    if (!selectedStash) {
      return Swal.fire({
        // text: code,
        title: '선택된 창고가 없습니다.',
        icon: 'error',
        confirmButtonText: '확인',
      })
    }

    await fetchMergeStackedItemInStash(selectedStash._id!)
    await syncData()
  }, [selectedStash, syncData])

  const [divideAmount, setDivideAmount] = useState<number>(1)

  const divideStackableItems = useCallback(
    async (stashId?: string) => {
      const selectedItems = (
        !stashId ? items : selectedStash?.items || []
      ).filter((item) => item.isSelected)
      console.log(selectedItems, selectedStash)
      if (selectedItems.length !== 1) {
        return Swal.fire({
          title: `나눌 아이템을 한개만 선택해주세요. 중첩형 아이템만 가능합니다.`,
          icon: 'warning',
          confirmButtonText: '확인',
        })
      }

      const [selectedItem] = selectedItems
      if ((selectedItem?.misc?.stack || 0) <= 1) {
        return Swal.fire({
          title: `나눌 수 없는 아이템입니다.(1개 이거나 중첩형 아이템이 아님)`,
          icon: 'warning',
          confirmButtonText: '확인',
        })
      }

      withReactContent(Swal).fire({
        title: `나눌 수량을 설정하세요`,
        input: 'number',
        html: (
          <DivideItemDialogComponent
            item={selectedItem}
            setAmount={setDivideAmount}
          />
        ),
        inputAttributes: {
          autocapitalize: 'off',
        },
        showCancelButton: true,
        confirmButtonText: '등록하기',
        cancelButtonText: '취소',
        showLoaderOnConfirm: true,
        preConfirm: async (amount: string) => {
          const willDivideAmount = parseInt(amount, 10)
          if (!willDivideAmount) return
          const minAmount = 1
          const maxAmount = selectedItem.misc.stack
          if (willDivideAmount < minAmount) {
            return Swal.showValidationMessage(
              `최소 나누기 제한
            ${minAmount.toLocaleString()}`,
            )
          }
          if (willDivideAmount > maxAmount) {
            return Swal.showValidationMessage(
              `최대 나누기 제한
            ${maxAmount.toLocaleString()}`,
            )
          }
          try {
            await fetchDivideItem(selectedItem._id!, {
              amount: willDivideAmount,
              stashId,
            })
            await syncData()
          } catch (error) {
            Swal.showValidationMessage(`
        Request failed: ${error}
      `)
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
    },
    [items, selectedStash, syncData],
  )

  const salvageSelectedItems = async () => {
    const selectedItems = items.filter((item) => item.isSelected)
    if (selectedItems.length === 0) return
    if (
      selectedItems.filter((item) => !!item.weapon || !!item.defenceGear)
        .length !== selectedItems.length
    ) {
      return Swal.fire({
        title: `무기 또는 방어구만 분해할 수 있습니다.`,
        icon: 'warning',
        confirmButtonText: '확인',
      })
    }
    const { isConfirmed } = await Swal.fire({
      title: `${selectedItems.length}개의 아이템을 분해 하시겠습니까?`,
      icon: 'question',
      confirmButtonText: '예',
      denyButtonText: `닫기`,
      showDenyButton: true,
    })

    if (isConfirmed) {
      const itemIds = selectedItems.map((i) => i._id!).filter((data) => !!data)
      const { currency, earned } = await fetchSalvageItems(itemIds)
      Swal.fire({
        title: `분해되었습니다. 아이템 결정 ${earned.itemCrystalOfNormal} 획득`,
        icon: 'info',
        confirmButtonText: '확인',
      })
      await syncData()
    }
  }

  const sellSelectedItems = async () => {
    const selectedItems = items.filter((item) => item.isSelected)
    const totalPrice = selectedItems.reduce((prev, next) => {
      const { iType, baseMisc, stack } = getItemByType(next)
      if (iType === ItemTypeKind.Misc) {
        return prev + baseMisc.gold * stack
      }
      return prev + getItemByType(next).gold
    }, 0)

    const { isConfirmed } = await Swal.fire({
      title: `${selectedItems.length}개의 아이템을 판매하시겠습니까?`,
      text: `총 ${totalPrice.toLocaleString()}Gold`,
      icon: 'question',
      confirmButtonText: '예',
      denyButtonText: `닫기`,
      showDenyButton: true,
    })

    if (isConfirmed) {
      const itemIds = selectedItems.map((i) => i._id!).filter((data) => !!data)
      await fetchSellItems(itemIds)
      await syncData()
    }
  }

  const sendItemToStash = useCallback(
    async (stashId: string | undefined, itemIds: string[]) => {
      if (!stashId) return
      if (itemIds.length === 0) return
      await fetchItemToStash(stashId, itemIds)
      await syncData()
      if (selectedStash) await loadStash(selectedStash._id!)
    },
    [loadStash, selectedStash, syncData],
  )

  const sendItemToInventory = useCallback(
    async (stashId: string | undefined, itemIds: string[] = []) => {
      if (!stashId) return
      if (itemIds.filter((d) => !!d).length === 0) return
      await fetchItemToInventory(stashId, itemIds)
      await syncData()
      if (selectedStash) await loadStash(selectedStash._id!)
    },
    [loadStash, selectedStash, syncData],
  )

  const onSelectItem = useCallback(
    (
      item: InnItem,
      event: React.MouseEvent,
      fromStashAction: boolean = false,
    ) => {
      if (!item) return
      if (event?.ctrlKey) {
        if (!selectedStash) return
        if (!fromStashAction) sendItemToStash(selectedStash._id!, [item._id!])
        if (fromStashAction)
          sendItemToInventory(selectedStash._id!, [item._id!])
        return
      }

      if (!fromStashAction) {
        const selectedItemIndex = items.findIndex((i) => i._id === item?._id)
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
      } else {
        const selectedItemIndex = selectedStash!.items.findIndex(
          (i) => i._id === item?._id,
        )
        if (selectedItemIndex < 0) return
        const newItems = selectedStash!.items.map((originItem, index) => {
          if (selectedItemIndex === index) {
            const newItem = { ...originItem }
            newItem.isSelected = !newItem.isSelected
            return newItem
          }
          return originItem
        })

        setSelectedStash({ ...selectedStash, items: newItems } as any)
      }
    },

    [
      items,
      selectedStash,
      sendItemToInventory,
      sendItemToStash,
      setItems,
      setSelectedStash,
    ],
  )

  const selectAll = () => {
    if (items.filter((i) => i.isSelected).length === items.length) {
      return setItems(
        items.map((item) => {
          const newItem = item
          newItem.isSelected = false
          return newItem
        }),
      )
    }

    setItems(
      items.map((item, index) => {
        const newItem = item
        newItem.isSelected = true
        return newItem
      }),
    )
  }

  const selectEquipableItemsWithoutStarForce = () => {
    setItems(
      items.map((item, index) => {
        const newItem = item
        const { weapon, defenceGear } = item
        if (weapon || defenceGear) {
          if (weapon?.starForce === 0) {
            newItem.isSelected = true
          }
          if (defenceGear?.starForce === 0) {
            newItem.isSelected = true
          }
        }
        return newItem
      }),
    )
  }

  const selectAllInStash = () => {
    if (!selectedStash) return
    if (
      selectedStash.items.filter((i) => i.isSelected).length ===
      selectedStash.items.length
    ) {
      if (setSelectedStash)
        return setSelectedStash({
          ...selectedStash,
          items: selectedStash!.items.map((item) => {
            const newItem = item
            newItem.isSelected = false
            return newItem
          }),
        } as any)
    }

    setSelectedStash({
      ...selectedStash,
      items: selectedStash!.items.map((item) => {
        const newItem = item
        newItem.isSelected = true
        return newItem
      }),
    } as any)
  }

  return (
    <div className="[&_*]:select-none">
      {/* Start Inventory Horizontal */}
      <div className="flex gap-[10px]">
        {/* Left Inventory */}
        <div className="w-[520px]">
          <div className="flex">
            <div
              className="border py-[2px] px-[5px] text-[16px] rounded text-white bg-green-400 cursor-pointer hover:bg-green-300"
              onClick={() => selectAll()}
            >
              전체 선택
            </div>
            <Tooltip content="선택된 아이템을 판매합니다.">
              <div
                className="border py-[2px] px-[5px] text-[16px] rounded text-white bg-red-400 cursor-pointer"
                onClick={() => sellSelectedItems()}
              >
                판매
              </div>
            </Tooltip>
            <Tooltip content="선택된 아이템을 분해합니다. 무기만 분해 가능. 분해 시 아이템 결정을 얻습니다.">
              <div
                className="border py-[2px] px-[5px] text-[16px] rounded text-white bg-red-950 cursor-pointer"
                onClick={() => salvageSelectedItems()}
              >
                분해
              </div>
            </Tooltip>
            <Tooltip content="중첩 가능한 아이템이 있는 경우 합칩니다.">
              <div
                className="border py-[2px] px-[5px] text-[16px] rounded text-white bg-ruliweb cursor-pointer"
                onClick={() => mergeStackableItems()}
              >
                합치기
              </div>
            </Tooltip>
            <Tooltip content="중첩 아이템이고, 나눌수있는 경우 아이템을 두개로 원하는 수량만큼 나눕니다.">
              <div
                className="border py-[2px] px-[5px] text-[16px] rounded text-white bg-ruliweb cursor-pointer"
                onClick={() => divideStackableItems()}
              >
                나누기
              </div>
            </Tooltip>
            <div
              className="border py-[2px] px-[5px] text-[16px] rounded text-white bg-lightBlue-950 cursor-pointer hover:bg-green-300"
              onClick={() => selectEquipableItemsWithoutStarForce()}
            >
              스타포스가 없는 장비만 선택
            </div>
          </div>
          <div className="flex justify-between ff-ba mt-[5px]">
            <div className="text-blue-gray-600 border-blue-gray-900 border-b-0 border min-w-[60px] flex items-center justify-center ff-ba text-[18px] h-[27px] px-[4px]">
              인벤토리
            </div>
            {/* <div className="flex"> */}
            {/*  <input className="border border-dark-blue border-b-0 rounded-bl-none rounded rounded-r-none focus-visible:outline-0 ff-wavve text-[16px] p-[2px]" /> */}
            {/*  <div className="border-dark-blue border border-l-0 border-b-0 rounded-br-none rounded rounded-l-none ff-wavve text-[16px] flex items-center justify-center p-[2px]"> */}
            {/*    선택 */}
            {/*  </div> */}
            {/* </div> */}
          </div>
          <div ref={leftInventoryRef}>
            <div className="w-full flex justify-center bg-gray-100 border-gray-600 py-[4px] border rounded-b">
              <div className="flex flex-wrap bg-gray-100 p-[2px] rounded shadow-md gap-[1px]">
                {maxInventorySize.map((value, index) => {
                  const item = items[index]
                  const disableSlotClass = 'bg-gray-800'
                  const isOveredSlot = index >= maxItemSlots
                  return (
                    <div
                      key={`trade_inventory_slot_${item?._id || createKey()}`}
                      className={`relative bg-white flex border-[1px] border-r rounded-md w-[50px] h-[50px] ${isOveredSlot ? disableSlotClass : ''}`}
                      style={{
                        borderColor: `${item?.isSelected ? 'transparent' : ''}`,
                      }}
                      // onClick={() => onClickItem(index)}
                      onClick={(e) => onSelectItem(item, e)}
                    >
                      {item?.isSelected && (
                        <div className="w-full h-full absolute left-0 top-0 bg-red-500" />
                      )}
                      {isOveredSlot && (
                        <div className="absolute z-10 bg-gray-800 bg-opacity-60 w-[50px] h-[50px] rounded" />
                      )}
                      {item && (
                        <ItemBoxComponent
                          className="p-[2px]"
                          item={item}
                          actions={[
                            InventoryActionKind.Share,
                            InventoryActionKind.AddToAuction,
                            InventoryActionKind.Consume,
                            InventoryActionKind.Equip,
                            InventoryActionKind.Lock,
                          ]}
                          onShowTotalDamage
                          actionCallback={syncData}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        {/* End Left Inventory */}
        <div className="flex justify-center items-center flex-col gap-[10px] ">
          <div
            className="cursor-pointer h-[26px] ff-ba flex items-center justify-center px-[6px] bg-green-800 text-white rounded"
            onClick={() =>
              sendItemToInventory(
                selectedStash?._id,
                (selectedStash?.items || [])
                  .filter((item) => item.isSelected)
                  .map((i) => i._id!.toString()),
              )
            }
          >
            &lt;-
          </div>
          <div
            className="cursor-pointer h-[26px] ff-ba flex items-center justify-center px-[6px] bg-green-800 text-white rounded"
            onClick={() =>
              sendItemToStash(
                selectedStash?._id,
                items
                  .filter((item) => item.isSelected)
                  .map((i) => i._id!.toString()),
              )
            }
          >
            -&gt;
          </div>
        </div>
        {/* Right Inventory */}
        <div className="w-[520px]">
          <div className="flex">
            <div
              className="border py-[2px] px-[5px] text-[16px] rounded text-white bg-green-400 cursor-pointer hover:bg-green-300"
              onClick={() => selectAllInStash()}
            >
              전체 선택
            </div>
            <Tooltip content="중첩 가능한 아이템이 있는 경우 합칩니다.">
              <div
                className="border py-[2px] px-[5px] text-[16px] rounded text-white bg-ruliweb cursor-pointer"
                onClick={() => mergeStackableItemsInStash()}
              >
                합치기
              </div>
            </Tooltip>
            <Tooltip content="중첩 아이템이고, 나눌수있는 경우 아이템을 두개로 원하는 수량만큼 나눕니다.">
              <div
                className="border py-[2px] px-[5px] text-[16px] rounded text-white bg-ruliweb cursor-pointer"
                onClick={() => divideStackableItems(selectedStash?._id)}
              >
                나누기
              </div>
            </Tooltip>
          </div>
          <div className="flex mt-[5px] border-b border-b-blue-gray-900 border-dashed">
            {stashes.length === 0 && (
              <div className="text-blue-gray-600 border-blue-gray-900 border-b-0 border min-w-[60px] flex items-center justify-center ff-ba text-[18px] h-[27px] px-[4px]">
                개방된 창고 없음
              </div>
            )}
            {stashes.map((stash, index) => {
              return (
                <div
                  key={stash._id}
                  className="text-blue-gray-600 border-blue-gray-900 border-b-0 border min-w-[60px] flex items-center justify-center ff-ba text-[18px] h-[27px] px-[4px]"
                >
                  창고 {index + 1}
                </div>
              )
            })}
          </div>
          <div className="w-full flex justify-center bg-gray-100 border-gray-600 py-[4px] border border-t-0 rounded-b">
            <div className="flex flex-wrap max-w-[514px] bg-gray-100 p-[2px] rounded shadow-md gap-[1px]">
              {new Array(100).fill(1).map((value, index) => {
                const item = selectedStash?.items[index] || {
                  isSelected: false,
                } // items[index]
                const disableSlotClass = 'bg-gray-800'
                const isOveredSlot = (selectedStash?.slots || 0) <= index
                return (
                  <div
                    key={`trade_stash_slot_${item?._id || createKey()}`}
                    onClick={(e) => onSelectItem(item, e, true)}
                    className={`relative bg-white flex border-[1px] border-r rounded-md w-[50px] h-[50px] ${isOveredSlot ? disableSlotClass : ''}`}
                    style={{
                      borderColor: `${item?.isSelected ? 'transparent' : ''}`,
                    }}
                  >
                    {item?.isSelected && (
                      <div className="w-full h-full absolute left-0 top-0 bg-red-500" />
                    )}
                    {isOveredSlot && (
                      <div className="absolute z-10 bg-gray-800 bg-opacity-60 w-[50px] h-[50px] rounded" />
                    )}
                    {item && (
                      <ItemBoxComponent
                        className="p-[2px]"
                        item={item}
                        onShowTotalDamage
                        actionCallback={() => {}}
                        actions={[InventoryActionKind.Share]}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {/* End Right Inventory */}
      </div>
      {/* End Inventory Horizontal */}

      <div className="mt-[5px] ff-nbg text-[16px]">
        * 인벤토리와 창고간 아이템 이동은 [컨트롤+클릭]으로 빠르게 이동할 수
        있습니다.
      </div>
    </div>
  )
}
