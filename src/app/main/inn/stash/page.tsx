'use client'

import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from '@material-tailwind/react'
import { SetStateAction, Dispatch, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import {
  fetchGetMyInventory,
  fetchMe,
  fetchSellItems,
} from '@/services/api-fetch'
import { InnItem, Item } from '@/interfaces/item.interface'
import createKey from '@/services/key-generator'
import { ItemBoxComponent } from '@/app/main/inventory.component'
import { getItemByType } from '@/services/util'
import { MeResponse } from '@/interfaces/user.interface'

export default function StashPage() {
  const [items, setItems] = useState<InnItem[]>([])
  const [characterData, setCharacterData] = useState<MeResponse>()
  const [maxItemSlots, setMaxItemSlots] = useState<number>(0)
  const [isFulledInventory, setIsFulledInventory] = useState<boolean>()
  const refreshInventory = async () => {
    const { items: rItems, slots, isFulled } = await fetchGetMyInventory()
    setItems(rItems)
    setMaxItemSlots(slots)
    setIsFulledInventory(isFulled)
  }

  const refreshCharacterData = async () => {
    const result = await fetchMe()
    setCharacterData(result)
  }

  const syncData = async () => {
    refreshInventory()
    refreshCharacterData()
  }
  useEffect(() => {
    syncData()
  }, [])

  return (
    <div className="rounded w-full min-h-[500px]">
      <Card className="rounded border">
        <CardBody className="flex flex-col gap-1">
          <Card className="rounded shadow-none">
            {!!characterData?.character && (
              <div>{characterData.character.gold.toLocaleString()} Gold</div>
            )}
          </Card>
          <InnInventory
            items={items}
            setItems={setItems}
            syncData={syncData}
            maxItemSlots={maxItemSlots}
            isFulledInventory={isFulledInventory}
          />
        </CardBody>
      </Card>
    </div>
  )
}

function InnInventory({
  items,
  setItems,
  syncData = async () => {},
  maxItemSlots = 0,
  isFulledInventory = false,
}: {
  items: Array<InnItem>
  setItems: Dispatch<SetStateAction<InnItem[]>>
  syncData?: () => Promise<void>
  maxItemSlots?: number
  isFulledInventory?: boolean
}) {
  const sellItem = (item: InnItem) => {}

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
      const result = await fetchSellItems(itemIds)
      await syncData()
    }
  }
  const onSelectItem = (item: InnItem) => {
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
  }

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
      items.map((item) => {
        const newItem = item
        newItem.isSelected = true
        return newItem
      }),
    )
  }
  return (
    <div className="">
      <div className="flex">
        <div
          className="border px-[5px] text-[16px] rounded text-white bg-green-400 cursor-pointer hover:bg-green-300"
          onClick={() => selectAll()}
        >
          전체 선택
        </div>
        <div
          className="border px-[5px] text-[16px] rounded text-white bg-red-400 cursor-pointer"
          onClick={() => sellSelectedItems()}
        >
          선택된 아이템 판매
        </div>
      </div>

      {/* Start Inventory Horizontal */}
      <div className="flex gap-[10px]">
        {/* Left Inventory */}
        <div>
          <div>인벤토리</div>
          <div>
            <div>
              <div className="flex flex-wrap max-w-[414px] bg-gray-100 p-[2px] rounded shadow-md gap-[1px]">
                {new Array(100).fill(1).map((value, index) => {
                  const item = items[index]
                  const disableSlotClass = 'bg-gray-800'
                  const isOveredSlot = index >= maxItemSlots
                  return (
                    <div
                      key={createKey()}
                      className={`bg-white relative flex border-[1px] border-r rounded-md w-[40px] h-[40px] ${isOveredSlot ? disableSlotClass : ''} ${item?.isSelected ? 'border-red-300' : ''}`}
                    >
                      {isOveredSlot && (
                        <div className="absolute z-10 bg-gray-800 bg-opacity-60 w-[40px] h-[40px] rounded" />
                      )}
                      {item && (
                        <ItemBoxComponent
                          className="p-[2px]"
                          item={item}
                          onShowActions={false}
                          onShowTotalDamage
                          equippedCallback={() => {}}
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
        {/* End Left Inventory */}
        <div className="flex justify-center items-center flex-col gap-[1px]">
          <div className="flex items-center justify-center px-[6px] bg-green-300 text-white rounded">
            &lt;
          </div>
          <div className="flex items-center justify-center px-[6px] bg-green-300 text-white rounded">
            &gt;
          </div>
        </div>
        {/* Right Inventory */}
        <div>
          <div>창고(는 개발중..)</div>
          <div>
            <div>
              <div className="flex flex-wrap max-w-[404px] bg-gray-100 p-[2px] rounded shadow-md">
                {new Array(100).fill(1).map((value, index) => {
                  const item = { isSelected: false } // items[index]
                  const disableSlotClass = 'bg-gray-800'
                  // const isOveredSlot = maxItemSlots <= index
                  const isOveredSlot = false
                  return (
                    <div
                      key={createKey()}
                      className={`bg-white relative flex border-[1px] border-r rounded-md w-[40px] h-[40px] ${isOveredSlot ? disableSlotClass : ''} ${item?.isSelected ? 'border-red-300' : ''}`}
                    >
                      {isOveredSlot && (
                        <div className="absolute z-10 bg-gray-800 bg-opacity-60 w-[40px] h-[40px] rounded" />
                      )}
                      {item && (
                        <ItemBoxComponent
                          className="p-[2px]"
                          item={item}
                          onShowActions={false}
                          onShowTotalDamage
                          equippedCallback={() => {}}
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
        {/* End Right Inventory */}
      </div>
      {/* End Inventory Horizontal */}
    </div>
  )
}
