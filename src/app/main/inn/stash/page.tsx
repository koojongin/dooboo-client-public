'use client'

import { Card } from '@material-tailwind/react'
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import Swal from 'sweetalert2'
import {
  fetchGetMyInventory,
  fetchGetMyStash,
  fetchGetMyStashes,
  fetchItemToInventory,
  fetchItemToStash,
  fetchMe,
  fetchSellItems,
} from '@/services/api-fetch'
import { InnItem } from '@/interfaces/item.interface'
import createKey from '@/services/key-generator'
import { getItemByType } from '@/services/util'
import { MeResponse } from '@/interfaces/user.interface'
import { InventoryActionKind } from '@/components/item/item.interface'
import ItemBoxComponent from '@/components/item/item-box'
import { Stash } from '@/interfaces/stash.interface'

// eslint-disable-next-line react/display-name
export default function StashPage() {
  const [items, setItems] = useState<InnItem[]>([])
  const [characterData, setCharacterData] = useState<MeResponse>()
  const [maxItemSlots, setMaxItemSlots] = useState<number>(0)
  const [isFulledInventory, setIsFulledInventory] = useState<boolean>()
  const [stashes, setStashes] = useState<Stash[]>([])
  const [selectedStash, setSelectedStash] = useState<Stash>()

  const refreshInventory = useCallback(async () => {
    const { items: rItems, slots, isFulled } = await fetchGetMyInventory()
    setItems(rItems)
    setMaxItemSlots(slots)
    setIsFulledInventory(isFulled)
  }, [])

  const loadStash = useCallback(async (stashId: string) => {
    const result = await fetchGetMyStash(stashId)
    setSelectedStash(result.stash)
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
  }, [refreshCharacterData, refreshInventory])

  useEffect(() => {
    syncData()
    loadStashes()
  }, [loadStashes, syncData])

  return (
    <div className="rounded w-full min-h-[500px]">
      <Card className="rounded border p-[8px]">
        <Card className="rounded shadow-none mb-[4px]">
          {!!characterData?.character && (
            <div className="flex items-center gap-[14px]">
              <div className="flex items-center gap-[2px]">
                <img src="/images/icon_currency.png" className="w-[30px]" />
                <div className="text-[24px] ff-ba">
                  {characterData.character.gold.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-[2px]">
                <img
                  src="/images/icon_diamond.webp"
                  className="w-[22px] mr-[2px] mb-[2px]"
                />
                <div className="text-[24px] ff-ba">0</div>
              </div>
            </div>
          )}
        </Card>
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
  const sellItem = (item: InnItem) => {}
  const leftInventoryRef = useRef<any>()

  const sellSelectedItems = async () => {
    const selectedItems = items.filter((item) => item.isSelected)
    const totalPrice = selectedItems.reduce((prev, next) => {
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
    <div className="">
      {/* Start Inventory Horizontal */}
      <div className="flex gap-[10px]">
        {/* Left Inventory */}
        <div className="w-[420px]">
          <div className="flex">
            <div
              className="border py-[2px] px-[5px] text-[16px] rounded text-white bg-green-400 cursor-pointer hover:bg-green-300"
              onClick={() => selectAll()}
            >
              전체 선택
            </div>
            <div
              className="border py-[2px]  px-[5px] text-[16px] rounded text-white bg-red-400 cursor-pointer"
              onClick={() => sellSelectedItems()}
            >
              선택된 아이템 판매
            </div>
          </div>
          <div className="flex justify-between ff-ba mt-[5px]">
            <div className="text-blue-gray-600 border-blue-gray-900 border-b-0 border min-w-[60px] flex items-center justify-center ff-ba text-[18px] h-[27px] px-[4px]">
              인벤토리
            </div>
            <div className="flex">
              <input className="border border-dark-blue border-b-0 rounded-bl-none rounded rounded-r-none focus-visible:outline-0 ff-wavve text-[16px] p-[2px]" />
              <div className="border-dark-blue border border-l-0 border-b-0 rounded-br-none rounded rounded-l-none ff-wavve text-[16px] flex items-center justify-center p-[2px]">
                선택
              </div>
            </div>
          </div>
          <div ref={leftInventoryRef}>
            <div className="w-full flex justify-center bg-gray-100 border-gray-600 py-[4px] border rounded-b">
              <div className="flex flex-wrap max-w-[414px] bg-gray-100 p-[2px] rounded shadow-md gap-[1px]">
                {maxInventorySize.map((value, index) => {
                  const item = items[index]
                  const disableSlotClass = 'bg-gray-800'
                  const isOveredSlot = index >= maxItemSlots
                  return (
                    <div
                      key={`trade_inventory_slot_${item?._id || createKey()}`}
                      className={`relative bg-white flex border-[1px] border-r rounded-md w-[40px] h-[40px] ${isOveredSlot ? disableSlotClass : ''}`}
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
                        <div className="absolute z-10 bg-gray-800 bg-opacity-60 w-[40px] h-[40px] rounded" />
                      )}
                      {item && (
                        <ItemBoxComponent
                          className="p-[2px]"
                          item={item}
                          actions={[
                            InventoryActionKind.Share,
                            InventoryActionKind.AddToAuction,
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
        <div className="w-[420px]">
          <div className="flex">
            <div
              className="border py-[2px] px-[5px] text-[16px] rounded text-white bg-green-400 cursor-pointer hover:bg-green-300"
              onClick={() => selectAllInStash()}
            >
              전체 선택
            </div>
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
            <div className="flex flex-wrap max-w-[414px] bg-gray-100 p-[2px] rounded shadow-md gap-[1px]">
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
                    className={`relative bg-white flex border-[1px] border-r rounded-md w-[40px] h-[40px] ${isOveredSlot ? disableSlotClass : ''}`}
                    style={{
                      borderColor: `${item?.isSelected ? 'transparent' : ''}`,
                    }}
                  >
                    {item?.isSelected && (
                      <div className="w-full h-full absolute left-0 top-0 bg-red-500" />
                    )}
                    {isOveredSlot && (
                      <div className="absolute z-10 bg-gray-800 bg-opacity-60 w-[40px] h-[40px] rounded" />
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
